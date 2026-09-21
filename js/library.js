/**
 * library.js —— 教材库：加载、索引、查询
 *
 * 加载策略：
 *   - 按 registry 顺序动态 import()，**允许缺文件**（写书过程中仓库始终可用，
 *     某个章节还没写完不会让整站报错，只会在控制台留一条提示）。
 *   - 加载完成后建立多种索引，方便出题组、错题本、搜索复用。
 */

import { BOOK_FILES, QUESTION_FILES } from '../data/books/registry.js';
import { CONCEPT_ALIASES } from '../data/concept-aliases.js';

/** @type {{books:Array, index:Map<string, object>, byChapter:Map<string, object>, errors:Array}} */
const lib = {
  books: [],
  /** id -> item（定义/定理/公式），同时带上 bookId / chapterId / sectionId */
  index: new Map(),
  /** 别名 id -> item（见 data/concept-aliases.js） */
  aliasIndex: new Map(),
  /** chapterId -> { book, chapter } */
  byChapter: new Map(),
  /** chapterId -> sectionId[] */
  errors: [],
  loaded: false,
};

let loadPromise = null;

const KIND_LABEL = {
  definition: '定义',
  theorem: '定理',
  formula: '公式',
  note: '补充',
};

export const kindLabel = (k) => KIND_LABEL[k] || '内容';

async function loadChapterModule(path) {
  try {
    const mod = await import(`../${path}`);
    let ch = mod.default || mod.chapter || null;
    if (!ch) {
      lib.errors.push(`章节模块没有导出内容：${path}`);
      return null;
    }
    // 兼容两种导出形态：
    //   A. 章节对象   { id:'ch1', no:1, title, sections }
    //   B. 整本书对象 { id:'tongji-gaoshu-1', title, chapters:[章节…] }
    // 贡献者（尤其是 AI 贡献者）很容易写成 B，这里自动展开，避免整章丢失。
    if (!ch.sections && Array.isArray(ch.chapters)) {
      const inner = ch.chapters;
      if (inner.length === 1) {
        ch = inner[0];
      } else if (inner.length > 1) {
        lib.errors.push(`章节文件 ${path} 里装了 ${inner.length} 个章节，已只取第一个；建议按规范一个文件一个章节`);
        ch = inner[0];
      }
      ch.__wrappedBook = true;
    }
    if (!ch || !ch.id || !Array.isArray(ch.sections)) {
      lib.errors.push(`章节模块结构不对（缺少 id / sections）：${path}`);
      return null;
    }
    return ch;
  } catch (err) {
    // 允许章节文件尚未创建
    const msg = String(err && err.message ? err.message : err);
    if (/Failed to fetch|Cannot find module|404|dynamically imported module/i.test(msg)) {
      lib.errors.push(`章节文件还没写或路径不对，已跳过：${path}`);
    } else {
      lib.errors.push(`章节文件加载出错：${path} —— ${msg}`);
      console.warn('[library] 章节加载出错', path, err);
    }
    return null;
  }
}

export function loadLibrary() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    for (const entry of BOOK_FILES) {
      const chapters = [];
      for (const path of entry.chapters) {
        // eslint-disable-next-line no-await-in-loop
        const ch = await loadChapterModule(path);
        if (ch) {
          ch.__path = path;
          chapters.push(ch);
        }
      }
      chapters.sort((a, b) => (a.no || 0) - (b.no || 0));

      const book = {
        id: entry.id,
        ...entry.meta,
        chapters,
        itemCount: 0,
        defCount: 0,
        thmCount: 0,
        sectionCount: 0,
      };

      for (const chapter of chapters) {
        chapter.bookId = book.id;
        lib.byChapter.set(chapter.id, { book, chapter });
        chapter.sections = chapter.sections || [];
        for (const section of chapter.sections) {
          section.chapterId = chapter.id;
          section.bookId = book.id;
          book.sectionCount += 1;
          section.items = section.items || [];
          for (const item of section.items) {
            item.chapterId = chapter.id;
            item.sectionId = section.id;
            item.chapterTitle = chapter.title;
            item.sectionTitle = section.title;
            item.bookId = book.id;
            item.bookTitle = book.title;
            item.kind = item.kind || 'note';
            if (!item.id) {
              lib.errors.push(`有条目缺少 id：${book.title} / ${chapter.title} / ${section.title} / ${item.name || '未命名'}`);
              item.id = `auto-${lib.index.size}`;
            }
            if (lib.index.has(item.id)) {
              lib.errors.push(`条目 id 重复：${item.id}（后一个来自 ${path0(item)}）`);
            }
            lib.index.set(item.id, item);
            book.itemCount += 1;
            if (item.kind === 'definition') book.defCount += 1;
            if (item.kind === 'theorem') book.thmCount += 1;
          }
        }
      }
      lib.books.push(book);
    }
    lib.loaded = true;
    buildAliasIndex();
    if (lib.errors.length) {
      console.info('[library] 加载提示：\n - ' + lib.errors.join('\n - '));
    }
    return lib;
  })();
  return loadPromise;
}

/**
 * 把别名表并进索引。
 * 效果：题库里写 `concepts: ['thm-rolle']`，即使教材里真实 id 是别的写法，
 * getItem('thm-rolle') 也能拿到那一条定义/定理。
 * 同时给条目记上 aliasIds，方便界面显示"也叫 xxx"。
 */
function buildAliasIndex() {
  for (const [alias, target] of Object.entries(CONCEPT_ALIASES || {})) {
    if (alias === target) continue;
    const real = lib.index.get(target);
    if (!real) {
      lib.errors.push(`别名表里的目标不存在：${alias} → ${target}`);
      continue;
    }
    lib.aliasIndex.set(alias, real);
    if (!lib.index.has(alias)) lib.index.set(alias, real);
    real.aliasIds = [...(real.aliasIds || []), alias];
  }
}

/** 某个 item id 是否是别名 */
export const isAlias = (id) => lib.aliasIndex.has(id);

/** 别名 -> 真实条目 */
export const resolveAlias = (id) => lib.aliasIndex.get(id) || lib.index.get(id) || null;

const path0 = (item) => `${item.bookId}/${item.chapterId}/${item.sectionId}`;

export const getLibrary = () => lib;
export const getBooks = () => lib.books;
export const getBook = (id) => lib.books.find((b) => b.id === id) || lib.books[0] || null;
export const getItem = (id) => lib.index.get(id) || null;
export const getChapter = (chapterId) => lib.byChapter.get(chapterId) || null;

/** 所有条目展平 */
export function allItems() {
  return Array.from(lib.index.values());
}

/** 按 kind 过滤 */
export const itemsOfKind = (kind) => allItems().filter((i) => i.kind === kind);

/**
 * 全文搜索（名称、别名、陈述、通俗解释、证明、标签）
 * @param {string} kw
 * @param {{bookId?:string, kind?:string, limit?:number}} [opt]
 */
export function searchItems(kw, opt = {}) {
  const q = String(kw || '').trim().toLowerCase();
  if (!q) return [];
  const limit = opt.limit || 60;
  const hits = [];
  for (const item of allItems()) {
    if (opt.bookId && item.bookId !== opt.bookId) continue;
    if (opt.kind && item.kind !== opt.kind) continue;
    let score = 0;
    const name = (item.name || '').toLowerCase();
    if (name === q) score += 100;
    else if (name.includes(q)) score += 50;
    if ((item.aka || []).some((a) => String(a).toLowerCase().includes(q))) score += 25;
    if ((item.tags || []).some((t) => String(t).toLowerCase().includes(q))) score += 12;
    if (String(item.statement || '').toLowerCase().includes(q)) score += 8;
    if (String(item.plain || '').toLowerCase().includes(q)) score += 6;
    if (String(item.proof || '').toLowerCase().includes(q)) score += 3;
    if (String(item.why || '').toLowerCase().includes(q)) score += 3;
    if (score > 0) hits.push({ item, score });
    if (hits.length > 400) break;
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit).map((h) => h.item);
}

/** 某章节的条目数统计（用于目录角标） */
export function chapterStats(chapterId) {
  const found = lib.byChapter.get(chapterId);
  if (!found) return { def: 0, thm: 0, total: 0 };
  let def = 0, thm = 0, total = 0;
  for (const s of found.chapter.sections || []) {
    for (const i of s.items || []) {
      total += 1;
      if (i.kind === 'definition') def += 1;
      if (i.kind === 'theorem') thm += 1;
    }
  }
  return { def, thm, total };
}

export { QUESTION_FILES };
