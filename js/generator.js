/**
 * generator.js —— 组题组算法：同一知识点，难度层层递进
 *
 * 设计目标：不做"随机抽 10 题"，而是做一条**学习路径**：
 *
 *   入门（难度 1）→ 基础（2）→ 提高（3）→ 挑战（4）
 *
 * 具体规则：
 *   1. 先按用户选择的知识点（concepts）或章节聚合候选题目；
 *   2. 每一档难度内部，按"概念覆盖"排布：尽量让同一题组里覆盖不同侧面；
 *   3. 生成 `stages`：每个 stage 是一个难度档，答题时逐档推进，
 *      上一档没做完不做下一档（前端控制），从而形成"层层递进"。
 *   4. 支持 seed，同一个 seed 生成同一套题，方便分享 / 复现。
 */

import { getQuestions, getQuestion, questionsOfConcept, questionsOfChapter } from './bank.js';
import { getItem } from './library.js';

/** 确定性伪随机（mulberry32），保证同 seed 同题组 */
function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hashSeed = (str) => {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i += 1) {
    h ^= String(str).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const DIFFICULTY = {
  1: { name: '入门', desc: '直接套定义或公式，先热身', color: '#22c55e' },
  2: { name: '基础', desc: '需要一两步变形，常规题', color: '#3b82f6' },
  3: { name: '提高', desc: '要选对方法，多步推理', color: '#f59e0b' },
  4: { name: '挑战', desc: '综合多个知识点或带陷阱', color: '#ef4444' },
};

/** 每档默认题量（可按题组规模缩放） */
const TIER_PLAN = {
  small: { 1: 2, 2: 2, 3: 1, 4: 1 },
  medium: { 1: 2, 2: 3, 3: 2, 4: 1 },
  large: { 1: 3, 2: 4, 3: 3, 4: 2 },
};

export const SET_SIZES = [
  { id: 'small', name: '小份（6 题）', desc: '碎片时间，一个知识点走一遍' },
  { id: 'medium', name: '中份（8 题）', desc: '推荐，四档难度完整走一遍' },
  { id: 'large', name: '大份（12 题）', desc: '一次练透，适合考前' },
];

/**
 * 收集候选题目
 * @param {{concepts?:string[], chapterIds?:string[], bookId?:string, includeImported?:boolean, types?:string[]}} filter
 */
export function collectCandidates(filter = {}) {
  let pool = getQuestions();
  if (filter.bookId) pool = pool.filter((q) => !q.bookId || q.bookId === filter.bookId);
  if (filter.chapterIds && filter.chapterIds.length) {
    pool = pool.filter((q) => filter.chapterIds.includes(q.chapterId));
  }
  if (filter.concepts && filter.concepts.length) {
    const set = new Set(filter.concepts);
    const matched = pool.filter((q) => q.concepts.some((c) => set.has(c)));
    // 该概念太新没配套题时，回退到同章节题目，避免空题组
    if (matched.length) pool = matched;
  }
  if (filter.types && filter.types.length) {
    const set = new Set(filter.types);
    pool = pool.filter((q) => set.has(q.type));
  }
  return pool;
}

/**
 * 生成一个题组
 * @param {{
 *   concepts?:string[], chapterIds?:string[], bookId?:string, size?:'small'|'medium'|'large',
 *   maxDifficulty?:number, minDifficulty?:number, types?:string[], seed?:number|string,
 *   title?:string
 * }} opt
 */
export function buildQuiz(opt = {}) {
  const size = opt.size || 'medium';
  const plan = TIER_PLAN[size] || TIER_PLAN.medium;
  const seed = typeof opt.seed === 'string' ? hashSeed(opt.seed) : (opt.seed || Math.floor(Math.random() * 1e9));
  const rand = rng(seed);
  const minD = opt.minDifficulty || 1;
  const maxD = opt.maxDifficulty || 4;

  const pool = collectCandidates(opt);
  const byDiff = { 1: [], 2: [], 3: [], 4: [] };
  for (const q of pool) {
    const d = Math.min(4, Math.max(1, q.difficulty || 2));
    if (d < minD || d > maxD) continue;
    byDiff[d].push(q);
  }

  const used = new Set();
  const stages = [];

  for (let d = 1; d <= 4; d += 1) {
    if (d < minD || d > maxD) continue;
    const want = plan[d] || 0;
    // 优先覆盖更多概念：按"当前题组已用概念数最少"排序后取
    const conceptCount = new Map();
    for (const q of used) {
      for (const c of (q.concepts || [])) conceptCount.set(c, (conceptCount.get(c) || 0) + 1);
    }
    const shuffled = shuffle(byDiff[d], rand);
    shuffled.sort((a, b) => {
      const score = (q) => (q.concepts || []).reduce((s, c) => s + (conceptCount.get(c) || 0), 0);
      return score(a) - score(b);
    });

    const picked = [];
    for (const q of shuffled) {
      if (picked.length >= want) break;
      if (used.has(q.id)) continue;
      // 同档位尽量不重复同一个概念（题量够的时候）
      const dupConcept = picked.some((p) => (p.concepts || []).some((c) => (q.concepts || []).includes(c)));
      if (dupConcept && picked.length + 1 < Math.min(want, shuffled.length) && byDiff[d].length > want * 2) continue;
      picked.push(q);
      used.add(q.id);
    }
    if (!picked.length) continue;
    stages.push({
      difficulty: d,
      ...DIFFICULTY[d],
      questions: picked.map((q) => q.id),
    });
  }

  const totalQuestions = stages.reduce((n, s) => n + s.questions.length, 0);

  return {
    id: `quiz-${Date.now().toString(36)}-${seed.toString(36).slice(0, 4)}`,
    createdAt: Date.now(),
    seed,
    size,
    title: opt.title || autoTitle(opt, stages),
    filter: {
      concepts: opt.concepts || [],
      chapterIds: opt.chapterIds || [],
      bookId: opt.bookId || '',
      types: opt.types || [],
      minDifficulty: minD,
      maxDifficulty: maxD,
    },
    stages,
    total: totalQuestions,
    poolSize: pool.length,
  };
}

function autoTitle(opt, stages) {
  if (opt.concepts && opt.concepts.length) {
    const names = opt.concepts.map((c) => (getItem(c) || {}).name).filter(Boolean);
    if (names.length) return names.slice(0, 2).join(' / ') + (names.length > 2 ? ' 等' : '');
  }
  if (opt.chapterIds && opt.chapterIds.length) return `${opt.chapterIds.length} 个章节的综合题组`;
  if (stages.length) return '综合递进题组';
  return '题组';
}

/** 把题组展开成有序的 {question, stage} 数组（保留档位信息） */
export function quizQuestions(quiz) {
  const out = [];
  for (const stage of quiz.stages || []) {
    for (const id of stage.questions) {
      const q = getQuestion(id);
      if (q) out.push({ q, stage });
    }
  }
  return out;
}

/** 题组的难度分布（用于侧栏展示） */
export function quizDistribution(quiz) {
  return (quiz.stages || []).map((s) => ({
    difficulty: s.difficulty,
    name: s.name,
    count: s.questions.length,
    desc: s.desc,
  }));
}

/**
 * 从错题本"靶向出题"：把某条错题所属概念拿出来，重新组一个小题组。
 * 这是错题本闭环的关键：做错 → 记录 → 同类再练。
 */
export function buildQuizFromRecord(rec, opt = {}) {
  const concepts = (rec && rec.extra && rec.extra.concepts) || [];
  const chapterId = rec && rec.chapterId;
  return buildQuiz({
    concepts,
    chapterIds: concepts.length ? [] : (chapterId ? [chapterId] : []),
    size: opt.size || 'small',
    seed: opt.seed,
    title: rec ? `错题回练 · ${rec.title || ''}`.trim() : '错题回练',
  });
}
