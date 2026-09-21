/**
 * views/textbook.js —— 版块三：教材定理定义详细解
 *
 * 布局：
 *   左侧 目录（教材 → 章 → 节 → 定义/定理），层层点开
 *   右侧 内容（每节展开后是若干条目卡：严谨说法 / 说人话 / 为什么要这样想 / 证明 / 例子 / 易错点）
 *
 * 为什么这样设计：
 *   教材是线性的，但学习不是。左边给"地图"，右边给"讲解"，
 *   每个定义和定理右上角都能收藏、能加错题本，这样知识条目也进了复习循环。
 */

import { icon } from '../icons.js';
import { rich, richInline } from '../text.js';
import { toast, openModal, scrollToEl } from '../dom.js';
import { getBooks, getBook, getItem, searchItems, chapterStats, kindLabel } from '../library.js';
import { getState, updateSettings, getRecord } from '../storage.js';
import { conceptQuestionCount as qCount } from '../bank.js';
import { itemCard, itemRow, emptyState, kindTag, esc, toolButtons } from '../components.js';
import { forgettingCurveSVG } from './notebook.js';

const ui = {
  bookId: null,
  chapterId: null,
  /** 展开的章节集合 */
  openChapters: new Set(),
  /** 展开的节集合 */
  openSections: new Set(),
  keyword: '',
  onlyKind: '',      // '' | definition | theorem
  onlyStarred: false,
  onlyNotebook: false,
  searchMode: false,
};

export const textbookState = ui;

export function initTextbook() {
  const books = getBooks();
  if (!ui.bookId) ui.bookId = getState().settings.bookId || (books[0] && books[0].id);
  const book = getBook(ui.bookId);
  if (book && book.chapters.length && !ui.chapterId) {
    ui.chapterId = book.chapters[0].id;
    ui.openChapters.add(book.chapters[0].id);
    // 默认把第一节也展开
    if (book.chapters[0].sections[0]) ui.openSections.add(book.chapters[0].sections[0].id);
  }
}

/** 打开教材版块并定位到某个条目（从错题本 / 搜索跳过来时用） */
export function jumpToItem(itemId) {
  const item = getItem(itemId);
  if (!item) { toast('找不到这一条内容', 'warn'); return; }
  ui.bookId = item.bookId;
  ui.chapterId = item.chapterId;
  ui.openChapters.add(item.chapterId);
  ui.openSections.add(item.sectionId);
  ui.searchMode = false;
  ui.keyword = '';
  updateSettings({ bookId: item.bookId });
  render();
  setTimeout(() => {
    const node = document.getElementById(`item-${item.id}`);
    if (node) {
      scrollToEl(node);
      node.style.transition = 'box-shadow .4s';
      node.style.boxShadow = '0 0 0 3px var(--c-primary)';
      setTimeout(() => { node.style.boxShadow = ''; }, 1400);
    }
  }, 60);
}

let rerender = () => {};
export function setRerender(fn) { rerender = fn; }
const render = () => rerender();

/* ------------------------------------------------------------------ 渲染 */

export function renderTextbook() {
  initTextbook();
  const book = getBook(ui.bookId);
  if (!book || !book.chapters.length) {
    return `<section class="page">
      <div class="page-head"><h1>教材定理定义</h1></div>
      ${emptyState({
        iconName: 'book',
        title: '教材内容还没加载出来',
        desc: '可能是 <code>data/books/</code> 下的章节文件还没写完。请按 <code>docs/content-spec.md</code> 的格式补齐后刷新页面。',
      })}
    </section>`;
  }

  return `
  <section class="page">
    <div class="page-head">
      <h1>教材定理定义</h1>
      <div class="sub">
        左边是目录，一层层点开：<b>章 → 节 → 定义 / 定理</b>。每个条目都给了
        <b>严谨说法</b>、<b>说人话</b>、<b>为什么要这样想</b>${'、'}<b>证明</b>、<b>例子</b>和<b>易错点</b>。
        <span class="tag tag-def" style="margin-left:6px">定义</span> 负责把概念说清楚，
        <span class="tag tag-thm">定理</span> 负责把结论和证明讲明白。
      </div>
    </div>

    <div class="row row-wrap" style="margin-bottom:16px;gap:10px">
      <label class="field" style="min-width:220px">
        <span class="field-label">教材</span>
        <select class="select" data-action="pick-book">
          ${getBooks().map((b) => `<option value="${esc(b.id)}"${b.id === ui.bookId ? ' selected' : ''}>${esc(b.title)}（${esc(b.edition || '')}）</option>`).join('')}
        </select>
      </label>
      <label class="field" style="flex:1;min-width:220px">
        <span class="field-label">全文搜索（定义名、定理名、例题、证明里都能搜）</span>
        <input class="input" type="search" placeholder="例如：罗尔、ε-δ、夹逼、曲率、通解" data-action="tb-search" value="${esc(ui.keyword)}">
      </label>
      <div class="field">
        <span class="field-label">只看</span>
        <div class="chips">
          <button type="button" class="chip" data-action="tb-kind" data-kind="" aria-pressed="${ui.onlyKind === ''}">全部</button>
          <button type="button" class="chip" data-action="tb-kind" data-kind="definition" aria-pressed="${ui.onlyKind === 'definition'}">定义</button>
          <button type="button" class="chip" data-action="tb-kind" data-kind="theorem" aria-pressed="${ui.onlyKind === 'theorem'}">定理</button>
          <button type="button" class="chip" data-action="tb-flag" data-flag="star" aria-pressed="${ui.onlyStarred}">⭐ 已收藏</button>
          <button type="button" class="chip" data-action="tb-flag" data-flag="note" aria-pressed="${ui.onlyNotebook}">📕 在错题本</button>
        </div>
      </div>
    </div>

    ${ui.keyword ? renderSearch(book) : `
    <div class="book-layout">
      <nav class="toc" aria-label="教材目录">
        ${renderTOC(book)}
      </nav>
      <div class="book-content">
        ${renderChapters(book)}
      </div>
    </div>`}
  </section>`;
}

/* ---------------- 目录 ---------------- */

function renderTOC(book) {
  return `
  <div class="toc-book">
    <div>
      <div class="toc-book-name">${esc(book.title)}</div>
      <small>${esc(book.edition || '')}｜${book.itemCount} 条 · ${book.defCount} 定义 · ${book.thmCount} 定理</small>
    </div>
  </div>
  ${book.chapters.map((ch) => {
    const open = ui.openChapters.has(ch.id);
    const st = chapterStats(ch.id);
    return `
    <div class="toc-chapter">
      <button type="button" class="toc-row" data-action="toggle-chapter" data-chapter="${esc(ch.id)}" aria-expanded="${open}">
        ${icon('chevronRight', { size: 14, cls: 'ico chev' })}
        <span>第 ${ch.no} 章 ${esc(ch.title)}</span>
        <span class="count">${st.total}</span>
      </button>
      <div class="toc-sub" ${open ? '' : 'hidden'}>
        ${(ch.sections || []).map((sec) => {
          const secOpen = ui.openSections.has(sec.id);
          const n = (sec.items || []).length;
          return `
          <button type="button" class="toc-row" data-action="goto-section" data-chapter="${esc(ch.id)}" data-section="${esc(sec.id)}">
            <span>${esc(sec.no || '')} ${esc(sec.title)}</span>
            <span class="count">${n}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }).join('')}`;
}

/* ---------------- 章节内容 ---------------- */

function renderChapters(book) {
  const chapters = book.chapters;
  return chapters.map((ch) => {
    const isOpen = ui.openChapters.has(ch.id);
    const st = chapterStats(ch.id);
    return `
    <section class="card chapter-card" id="chapter-${esc(ch.id)}" data-chapter-block="${esc(ch.id)}">
      <div class="chapter-head">
        <div class="row row-wrap">
          <div style="flex:1;min-width:200px">
            <div class="chapter-no">第 ${ch.no} 章</div>
            <h2>${esc(ch.title)}</h2>
          </div>
          <div class="chips">
            <span class="tag tag-def">${st.def} 个定义</span>
            <span class="tag tag-thm">${st.thm} 个定理</span>
            <span class="tag tag-soft">共 ${st.total} 条</span>
          </div>
          <button type="button" class="btn btn-sm" data-action="toggle-chapter" data-chapter="${esc(ch.id)}">
            ${icon(isOpen ? 'chevronDown' : 'chevronRight', { size: 14 })} ${isOpen ? '收起本章' : '展开本章'}
          </button>
        </div>
        ${ch.intro ? `<div class="intro">${rich(ch.intro)}</div>` : ''}
      </div>
      <div ${isOpen ? '' : 'hidden'}>
        ${(ch.sections || []).map((sec) => renderSection(ch, sec)).join('')}
      </div>
    </section>`;
  }).join('');
}

function renderSection(ch, sec) {
  const items = filterItems(sec.items || []);
  if (ui.onlyKind || ui.onlyStarred || ui.onlyNotebook) {
    if (!items.length) return '';
  }
  const open = ui.openSections.has(sec.id) || Boolean(ui.onlyKind || ui.onlyStarred || ui.onlyNotebook);
  const total = (sec.items || []).length;
  return `
  <div class="section-block" id="section-${esc(sec.id)}" data-section-block="${esc(sec.id)}">
    <div class="section-title">
      <span class="no">${esc(sec.no || '')}</span>
      <h3>${esc(sec.title)}</h3>
      <span class="tag tag-soft">${items.length}/${total} 条</span>
      <span class="spacer"></span>
      <button type="button" class="btn btn-ghost btn-sm" data-action="toggle-section" data-section="${esc(sec.id)}">
        ${icon(open ? 'chevronDown' : 'chevronRight', { size: 14 })} ${open ? '收起' : '展开'}
      </button>
    </div>
    ${sec.summary ? `<div class="section-summary">${rich(sec.summary)}</div>` : ''}
    <div ${open ? '' : 'hidden'}>
      ${items.length
        ? `<div class="section-items">${items.map((i) => itemCard(i)).join('')}</div>`
        : `<p style="color:var(--c-text-faint);font-size:13.5px">这一节没有符合筛选条件的条目。</p>`}
    </div>
  </div>`;
}

function filterItems(items) {
  let list = items;
  if (ui.onlyKind) list = list.filter((i) => i.kind === ui.onlyKind);
  if (ui.onlyStarred) list = list.filter((i) => { const r = getRecord(i.id, 'item'); return r && r.stars; });
  if (ui.onlyNotebook) list = list.filter((i) => { const r = getRecord(i.id, 'item'); return r && r.srs; });
  return list;
}

/* ---------------- 搜索结果 ---------------- */

function renderSearch(book) {
  const hits = searchItems(ui.keyword, { bookId: book.id }).filter((i) => {
    if (ui.onlyKind && i.kind !== ui.onlyKind) return false;
    if (ui.onlyStarred) { const r = getRecord(i.id, 'item'); if (!(r && r.stars)) return false; }
    if (ui.onlyNotebook) { const r = getRecord(i.id, 'item'); if (!(r && r.srs)) return false; }
    return true;
  });
  if (!hits.length) {
    return emptyState({
      iconName: 'search',
      title: `没搜到「${ui.keyword}」`,
      desc: '换个关键词试试，比如只输入定理名的一两个字；也可以清空搜索框回到目录浏览。',
      action: `<div class="chips" style="justify-content:center;margin-top:12px"><button type="button" class="btn" data-action="tb-clear">${icon('x', { size: 15 })} 清空搜索</button></div>`,
    });
  }
  return `
  <div class="card">
    <div class="card-pad" style="border-bottom:1px solid var(--c-border)">
      <b>找到 ${hits.length} 条</b>
      <span style="color:var(--c-text-soft);font-size:13.5px">，点条目标题可以直接跳回目录里的位置</span>
      <button type="button" class="btn btn-sm btn-ghost" style="float:right" data-action="tb-clear">${icon('x', { size: 14 })} 清空</button>
    </div>
    ${hits.map((i) => itemRow(i, { keyword: ui.keyword })).join('')}
  </div>`;
}

/* ------------------------------------------------------------------ 事件 */

export function textbookActions(action, el) {
  switch (action) {
    case 'pick-book': {
      ui.bookId = el.value;
      ui.chapterId = null;
      ui.openChapters.clear();
      ui.openSections.clear();
      updateSettings({ bookId: ui.bookId });
      render();
      return true;
    }

    case 'toggle-chapter': {
      const id = el.dataset.chapter;
      if (ui.openChapters.has(id)) ui.openChapters.delete(id);
      else ui.openChapters.add(id);
      render();
      // 展开后滚到该章
      if (ui.openChapters.has(id)) setTimeout(() => scrollToEl(document.getElementById(`chapter-${id}`)), 40);
      return true;
    }

    case 'toggle-section': {
      const id = el.dataset.section;
      if (ui.openSections.has(id)) ui.openSections.delete(id);
      else ui.openSections.add(id);
      render();
      return true;
    }

    case 'goto-section': {
      const { chapter, section } = el.dataset;
      ui.openChapters.add(chapter);
      ui.openSections.add(section);
      ui.chapterId = chapter;
      ui.keyword = '';
      render();
      setTimeout(() => scrollToEl(document.getElementById(`section-${section}`)), 40);
      return true;
    }

    case 'tb-kind':
      ui.onlyKind = el.dataset.kind;
      render();
      return true;

    case 'tb-flag': {
      if (el.dataset.flag === 'star') ui.onlyStarred = !ui.onlyStarred;
      else ui.onlyNotebook = !ui.onlyNotebook;
      render();
      return true;
    }

    case 'tb-clear':
      ui.keyword = '';
      render();
      return true;

    case 'goto-item':
      jumpToItem(el.dataset.gotoItem);
      return true;

    case 'expand-all': {
      const book = getBook(ui.bookId);
      if (book) {
        book.chapters.forEach((c) => { ui.openChapters.add(c.id); (c.sections || []).forEach((s) => ui.openSections.add(s.id)); });
      }
      render();
      return true;
    }

    case 'collapse-all':
      ui.openChapters.clear();
      ui.openSections.clear();
      render();
      return true;

    case 'open-curve':
      openModal({
        title: '为什么按这个时间提醒你复习？',
        wide: true,
        body: `
          <p>德国心理学家艾宾浩斯在 1885 年做过一个实验：让人记一堆没有意义的音节，然后隔不同时间测还能记住多少。
          结果发现——<b>忘得最快的是刚学完那几小时</b>，之后越来越慢。这条曲线就叫<b>遗忘曲线</b>。</p>
          <p>把这条规律用在复习上就是：<b>在你快要忘的时候复习一次</b>，记忆会被重新拉回来，而且下一次掉得比上次慢。
          所以复习间隔应该一次比一次长，而不是每天都从头背。</p>
          <div style="margin:8px 0 14px">${forgettingCurveSVG()}</div>
          <p style="color:var(--c-text-soft);font-size:13.5px">
            本站采用的间隔是 <code>5 分钟 → 30 分钟 → 12 小时 → 1 天 → 2 天 → 4 天 → 7 天 → 15 天 → 30 天 → 60 天</code>。
            这是"遗忘曲线思路 + 常见实践"的组合，<b>不是</b>艾宾浩斯论文里的原始数值。
            代码在 <code>js/srs.js</code>，你想改成自己的节奏，直接改那个数组就行。
          </p>`,
      });
      return true;

    default:
      return false;
  }
}

export function textbookInput(action, el) {
  if (action === 'tb-search') {
    ui.keyword = el.value;
    // 输入时只更新结果区，避免整个页面重绘导致输入框失焦
    clearTimeout(textbookInput._t);
    textbookInput._t = setTimeout(() => {
      const book = getBook(ui.bookId);
      const host = el.closest('.page');
      if (!book || !host) return;
      const layout = host.querySelector('.book-layout');
      const searchHost = host.querySelector('[data-search-host]');
      void layout; void searchHost;
      render();
      // 重绘后把焦点还给搜索框并恢复到末尾
      const again = document.querySelector('[data-action="tb-search"]');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    }, 260);
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ 教材元信息卡（复习计划说明） */

export function renderStudyTips() {
  return `
  <div class="card card-pad">
    <h3>${icon('clock', { size: 14 })} 怎么用这个版块</h3>
    <ol style="font-size:13.6px;color:var(--c-text-soft);padding-left:1.2em">
      <li>先读「说人话」，把概念和常识挂上钩；再看「严谨说法」，把表达练准。</li>
      <li>定理一定看「为什么要这样想」，比背证明有用得多。</li>
      <li>看完一条，点右上角<b>本子图标</b>加进错题本，之后会按记忆曲线提醒你回看。</li>
      <li>不确定掌握没有？点本子旁边的星形收藏，考前集中刷收藏夹。</li>
    </ol>
    <button type="button" class="btn btn-sm" data-action="open-curve">${icon('info', { size: 14 })} 看看复习时间是怎么定的</button>
  </div>`;
}

void kindLabel;
void kindTag;
void toolButtons;
void qCount;
void richInline;
