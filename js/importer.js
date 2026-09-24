/**
 * importer.js —— 题库导入：格式自动识别 + 逐题校验 + 分类
 *
 * 目标（对应三条用户诉求）：
 *   1. 门槛低 —— 不要求用户改文件。常见的几种 JSON 形状都能自动认出来：
 *        · 本项目自带的题包 { name, questions: [...] }
 *        · 纯数组 [ {...}, {...} ]
 *        · 别家的字段名（question/choices/correct/explanation…）自动映射
 *        · 错题本导出 { records: { "q:xxx": {...} } }（只取题目部分）
 *   2. 有保障 —— 每道题都过一遍校验，分成三类返回，界面逐条展示：
 *        ok        字段齐全，可以导入
 *        problem   缺必填字段 / 类型不合法（会列出具体缺什么）
 *        duplicate 与现有题库 id 相同（默认不覆盖）
 *   3. 可自选 —— 返回的每条都带 _index 与摘要，界面据此做逐题勾选。
 *
 * ⚠️ 这个模块是**纯函数**（不读 localStorage、不发请求），
 *    便于在 Node 里直接跑测试。写盘由调用方（views/bank-import.js）负责。
 */

/** 必填字段 */
export const REQUIRED_FIELDS = ['id', 'stem', 'answer'];
/** 合法题型 */
export const VALID_TYPES = ['choice', 'fill', 'judge', 'compute', 'proof'];

/** 题型别名映射：别家写法 -> 本项目写法 */
const TYPE_ALIASES = {
  choice: 'choice', multiple_choice: 'choice', multiplechoice: 'choice', mcq: 'choice',
  single_choice: 'choice', select: 'choice', 选择题: 'choice',
  fill: 'fill', fillin: 'fill', 'fill-in': 'fill', 'fill_in': 'fill', blank: 'fill',
  fillblank: 'fill', fill_blank: 'fill', completion: 'fill', 填空: 'fill', 填空题: 'fill',
  judge: 'judge', truefalse: 'judge', 'true-false': 'judge', boolean: 'judge',
  tf: 'judge', 判断: 'judge', 判断题: 'judge',
  compute: 'compute', calculation: 'compute', calc: 'compute', solve: 'compute',
  numeric: 'compute', 计算: 'compute', 计算题: 'compute',
  proof: 'proof', prove: 'proof', proofquestion: 'proof', 证明: 'proof', 证明题: 'proof',
};

/** 取对象里第一个存在的字段名（兼容别家命名） */
function pick(obj, names) {
  for (const n of names) {
    const v = obj[n];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

/** 把任意题型写法归一到本项目枚举 */
function normalizeType(raw, hasOptions) {
  if (!raw) return hasOptions ? 'choice' : 'fill';
  const key = String(raw).toLowerCase().replace(/[\s_]+/g, '');
  if (TYPE_ALIASES[key]) return TYPE_ALIASES[key];
  const direct = String(raw).toLowerCase();
  if (TYPE_ALIASES[direct]) return TYPE_ALIASES[direct];
  return hasOptions ? 'choice' : 'fill';
}

/**
 * 把不同形状的 options 归一成字符串数组。
 * 支持：
 *   ['A 选项', 'B 选项']
 *   [{ text: '…', isCorrect: true }, ...]
 *   { A: '…', B: '…' }
 *   且能顺带把"标了正确项"的题目答案补出来
 */
function normalizeOptions(rawOptions) {
  let options = null;
  let answerFromOptions = null;

  if (Array.isArray(rawOptions)) {
    options = rawOptions.map((o) => {
      if (o === null || o === undefined) return '';
      if (typeof o === 'string') return o;
      const t = pick(o, ['text', 'content', 'label', 'body', 'value', 'option']);
      return t === undefined ? String(o) : String(t);
    });
    // 标了正确项的情况：选项对象里的 isCorrect / correct / answer 标记。
    // 只认严格等于 true，避免把 correct: '答案文本' 这种标量误判成标记。
    const hit = rawOptions.findIndex((o) => o && typeof o === 'object'
      && (o.isCorrect === true || o.correct === true || o.answer === true));
    if (hit >= 0) answerFromOptions = String.fromCharCode(65 + hit);
  } else if (rawOptions && typeof rawOptions === 'object') {
    const keys = Object.keys(rawOptions);
    options = keys.map((k) => String(rawOptions[k]));
  }

  if (options) options = options.map((o) => o.trim()).filter((o) => o !== '');
  return { options: options && options.length ? options : null, answerFromOptions };
}

/**
 * 把一条外部题目归一成项目内部格式。
 * 不会抛异常 —— 缺什么就留空，交给 validate 分类。
 * @param {object} raw
 * @param {number} index
 * @returns {object} 归一后的题目（含 __issues 数组）
 */
export function normalizeQuestion(raw, index = 0) {
  const issues = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      id: '', stem: '', answer: '', type: 'fill', difficulty: 2,
      concepts: [], tags: [], solution: '', options: null, __issues: ['这一条不是对象'],
    };
  }

  const stem = pick(raw, ['stem', 'question', 'prompt', 'text', 'title', 'content', 'body', '题干']);
  const { options, answerFromOptions } = normalizeOptions(
    pick(raw, ['options', 'choices', 'answers', 'option', '选项']),
  );

  let answer = pick(raw, ['answer', 'correct', 'correctAnswer', 'correct_answer', 'rightAnswer', 'solution', 'key', '答案']);

  // 答案是下标数字 -> 转成字母
  if (typeof answer === 'number' && options) {
    answer = String.fromCharCode(65 + answer);
  }
  // 答案写成选项原文 -> 找它在第几个，转成字母
  if (typeof answer === 'string' && options && answer.length > 1) {
    const i = options.findIndex((o) => o === answer.trim());
    if (i >= 0) answer = String.fromCharCode(65 + i);
  }
  if ((answer === undefined || answer === '') && answerFromOptions) answer = answerFromOptions;

  const id = pick(raw, ['id', 'uid', 'uuid', 'key', 'slug', '编号']);

  let difficulty = Number(pick(raw, ['difficulty', 'level', 'hardness', '难度']));
  if (!Number.isFinite(difficulty)) difficulty = 2;
  difficulty = Math.min(4, Math.max(1, Math.round(difficulty)));

  const solution = pick(raw, ['solution', 'explanation', 'rationale', 'analysis', 'explain', '解析', '解答']);

  let concepts = pick(raw, ['concepts', 'concept', 'knowledgePoints', 'knowledge_points', '知识点']);
  if (typeof concepts === 'string') concepts = [concepts];
  if (!Array.isArray(concepts)) concepts = [];

  let tags = pick(raw, ['tags', 'tag', 'labels', '标签']);
  if (typeof tags === 'string') tags = [tags];
  if (!Array.isArray(tags)) tags = [];

  return {
    id: id === undefined ? '' : String(id),
    stem: stem === undefined ? '' : String(stem),
    answer: answer === undefined ? '' : String(answer),
    type: normalizeType(pick(raw, ['type', 'questionType', 'question_type', 'kind', '题型']), Boolean(options)),
    difficulty,
    options,
    solution: solution === undefined ? '' : String(solution),
    concepts: concepts.map(String),
    tags: tags.map(String),
    chapterId: pick(raw, ['chapterId', 'chapter', 'chapter_id']) || '',
    sectionId: pick(raw, ['sectionId', 'section', 'section_id']) || '',
    source: 'imported',
    license: pick(raw, ['license', '许可']) || '',
    attribution: pick(raw, ['attribution', 'author', 'source', '来源']) || '',
    __issues: issues,
  };
}

/**
 * 逐题校验归一后的题目。
 * @returns {{ok:boolean, errors:string[], warnings:string[]}}
 */
export function validateQuestion(q) {
  const errors = [];
  const warnings = [];

  if (!q || typeof q !== 'object') return { ok: false, errors: ['不是有效的题目对象'], warnings };

  for (const f of REQUIRED_FIELDS) {
    if (q[f] === undefined || q[f] === null || String(q[f]).trim() === '') {
      const label = { id: 'id', stem: '题干', answer: '答案' }[f] || f;
      errors.push(`缺${label}`);
    }
  }
  if (q.type && !VALID_TYPES.includes(q.type)) errors.push(`题型不合法（${q.type}）`);
  if (q.type === 'choice' && (!Array.isArray(q.options) || q.options.length < 2)) {
    errors.push('选择题缺少选项');
  }
  if (q.type === 'choice' && Array.isArray(q.options) && q.options.length >= 2) {
    const keys = q.options.map((_, i) => String.fromCharCode(65 + i));
    if (q.answer && !keys.includes(String(q.answer).toUpperCase()) && q.answer.length === 1) {
      warnings.push(`答案 "${q.answer}" 不在选项范围 ${keys.join('/')} 内`);
    }
  }
  if (!q.solution) warnings.push('没有解析（导入后学生看不到解题过程）');
  if (!q.concepts || !q.concepts.length) warnings.push('没有知识点标签（无法用于"按知识点出题"）');
  if (q.difficulty === 2 && !q.__hadDifficulty) warnings.push('未标注难度，已默认设为「基础」');
  if (!q.chapterId) warnings.push('没有章节信息（无法用于"按章节出题"）');

  return { ok: errors.length === 0, errors, warnings };
}

/**
 * 从任意 JSON 里把题目数组挖出来。
 * 支持的顶层形状见文件头注释。
 * @param {any} payload
 * @returns {{list:any[], shape:string, meta:object}}
 */
export function extractQuestions(payload) {
  const meta = {};

  if (Array.isArray(payload)) {
    return { list: payload, shape: '纯数组', meta };
  }
  if (!payload || typeof payload !== 'object') {
    return { list: [], shape: '无法识别', meta };
  }

  // 顺带把题包元信息捞出来
  for (const k of ['name', 'title', 'bookId', 'license', 'attribution']) {
    if (payload[k]) meta[k] = payload[k];
  }

  for (const key of ['questions', 'items', 'problems', 'exercises', 'data', 'list']) {
    if (Array.isArray(payload[key])) {
      return { list: payload[key], shape: `{ ${key}: [...] }`, meta };
    }
  }

  // 错题本导出：{ records: { "q:xxx": {...} } }，只取题目类记录
  if (payload.records && typeof payload.records === 'object') {
    const list = [];
    for (const [k, v] of Object.entries(payload.records)) {
      if (!k.startsWith('q:') || !v || typeof v !== 'object') continue;
      list.push({
        id: v.id || k.slice(2),
        stem: v.preview || v.title || '',
        answer: (v.extra && v.extra.answer) || '',
        difficulty: (v.extra && v.extra.difficulty) || 2,
        concepts: (v.extra && v.extra.concepts) || [],
        tags: (v.extra && v.extra.tags) || [],
        chapterId: v.chapterId || '',
        solution: '',
      });
    }
    if (list.length) return { list, shape: '错题本导出', meta };
  }

  // 单题对象
  if (payload.stem || payload.question || payload.prompt) {
    return { list: [payload], shape: '单道题', meta };
  }

  return { list: [], shape: '无法识别', meta };
}

/**
 * 主入口：把一段原始 payload 解析成"可预览、可勾选"的结果。
 * @param {any} payload 已 JSON.parse 的对象（或字符串，会自动 parse）
 * @param {{existingIds?:Set<string>|string[]}} [opt] 现有题库 id，用于判重
 * @returns {{
 *   ok:boolean, error?:string, shape:string, meta:object,
 *   items:Array<{index:number, question:object, status:'ok'|'problem'|'duplicate',
 *                errors:string[], warnings:string[], summary:string, selected:boolean}>,
 *   counts:{total:number, ok:number, problem:number, duplicate:number, importable:number}
 * }}
 */
export function parseImportPayload(payload, opt = {}) {
  let data = payload;

  // 允许直接传字符串（粘贴进来的）
  if (typeof data === 'string') {
    const text = data.trim();
    if (!text) return emptyResult('粘贴的内容是空的');
    try {
      data = JSON.parse(text);
    } catch (err) {
      return emptyResult(`不是合法的 JSON：${String(err.message).split('\n')[0]}`);
    }
  }

  const { list, shape, meta } = extractQuestions(data);
  if (!list.length) {
    return emptyResult(
      '没找到题目数组。支持的形式：数组 [...]、{ questions: [...] }、'
      + '{ items: [...] }、或本站导出的错题本 JSON。',
      shape,
    );
  }

  const existing = opt.existingIds instanceof Set ? opt.existingIds : new Set(opt.existingIds || []);
  const seenInFile = new Set();
  const items = [];

  list.forEach((raw, i) => {
    const q = normalizeQuestion(raw, i);
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      q.__hadDifficulty = ['difficulty', 'level', 'hardness', '难度'].some((k) => raw[k] !== undefined);
    }
    const { ok, errors, warnings } = validateQuestion(q);

    let status = ok ? 'ok' : 'problem';
    if (ok) {
      if (existing.has(q.id)) {
        status = 'duplicate';
        warnings.unshift('这一题的 id 与现有题库重复，导入时会跳过');
      } else if (seenInFile.has(q.id)) {
        status = 'duplicate';
        warnings.unshift('文件内部 id 重复，只保留第一道');
      } else {
        seenInFile.add(q.id);
      }
    }

    items.push({
      index: i,
      question: q,
      status,
      errors,
      warnings,
      summary: summarize(q),
      // 默认勾选：可导入的都勾上；有问题的默认不勾（让用户自己决定）
      selected: status === 'ok',
    });
  });

  const counts = {
    total: items.length,
    ok: items.filter((x) => x.status === 'ok').length,
    problem: items.filter((x) => x.status === 'problem').length,
    duplicate: items.filter((x) => x.status === 'duplicate').length,
    importable: items.filter((x) => x.status === 'ok').length,
  };

  return { ok: true, shape, meta, items, counts };
}

function emptyResult(error, shape = '无法识别') {
  return {
    ok: false,
    error,
    shape,
    meta: {},
    items: [],
    counts: { total: 0, ok: 0, problem: 0, duplicate: 0, importable: 0 },
  };
}

/** 给界面用的一句摘要 */
function summarize(q) {
  const stem = String(q.stem || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return stem.length > 60 ? stem.slice(0, 60) + '…' : stem || '(无题干)';
}

/**
 * 把选中的条目组装成"可直接入库的题目数组"。
 * @param {Array} items parseImportPayload 返回的 items
 * @param {Set<number>|number[]} selectedIndexes
 * @returns {object[]}
 */
export function collectSelected(items, selectedIndexes) {
  const set = selectedIndexes instanceof Set ? selectedIndexes : new Set(selectedIndexes || []);
  return items
    .filter((x) => set.has(x.index) && x.status !== 'problem')
    .map((x) => {
      const { __issues, __hadDifficulty, ...q } = x.question;
      void __issues; void __hadDifficulty;
      return q;
    });
}

/**
 * 生成一个可分享的题包对象（用于导出）。
 * @param {object[]} questions
 * @param {{name?:string, bookId?:string, description?:string}} [meta]
 */
export function buildPack(questions, meta = {}) {
  return {
    format: 'shuxue-peilian/question-pack',
    formatVersion: 1,
    name: meta.name || '自选题包',
    bookId: meta.bookId || '',
    description: meta.description || '',
    license: 'CC-BY-4.0',
    attribution: meta.attribution || '由「数学陪练」用户导出',
    generatedAt: new Date().toISOString(),
    generatedBy: '数学陪练 (math-improvement-plan)',
    count: questions.length,
    questions,
  };
}
