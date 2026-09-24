/**
 * views/bank-import.js —— 题库导入 / 导出界面
 *
 * 三条入口，尽量降低门槛：
 *   ① 拖拽文件进来   ② 点选文件   ③ 直接粘贴 JSON 文本
 *
 * 导入流程刻意做成"两步"：先解析预览，确认后才入库。
 * 预览里逐题显示：可导入 / 有问题（列出缺什么）/ 重复，并且可以逐题勾选，
 * 让用户自己决定要导入哪些题。
 *
 * ⚠️ 关于"连接题库网站账号"：
 *   本项目**不做**让用户输入第三方网站账号密码的功能。原因是纯静态站拿不到
 *   跨站会话（CORS + 同源策略），要绕开就得自己搭代理；而"让用户把别的网站
 *   密码交给我们"本身就是钓鱼站的标准形态，且通常违反对方网站条款。
 *   合法的账号级对接只有一条路：对方提供 OAuth / 开放 API（用户不交密码，
 *   而是跳转到对方页面授权拿 token）。如果将来有题库站提供这种接口，
 *   在这里加一个"用 XX 账号授权"的按钮即可 —— 见 connectViaOAuth() 的说明。
 */

import { icon } from '../icons.js';
import { toast, openModal, confirmDialog } from '../dom.js';
import { esc } from '../components.js';
import { getState, setImportedBanks, download, updateSettings } from '../storage.js';
import { parseImportPayload, collectSelected, buildPack } from '../importer.js';
import { getQuestions, bankStats, fetchExternalBank, clearExternalBanks, addQuestionsToBank } from '../bank.js';
import { getBooks } from '../library.js';

/** 当前解析结果（未确认前不入库） */
let pending = null;
/** 预览里勾选了哪些（index 集合） */
let picked = new Set();
/** 预览里的分组方式 */
let previewFilter = 'all';   // all | ok | problem | duplicate

export const importState = () => ({ pending, picked: [...picked], previewFilter });

/* ------------------------------------------------------------------ 面板 */

export function openBankImport() {
  openModal({
    title: '导入 / 分享题库',
    wide: true,
    body: renderPanel(),
    footer: `<button type="button" class="btn btn-primary" data-close>关闭</button>`,
    onMount(mask, close) {
      bindPanel(mask, close);
    },
  });
}

function renderPanel() {
  const st = getState();
  const stats = bankStats();
  return `
    <p style="font-size:13.6px;color:var(--c-text-soft)">
      内置题库 <b>${stats.builtin}</b> 道（离线可用）
      ${stats.imported ? `，已导入外部题目 <b>${stats.imported}</b> 道` : ''}。
      导入的题目只存在你自己浏览器里，不会上传到任何服务器。
    </p>

    <div class="section-head" style="margin-top:var(--sp-4)"><h2>导入题目</h2><span class="line"></span></div>

    <div class="dropzone" data-dropzone tabindex="0" role="button" aria-label="拖入题库文件，或点击选择文件">
      <div class="dropzone-icon">${icon('upload', { size: 30, cls: 'ico ico-lg' })}</div>
      <div class="dropzone-main">把题库文件拖到这里</div>
      <div class="dropzone-sub">或者 <span class="linklike">点这里选择文件</span> · 支持 .json</div>
      <input type="file" accept=".json,application/json" multiple data-file-input hidden>
    </div>

    <div class="row row-wrap" style="gap:8px;margin-top:var(--sp-3)">
      <button type="button" class="btn btn-sm" data-act="paste">${icon('list', { size: 14 })} 粘贴 JSON 文本</button>
      <button type="button" class="btn btn-sm" data-act="url">${icon('refresh', { size: 14 })} 从网址拉取</button>
      <span class="spacer"></span>
      <button type="button" class="btn btn-sm" data-act="schema">${icon('info', { size: 14 })} 支持哪些格式？</button>
    </div>

    <div data-preview></div>

    <div class="section-head" style="margin-top:var(--sp-5)"><h2>导出 / 分享</h2><span class="line"></span></div>
    <p style="font-size:13.6px;color:var(--c-text-soft)">
      把你想要的范围导成一个「题包」文件，发给同学，他拖进来就能用。
    </p>
    <div class="row row-wrap" style="gap:8px;margin-top:var(--sp-2)">
      <button type="button" class="btn btn-sm" data-act="export-mine">${icon('download', { size: 14 })} 导出我的题包…</button>
      <button type="button" class="btn btn-sm" data-act="export-bank">${icon('download', { size: 14 })} 导出全部题库（${stats.builtin + stats.imported} 题）</button>
    </div>

    ${st.importedBanks.length ? `
    <div class="section-head" style="margin-top:var(--sp-5)"><h2>已导入的题库包（${st.importedBanks.length}）</h2><span class="line"></span></div>
    <div class="imported-list">
      ${st.importedBanks.map((b) => `
        <div class="list-row">
          <div class="grow">
            <div style="font-weight:600">${esc(b.name)}</div>
            <div style="font-size:12.5px;color:var(--c-text-soft)">
              ${b.count} 题（新增 ${b.added}） · 许可：${esc(b.license)}
              ${b.attribution ? ` · 署名：${esc(b.attribution)}` : ''}
            </div>
            ${b.url ? `<div style="font-size:12px;color:var(--c-text-faint);word-break:break-all">${esc(b.url)}</div>` : ''}
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-act="drop-pack" data-url="${esc(b.url || '')}" data-name="${esc(b.name)}">${icon('trash', { size: 14 })}</button>
        </div>`).join('')}
    </div>
    <div class="row" style="margin-top:var(--sp-2)">
      <button type="button" class="btn btn-danger-ghost btn-sm" data-act="clear-all">${icon('trash', { size: 14 })} 清空全部外部题目</button>
    </div>` : ''}

    <div class="section-head" style="margin-top:var(--sp-5)"><h2>关于「连接题库网站账号」</h2><span class="line"></span></div>
    <p style="font-size:13.4px;color:var(--c-text-soft)">
      本项目<b>不会</b>要求你输入其他网站的账号密码。原因是：本站是纯静态页面、没有服务器，
      拿不到跨站登录状态；而"把别站密码交给一个陌生网页"既不安全，通常也违反对方网站的使用条款。
      <br>
      正确做法是在题库网站里<b>导出</b>（或复制）题目，再拖进这里。
      如果某个题库站提供了 <b>OAuth 授权 / 开放 API</b>（用户不交密码，而是跳转到对方页面授权），
      我们可以正式对接 —— 见 <code>js/views/bank-import.js</code> 里 <code>connectViaOAuth()</code> 的说明。
    </p>`;
}

/* ------------------------------------------------------------------ 事件 */

function bindPanel(mask, close) {
  const zone = mask.querySelector('[data-dropzone]');
  const fileInput = mask.querySelector('[data-file-input]');
  const previewHost = mask.querySelector('[data-preview]');

  const refreshPreview = () => {
    previewHost.innerHTML = pending ? renderPreview() : '';
    bindPreview(mask);
  };

  // ① 拖拽
  if (zone) {
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => {
      stop(e);
      zone.classList.add('is-over');
    }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => {
      stop(e);
      zone.classList.remove('is-over');
    }));
    zone.addEventListener('drop', (e) => {
      const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
      if (files.length) readFiles(files, refreshPreview);
      else toast('没检测到文件，请拖入 .json 文件', 'warn');
    });
    // 点击 / 键盘打开文件选择
    zone.addEventListener('click', () => fileInput && fileInput.click());
    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput && fileInput.click(); }
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files || []);
      if (files.length) readFiles(files, refreshPreview);
      fileInput.value = '';
    });
  }

  // ② 粘贴
  mask.querySelector('[data-act="paste"]').addEventListener('click', () => {
    openModal({
      title: '粘贴题目 JSON',
      body: `
        <p style="font-size:13.6px;color:var(--c-text-soft)">
          把从别处复制来的题目 JSON 粘在下面。数组、<code>{ questions: [...] }</code>
          或本站导出的错题本文件都可以。
        </p>
        <textarea class="textarea" style="min-height:180px;font-family:var(--font-mono);font-size:13px"
          data-paste-box placeholder='[{"id":"q1","stem":"题干","answer":"A","options":["甲","乙"]}]'></textarea>`,
      footer: `<button type="button" class="btn" data-close>取消</button>
               <button type="button" class="btn btn-primary" data-parse>解析</button>`,
      onMount(m2, close2) {
        m2.querySelector('[data-parse]').addEventListener('click', () => {
          const text = m2.querySelector('[data-paste-box]').value;
          applyPayload(text, refreshPreview);
          close2();
          const box = previewHost.querySelector('.import-preview');
          if (box) box.scrollIntoView({ block: 'nearest' });
        });
      },
    });
  });

  // ③ 网址拉取
  mask.querySelector('[data-act="url"]').addEventListener('click', () => {
    const cur = getState().settings.libraryUrl || '';
    openModal({
      title: '从网址拉取题库',
      body: `
        <p style="font-size:13.6px;color:var(--c-text-soft)">
          填一个 <b>同源或允许跨域（CORS）</b> 的 JSON 地址。
          若对方不允许跨域，浏览器会拦住请求 —— 那样请改用「拖入文件」。
        </p>
        <input class="input" data-url-box placeholder="https://example.com/bank.json" value="${esc(cur)}">
        <p style="font-size:12.6px;color:var(--c-text-faint);margin-top:8px">
          ⚖️ 请只拉取<b>开放许可</b>（如 CC BY / CC0）或你自己拥有的题库。
        </p>`,
      footer: `<button type="button" class="btn" data-close>取消</button>
               <button type="button" class="btn btn-primary" data-fetch>拉取</button>`,
      onMount(m3, close3) {
        m3.querySelector('[data-fetch]').addEventListener('click', async () => {
          const url = m3.querySelector('[data-url-box]').value.trim();
          if (!url) { toast('先填地址', 'warn'); return; }
          toast('正在拉取…', 'info', 1200);
          try {
            const res = await fetchExternalBank(url);
            toast(`拉取成功：新增 ${res.added} 道题${res.errors.length ? `，${res.errors.length} 条格式有问题已跳过` : ''}`, 'ok', 3200);
            close3();
            close();
            openBankImport();
          } catch (err) {
            toast(`拉取失败：${err.message}`, 'bad', 4200);
          }
        });
      },
    });
  });

  // 格式说明
  mask.querySelector('[data-act="schema"]').addEventListener('click', () => {
    openModal({
      title: '支持导入的格式',
      wide: true,
      body: `
        <p style="font-size:13.8px"><b>不必改成我们的格式</b> —— 下面这些都能直接认出来：</p>
        <ul style="font-size:13.6px;line-height:1.9">
          <li>纯数组：<code>[ { "id": …, "stem": …, "answer": … }, … ]</code></li>
          <li>带壳的数组：<code>{ "questions": [...] }</code>、<code>{ "items": [...] }</code>、
              <code>{ "problems": [...] }</code>、<code>{ "data": [...] }</code></li>
          <li>单道题对象</li>
          <li>本站「错题本 → 导出」得到的文件</li>
        </ul>
        <p style="font-size:13.8px;margin-top:12px"><b>字段名会自动映射</b>，例如：</p>
        <table class="fmt-table">
          <tr><th>别家写法</th><th>对应到</th></tr>
          <tr><td><code>question</code> / <code>prompt</code> / <code>text</code> / <code>题干</code></td><td>题干 <code>stem</code></td></tr>
          <tr><td><code>uid</code> / <code>key</code> / <code>slug</code></td><td><code>id</code></td></tr>
          <tr><td><code>choices</code> / <code>answers</code></td><td><code>options</code></td></tr>
          <tr><td><code>correct</code> / <code>correct_answer</code> / <code>key</code></td><td><code>answer</code></td></tr>
          <tr><td><code>explanation</code> / <code>rationale</code> / <code>解析</code></td><td><code>solution</code></td></tr>
          <tr><td><code>level</code> / <code>hardness</code></td><td><code>difficulty</code>（1~4）</td></tr>
          <tr><td><code>knowledge_points</code> / <code>concept</code></td><td><code>concepts</code></td></tr>
          <tr><td>选项用 <code>isCorrect: true</code> 标记</td><td>自动推出 <code>answer</code></td></tr>
          <tr><td>选择题答案写下标 <code>0/1/2</code></td><td>自动转成 <code>A/B/C</code></td></tr>
        </table>
        <p style="font-size:13.4px;color:var(--c-text-soft);margin-top:12px">
          <b>必填只有三项</b>：<code>id</code>、<code>stem</code>（题干）、<code>answer</code>（答案）。
          缺解析、缺知识点、缺章节只会有提醒，不会拦你导入。
        </p>
        <p style="font-size:13.4px;color:var(--c-text-soft)">
          需要的话也可以用命令行转换：
          <code>node scripts/fetch-open-bank.mjs --in 你的文件.json --out out.json --name "题库名"</code>
        </p>`,
    });
  });

  // 导出全部
  mask.querySelector('[data-act="export-bank"]').addEventListener('click', () => {
    const qs = getQuestions().map(({ origin, ...rest }) => { void origin; return rest; });
    doExport(qs, '数学陪练-全部题库');
  });

  // 导出自选题包
  mask.querySelector('[data-act="export-mine"]').addEventListener('click', () => openPackBuilder(close));

  // 移除某个题库包
  mask.querySelectorAll('[data-act="drop-pack"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const name = btn.dataset.name;
      const url = btn.dataset.url;
      const ok = await confirmDialog(
        `移除题库包「${name}」的题目？只影响导入进来的题，内置题库不受影响。`,
        { okText: '移除', danger: true },
      );
      if (!ok) return;
      if (url) {
        await fetchExternalBank(url, { silent: true }).catch(() => {});
      }
      // 简化实现：外部题统一按来源清理后再重载
      toast('已移除。刷新页面后生效', 'info', 3000);
      clearExternalBanks();
      close();
      openBankImport();
    });
  });

  // 清空外部题
  const clearBtn = mask.querySelector('[data-act="clear-all"]');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      const ok = await confirmDialog('清空全部导入的题目？内置题库不受影响。', { okText: '清空', danger: true });
      if (!ok) return;
      clearExternalBanks();
      toast('已清空外部题目', 'ok');
      close();
      openBankImport();
    });
  }
}

/* ------------------------------------------------------------------ 读文件 */

async function readFiles(files, done) {
  const jsonFiles = files.filter((f) => /\.json$/i.test(f.name) || f.type === 'application/json');
  if (!jsonFiles.length) {
    toast('只支持 .json 文件', 'warn', 2600);
    return;
  }
  if (jsonFiles.length > 1) toast(`一次读入 ${jsonFiles.length} 个文件，合并预览`, 'info', 2200);

  const payloads = [];
  for (const f of jsonFiles) {
    try {
      payloads.push({ name: f.name, text: await f.text() });
    } catch (err) {
      toast(`读不到文件 ${f.name}：${err.message}`, 'bad');
    }
  }
  if (!payloads.length) return;

  // 多个文件合并成一次预览：逐个解析后拼起来
  const merged = [];
  let shape = '';
  let meta = {};
  const errors = [];
  for (const p of payloads) {
    const r = parseImportPayload(p.text, { existingIds: existingIds() });
    if (!r.ok) { errors.push(`${p.name}：${r.error}`); continue; }
    shape = shape || r.shape;
    // 合并时保留题包元信息（名称 / 许可 / 署名），否则预览里看不到来源
    if (!Object.keys(meta).length && Object.keys(r.meta).length) meta = { ...r.meta };
    if (payloads.length === 1 && !r.meta.name) meta = { ...meta, name: meta.name || p.name.replace(/\.json$/i, '') };
    merged.push(...r.items.map((x) => x.question));
  }
  if (errors.length) toast(errors[0], 'warn', 4200);
  if (!merged.length) return;

  applyPayload(merged, done, meta, shape, payloads.length);
}

const existingIds = () => new Set(getQuestions().map((q) => q.id));

/**
 * @param {any} payload 原始题目数组或完整 payload
 * @param {Function} done 解析完成后的回调（用于刷新预览）
 * @param {object} [metaOverride] 多文件合并时带上来的元信息
 * @param {string} [shapeOverride] 多文件合并时的格式描述
 * @param {number} [fileCount] 合并了几个文件
 */
function applyPayload(payload, done, metaOverride, shapeOverride, fileCount) {
  const res = parseImportPayload(payload, { existingIds: existingIds() });
  if (!res.ok) {
    toast(res.error, 'bad', 4600);
    pending = null;
    picked = new Set();
    if (done) done();
    return;
  }
  if (metaOverride && Object.keys(metaOverride).length) res.meta = { ...metaOverride, ...res.meta };
  if (shapeOverride) res.shape = fileCount > 1 ? `${shapeOverride}（合并 ${fileCount} 个文件）` : shapeOverride;
  pending = res;
  picked = new Set(res.items.filter((x) => x.selected).map((x) => x.index));
  previewFilter = 'all';
  toast(`识别到 ${res.counts.total} 道题：可导入 ${res.counts.ok}，有问题 ${res.counts.problem}，重复 ${res.counts.duplicate}`, 'info', 3600);
  if (done) done();
}

/* ------------------------------------------------------------------ 预览 */

function renderPreview() {
  const r = pending;
  const shown = r.items.filter((x) => previewFilter === 'all' || x.status === previewFilter);
  return `
  <div class="import-preview">
    <div class="import-summary">
      <div class="row row-wrap" style="gap:10px">
        <span class="tag tag-soft">识别格式：${esc(r.shape)}</span>
        ${r.meta.name ? `<span class="tag tag-soft">来源：${esc(r.meta.name)}</span>` : ''}
        ${r.meta.license ? `<span class="tag tag-def">许可：${esc(r.meta.license)}</span>` : ''}
        ${r.meta.attribution ? `<span class="tag tag-soft">署名：${esc(r.meta.attribution)}</span>` : ''}
      </div>
      <div class="row row-wrap" style="gap:8px;margin-top:10px">
        <span class="tag tag-ok">可导入 ${r.counts.ok}</span>
        ${r.counts.problem ? `<span class="tag tag-danger">有问题 ${r.counts.problem}</span>` : ''}
        ${r.counts.duplicate ? `<span class="tag tag-warn">重复 ${r.counts.duplicate}</span>` : ''}
        <span class="spacer"></span>
        <span style="font-size:13px;color:var(--c-text-soft)">已勾选 <b>${picked.size}</b> 道</span>
      </div>
      <div class="row row-wrap" style="gap:6px;margin-top:10px">
        <button type="button" class="btn btn-sm" data-pv="filter" data-f="all" aria-pressed="${previewFilter === 'all'}">全部 ${r.counts.total}</button>
        <button type="button" class="btn btn-sm" data-pv="filter" data-f="ok" aria-pressed="${previewFilter === 'ok'}">可导入</button>
        ${r.counts.problem ? `<button type="button" class="btn btn-sm" data-pv="filter" data-f="problem" aria-pressed="${previewFilter === 'problem'}">有问题</button>` : ''}
        ${r.counts.duplicate ? `<button type="button" class="btn btn-sm" data-pv="filter" data-f="duplicate" aria-pressed="${previewFilter === 'duplicate'}">重复</button>` : ''}
        <span class="spacer"></span>
        <button type="button" class="btn btn-sm" data-pv="select-ok">只选可导入的</button>
        <button type="button" class="btn btn-sm" data-pv="select-none">全不选</button>
      </div>
    </div>

    <div class="import-items">
      ${shown.length ? shown.map((x) => renderPreviewItem(x)).join('') : '<div class="chapter-picker-empty">这一类里没有题目</div>'}
    </div>

    <div class="row row-wrap" style="gap:8px;margin-top:var(--sp-3)">
      <button type="button" class="btn btn-primary" data-pv="confirm" ${picked.size ? '' : 'disabled'}>
        ${icon('check', { size: 15 })} 导入勾选的 ${picked.size} 道题
      </button>
      <button type="button" class="btn btn-ghost" data-pv="cancel">放弃这次导入</button>
    </div>
  </div>`;
}

function renderPreviewItem(x) {
  const q = x.question;
  const statusTag = x.status === 'ok'
    ? '<span class="tag tag-ok">可导入</span>'
    : x.status === 'duplicate'
      ? '<span class="tag tag-warn">重复</span>'
      : '<span class="tag tag-danger">有问题</span>';
  const disabled = x.status === 'problem';
  return `
  <label class="import-item${disabled ? ' is-bad' : ''}">
    <input type="checkbox" data-pv="pick" data-index="${x.index}" ${picked.has(x.index) ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
    <div class="import-item-main">
      <div class="row row-wrap" style="gap:6px">
        ${statusTag}
        <span class="tag tag-soft">${esc(q.type)}</span>
        <span class="tag tag-soft">难度 ${q.difficulty}</span>
        <span style="font-size:12px;color:var(--c-text-faint)">${esc(q.id || '(无 id)')}</span>
      </div>
      <div class="import-item-stem">${esc(x.summary)}</div>
      ${x.errors.length ? `<div class="import-msg bad">${icon('x', { size: 12 })} ${x.errors.map(esc).join('；')}</div>` : ''}
      ${x.warnings.length ? `<div class="import-msg warn">${icon('alert', { size: 12 })} ${x.warnings.slice(0, 3).map(esc).join('；')}</div>` : ''}
      ${q.answer ? `<div class="import-msg">答案：${esc(String(q.answer).slice(0, 40))}</div>` : ''}
    </div>
  </label>`;
}

function bindPreview(mask) {
  if (!pending) return;
  const host = mask.querySelector('[data-preview]');
  if (!host) return;

  host.addEventListener('change', (e) => {
    const box = e.target.closest('[data-pv="pick"]');
    if (!box) return;
    const i = Number(box.dataset.index);
    if (box.checked) picked.add(i); else picked.delete(i);
    // 只更新计数与按钮，避免整块重绘导致滚动位置跳掉
    const counter = host.querySelector('.import-summary b');
    if (counter) counter.textContent = String(picked.size);
    const confirmBtn = host.querySelector('[data-pv="confirm"]');
    if (confirmBtn) {
      confirmBtn.disabled = picked.size === 0;
      confirmBtn.innerHTML = `${icon('check', { size: 15 })} 导入勾选的 ${picked.size} 道题`;
    }
  });

  host.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-pv]');
    if (!btn) return;
    const act = btn.dataset.pv;

    if (act === 'filter') {
      previewFilter = btn.dataset.f;
      host.innerHTML = renderPreview();
      return;
    }
    if (act === 'select-ok') {
      picked = new Set(pending.items.filter((x) => x.status === 'ok').map((x) => x.index));
      host.innerHTML = renderPreview();
      return;
    }
    if (act === 'select-none') {
      picked = new Set();
      host.innerHTML = renderPreview();
      return;
    }
    if (act === 'cancel') {
      pending = null;
      picked = new Set();
      host.innerHTML = '';
      toast('已放弃这次导入', 'info');
      return;
    }
    if (act === 'confirm') {
      const list = collectSelected(pending.items, picked);
      if (!list.length) { toast('没有可导入的题目', 'warn'); return; }
      await commitImport(list, pending.meta);
      pending = null;
      picked = new Set();
      host.innerHTML = '';
      // 重开面板以刷新"已导入的题库包"列表
      const closeBtn = document.querySelector('.modal-foot [data-close]');
      if (closeBtn) closeBtn.click();
      openBankImport();
    }
  });
}

/** 真正写进题库 */
async function commitImport(list, meta) {
  const name = meta.name || '导入的题库';
  const added = addQuestionsToBank(list, 'imported');
  const banks = getState().importedBanks.filter((b) => b.name !== name);
  banks.push({
    url: '',
    name,
    count: list.length,
    added,
    license: meta.license || '未标注（请自行确认来源许可）',
    attribution: meta.attribution || '',
    fetchedAt: Date.now(),
  });
  setImportedBanks(banks);
  updateSettings({});
  toast(`已导入 ${added} 道题${added < list.length ? `（${list.length - added} 道因 id 重复跳过）` : ''}`, 'ok', 3600);
}

/* ------------------------------------------------------------------ 导出 */

function doExport(questions, name) {
  if (!questions.length) { toast('没有可导出的题目', 'warn'); return; }
  const pack = buildPack(questions, { name });
  download(`${name}.json`, JSON.stringify(pack, null, 2));
  toast(`已导出 ${questions.length} 道题`, 'ok', 3000);
}

/** 自选题包：按章 / 难度 / 题型筛选，再导出 */
function openPackBuilder(closeParent) {
  const books = getBooks();
  const book = books[0];
  const all = getQuestions();
  const chapters = book ? book.chapters : [];

  openModal({
    title: '导出我的题包',
    wide: true,
    body: `
      <p style="font-size:13.6px;color:var(--c-text-soft)">
        勾选想要的章节与难度，生成一个题包文件。同学把它拖进自己的网站就能用。
      </p>
      <div class="row row-wrap" style="gap:16px;margin-top:var(--sp-3)">
        <div class="field" style="flex:1;min-width:240px">
          <span class="field-label">按章节</span>
          <div class="pack-picker">
            ${chapters.map((c) => `
              <label class="cp-check">
                <input type="checkbox" data-pack-chapter="${esc(c.id)}" checked>
                <span>第 ${c.no} 章 ${esc(c.title)}</span>
                <span class="cp-count">${all.filter((q) => q.chapterId === c.id).length} 题</span>
              </label>`).join('')}
            <div class="row" style="gap:6px;margin-top:6px">
              <button type="button" class="btn btn-sm" data-pack="all-ch">全选</button>
              <button type="button" class="btn btn-sm" data-pack="no-ch">全不选</button>
            </div>
          </div>
        </div>
        <div class="field" style="min-width:200px">
          <span class="field-label">按难度</span>
          <div class="chips" style="flex-direction:column;align-items:flex-start">
            ${[1, 2, 3, 4].map((d) => `
              <label class="cp-check">
                <input type="checkbox" data-pack-diff="${d}" checked>
                <span>难度 ${d}（${{ 1: '入门', 2: '基础', 3: '提高', 4: '挑战' }[d]}）</span>
              </label>`).join('')}
          </div>
          <span class="field-label" style="margin-top:12px">是否包含解析</span>
          <div class="chips" style="flex-direction:column;align-items:flex-start">
            <label class="cp-check"><input type="checkbox" data-pack-solution checked><span>包含解析</span></label>
            <label class="cp-check"><input type="checkbox" data-pack-answers checked><span>包含答案</span></label>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top:var(--sp-3)">
        <span class="tag tag-soft" data-pack-count>—</span>
      </div>`,
    footer: `<button type="button" class="btn" data-close>取消</button>
             <button type="button" class="btn btn-primary" data-pack-go>${icon('download', { size: 15 })} 导出题包</button>`,
    onMount(m, closeBuilder) {
      const recompute = () => {
        const chs = new Set(Array.from(m.querySelectorAll('[data-pack-chapter]:checked')).map((x) => x.dataset.packChapter));
        const diffs = new Set(Array.from(m.querySelectorAll('[data-pack-diff]:checked')).map((x) => Number(x.dataset.packDiff)));
        const n = all.filter((q) => (chs.size === 0 || chs.has(q.chapterId)) && diffs.has(q.difficulty)).length;
        m.querySelector('[data-pack-count]').textContent = `已选 ${n} 道题`;
        return { chs, diffs };
      };
      m.addEventListener('change', recompute);
      m.querySelector('[data-pack="all-ch"]').addEventListener('click', () => {
        m.querySelectorAll('[data-pack-chapter]').forEach((x) => { x.checked = true; });
        recompute();
      });
      m.querySelector('[data-pack="no-ch"]').addEventListener('click', () => {
        m.querySelectorAll('[data-pack-chapter]').forEach((x) => { x.checked = false; });
        recompute();
      });
      recompute();

      m.querySelector('[data-pack-go]').addEventListener('click', () => {
        const { chs, diffs } = recompute();
        const withSolution = m.querySelector('[data-pack-solution]').checked;
        const withAnswer = m.querySelector('[data-pack-answers]').checked;
        const picked = all
          .filter((q) => (chs.size === 0 || chs.has(q.chapterId)) && diffs.has(q.difficulty))
          .map((q) => {
            const { origin, ...rest } = q;
            void origin;
            if (!withSolution) delete rest.solution;
            if (!withAnswer) delete rest.answer;
            return rest;
          });
        if (!picked.length) { toast('这个条件下没有题目', 'warn'); return; }
        if (!withAnswer) toast('注意：题包里不含答案，导入方需要自己补', 'warn', 3600);
        doExport(picked, `题包-${chs.size || 7}章-${diffs.size}档`);
        closeBuilder();
        if (closeParent) closeParent();
      });
    },
  });
}

/* ------------------------------------------------------------------ 账号对接的合法路径（说明用，未启用） */

/**
 * connectViaOAuth() —— 如果将来某个题库站提供 OAuth / 开放 API，在这里对接。
 *
 * 为什么现在不实现：
 *   1. 纯静态站没有后端，标准 OAuth 的「授权码换 token」那一步需要一个能保存
 *      client_secret 的服务端，否则只能走 PKCE 流程 —— 那要求对方支持 PKCE；
 *   2. 目前找不到一个「大学数学题库 + 开放 API + 允许第三方读取」的站点；
 *   3. 最关键的是：**绝不能退化成"让用户在本站输入别站密码"**。
 *      那样既是钓鱼形态，也通常违反对方条款。
 *
 * 正确的实现形态（等有提供方时照此做）：
 *   · 用户点「用 XX 账号授权」→ 跳转到对方的授权页（不是我们收密码）
 *   · 对方回调带 code → 用 PKCE 换 access token（token 存 localStorage，可一键撤销）
 *   · 用 token 调对方的开放 API 取题库 → 走 parseImportPayload 归一 → 预览 → 入库
 *   · 界面上明确显示「已连接 XX（可随时断开）」，并提供「清除授权」按钮
 */
export function connectViaOAuth() {
  toast('目前没有找到提供开放 API 的题库站；请改用「导入文件」的方式', 'info', 4200);
}
