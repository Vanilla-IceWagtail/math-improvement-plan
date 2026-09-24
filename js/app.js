/**
 * app.js —— 应用入口：路由、状态订阅、艾宾浩斯提醒、数据与设置
 *
 * 三大版块（用户要求的分区）：
 *   #/practice  组题组
 *   #/notebook  错题本
 *   #/textbook  教材定理定义详细解
 */

import { icon, hydrateIcons } from './icons.js';
import { $, $$, toast, openModal, confirmDialog, chime, humanizeDue, formatDateTime } from './dom.js';
import { getState, subscribe, updateSettings, exportBackup, importState, resetAll, download, toggleStar, toggleNotebook, getRecord } from './storage.js';
import { dueRecords, srsSummary, INTERVALS, MAX_PHASE, upcomingRecords } from './srs.js';
import { loadLibrary, getItem, getChapter } from './library.js';
import { loadBank, getQuestion, bankStats, fetchExternalBank, clearExternalBanks } from './bank.js';
import { renderPractice, practiceActions, practiceInput, practiceState, bindRerender as bindPracticeRerender } from './views/practice.js';
import { renderNotebook, notebookActions, startReview, forgettingCurveSVG, setRerender as setNotebookRerender } from './views/notebook.js';
import { renderTextbook, textbookActions, textbookInput, jumpToItem, initTextbook, setRerender as setTextbookRerender } from './views/textbook.js';
import { itemCard, questionCard, typeLabel, esc, toolButtons } from './components.js';

/* ------------------------------------------------------------------ 主题 */

function applyTheme() {
  const pref = getState().settings.theme || 'auto';
  const dark = pref === 'dark' || (pref === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.innerHTML = `<span class="ico">${icon(dark ? 'sun' : 'moon', { size: 18, cls: 'ico' }).replace(/^<span[^>]*>|<\/span>$/g, '')}</span>`;
  }
}

function cycleTheme() {
  const cur = getState().settings.theme || 'auto';
  const next = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
  updateSettings({ theme: next });
  applyTheme();
  toast(next === 'auto' ? '跟随系统主题' : next === 'dark' ? '深色模式' : '浅色模式', 'info', 1400);
}

/* ------------------------------------------------------------------ 路由 */

const VIEWS = ['practice', 'notebook', 'textbook'];
let currentView = 'practice';

const parseHash = () => {
  const m = /^#\/?([a-z-]+)/i.exec(location.hash || '');
  const v = m ? m[1].toLowerCase() : '';
  return VIEWS.includes(v) ? v : 'practice';
};

function render() {
  const host = document.getElementById('main');
  if (!host) return;
  if (currentView === 'practice') host.innerHTML = renderPractice();
  else if (currentView === 'notebook') host.innerHTML = renderNotebook();
  else host.innerHTML = renderTextbook();

  host.classList.toggle('is-wide', currentView === 'textbook' || currentView === 'notebook');

  // 章节选择器里"部分选中"的章：indeterminate 只能通过 JS 属性设置，
  // 不是 HTML 属性，所以必须在这里统一应用一次。
  $$('.chapter-picker input[data-partial="true"]').forEach((box) => { box.indeterminate = true; });

  // 导航高亮
  $$('.navbtn').forEach((b) => {
    const on = b.dataset.view === currentView;
    if (on) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  updateBadges();
}

function go(view) {
  if (!VIEWS.includes(view)) view = 'practice';
  currentView = view;
  if (location.hash !== `#/${view}`) history.replaceState(null, '', `#/${view}`);
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function updateBadges() {
  const s = srsSummary();
  const bell = document.getElementById('bell-badge');
  const navBadge = document.getElementById('nav-notebook-badge');
  for (const el of [bell, navBadge]) {
    if (!el) continue;
    if (s.due > 0) { el.hidden = false; el.textContent = s.due > 99 ? '99+' : String(s.due); }
    else el.hidden = true;
  }
  const bellBtn = document.getElementById('btn-remind');
  if (bellBtn) bellBtn.classList.toggle('is-on', s.due > 0);
}

/* ------------------------------------------------------------------ 艾宾浩斯提醒 */

const REMIND_COOLDOWN = 20 * 60 * 1000; // 20 分钟内不重复弹
let reminderTimer = null;

function checkReminders({ manual = false } = {}) {
  const s = srsSummary();
  const st = getState().settings;
  if (!s.due) {
    if (manual) {
      const soon = upcomingRecords(7);
      openModal({
        title: '复习提醒',
        body: `
          <div class="remind-hero">
            <div>${icon('check', { size: 30 })}</div>
            <div>
              <div class="n">0</div>
              <div style="color:var(--c-text-soft)">现在没有到期的复习</div>
            </div>
          </div>
          <p>错题本里一共有 <b>${s.total}</b> 条，其中 <b>${s.mastered}</b> 条已经走完全部 ${MAX_PHASE} 档。</p>
          ${soon.length ? `<p>接下来会提醒你的最近几条：</p>
          <ul>${soon.slice(0, 6).map((r) => `<li>${esc(r.title || r.id)} —— <span style="color:var(--c-text-soft)">${humanizeDue(r.srs.due)}</span></li>`).join('')}</ul>` : '<p>错题本里还没有内容。去做几道题，答错的会自动进来。</p>'}
          <div style="margin-top:10px">${forgettingCurveSVG()}</div>`,
        footer: `<button type="button" class="btn btn-primary" data-close>知道了</button>`,
      });
    }
    return;
  }

  if (!manual) {
    if (!st.popupOnOpen) return;
    if (Date.now() - (st.lastRemindAt || 0) < REMIND_COOLDOWN) return;
  }
  updateSettings({ lastRemindAt: Date.now() });
  if (getState().settings.sound) chime('remind');

  const first = s.dueList[0];
  const firstTitle = first.kind === 'item'
    ? (getItem(first.id) || {}).name || first.title || first.id
    : summarizeQuestion(first.id);

  openModal({
    title: '该复习啦',
    body: `
      <div class="remind-hero">
        <div>${icon('bell', { size: 30 })}</div>
        <div>
          <div class="n">${s.due}</div>
          <div style="color:var(--c-text-soft)">条内容到了该复习的时间</div>
        </div>
      </div>
      <p>按记忆规律，现在复习一次，效果比过几天再翻书好得多。今天一共安排 <b>${s.today}</b> 条。</p>
      ${first ? `<p style="color:var(--c-text-soft);font-size:13.6px">最先到期的一条：<b>${esc(firstTitle)}</b>（${humanizeDue(first.srs.due)}）</p>` : ''}
      <div style="margin-top:12px">${forgettingCurveSVG()}</div>`,
    footer: `
      <button type="button" class="btn btn-ghost" data-close>稍后</button>
      <button type="button" class="btn btn-primary" data-review>${icon('clock', { size: 15 })} 现在就开始复习</button>`,
    onMount(mask, close) {
      mask.querySelector('[data-review]').addEventListener('click', () => {
        close();
        go('notebook');
        setTimeout(() => startReview(), 120);
      });
    },
  });
}

function summarizeQuestion(id) {
  const q = getQuestion(id);
  if (!q) return id;
  return `${typeLabel(q.type)}：${String(q.stem).replace(/<[^>]+>/g, '').slice(0, 40)}`;
}

function startReminderLoop() {
  if (reminderTimer) clearInterval(reminderTimer);
  reminderTimer = setInterval(() => {
    updateBadges();
    if (document.visibilityState === 'visible') checkReminders({ manual: false });
  }, 60 * 1000);
  // 回到页面时立刻检查一次
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { updateBadges(); checkReminders({ manual: false }); }
  });
}

/* ------------------------------------------------------------------ 数据与设置 */

function openSettings() {
  const st = getState().settings;
  const stats = getState().stats;
  const bank = bankStats();
  const s = srsSummary();

  openModal({
    title: '数据与设置',
    wide: true,
    body: `
      <div class="section-head" style="margin-top:0"><h2>学习数据</h2><span class="line"></span></div>
      <div class="grid grid-3">
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${stats.answered || 0}</div><div style="font-size:12.5px;color:var(--c-text-soft)">累计做题</div></div>
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${stats.answered ? Math.round(((stats.correct || 0) / stats.answered) * 100) : 0}%</div><div style="font-size:12.5px;color:var(--c-text-soft)">总体正确率</div></div>
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${stats.quizSets || 0}</div><div style="font-size:12.5px;color:var(--c-text-soft)">生成过的题组</div></div>
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${stats.streakDays || 0}</div><div style="font-size:12.5px;color:var(--c-text-soft)">连续学习天数</div></div>
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${st.reviews || 0}</div><div style="font-size:12.5px;color:var(--c-text-soft)">完成复习次数</div></div>
        <div class="card card-pad"><div style="font-size:22px;font-weight:800">${s.mastered}</div><div style="font-size:12.5px;color:var(--c-text-soft)">已掌握条目</div></div>
      </div>

      <div class="section-head"><h2>提醒设置</h2><span class="line"></span></div>
      <div class="stack">
        <label class="row" style="gap:10px">
          <input type="checkbox" data-set="popupOnOpen" ${st.popupOnOpen ? 'checked' : ''}>
          <span>打开网页时，如果有到期内容就弹窗提醒</span>
        </label>
        <label class="row" style="gap:10px">
          <input type="checkbox" data-set="sound" ${st.sound ? 'checked' : ''}>
          <span>提醒时播放提示音</span>
        </label>
        <div class="row row-wrap" style="gap:10px">
          <span class="field-label" style="min-width:120px">主题</span>
          <select class="select" data-set="theme" style="width:auto">
            <option value="auto"${st.theme === 'auto' ? ' selected' : ''}>跟随系统</option>
            <option value="light"${st.theme === 'light' ? ' selected' : ''}>浅色</option>
            <option value="dark"${st.theme === 'dark' ? ' selected' : ''}>深色</option>
          </select>
        </div>
        <div class="row row-wrap" style="gap:10px">
          <span class="field-label" style="min-width:120px">每日目标</span>
          <input class="input" type="number" min="1" max="99" value="${st.dailyGoal || 10}" data-set="dailyGoal" style="width:110px">
          <span style="font-size:13px;color:var(--c-text-soft)">条复习</span>
        </div>
      </div>

      <div class="section-head"><h2>实时题库（可选）</h2><span class="line"></span></div>
      <p style="font-size:13.6px;color:var(--c-text-soft)">
        内置题库有 <b>${bank.total}</b> 道原创题，离线可用。你也可以填一个
        <b>同源或允许跨域</b>的 JSON 地址，页面会实时拉取合并（例如自己搭的题库服务，或把
        OpenStax 等开放许可题库转成 JSON 后挂在自己的静态托管上）。
      </p>
      <div class="row row-wrap" style="gap:8px;margin-top:8px">
        <input class="input" style="flex:1;min-width:220px" placeholder="https://example.com/math-bank.json" data-set="libraryUrl" value="${esc(st.libraryUrl || '')}">
        <button type="button" class="btn btn-primary" data-act="fetch-bank">${icon('refresh', { size: 14 })} 拉取并合并</button>
        ${bank.imported ? `<button type="button" class="btn btn-danger-ghost" data-act="clear-banks">清空外部题（${bank.imported}）</button>` : ''}
      </div>
      <p style="font-size:12.6px;color:var(--c-text-faint);margin-top:6px">
        ⚖️ 只接开放许可或你自己拥有的题库。本项目不抓取任何付费题库，也不内置未授权内容。
        导入的题目需要带有 <code>id / stem / answer</code> 字段。
      </p>
      ${getState().importedBanks.length ? `
      <div style="margin-top:10px">
        ${getState().importedBanks.map((b) => `<div class="stat-row"><span>${esc(b.name)}<br><small style="color:var(--c-text-faint)">${esc(b.license)}｜${b.count} 题（新增 ${b.added}）</small></span><span class="v">${formatDateTime(b.fetchedAt)}</span></div>`).join('')}
      </div>` : ''}

      <div class="section-head"><h2>复习间隔</h2><span class="line"></span></div>
      <p style="font-size:13.6px;color:var(--c-text-soft)">
        当前使用的间隔（在 <code>js/srs.js</code> 里可以改）：
        <code>${INTERVALS.map((i) => i.label).join(' → ')}</code>。走完 ${MAX_PHASE} 档算掌握。
      </p>

      <div class="section-head"><h2>备份与迁移</h2><span class="line"></span></div>
      <p style="font-size:13.6px;color:var(--c-text-soft)">
        所有学习数据只存在你自己这台设备的浏览器里，不会上传。换设备或换浏览器时，用下面的导出/导入搬运。
      </p>
      <div class="row row-wrap" style="gap:8px;margin-top:8px">
        <button type="button" class="btn" data-act="export">${icon('download', { size: 14 })} 导出全部数据</button>
        <button type="button" class="btn" data-act="import">${icon('upload', { size: 14 })} 导入数据文件</button>
        <span class="spacer"></span>
        <button type="button" class="btn btn-danger-ghost" data-act="reset">${icon('trash', { size: 14 })} 清空所有数据</button>
      </div>
      <input type="file" accept="application/json" data-act="import-file" hidden>
    `,
    footer: `<button type="button" class="btn btn-primary" data-close>好了</button>`,
    onMount(mask, close) {
      // 设置改动即时保存
      mask.querySelectorAll('[data-set]').forEach((el) => {
        el.addEventListener('change', () => {
          const key = el.dataset.set;
          let val = el.type === 'checkbox' ? el.checked : el.value;
          if (key === 'dailyGoal') val = Number(val) || 10;
          updateSettings({ [key]: val });
          if (key === 'theme') applyTheme();
          if (key === 'popupOnOpen' || key === 'sound') toast('已保存', 'ok', 1200);
        });
      });

      mask.querySelector('[data-act="fetch-bank"]').addEventListener('click', async () => {
        const input = mask.querySelector('[data-set="libraryUrl"]');
        const url = input.value.trim();
        if (!url) { toast('先填一个题库地址', 'warn'); return; }
        toast('正在拉取…', 'info', 1200);
        try {
          const res = await fetchExternalBank(url);
          toast(`拉取成功：新增 ${res.added} 道题${res.errors.length ? `，${res.errors.length} 条格式有问题已跳过` : ''}`, 'ok', 3200);
          close();
          openSettings();
          refreshData();
        } catch (err) {
          toast(`拉取失败：${err.message}（可能是对方不允许跨域）`, 'bad', 4200);
        }
      });

      const clearBtn = mask.querySelector('[data-act="clear-banks"]');
      if (clearBtn) clearBtn.addEventListener('click', () => {
        clearExternalBanks();
        toast('已清空外部题库', 'info');
        close(); refreshData();
      });

      mask.querySelector('[data-act="export"]').addEventListener('click', () => {
        download(`数学陪练-数据-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(exportBackup(), null, 2));
        toast('已导出，请妥善保存这个文件', 'ok');
      });

      const fileInput = mask.querySelector('[data-act="import-file"]');
      mask.querySelector('[data-act="import"]').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const ok = await confirmDialog('导入方式：确定 = 合并（保留两边较新的记录）；取消 = 放弃本次导入。', { title: '导入数据', okText: '合并导入' });
          if (!ok) return;
          importState(data, 'merge');
          toast('导入完成，页面即将刷新', 'ok');
          setTimeout(() => location.reload(), 700);
        } catch (err) {
          toast(`导入失败：${err.message}`, 'bad', 4000);
        }
      });

      mask.querySelector('[data-act="reset"]').addEventListener('click', async () => {
        const ok = await confirmDialog('会删掉全部错题本、收藏和统计，且不可恢复。建议先导出备份。确定清空？', { title: '清空所有数据', okText: '确定清空', danger: true });
        if (!ok) return;
        resetAll();
        toast('已清空', 'info');
        close(); refreshData(); applyTheme();
      });
    },
  });
}

/* ------------------------------------------------------------------ 收藏 / 错题本 快捷查看 */

function openFavorites() {
  const recs = Object.values(getState().records).filter((r) => r && r.stars);
  if (!recs.length) {
    openModal({
      title: '我的收藏',
      body: `<p>还没有收藏任何内容。</p>
        <p style="color:var(--c-text-soft)">在定义、定理或题目卡片的右上角点<b>星形图标</b>，就能把它们收进来。教材版块里每个定义和定理都有这个按钮。</p>`,
      footer: `<button type="button" class="btn btn-primary" data-close>知道了</button>`,
    });
    return;
  }
  const html = recs.map((r) => {
    if (r.kind === 'item') {
      const it = getItem(r.id);
      return it ? itemCard(it) : '';
    }
    const q = getQuestion(r.id);
    return q ? questionCard(q) : '';
  }).join('<div style="height:14px"></div>');

  openModal({
    title: `我的收藏（${recs.length}）`,
    wide: true,
    body: `<div class="stack">${html}</div>`,
    footer: `<button type="button" class="btn" data-close>关闭</button>`,
    onMount(mask, close) {
      mask.addEventListener('click', (e) => {
        const goto = e.target.closest('[data-goto-item]');
        if (goto) {
          close();
          go('textbook');
          setTimeout(() => jumpToItem(goto.dataset.gotoItem), 160);
        }
      });
    },
  });
}

/* ------------------------------------------------------------------ 全局事件委托 */

function bindGlobalEvents() {
  // 导航
  document.getElementById('mainnav').addEventListener('click', (e) => {
    const btn = e.target.closest('.navbtn');
    if (btn) go(btn.dataset.view);
  });
  window.addEventListener('hashchange', () => {
    const v = parseHash();
    if (v !== currentView) { currentView = v; render(); }
  });

  document.getElementById('btn-theme').addEventListener('click', cycleTheme);
  document.getElementById('btn-remind').addEventListener('click', () => checkReminders({ manual: true }));
  document.getElementById('btn-favorites').addEventListener('click', openFavorites);
  document.getElementById('btn-data').addEventListener('click', openSettings);

  // 页面内点击委托
  document.getElementById('main').addEventListener('click', (e) => {
    // 1) 星标 / 错题本 两个可点亮图标（三个版块通用，优先级最高）
    const tool = e.target.closest('.toolbtn[data-tool]');
    if (tool && document.getElementById('main').contains(tool)) {
      handleToolToggle(tool);
      return;
    }

    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    // 2) 视图自己的动作
    let handled = false;
    if (currentView === 'practice') handled = practiceActions(action, el, e);
    else if (currentView === 'notebook') handled = notebookActions(action, el);
    else handled = textbookActions(action, el);

    // 3) 通用动作
    if (!handled && action === 'add-wrong') {
      const { qid } = el.dataset;
      const q = getQuestion(qid);
      const on = toggleNotebook(qid, 'question', q ? {
        chapterId: q.chapterId,
        title: `${typeLabel(q.type)} · ${String(q.stem).replace(/<[^>]+>/g, '').slice(0, 40)}`,
        preview: String(q.stem).replace(/<[^>]+>/g, ''),
        extra: { concepts: q.concepts || [], difficulty: q.difficulty, answer: String(q.answer).replace(/<[^>]+>/g, '') },
      } : {});
      toast(on ? '已加入错题本' : '已从错题本移出', on ? 'ok' : 'info');
      const btn = el.querySelector('.toolbtn[data-tool="notebook"]') || el;
      if (btn.classList.contains('toolbtn')) { btn.classList.toggle('is-on', on); btn.setAttribute('aria-pressed', String(on)); }
      updateBadges();
    }
  });

  // 输入类事件
  document.getElementById('main').addEventListener('input', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    if (currentView === 'practice') practiceInput(el.dataset.action, el);
    else if (currentView === 'textbook') textbookInput(el.dataset.action, el);
  });

  // 快捷键：1/2/3 切版块（输入框里不触发）
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '1') go('practice');
    if (e.key === '2') go('notebook');
    if (e.key === '3') go('textbook');
    if (e.key === '/') {
      e.preventDefault();
      go('textbook');
      setTimeout(() => { const i = document.querySelector('[data-action="tb-search"]'); if (i) i.focus(); }, 60);
    }
  });
}

function handleToolToggle(tool) {
  const { id, kind } = tool.dataset;
  const isStar = tool.dataset.tool === 'star';

  let meta = {};
  if (kind === 'item') {
    const it = getItem(id);
    if (it) meta = { chapterId: it.chapterId, title: it.name, preview: String(it.statement || '').replace(/<[^>]+>/g, '') };
  } else {
    const q = getQuestion(id);
    if (q) {
      meta = {
        chapterId: q.chapterId,
        title: `${typeLabel(q.type)} · ${String(q.stem).replace(/<[^>]+>/g, '').slice(0, 40)}`,
        preview: String(q.stem).replace(/<[^>]+>/g, ''),
        extra: { concepts: q.concepts || [], difficulty: q.difficulty, answer: String(q.answer).replace(/<[^>]+>/g, '') },
      };
    }
  }

  const on = isStar ? toggleStar(id, kind, meta) : toggleNotebook(id, kind, meta);
  tool.classList.toggle('is-on', on);
  tool.setAttribute('aria-pressed', String(on));
  tool.classList.remove('just-on');
  void tool.offsetWidth;
  if (on) tool.classList.add('just-on');

  toast(
    isStar
      ? (on ? '已收藏 ⭐' : '已取消收藏')
      : (on ? '已加入错题本，会按记忆曲线提醒你复习' : '已从错题本移出'),
    on ? 'ok' : 'info',
    1600,
  );
  updateBadges();
}

/* ------------------------------------------------------------------ 启动 */

async function boot() {
  applyTheme();
  hydrateIcons(document);

  // 先把内容加载完再渲染，避免闪一下空目录
  try {
    await loadLibrary();
  } catch (err) {
    console.error('[boot] 教材加载失败', err);
  }
  try {
    await loadBank();
  } catch (err) {
    console.error('[boot] 题库加载失败', err);
  }

  // 视图自己需要局部重渲染时，回调到统一的 render()
  bindPracticeRerender(render);
  setNotebookRerender(render);
  setTextbookRerender(render);

  currentView = parseHash();
  initTextbook();

  // 从错题本"同类再练"跳过来的题组
  if (window.__pendingQuiz && practiceState) {
    practiceState.quiz = window.__pendingQuiz;
    practiceState.answers = {};
    practiceState.finished = false;
    window.__pendingQuiz = null;
  }

  render();
  bindGlobalEvents();
  startReminderLoop();

  // 状态变了就同步角标（重渲染由各视图自己控制，避免输入框被打断）
  subscribe((reason) => {
    updateBadges();
    if (reason === 'records' || reason === 'notebook' || reason === 'star') {
      // 收藏/错题本状态可能影响当前页面展示，轻量重渲染
      if (currentView === 'notebook' || currentView === 'textbook') render();
    }
  });

  // 首屏提醒（稍等一会，别和页面渲染抢注意力）
  setTimeout(() => checkReminders({ manual: false }), 1200);

  console.info(
    `%c数学陪练已就绪 %c题库 ${bankStats().total} 题 · 错题本 ${srsSummary().total} 条`,
    'color:#0f766e;font-weight:700',
    'color:inherit',
  );
}

boot();

// 方便调试：挂到 window 上
window.__mathTrainer = { go, getState, dueRecords, upcomingRecords };
void $;
void getChapter;
void getRecord;
