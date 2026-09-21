/**
 * storage.js —— 本地数据层（localStorage，零后端、零账号、可导出）
 *
 * 设计原则：
 *   1. 所有学习数据只存在用户自己浏览器里，不上传任何服务器（除了教材 JSON 在同源静态目录）。
 *   2. 单一 key 存整棵状态树，写入时做一次节流合并，避免频繁写盘。
 *   3. 任何一次写入都发事件，视图层订阅后重渲染，避免各模块互相耦合。
 */

const KEY = 'math-trainer/state/v1';
const SCHEMA = 1;

/** @typedef {{ id:string, kind:'question'|'item', chapterId?:string, title:string, preview?:string,
 *   addedAt:number, updatedAt:number, stars:number, // 0 或 1
 *   srs?: { phase:number, due:number, lastReview:number, lapses:number, reviews:number, history:Array<{t:number, ok:boolean}> },
 *   extra?: object }} Record */

const defaultState = () => ({
  schema: SCHEMA,
  createdAt: Date.now(),
  settings: {
    theme: 'auto',
    sound: true,
    popupOnOpen: true,
    dailyGoal: 10,
    lastRemindAt: 0,
    bookId: 'tongji-gaoshu-1',
    libraryUrl: '', // 可选的外部开放题库地址（同源 JSON）
  },
  /** @type {Record<string, Record>} */
  records: {},
  /** 最近一次生成的题组，用于“继续上次” */
  lastQuiz: null,
  /** 已导入的开放题库包元信息 */
  importedBanks: [],
  stats: {
    answered: 0,
    correct: 0,
    quizSets: 0,
    reviews: 0,
    streakDays: 0,
    lastActiveDay: '',
    activeDays: [],
  },
});

let state = null;
const listeners = new Set();
let writeTimer = null;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultState();
    // 简单迁移：缺字段就补默认值
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      stats: { ...base.stats, ...(parsed.stats || {}) },
      records: parsed.records && typeof parsed.records === 'object' ? parsed.records : {},
    };
  } catch (err) {
    console.warn('[storage] 读取失败，使用空状态', err);
    return defaultState();
  }
}

export function getState() {
  if (!state) state = load();
  return state;
}

function persist() {
  if (writeTimer) return;
  writeTimer = setTimeout(() => {
    writeTimer = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[storage] 写入失败（可能是隐私模式或空间不足）', err);
    }
  }, 160);
}

export function save() {
  persist();
}

/** 订阅状态变化 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit(reason = 'change') {
  save();
  for (const fn of listeners) {
    try { fn(reason, getState()); } catch (err) { console.error('[storage] 订阅回调出错', err); }
  }
}

/* ------------------------------------------------------------------ 记录 */

const keyOf = (id, kind) => `${kind === 'question' ? 'q' : 'i'}:${id}`;

export function getRecord(id, kind = 'question') {
  return getState().records[keyOf(id, kind)] || null;
}

export function hasRecord(id, kind = 'question') {
  return Boolean(getRecord(id, kind));
}

/** 取或建记录（不自动保存，调用方 emit） */
export function ensureRecord({ id, kind = 'question', chapterId, title, preview, extra }) {
  const s = getState();
  const k = keyOf(id, kind);
  let rec = s.records[k];
  if (!rec) {
    rec = {
      id, kind, chapterId: chapterId || '', title: title || '',
      preview: preview || '', addedAt: Date.now(), updatedAt: Date.now(),
      stars: 0, srs: null, extra: extra || null,
    };
    s.records[k] = rec;
  } else {
    // 内容可能更新，刷新展示字段
    if (title) rec.title = title;
    if (preview) rec.preview = preview;
    if (chapterId) rec.chapterId = chapterId;
    if (extra) rec.extra = { ...(rec.extra || {}), ...extra };
  }
  return rec;
}

export function removeRecord(id, kind = 'question') {
  const s = getState();
  delete s.records[keyOf(id, kind)];
  emit('records');
}

/** 收藏（星标）切换 */
export function toggleStar(id, kind = 'question', meta = {}) {
  const s = getState();
  const rec = ensureRecord({ id, kind, ...meta });
  rec.stars = rec.stars ? 0 : 1;
  rec.updatedAt = Date.now();
  // 星标和错题本都取消且没有复习记录时，清掉空记录
  if (!rec.stars && !rec.srs) delete s.records[keyOf(id, kind)];
  emit('star');
  return rec.stars === 1;
}

/** 加入 / 移出错题本 */
export function toggleNotebook(id, kind = 'question', meta = {}) {
  const s = getState();
  const rec = ensureRecord({ id, kind, ...meta });
  if (rec.srs) {
    rec.srs = null;
    rec.updatedAt = Date.now();
    if (!rec.stars) delete s.records[keyOf(id, kind)];
    emit('notebook');
    return false;
  }
  rec.srs = newSrs();
  rec.updatedAt = Date.now();
  emit('notebook');
  return true;
}

export function setNotebook(rec, on = true) {
  const s = getState();
  const k = keyOf(rec.id, rec.kind);
  const cur = s.records[k] || (s.records[k] = rec);
  if (on) { if (!cur.srs) cur.srs = newSrs(); }
  else { cur.srs = null; if (!cur.stars) delete s.records[k]; }
  cur.updatedAt = Date.now();
  emit('notebook');
  return on;
}

export function newSrs() {
  return { phase: 0, due: Date.now(), lastReview: 0, lapses: 0, reviews: 0, history: [] };
}

/** 所有带错题本记录（srs 存在） */
export function notebookRecords() {
  return Object.values(getState().records).filter((r) => r && r.srs);
}

/** 所有收藏记录 */
export function starredRecords() {
  return Object.values(getState().records).filter((r) => r && r.stars);
}

/* ------------------------------------------------------------------ 设置与统计 */

export function updateSettings(patch) {
  Object.assign(getState().settings, patch);
  emit('settings');
}

export function bumpStats(patch) {
  const st = getState().stats;
  for (const [k, v] of Object.entries(patch)) {
    st[k] = (st[k] || 0) + v;
  }
  markActiveToday();
  emit('stats');
}

/** 只在当天首次操作时记录活跃日，用于连续天数 */
export function markActiveToday() {
  const st = getState().stats;
  const today = new Date().toISOString().slice(0, 10);
  if (st.lastActiveDay === today) return;
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  st.streakDays = st.lastActiveDay === yest ? (st.streakDays || 0) + 1 : 1;
  st.lastActiveDay = today;
  st.activeDays = [...new Set([...(st.activeDays || []), today])].slice(-400);
}

export function setLastQuiz(quiz) {
  getState().lastQuiz = quiz;
  emit('quiz');
}

export function setImportedBanks(list) {
  getState().importedBanks = list;
  emit('banks');
}

/* ------------------------------------------------------------------ 导入 / 导出 */

export function exportJSON() {
  return JSON.stringify(getState(), null, 2);
}

export function exportBackup() {
  return {
    app: 'shuxue-peilian',
    schema: SCHEMA,
    exportedAt: new Date().toISOString(),
    data: getState(),
  };
}

/**
 * 导入：merge 策略优先（保留本地已有记录中更新时间较新的），可选替换
 * @param {object} payload
 * @param {'merge'|'replace'} mode
 */
export function importState(payload, mode = 'merge') {
  const incoming = payload && payload.data ? payload.data : payload;
  if (!incoming || typeof incoming !== 'object' || !incoming.records) {
    throw new Error('文件格式不对：没有找到 records 字段');
  }
  if (mode === 'replace') {
    state = { ...defaultState(), ...incoming, settings: { ...defaultState().settings, ...(incoming.settings || {}) } };
  } else {
    const cur = getState();
    for (const [k, rec] of Object.entries(incoming.records)) {
      const old = cur.records[k];
      if (!old || (rec.updatedAt || 0) > (old.updatedAt || 0)) cur.records[k] = rec;
    }
    cur.settings = { ...cur.settings, ...(incoming.settings || {}) };
    cur.stats = { ...cur.stats, ...(incoming.stats || {}) };
  }
  emit('import');
  save();
}

export function resetAll() {
  state = defaultState();
  emit('reset');
  save();
}

/** 下载 JSON 文件 */
export function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
