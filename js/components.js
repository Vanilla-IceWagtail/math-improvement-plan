/**
 * components.js —— 可复用 UI 组件
 */

import { icon } from './icons.js';
import { rich, richInline, preview as textPreview } from './text.js';
import { kindLabel } from './library.js';
import { getRecord } from './storage.js';
import { DIFFICULTY } from './generator.js';
import { phaseLabel, phaseRatio, MAX_PHASE } from './srs.js';
import { humanizeDue } from './dom.js';

/* ---------------- 星标 / 错题本 两个可点亮图标 ---------------- */

/**
 * @param {string} id
 * @param {'question'|'item'} kind
 * @returns {string} HTML
 */
export function toolButtons(id, kind) {
  const rec = getRecord(id, kind);
  const starred = rec && rec.stars ? true : false;
  const inBook = rec && rec.srs ? true : false;
  return `
    <div class="card-tools">
      <button type="button" class="toolbtn${starred ? ' is-on' : ''}" data-tool="star"
        data-id="${esc(id)}" data-kind="${kind}" aria-pressed="${starred}"
        title="${starred ? '取消收藏' : '收藏这一条'}" aria-label="${starred ? '取消收藏' : '收藏这一条'}">
        ${icon('star', { size: 17 })}
      </button>
      <button type="button" class="toolbtn${inBook ? ' is-on' : ''}" data-tool="notebook"
        data-id="${esc(id)}" data-kind="${kind}" aria-pressed="${inBook}"
        title="${inBook ? '从错题本移出' : '加入错题本（按艾宾浩斯曲线提醒复习）'}"
        aria-label="${inBook ? '从错题本移出' : '加入错题本'}">
        ${icon('notebook', { size: 17 })}
      </button>
    </div>`;
}

export const esc = (s) =>
  String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------------- 定义 / 定理 / 公式 标签 ---------------- */

export const kindTag = (kind) => {
  const cls = kind === 'definition' ? 'tag-def' : kind === 'theorem' ? 'tag-thm' : kind === 'formula' ? 'tag-formula' : 'tag-note';
  return `<span class="tag ${cls}">${kindLabel(kind)}</span>`;
};

export const diffMeter = (d) => {
  const n = Math.min(4, Math.max(1, Number(d) || 1));
  return `<span class="diff-meter" title="难度 ${n}/4 · ${DIFFICULTY[n].name}" aria-label="难度 ${n} 级，共 4 级">${
    [1, 2, 3, 4].map((i) => `<i class="${i <= n ? `on-${n}` : ''}"></i>`).join('')
  }</span>`;
};

export const diffTag = (d) => {
  const n = Math.min(4, Math.max(1, Number(d) || 1));
  const cls = n === 1 ? 'tag-ok' : n === 2 ? 'tag-def' : n === 3 ? 'tag-warn' : 'tag-danger';
  return `<span class="tag ${cls}">难度 ${n} · ${DIFFICULTY[n].name}</span>`;
};

export const typeLabel = (t) =>
  ({ choice: '选择题', fill: '填空题', judge: '判断题', compute: '计算题', proof: '证明题' }[t] || '题目');

/* ---------------- 教材条目卡 ---------------- */

/**
 * 渲染一条定义/定理
 * @param {object} item
 * @param {{collapsed?:boolean, alwaysOpen?:boolean, anchor?:boolean}} [opt]
 */
export function itemCard(item, opt = {}) {
  const kindCls = item.kind === 'definition' ? 'kind-definition' : item.kind === 'theorem' ? 'kind-theorem' : item.kind === 'formula' ? 'kind-formula' : 'kind-note';
  const aka = (item.aka && item.aka.length) ? `<span class="item-aka">（也叫 ${item.aka.map(esc).join('、')}）</span>` : '';
  const blocks = [];

  blocks.push(`
    <div class="block">
      <div class="block-label">${icon('list', { size: 13 })} 严谨说法</div>
      <div class="block-statement">${richInline(item.statement)}</div>
    </div>`);

  if (item.plain) {
    blocks.push(`
      <div class="block block-plain">
        <div class="block-label">${icon('lightbulb', { size: 13 })} 说人话</div>
        <div>${rich(item.plain)}</div>
      </div>`);
  }

  if (item.why) {
    blocks.push(`
      <div class="block">
        <div class="block-label">${icon('sparkles', { size: 13 })} 为什么要这样想</div>
        <div>${rich(item.why)}</div>
      </div>`);
  }

  if (item.proof) {
    blocks.push(`
      <div class="block block-proof">
        <div class="block-label">${icon('check', { size: 13 })} ${item.kind === 'theorem' ? '证明' : '推导'}</div>
        <div>${rich(item.proof)}</div>
      </div>`);
  }

  if (item.example) {
    blocks.push(`
      <div class="block block-example">
        <div class="block-label">${icon('target', { size: 13 })} 举个最小例子</div>
        <div>${rich(item.example)}</div>
      </div>`);
  }

  if (item.pitfalls && item.pitfalls.length) {
    blocks.push(`
      <div class="block block-pitfall">
        <div class="block-label">${icon('alert', { size: 13 })} 容易错的地方</div>
        <ul>${item.pitfalls.map((p) => `<li>${richInline(p)}</li>`).join('')}</ul>
      </div>`);
  }

  const related = (item.related || []).filter(Boolean);
  const relHtml = related.length
    ? `<div class="kv-inline">${related.map((r) => `<button type="button" class="chip" data-goto-item="${esc(r)}">${icon('arrowRight', { size: 12 })} ${esc(r)}</button>`).join('')}</div>`
    : '';

  const tags = (item.tags || []).length
    ? `<div class="kv-inline">${item.tags.map((t) => `<span class="tag tag-soft">${esc(t)}</span>`).join('')}</div>`
    : '';

  const rec = getRecord(item.id, 'item');

  return `
    <article class="item ${kindCls}" id="item-${esc(item.id)}" data-item-id="${esc(item.id)}">
      <div class="item-head">
        <div class="item-head-text">
          <div class="item-title-row">
            ${kindTag(item.kind)}
            <span class="item-title">${esc(item.name)}</span>
            ${aka}
          </div>
          ${rec && rec.srs ? `<div style="margin-top:6px"><span class="due-pill ${rec.srs.due <= Date.now() ? 'now' : 'soon'}">${icon('clock', { size: 12 })} 错题本 · ${phaseLabel(rec.srs.phase)}</span></div>` : ''}
        </div>
        ${toolButtons(item.id, 'item')}
      </div>
      <div class="item-body">
        ${blocks.join('')}
        ${relHtml}
        ${tags}
      </div>
    </article>`;
}

/* ---------------- 单行条目（搜索结果 / 收藏列表） ---------------- */

export function itemRow(item, { keyword = '' } = {}) {
  const rec = getRecord(item.id, 'item');
  return `
    <div class="list-row">
      <div class="grow">
        <div class="item-title-row">
          ${kindTag(item.kind)}
          <button type="button" class="linklike" data-goto-item="${esc(item.id)}">${hl(item.name, keyword)}</button>
        </div>
        <div class="nb-preview">${hl(textPreview(item.statement, 110), keyword)}</div>
        <div class="tag tag-soft" style="margin-top:6px">${esc(item.chapterTitle || '')} · ${esc(item.sectionTitle || '')}</div>
      </div>
      <div class="nb-side">
        ${rec && rec.srs ? `<span class="due-pill soon">${phaseLabel(rec.srs.phase)}</span>` : ''}
        ${toolButtons(item.id, 'item')}
      </div>
    </div>`;
}

function hl(text, kw) {
  const safe = esc(text);
  if (!kw) return safe;
  try {
    return safe.replace(new RegExp(`(${String(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  } catch { return safe; }
}

/* ---------------- 题目卡（错题本 / 收藏里展示用） ---------------- */

export function questionCard(q, { showSolution = true, showActions = true, index } = {}) {
  const rec = getRecord(q.id, 'question');
  const opts = (q.options || []).length
    ? `<div class="options">${q.options.map((o, i) => {
        const key = String.fromCharCode(65 + i);
        return `<div class="option" style="cursor:default"><span class="key">${key}</span><span>${richInline(String(o).replace(/^[A-D][.、]\s*/, ''))}</span></div>`;
      }).join('')}</div>`
    : '';
  return `
    <article class="item" id="q-${esc(q.id)}" data-q-id="${esc(q.id)}" style="border-left-color:var(--c-primary)">
      <div class="item-head">
        <div class="item-head-text">
          <div class="item-title-row">
            <span class="tag tag-soft">${typeLabel(q.type)}</span>
            ${diffTag(q.difficulty)}
            ${index != null ? `<span class="tag tag-soft">第 ${index} 题</span>` : ''}
          </div>
          ${rec && rec.srs ? `<div style="margin-top:6px"><span class="due-pill ${rec.srs.due <= Date.now() ? 'now' : 'later'}">${icon('clock', { size: 12 })} ${phaseLabel(rec.srs.phase)} · ${humanizeDue(rec.srs.due)}</span></div>` : ''}
        </div>
        ${showActions ? toolButtons(q.id, 'question') : ''}
      </div>
      <div class="item-body">
        <div class="q-stem">${richInline(q.stem)}</div>
        ${opts}
        <div class="block block-example" style="margin-top:14px">
          <div class="block-label">${icon('check', { size: 13 })} 答案</div>
          <div>${richInline(q.answer)}</div>
        </div>
        ${showSolution && q.solution ? `
        <div class="block block-proof" style="margin-top:12px">
          <div class="block-label">${icon('lightbulb', { size: 13 })} 解析</div>
          <div>${rich(q.solution)}</div>
        </div>` : ''}
        ${(q.tags || []).length ? `<div class="kv-inline">${q.tags.map((t) => `<span class="tag tag-soft">${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
    </article>`;
}

/* ---------------- 进度环 / 复习阶段条 ---------------- */

export function phaseBar(phase) {
  const r = phaseRatio(phase);
  return `<div class="ladder-row" title="记忆强度 ${Math.round(r * 100)}%">
    <span style="min-width:64px;color:var(--c-text-soft)">阶段 ${Math.min(phase || 0, MAX_PHASE)}/${MAX_PHASE}</span>
    <span class="bar"><span style="width:${Math.round(r * 100)}%"></span></span>
  </div>`;
}

export function emptyState({ iconName = 'info', title, desc, action = '' }) {
  return `<div class="empty">
    <div class="big">${icon(iconName, { size: 34, cls: 'ico ico-lg' })}</div>
    <h3>${esc(title)}</h3>
    <p>${richInline(desc)}</p>
    ${action}
  </div>`;
}
