/**
 * views/notebook.js —— 版块二：错题本
 *
 * 四个标签页：
 *   待复习 —— 到期 / 今天要复习的（核心，配合弹窗提醒）
 *   错题   —— 进过错题本的题目和定义
 *   收藏   —— 星标点亮的定义 / 定理 / 题目
 *   已掌握 —— 走完全部复习档位的
 *
 * 复习交互故意做得极简：正面给"提示"，点"显示答案"后自评
 *   「记住了」-> 进入下一档，间隔变长
 *   「忘了」  -> 打回上一档，很快再来一次
 */

import { icon } from '../icons.js';
import { rich, richInline } from '../text.js';
import { toast, openModal, humanizeDue, formatDateTime, confirmDialog } from '../dom.js';
import { getItem, kindLabel, getChapter } from '../library.js';
import { getQuestion } from '../bank.js';
import { getState, notebookRecords, starredRecords, removeRecord, download } from '../storage.js';
import {
  grade, dueRecords, masteredRecords, srsSummary, INTERVALS, MAX_PHASE, phaseLabel, phaseRatio, upcomingRecords,
} from '../srs.js';
import { itemCard, questionCard, emptyState, toolButtons, typeLabel, diffTag, kindTag, phaseBar, esc } from '../components.js';
import { buildQuizFromRecord } from '../generator.js';

let tab = 'due';       // due | wrong | starred | mastered
let reviewQueue = [];  // 复习队列 [{id, kind}]
let bindRerender = () => {};

export function setRerender(fn) { bindRerender = fn; }
const rerender = () => bindRerender();
export const notebookTab = () => tab;

/* ------------------------------------------------------------------ 渲染 */

export function renderNotebook() {
  const s = srsSummary();
  const counts = {
    due: s.due,
    wrong: notebookRecords().length,
    starred: starredRecords().length,
    mastered: s.mastered,
  };

  return `
  <section class="page">
    <div class="page-head">
      <h1>错题本</h1>
      <div class="sub">
        做错的题会<b>自动</b>进来，收藏的内容也能手动加进来。系统按"先快后慢"的记忆规律安排复习时间：
        <code>5 分钟 → 30 分钟 → 12 小时 → 1 天 → 2 天 → 4 天 → 7 天 → 15 天 → 30 天 → 60 天</code>，走完就算掌握。
      </div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:16px">
      <div class="card card-pad">
        <div style="font-size:26px;font-weight:800;color:var(--c-danger)">${s.due}</div>
        <div style="font-size:13px;color:var(--c-text-soft)">现在就该复习</div>
      </div>
      <div class="card card-pad">
        <div style="font-size:26px;font-weight:800;color:var(--c-primary)">${s.today}</div>
        <div style="font-size:13px;color:var(--c-text-soft)">今天以内要复习</div>
      </div>
      <div class="card card-pad">
        <div style="font-size:26px;font-weight:800">${s.total}</div>
        <div style="font-size:13px;color:var(--c-text-soft)">错题本总条数</div>
      </div>
      <div class="card card-pad">
        <div style="font-size:26px;font-weight:800;color:var(--c-ok)">${s.mastered}</div>
        <div style="font-size:13px;color:var(--c-text-soft)">已掌握</div>
      </div>
    </div>

    <div class="tabs" role="tablist">
      <button type="button" class="tab" role="tab" data-action="tab" data-tab="due" aria-selected="${tab === 'due'}">待复习（${counts.due}）</button>
      <button type="button" class="tab" role="tab" data-action="tab" data-tab="wrong" aria-selected="${tab === 'wrong'}">错题（${counts.wrong}）</button>
      <button type="button" class="tab" role="tab" data-action="tab" data-tab="starred" aria-selected="${tab === 'starred'}">收藏（${counts.starred}）</button>
      <button type="button" class="tab" role="tab" data-action="tab" data-tab="mastered" aria-selected="${tab === 'mastered'}">已掌握（${counts.mastered}）</button>
    </div>

    ${tab === 'due' ? renderDue() : ''}
    ${tab === 'wrong' ? renderAll() : ''}
    ${tab === 'starred' ? renderStarred() : ''}
    ${tab === 'mastered' ? renderMastered() : ''}
  </section>`;
}

/* ---------------- 待复习 ---------------- */

function renderDue() {
  const due = dueRecords();
  const soon = upcomingRecords(3);
  const dueBlock = due.length
    ? `<div class="card card-pad" style="margin-bottom:16px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div>
          <div style="font-weight:800;font-size:16px">现在有 ${due.length} 条该复习了</div>
          <div style="color:var(--c-text-soft);font-size:13.6px">一条一条过，凭记忆自评，一分钟能过好几条。</div>
        </div>
        <span class="spacer"></span>
        <button type="button" class="btn btn-primary btn-lg" data-action="start-review">${icon('clock', { size: 16 })} 开始复习</button>
      </div>
      <div class="nb-list">${due.map((r) => recordCard(r, { showActions: true })).join('')}</div>`
    : emptyState({
        iconName: 'check',
        title: '现在没有到期的复习',
        desc: soon.length
          ? `最近一条会在 ${humanizeDue(soon[0].srs.due)} 到期。您可以先去「组题组」做几道新题。`
          : '错题本还是空的。做几道题，做错的会自动进来，这里就会按时间提醒你复习。',
        action: `<div class="chips" style="justify-content:center;margin-top:12px"><button type="button" class="btn btn-primary" data-action="goto-practice">${icon('target', { size: 15 })} 去组题组做题</button></div>`,
      });

  const soonBlock = soon.length
    ? `<div class="section-head"><h2>接下来 3 天会提醒你</h2><span class="line"></span></div>
       <div class="stack">${soon.slice(0, 8).map((r) => recordCard(r, { compact: true })).join('')}</div>`
    : '';

  return dueBlock + soonBlock;
}

/* ---------------- 全部错题 ---------------- */

function renderAll() {
  const list = notebookRecords().sort((a, b) => (a.srs.due || 0) - (b.srs.due || 0));
  if (!list.length) {
    return emptyState({
      iconName: 'notebook',
      title: '错题本还是空的',
      desc: '做题答错的题会<b>自动</b>记进来；也可以在任意定义、定理、题目右上角点那个<b>小本子图标</b>手动加入。',
      action: `<div class="chips" style="justify-content:center;margin-top:12px">
        <button type="button" class="btn btn-primary" data-action="goto-practice">${icon('target', { size: 15 })} 去做题</button>
        <button type="button" class="btn" data-action="goto-textbook">${icon('book', { size: 15 })} 去教材区</button>
      </div>`,
    });
  }
  const grouped = groupByChapter(list);
  return `
  <div class="card card-pad" style="margin-bottom:16px">
    <div class="row row-wrap">
      <span style="font-size:13.5px;color:var(--c-text-soft)">共 ${list.length} 条，平均记忆阶段 <b>${srsSummary().avgPhase}</b> / ${MAX_PHASE}</span>
      <span class="spacer"></span>
      <button type="button" class="btn btn-sm" data-action="export-nb">${icon('download', { size: 14 })} 导出错题本</button>
      <button type="button" class="btn btn-sm" data-action="print-nb">${icon('list', { size: 14 })} 打印 / 存 PDF</button>
    </div>
  </div>
  ${grouped.map(([chapterTitle, recs]) => `
    <div class="section-head"><h2>${esc(chapterTitle)}</h2><span class="line"></span><span class="tag tag-soft">${recs.length} 条</span></div>
    <div class="nb-list">${recs.map((r) => recordCard(r)).join('')}</div>
  `).join('')}`;
}

function groupByChapter(list) {
  const map = new Map();
  for (const r of list) {
    const item = r.kind === 'item' ? getItem(r.id) : null;
    const q = r.kind === 'question' ? getQuestion(r.id) : null;
    const chapterId = r.chapterId || (item && item.chapterId) || (q && q.chapterId) || '';
    let title = '未归类';
    if (chapterId) {
      const found = getChapter(chapterId);
      title = found ? `第 ${found.chapter.no} 章 ${found.chapter.title}` : chapterId;
    }
    if (!map.has(title)) map.set(title, []);
    map.get(title).push(r);
  }
  return Array.from(map.entries());
}

/* ---------------- 收藏 ---------------- */

function renderStarred() {
  const list = starredRecords();
  if (!list.length) {
    return emptyState({
      iconName: 'star',
      title: '还没有收藏',
      desc: '在定义、定理、题目的右上角点<b>星形图标</b>就能收藏，之后在这里集中回看。',
      action: `<div class="chips" style="justify-content:center;margin-top:12px"><button type="button" class="btn btn-primary" data-action="goto-textbook">${icon('book', { size: 15 })} 去教材区看看</button></div>`,
    });
  }
  const items = list.filter((r) => r.kind === 'item');
  const questions = list.filter((r) => r.kind === 'question');
  const itemBlock = items.length
    ? `<div class="section-head"><h2>收藏的定义 / 定理</h2><span class="line"></span><span class="tag tag-soft">${items.length} 条</span></div>
       <div class="stack">${items.map((r) => { const it = getItem(r.id); return it ? itemCard(it) : ''; }).join('')}</div>`
    : '';
  const qBlock = questions.length
    ? `<div class="section-head"><h2>收藏的题目</h2><span class="line"></span><span class="tag tag-soft">${questions.length} 条</span></div>
       <div class="stack">${questions.map((r) => { const q = getQuestion(r.id); return q ? questionCard(q) : ''; }).join('')}</div>`
    : '';
  return itemBlock + qBlock;
}

/* ---------------- 已掌握 ---------------- */

function renderMastered() {
  const list = masteredRecords();
  if (!list.length) {
    return emptyState({
      iconName: 'trophy',
      title: '还没有完全掌握的条目',
      desc: `连着答对 ${MAX_PHASE} 次、走完「60 天后」那一档，条目就会出现在这里。慢慢来，这本来就是长期的事。`,
    });
  }
  return `
  <div class="card card-pad" style="margin-bottom:16px">
    <div class="row row-wrap">
      <span style="font-size:14px">🎉 已经掌握 ${list.length} 条，偶尔回来看一眼，记忆能保持很久。</span>
      <span class="spacer"></span>
      <button type="button" class="btn btn-sm" data-action="reset-mastered">${icon('refresh', { size: 14 })} 重置进度再练一轮</button>
    </div>
  </div>
  <div class="nb-list">${list.map((r) => recordCard(r, { compact: true })).join('')}</div>`;
}

/* ---------------- 单条记录卡 ---------------- */

function recordCard(r, { compact = false, showActions = false } = {}) {
  const isItem = r.kind === 'item';
  const item = isItem ? getItem(r.id) : null;
  const q = isItem ? null : getQuestion(r.id);
  const rawTitle = item ? item.name
    : q ? `${typeLabel(q.type)} · ${truncate(stripTags(q.stem), 56)}`
    : (r.title || r.id);
  const due = r.srs ? r.srs.due : 0;
  const cls = due <= Date.now() ? 'now' : 'later';
  const wrongLevel = Math.min(4, Math.max(0, Math.round(phaseRatio(r.srs ? r.srs.phase : 0) * 4)));

  let body = '';
  if (compact) {
    body = `<div class="nb-preview">${richInline(truncate(stripTags(item ? item.statement : (q ? q.stem : '')), 130))}</div>`;
  } else if (item) {
    body = `<div class="nb-preview">${richInline(truncate(stripTags(item.statement), 150))}</div>`;
  } else if (q) {
    body = `<div class="nb-preview">${richInline(truncate(stripTags(q.solution || q.answer), 150))}</div>`;
  }

  const srsBlock = r.srs
    ? `<div style="margin-top:10px;max-width:440px">
        ${phaseBar(r.srs.phase)}
        <div style="font-size:12.5px;color:var(--c-text-soft);margin-top:6px">
          ${phaseLabel(r.srs.phase)}｜复习 ${r.srs.reviews || 0} 次，卡壳 ${r.srs.lapses || 0} 次${r.srs.lastReview ? `｜上次 ${formatDateTime(r.srs.lastReview)}` : ''}
        </div>
      </div>`
    : '';

  const gradeBtns = showActions
    ? `<button type="button" class="btn btn-sm btn-ok" data-action="grade" data-id="${esc(r.id)}" data-kind="${r.kind}" data-ok="1">${icon('check', { size: 14 })} 记住了</button>
       <button type="button" class="btn btn-sm btn-warn" data-action="grade" data-id="${esc(r.id)}" data-kind="${r.kind}" data-ok="0">${icon('refresh', { size: 14 })} 忘了</button>`
    : '';

  return `
  <div class="nb-item wrong-${wrongLevel}" data-rec-id="${esc(r.id)}" data-rec-kind="${r.kind}">
    <div class="nb-main">
      <div class="nb-title">
        ${isItem ? kindTag(item ? item.kind : 'note') : `<span class="tag tag-soft">${typeLabel(q ? q.type : 'fill')}</span>`}
        ${!isItem && q ? diffTag(q.difficulty) : ''}
        <span>${esc(rawTitle)}</span>
      </div>
      ${body}
      ${srsBlock}
      <div class="review-actions">
        ${gradeBtns}
        <button type="button" class="btn btn-sm" data-action="open-rec" data-id="${esc(r.id)}" data-kind="${r.kind}">${icon('search', { size: 14 })} 展开看内容</button>
        <button type="button" class="btn btn-sm" data-action="drill" data-id="${esc(r.id)}" data-kind="${r.kind}">${icon('target', { size: 14 })} 同类再来几题</button>
      </div>
    </div>
    <div class="nb-side">
      <span class="due-pill ${cls}">${icon('clock', { size: 12 })} ${humanizeDue(due)}</span>
      ${toolButtons(r.id, r.kind)}
      <button type="button" class="btn btn-ghost btn-sm" data-action="forget" data-id="${esc(r.id)}" data-kind="${r.kind}" title="从错题本 / 收藏中移除" aria-label="移除">${icon('trash', { size: 14 })}</button>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ 复习流程 */

export function startReview() {
  reviewQueue = dueRecords().map((r) => ({ id: r.id, kind: r.kind }));
  if (!reviewQueue.length) { toast('现在没有到期的复习', 'info'); return; }
  stepReview();
}

function stepReview() {
  const cur = reviewQueue.shift();
  if (!cur) {
    toast('今天的复习完成了，做得漂亮！', 'ok');
    rerender();
    return;
  }
  const isItem = cur.kind === 'item';
  const item = isItem ? getItem(cur.id) : null;
  const q = isItem ? null : getQuestion(cur.id);
  const title = item ? item.name : (q ? truncate(stripTags(q.stem), 46) : cur.id);

  const answerBlock = item
    ? `<div class="block-label">${icon('list', { size: 13 })} 严谨说法</div>
       <div class="block-statement">${richInline(item.statement)}</div>
       <div class="block-label" style="margin-top:12px">${icon('lightbulb', { size: 13 })} 说人话</div>
       <div class="block-plain" style="padding:12px;border-radius:8px">${richInline(item.plain || '')}</div>
       ${item.kind === 'theorem' && item.proof
         ? `<div class="block-label" style="margin-top:12px">${icon('check', { size: 13 })} 证明</div><div>${rich(item.proof)}</div>`
         : ''}`
    : `<div class="block-label">${icon('check', { size: 13 })} 答案</div>
       <div>${q ? richInline(q.answer) : ''}</div>
       ${q && q.solution ? `<div class="block-label" style="margin-top:12px">${icon('lightbulb', { size: 13 })} 解析</div><div>${rich(q.solution)}</div>` : ''}`;

  const front = item
    ? `<div class="review-card">
         <div class="item-title-row">${kindTag(item.kind)}<b>${esc(item.name)}</b></div>
         <p style="margin-top:10px;color:var(--c-text-soft)">先自己回忆：这一条在说什么？条件和结论分别是什么？</p>
         <div style="margin-top:12px" data-answer hidden>${answerBlock}</div>
       </div>`
    : `<div class="review-card">
         <div class="q-meta">${q ? `<span class="tag tag-soft">${typeLabel(q.type)}</span>${diffTag(q.difficulty)}` : ''}</div>
         <div class="q-stem">${q ? richInline(q.stem) : ''}</div>
         <div style="margin-top:12px" data-answer hidden>${answerBlock}</div>
       </div>`;

  openModal({
    title: `复习 · ${title}`,
    wide: true,
    dismissable: false,
    body: `${front}
      <div class="row row-wrap" style="margin-top:16px;justify-content:space-between">
        <span style="font-size:13px;color:var(--c-text-soft)">还剩 ${reviewQueue.length} 条 · 快捷键：空格显示答案，<b>2</b> 记住了，<b>1</b> 忘了</span>
        <button type="button" class="btn btn-sm" data-reveal>${icon('search', { size: 14 })} 显示答案</button>
      </div>`,
    footer: `
      <button type="button" class="btn btn-ghost" data-later>先不复习了</button>
      <button type="button" class="btn btn-warn" data-grade="0">${icon('refresh', { size: 15 })} 忘了</button>
      <button type="button" class="btn btn-ok" data-grade="1">${icon('check', { size: 15 })} 记住了</button>`,
    onMount(mask, close) {
      const answer = mask.querySelector('[data-answer]');
      const reveal = mask.querySelector('[data-reveal]');
      const show = () => { if (answer) answer.hidden = false; if (reveal) reveal.hidden = true; };
      reveal.addEventListener('click', show);

      const onKey = (e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); show(); }
        if (e.key === '1') mask.querySelector('[data-grade="0"]').click();
        if (e.key === '2') mask.querySelector('[data-grade="1"]').click();
      };
      document.addEventListener('keydown', onKey);
      const cleanup = new MutationObserver(() => {
        if (!document.body.contains(mask)) { document.removeEventListener('keydown', onKey); cleanup.disconnect(); }
      });
      cleanup.observe(document.body, { childList: true });

      mask.querySelector('[data-later]').addEventListener('click', () => { close(); rerender(); });
      mask.querySelectorAll('[data-grade]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rec = findRec(cur.id, cur.kind);
          if (rec) {
            const before = rec.srs ? rec.srs.phase : 0;
            grade(rec, btn.dataset.grade === '1');
            const phase = rec.srs ? rec.srs.phase : 0;
            const label = INTERVALS[Math.min(phase, MAX_PHASE - 1)].label;
            toast(btn.dataset.grade === '1'
              ? `记住了！阶段 ${before} → ${phase}，下次 ${label}`
              : `没关系，${label}再来一次`, btn.dataset.grade === '1' ? 'ok' : 'warn');
          }
          close();
          stepReview();
        });
      });
    },
  });
}

function findRec(id, kind) {
  return getState().records[`${kind === 'question' ? 'q' : 'i'}:${id}`] || null;
}

/* ------------------------------------------------------------------ 事件 */

export function notebookActions(action, el) {
  switch (action) {
    case 'tab':
      tab = el.dataset.tab;
      rerender();
      return true;

    case 'start-review':
      startReview();
      return true;

    case 'grade': {
      const rec = findRec(el.dataset.id, el.dataset.kind);
      if (!rec) return true;
      const ok = el.dataset.ok === '1';
      grade(rec, ok);
      toast(ok ? '记住了，下次间隔延长' : '已打回上一档，很快会再提醒你', ok ? 'ok' : 'warn');
      rerender();
      return true;
    }

    case 'forget': {
      const { id, kind } = el.dataset;
      confirmDialog('把这笔记录从错题本 / 收藏里彻底删掉？复习进度会一起清空。', { okText: '删掉', danger: true })
        .then((ok) => { if (ok) { removeRecord(id, kind); toast('已移除', 'info'); rerender(); } });
      return true;
    }

    case 'open-rec': {
      const isItem = el.dataset.kind === 'item';
      const data = isItem ? getItem(el.dataset.id) : getQuestion(el.dataset.id);
      if (!data) { toast('内容找不到了，可能题库已更新', 'warn'); return true; }
      openModal({
        title: isItem ? data.name : '题目详情',
        wide: true,
        body: isItem ? itemCard(data) : questionCard(data),
      });
      return true;
    }

    case 'drill': {
      const rec = findRec(el.dataset.id, el.dataset.kind);
      if (!rec) return true;
      const quiz = buildQuizFromRecord(rec, { size: 'small' });
      if (!quiz.total) { toast('这个知识点暂时没有别的题了', 'warn'); return true; }
      window.__pendingQuiz = quiz;
      toast(`围绕这个知识点生成 ${quiz.total} 道题`, 'ok');
      location.hash = '#/practice';
      return true;
    }

    case 'export-nb': {
      const data = notebookRecords();
      download(`错题本-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({
        app: 'shuxue-peilian', type: 'notebook', exportedAt: new Date().toISOString(), records: data,
      }, null, 2));
      toast('已导出 JSON 文件', 'ok');
      return true;
    }

    case 'print-nb':
      window.print();
      return true;

    case 'reset-mastered':
      confirmDialog('把已掌握条目的复习进度清零，重新排进复习队列？', { okText: '重置' }).then((ok) => {
        if (!ok) return;
        for (const r of masteredRecords()) {
          r.srs.phase = 0;
          r.srs.due = Date.now();
          r.updatedAt = Date.now();
          delete r.masteredAt;
        }
        rerender();
        toast('已重置，它们回到待复习列表', 'ok');
      });
      return true;

    case 'goto-practice':
      location.hash = '#/practice';
      return true;

    case 'goto-textbook':
      location.hash = '#/textbook';
      return true;

    default:
      return false;
  }
}

/* ------------------------------------------------------------------ 遗忘曲线示意图 */

/**
 * 画"遗忘曲线 + 复习点"示意图：纯 SVG，无依赖。
 * 记忆强度在两次复习之间按指数衰减，每次复习把它拉回接近 1，并且衰减越来越慢。
 */
export function forgettingCurveSVG(width = 560, height = 156) {
  const pad = { l: 36, r: 14, t: 22, b: 26 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const total = INTERVALS.reduce((a, i) => a + i.ms, 0);
  const x = (ms) => pad.l + (ms / total) * w;
  const y = (retention) => pad.t + (1 - retention) * h;

  let acc = 0;
  let level = 1;
  const segs = [];
  INTERVALS.forEach((iv) => {
    const x0 = x(acc);
    const x1 = x(acc + iv.ms);
    const pts = [];
    for (let t = 0; t <= 1.0001; t += 0.1) {
      const decay = level * Math.exp(-2.1 * t);
      pts.push(`${(x0 + (x1 - x0) * t).toFixed(1)},${y(decay).toFixed(1)}`);
    }
    segs.push({ path: `M${pts.join(' L')}`, x1, label: iv.label.replace('后', '') });
    acc += iv.ms;
    level = Math.min(1, level + 0.26);
  });

  return `
  <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img"
       aria-label="遗忘曲线与复习间隔示意图：记忆随时间下降，每次复习把它拉回并让下降变慢">
    <line x1="${pad.l}" y1="${pad.t + h}" x2="${pad.l + w}" y2="${pad.t + h}" stroke="var(--c-border-strong)" stroke-width="1"/>
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + h}" stroke="var(--c-border-strong)" stroke-width="1"/>
    <text x="6" y="${pad.t + 4}" font-size="10" fill="var(--c-text-faint)">记得牢</text>
    <text x="6" y="${pad.t + h}" font-size="10" fill="var(--c-text-faint)">忘了</text>
    <text x="${pad.l + w / 2}" y="12" font-size="10.5" fill="var(--c-text-faint)" text-anchor="middle">黄点是复习时刻：每次复习把记忆拉回来，而且下降得越来越慢</text>
    ${segs.map((s, i) => `<path d="${s.path}" fill="none" stroke="${i % 2 ? 'var(--c-def)' : 'var(--c-primary)'}" stroke-width="1.8" opacity="0.85"/>`).join('')}
    ${segs.map((s) => `
      <circle cx="${s.x1.toFixed(1)}" cy="${y(1).toFixed(1)}" r="3.1" fill="var(--c-accent)"/>
      <text x="${s.x1.toFixed(1)}" y="${height - 6}" font-size="8.5" fill="var(--c-text-faint)" text-anchor="middle">${esc(s.label)}</text>
    `).join('')}
    <text x="${pad.l + w}" y="${pad.t + h - 4}" font-size="9" fill="var(--c-text-faint)" text-anchor="end">时间 →</text>
  </svg>`;
}

const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\[\[(?:tip|warn):([\s\S]*?)\]\]/g, '$1');
const truncate = (s, n) => { const t = String(s || ''); return t.length > n ? t.slice(0, n) + '…' : t; };
void kindLabel;
