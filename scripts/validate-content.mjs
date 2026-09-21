#!/usr/bin/env node
/**
 * validate-content.mjs —— 内容校验器
 *
 * 校验对象：data/books/*.js 章节模块、data/books/registry.js、data/questions/*.js 题库
 * 校验项：
 *   1. ES 模块能正常 import
 *   2. id 全局唯一、格式合法
 *   3. 必填字段齐全（定义/定理/公式/题目）
 *   4. theorem 必须有 proof
 *   5. related / concepts 引用必须存在
 *   6. 选择题必须有 options，difficulty 在 1~4
 *   7. 行内标记是否闭合、是否混入 LaTeX / Markdown
 *   8. 教材每个知识点的配套题量（低于阈值给出提示，不判错）
 *
 * 用法：node scripts/validate-content.mjs [--strict]
 *   默认：错误（error）导致退出码 1；提示（warn）只打印。
 *   --strict：把 warn 也当失败。
 */

import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

const errors = [];
const warns = [];
const notes = [];

const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);
const note = (m) => notes.push(m);

const KINDS = ['definition', 'theorem', 'formula', 'note'];
const TYPES = ['choice', 'fill', 'judge', 'compute', 'proof'];
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

async function importModule(rel) {
  const abs = path.join(ROOT, rel);
  const url = pathToFileURL(abs).href;
  const mod = await import(url);
  return mod.default ?? mod;
}

/** 检查富文本标记 */
function checkMarkup(text, where, { requireTags = true } = {}) {
  if (text == null || text === '') return;
  const s = String(text);
  if (/\$\$|\\frac|\\int|\\sum|\\lim|\\left|\\begin\{/.test(s)) {
    err(`${where}: 混入了 LaTeX（不会渲染），请改用 <code> + Unicode 符号`);
  }
  if (/\*\*[^*]+\*\*/.test(s)) warn(`${where}: 出现了 Markdown 粗体 **…**，不会被渲染`);
  if (/^#{1,6}\s/m.test(s)) warn(`${where}: 出现了 Markdown 标题 #，不会被渲染`);
  if (requireTags) {
    for (const tag of ['code', 'b', 'i', 'sup', 'sub', 'em', 'strong', 'br']) {
      const open = (s.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) || []).length;
      const close = (s.match(new RegExp(`</${tag}>`, 'g')) || []).length;
      if (tag === 'br') continue;
      if (open !== close) err(`${where}: <${tag}> 标签不配对（${open} 开 / ${close} 闭）`);
    }
  }
  const openBlocks = (s.match(/\[\[(?:tip|warn):/g) || []).length;
  const closeBlocks = (s.match(/\]\]/g) || []).length;
  if (openBlocks !== closeBlocks) err(`${where}: [[tip:]] / [[warn:]] 块不配对（${openBlocks} / ${closeBlocks}）`);
}

/* ------------------------------------------------------------------ 教材 */

const registry = await importModule('data/books/registry.js');
const bookEntries = registry.BOOK_FILES || [];

const aliasMod = await importModule('data/concept-aliases.js').catch(() => ({ CONCEPT_ALIASES: {} }));
const CONCEPT_ALIASES = aliasMod.CONCEPT_ALIASES || {};
const canon = (id) => CONCEPT_ALIASES[id] || id;

const allItemIds = new Set();
const allItems = [];
const bookReports = [];

for (const entry of bookEntries) {
  const bookLabel = entry.id;
  for (const rel of entry.chapters || []) {
    let ch;
    try {
      ch = await importModule(rel);
    } catch (e) {
      const msg = String(e.message || e);
      if (/Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND/i.test(msg)) {
        err(`章节文件缺失或路径不对：${rel}`);
      } else {
        err(`章节文件无法解析（多半是语法错误或文件写到一半）：${rel} —— ${msg.split('\n')[0]}`);
      }
      continue;
    }
    if (!ch || !ch.id) { err(`${rel}: 没有导出有效的章节对象`); continue; }
    // 与 js/library.js 保持一致的兼容：允许文件导出整本书对象
    if (!ch.sections && Array.isArray(ch.chapters)) {
      if (ch.chapters.length !== 1) {
        warn(`${rel}: 文件里装了 ${ch.chapters.length} 个章节（规范要求一个文件一个章节），已按第一个校验`);
      }
      ch = ch.chapters[0];
    }
    if (!Array.isArray(ch.sections)) { err(`${rel}: 缺少 sections 数组（既不是章节对象，也不是整本书对象）`); continue; }

    let count = 0;
    for (const sec of ch.sections) {
      if (!sec.id) err(`${rel}: 有 section 缺 id`);
      if (!sec.title) err(`${rel}: section ${sec.id} 缺 title`);
      if (!Array.isArray(sec.items)) { err(`${rel}: section ${sec.id} 缺 items 数组`); continue; }
      for (const it of sec.items) {
        const where = `${rel} / ${ch.id} / ${sec.id} / ${it.id || it.name || '?'}`;
        count += 1;
        if (!it.id) { err(`${where}: 缺 id`); continue; }
        if (!ID_RE.test(it.id)) warn(`${where}: id 建议只用小写字母数字和连字符`);
        if (allItemIds.has(it.id)) err(`${where}: id 重复`);
        allItemIds.add(it.id);
        if (!KINDS.includes(it.kind)) err(`${where}: kind 不合法（${it.kind}）`);
        if (!it.name) err(`${where}: 缺 name`);
        if (!it.statement) err(`${where}: 缺 statement`);
        if (!it.plain) err(`${where}: 缺 plain（通俗解释是本站的核心，必填）`);
        if (it.kind === 'theorem' && !it.proof) err(`${where}: 定理缺 proof`);
        if (it.kind === 'theorem' && !it.why) warn(`${where}: 定理建议补 why（证明思路）`);
        for (const f of ['statement', 'plain', 'why', 'proof', 'example']) checkMarkup(it[f], `${where}.${f}`);
        (it.pitfalls || []).forEach((p, i) => checkMarkup(p, `${where}.pitfalls[${i}]`));
        allItems.push({ ...it, __chapter: ch.id, __section: sec.id, __file: rel, __book: bookLabel });
      }
    }
    if (count === 0) err(`${rel}: 一个条目都没有（文件可能只写了一半）`);
    bookReports.push({ file: rel, chapter: ch.id, no: ch.no, title: ch.title, sections: ch.sections.length, items: count });
  }
}

// related 引用检查（放在所有条目收集完之后）
for (const it of allItems) {
  for (const r of it.related || []) {
    if (!allItemIds.has(r)) warn(`${it.__file} / ${it.id}: related 指向不存在的条目 ${r}`);
  }
}

// 同名条目检查：跨章节出现同名定理往往是重复撰写（id 不同所以不会被 id 查重抓到）
{
  const byName = new Map();
  for (const it of allItems) {
    const key = `${it.kind}::${String(it.name || '').trim()}`;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(`${it.__chapter}/${it.id}`);
  }
  for (const [key, where] of byName) {
    if (where.length > 1) {
      const [kind, name] = key.split('::');
      warn(`同名${kind === 'theorem' ? '定理' : kind === 'definition' ? '定义' : '条目'}「${name}」出现在多处：${where.join('、')}（若内容重复，建议合并或改 id）`);
    }
  }
}

// 别名表检查
const aliasTargets = new Set();
for (const [alias, target] of Object.entries(CONCEPT_ALIASES)) {
  if (alias === target) continue;
  aliasTargets.add(alias);
  if (!allItemIds.has(target)) err(`data/concept-aliases.js: 别名 ${alias} 指向的 ${target} 在教材里不存在`);
}
const unusedAliases = Object.keys(CONCEPT_ALIASES).filter((a) => a !== CONCEPT_ALIASES[a] && !aliasTargets.has(a));
if (unusedAliases.length) note(`别名表里有 ${unusedAliases.length} 条暂时没被任何题目用到（不影响运行）`);

/* ------------------------------------------------------------------ 题库 */

const questionFiles = registry.QUESTION_FILES || [];
const allQuestionIds = new Set();
const allQuestions = [];

for (const rel of questionFiles) {
  let mod;
  try {
    mod = await importModule(rel);
  } catch (e) {
    const msg = String(e.message || e);
    if (/Cannot find module|ERR_MODULE_NOT_FOUND|Failed to fetch/i.test(msg)) err(`题库文件缺失：${rel}`);
    else err(`题库文件无法解析：${rel} —— ${msg.split('\n')[0]}`);
    continue;
  }
  const list = (mod && mod.questions) || (Array.isArray(mod) ? mod : null);
  if (!Array.isArray(list)) { err(`${rel}: 没有 questions 数组`); continue; }

  for (const q of list) {
    const where = `${rel} / ${q && q.id}`;
    if (!q || !q.id) { err(`${where}: 缺 id`); continue; }
    if (allQuestionIds.has(q.id)) err(`${where}: id 重复`);
    allQuestionIds.add(q.id);
    if (!q.chapterId) warn(`${where}: 缺 chapterId`);
    if (!q.stem) err(`${where}: 缺 stem`);
    if (q.answer == null || q.answer === '') err(`${where}: 缺 answer`);
    if (!q.solution) warn(`${where}: 缺 solution（解析）`);
    if (q.type && !TYPES.includes(q.type)) err(`${where}: type 不合法（${q.type}）`);
    if (q.type === 'choice' && (!Array.isArray(q.options) || q.options.length < 2)) err(`${where}: 选择题缺 options`);
    const d = Number(q.difficulty);
    if (!Number.isFinite(d) || d < 1 || d > 4) err(`${where}: difficulty 应为 1~4（实际 ${q.difficulty}）`);
    if (!Array.isArray(q.concepts) || !q.concepts.length) warn(`${where}: 建议补 concepts，组题组需要它来聚类`);
    for (const c of q.concepts || []) {
      const target = canon(c);
      if (!allItemIds.has(target)) {
        warn(`${where}: concepts 指向不存在的知识点 ${c}${target !== c ? `（别名 → ${target}）` : ''}；可在 data/concept-aliases.js 里补别名`);
      }
    }
    for (const f of ['stem', 'answer', 'solution']) checkMarkup(q[f], `${where}.${f}`);
    (q.options || []).forEach((o, i) => checkMarkup(o, `${where}.options[${i}]`));
    allQuestions.push(q);
  }
}

/* ------------------------------------------------------------------ 报告 */

const byChapter = new Map();
for (const q of allQuestions) {
  const k = q.chapterId || 'unknown';
  if (!byChapter.has(k)) byChapter.set(k, { total: 0, d: [0, 0, 0, 0, 0] });
  const rec = byChapter.get(k);
  rec.total += 1;
  rec.d[Math.min(4, Math.max(1, Number(q.difficulty) || 1))] += 1;
}

const conceptCount = new Map();
for (const q of allQuestions) for (const c of q.concepts || []) conceptCount.set(c, (conceptCount.get(c) || 0) + 1);

const THIN = 3;
const thinConcepts = allItems
  .filter((i) => (i.kind === 'definition' || i.kind === 'theorem')
    && (i.__book === 'tongji-gaoshu-1')
    && (conceptCount.get(i.id) || 0) < THIN)
  .map((i) => `${i.id}（${conceptCount.get(i.id) || 0} 题）`);

const kindTally = allItems.reduce((acc, i) => { acc[i.kind] = (acc[i.kind] || 0) + 1; return acc; }, {});

console.log('══════════ 内容校验报告 ══════════\n');

console.log('【教材章节】');
for (const r of bookReports.sort((a, b) => (a.no || 0) - (b.no || 0))) {
  console.log(`  ch${String(r.no).padStart(2)} ${String(r.title).padEnd(22, '　')} ${String(r.sections).padStart(2)} 节 / ${String(r.items).padStart(3)} 条    ${r.file}`);
}
console.log(`\n  条目合计 ${allItems.length}（定义 ${kindTally.definition || 0} / 定理 ${kindTally.theorem || 0} / 公式 ${kindTally.formula || 0} / 补充 ${kindTally.note || 0}）`);

console.log('\n【题库分布】');
for (const [cid, rec] of Array.from(byChapter.entries()).sort()) {
  console.log(`  ${cid.padEnd(8)} 共 ${String(rec.total).padStart(3)} 题   难度 1~4: ${rec.d.slice(1).join(' / ')}`);
}
console.log(`\n  题目合计 ${allQuestions.length}`);

if (thinConcepts.length) {
  note(`以下知识点配套题少于 ${THIN} 道（不影响运行，但组题组时可能凑不齐阶梯）：共 ${thinConcepts.length} 个`);
}

console.log('');
if (warns.length) {
  console.log(`【提示 ${warns.length} 条】`);
  for (const w of warns.slice(0, 40)) console.log('  · ' + w);
  if (warns.length > 40) console.log(`  …… 还有 ${warns.length - 40} 条`);
  console.log('');
}
if (notes.length) {
  console.log('【备注】');
  for (const n of notes) console.log('  · ' + n);
  for (const t of thinConcepts.slice(0, 25)) console.log('    - ' + t);
  if (thinConcepts.length > 25) console.log(`    …… 还有 ${thinConcepts.length - 25} 个`);
  console.log('');
}
if (errors.length) {
  console.log(`【❌ 错误 ${errors.length} 条】`);
  for (const e of errors) console.log('  · ' + e);
  console.log('');
  process.exit(1);
}
console.log(warns.length && STRICT ? '【❌ 严格模式：存在提示，视为失败】' : '【✅ 内容校验通过】');
process.exit(warns.length && STRICT ? 1 : 0);
