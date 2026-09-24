/**
 * bank.js —— 题库：加载内置题库 + 可选接入外部开放题库（实时拉取）
 *
 * 「实时题库」的两种含义，本文件都支持：
 *   1. 内置题库：随仓库分发的原创题目，离线可用，打开即用。
 *   2. 外部题库：在「数据与设置」里填一个 **同源或允许 CORS 的 JSON 地址**，
 *      页面会实时 fetch 回来合并。适合自建题库服务、班级共享题库、
 *      或者把 OpenStax / OER 等**开放许可**题库存成 JSON 挂在自己的静态托管上。
 *
 * ⚖️ 合规说明（重要）
 *   本项目**不抓取、不内置**任何需要付费或未授权转载的题库。
 *   我们只建议接入以下来源，并请保留其署名：
 *     - OpenStax（CC BY 4.0） https://openstax.org
 *     - MIT OpenCourseWare（CC BY-NC-SA）
 *     - Wikibooks / Wikiversity（CC BY-SA）
 *     - 你自己编写的题库
 *   scripts/fetch-open-bank.mjs 提供了把开放许可题库转成本项目 JSON 的示例管道。
 */

import { QUESTION_FILES } from '../data/books/registry.js';
import { CONCEPT_ALIASES } from '../data/concept-aliases.js';
import { getState, updateSettings, setImportedBanks } from './storage.js';

/** 把题库里的知识点写法统一到教材真实 id（见 data/concept-aliases.js） */
const canon = (id) => CONCEPT_ALIASES[id] || id;

const QUESTIONS = [];
const dict = new Map();
let loadPromise = null;

export const REQUIRED_FIELDS = ['id', 'stem', 'answer'];
export const VALID_TYPES = ['choice', 'fill', 'judge', 'compute', 'proof'];

/** 校验一道外部题，返回错误数组 */
export function validateQuestion(q, index = 0) {
  const errs = [];
  if (!q || typeof q !== 'object') return [`第 ${index + 1} 条不是对象`];
  for (const f of REQUIRED_FIELDS) {
    if (q[f] == null || q[f] === '') errs.push(`第 ${index + 1} 条缺少 ${f}`);
  }
  if (q.type && !VALID_TYPES.includes(q.type)) errs.push(`第 ${index + 1} 条 type 不合法：${q.type}`);
  if (q.type === 'choice' && (!Array.isArray(q.options) || q.options.length < 2)) {
    errs.push(`第 ${index + 1} 条是选择题但没有 options`);
  }
  if (q.difficulty != null && (q.difficulty < 1 || q.difficulty > 4)) {
    errs.push(`第 ${index + 1} 条 difficulty 应在 1~4，实际 ${q.difficulty}`);
  }
  return errs;
}

/**
 * 把一批题目加进运行时题库（供「导入」功能调用）。
 * 已存在的 id 会被跳过（内置题库优先），返回真正新增的条数。
 * @param {object[]} list 已经过 validateQuestion 校验的题目
 * @param {'builtin'|'imported'} [origin]
 * @returns {number} 新增条数
 */
export function addQuestionsToBank(list, origin = 'imported') {
  return addQuestions(list, origin);
}

function addQuestions(list, origin) {
  let added = 0;
  for (const q of list) {
    if (!q || !q.id) continue;
    if (dict.has(q.id)) continue; // 同一 id 只留一份（内置优先）
    const item = {
      ...q,
      difficulty: Number(q.difficulty) || 2,
      type: q.type || 'fill',
      concepts: Array.isArray(q.concepts) ? q.concepts : [],
      tags: Array.isArray(q.tags) ? q.tags : [],
      origin: origin || (q.source === 'imported' ? 'imported' : 'builtin'),
    };
    dict.set(item.id, item);
    QUESTIONS.push(item);
    added += 1;
  }
  return added;
}

export function loadBank() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    for (const path of QUESTION_FILES) {
      try {
        const mod = await import(`../${path}`);
        const data = mod.default || mod;
        if (data && Array.isArray(data.questions)) addQuestions(data.questions, 'builtin');
      } catch (err) {
        const msg = String(err && err.message ? err.message : err);
        if (!/Failed to fetch|Cannot find module|404|dynamically imported module/i.test(msg)) {
          console.warn('[bank] 题库加载出错', path, err);
        }
      }
    }
    // 自动尝试已配置的外部题库
    const url = getState().settings.libraryUrl;
    if (url) {
      await fetchExternalBank(url).catch((err) => {
        console.warn('[bank] 外部题库自动加载失败：', err.message);
      });
    }
    return QUESTIONS;
  })();
  return loadPromise;
}

export const getQuestions = () => QUESTIONS;
export const getQuestion = (id) => dict.get(id) || null;
export const bankSize = () => QUESTIONS.length;

/** 按章节取题 */
export const questionsOfChapter = (chapterId) => QUESTIONS.filter((q) => q.chapterId === chapterId);

/** 按知识点取题 */
export const questionsOfConcept = (conceptId) => QUESTIONS.filter((q) => q.concepts.includes(conceptId));

/** 用到某个知识点的题量（用于侧栏提示"这个定义有多少配套题"） */
export const conceptQuestionCount = (conceptId) => questionsOfConcept(conceptId).length;

/**
 * 实时拉取外部题库
 * @param {string} url 同源或允许 CORS 的 JSON 地址
 * @param {{name?:string, attribution?:string, license?:string, silent?:boolean}} [meta]
 * @returns {Promise<{added:number, errors:string[]}>}
 */
export async function fetchExternalBank(url, meta = {}) {
  if (!url) throw new Error('题库地址为空');
  if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('./')) {
    throw new Error('题库地址必须以 http(s):// 或 / 开头');
  }
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`服务器返回 ${res.status} ${res.statusText}`);
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.questions;
  if (!Array.isArray(list)) throw new Error('JSON 里没有 questions 数组');

  const errors = [];
  const clean = [];
  list.forEach((q, i) => {
    const errs = validateQuestion(q, i);
    if (errs.length) errors.push(...errs.slice(0, 2));
    else clean.push({ ...q, source: 'imported' });
  });

  const added = addQuestions(clean, 'imported');
  const banks = getState().importedBanks.filter((b) => b.url !== url);
  banks.push({
    url,
    name: meta.name || data.name || url.split('/').pop() || '外部题库',
    bookId: data.bookId || meta.bookId || '',
    license: meta.license || data.license || '未标注（请确认来源许可）',
    attribution: meta.attribution || data.attribution || '',
    count: clean.length,
    added,
    fetchedAt: Date.now(),
  });
  setImportedBanks(banks);
  if (!meta.silent) updateSettings({ libraryUrl: url });
  return { added, errors };
}

/** 清空外部题库（内置题库不受影响） */
export function clearExternalBanks() {
  for (let i = QUESTIONS.length - 1; i >= 0; i -= 1) {
    if (QUESTIONS[i].origin === 'imported') {
      dict.delete(QUESTIONS[i].id);
      QUESTIONS.splice(i, 1);
    }
  }
  setImportedBanks([]);
  updateSettings({ libraryUrl: '' });
}

/** 宏观统计 */
export function bankStats() {
  const byChapter = new Map();
  const byDifficulty = [0, 0, 0, 0, 0];
  const byType = new Map();
  for (const q of QUESTIONS) {
    byChapter.set(q.chapterId || 'unknown', (byChapter.get(q.chapterId || 'unknown') || 0) + 1);
    const d = Math.min(4, Math.max(1, q.difficulty || 2));
    byDifficulty[d] += 1;
    byType.set(q.type, (byType.get(q.type) || 0) + 1);
  }
  return {
    total: QUESTIONS.length,
    builtin: QUESTIONS.filter((q) => q.origin !== 'imported').length,
    imported: QUESTIONS.filter((q) => q.origin === 'imported').length,
    byChapter: Array.from(byChapter.entries()).sort((a, b) => a[0].localeCompare(b[0], 'zh')),
    byDifficulty,
    byType: Array.from(byType.entries()),
  };
}
