/**
 * srs.js —— 间隔复习调度（艾宾浩斯遗忘曲线思路）
 *
 * 说明（写在代码里，避免误导）：
 *   艾宾浩斯 1885 年用无意义音节测出遗忘曲线，结论是"遗忘先快后慢"。
 *   工程上通常把它变成一组**递增的复习间隔**。本项目采用的间隔如下，
 *   它是"遗忘曲线思路 + 常见实践"的组合，**不是**艾宾浩斯论文里的原始数值，
 *   你可以按自己的记忆情况在 INTERVALS 里随意改：
 *
 *     第 1 次：5 分钟后   （当天巩固，趁还没忘）
 *     第 2 次：30 分钟后
 *     第 3 次：12 小时后  （睡前/第二天早上）
 *     第 4 次：1 天后
 *     第 5 次：2 天后
 *     第 6 次：4 天后
 *     第 7 次：7 天后
 *     第 8 次：15 天后
 *     第 9 次：30 天后
 *     第10 次：60 天后    —— 走完 10 次视为"已掌握"
 *
 * 答对 -> 进入下一档；答错 -> 打回上一档（或第 1 档），并记一次 lapse。
 */

import { getState, emit } from './storage.js';
import { preview } from './text.js';

export const INTERVALS = [
  { ms: 5 * 60 * 1000, label: '5 分钟后' },
  { ms: 30 * 60 * 1000, label: '30 分钟后' },
  { ms: 12 * 60 * 60 * 1000, label: '12 小时后' },
  { ms: 1 * 24 * 60 * 60 * 1000, label: '1 天后' },
  { ms: 2 * 24 * 60 * 60 * 1000, label: '2 天后' },
  { ms: 4 * 24 * 60 * 60 * 1000, label: '4 天后' },
  { ms: 7 * 24 * 60 * 60 * 1000, label: '7 天后' },
  { ms: 15 * 24 * 60 * 60 * 1000, label: '15 天后' },
  { ms: 30 * 24 * 60 * 60 * 1000, label: '30 天后' },
  { ms: 60 * 24 * 60 * 60 * 1000, label: '60 天后' },
];

export const MAX_PHASE = INTERVALS.length;

/** 完成第 n 档复习后，下一次该等多久 */
export function intervalLabelAfter(phase) {
  if (phase >= MAX_PHASE) return '已掌握（间隔循环）';
  return INTERVALS[phase].label;
}

/** 当前记录所处阶段的展示文本 */
export function phaseLabel(phase) {
  if (!phase || phase <= 0) return '第 1 档 · 待首次复习';
  if (phase >= MAX_PHASE) return `已掌握 · 已复习 ${phase} 档`;
  return `第 ${phase + 1} 档 · 下次 ${INTERVALS[phase].label}`;
}

/** 复习进度 0~1 */
export const phaseRatio = (phase) => Math.min(1, (phase || 0) / MAX_PHASE);

/**
 * 提交一次复习结果
 * @param {object} rec 记录对象（来自 storage）
 * @param {boolean} ok 是否记得住
 * @param {number} [now]
 */
export function grade(rec, ok, now = Date.now()) {
  if (!rec.srs) return rec;
  const s = rec.srs;
  s.reviews = (s.reviews || 0) + 1;
  s.lastReview = now;
  s.history = [...(s.history || []), { t: now, ok: Boolean(ok) }].slice(-40);

  if (ok) {
    s.phase = Math.min(MAX_PHASE, (s.phase || 0) + 1);
  } else {
    s.lapses = (s.lapses || 0) + 1;
    // 答错的处理分两种：
    //   - 还没真正记住过（phase = 0）：留在起跑线，5 分钟后再来一遍（这才是错题本的意义）
    //   - 已经推进过：打回上一档，下次间隔缩短
    s.phase = (s.phase || 0) > 0 ? s.phase - 1 : 0;
  }
  const idx = Math.min(s.phase, MAX_PHASE - 1);
  s.due = now + INTERVALS[idx].ms;
  rec.updatedAt = now;
  if (ok && s.phase >= MAX_PHASE) rec.masteredAt = now;
  else delete rec.masteredAt;

  const st = getState().stats;
  st.reviews = (st.reviews || 0) + 1;
  emit('grade');
  return rec;
}

/** 到期需要复习的记录（按到期时间升序） */
export function dueRecords(now = Date.now()) {
  return Object.values(getState().records)
    .filter((r) => r && r.srs && r.srs.due <= now)
    .sort((a, b) => a.srs.due - b.srs.due);
}

/** 未来 n 天内要复习的记录 */
export function upcomingRecords(days = 7, now = Date.now()) {
  const end = now + days * 86400000;
  return Object.values(getState().records)
    .filter((r) => r && r.srs && r.srs.due > now && r.srs.due <= end)
    .sort((a, b) => a.srs.due - b.srs.due);
}

/** 已掌握（走完全部档位） */
export function masteredRecords() {
  return Object.values(getState().records).filter((r) => r && r.srs && (r.srs.phase || 0) >= MAX_PHASE);
}

/** 统计概览 */
export function srsSummary(now = Date.now()) {
  const all = Object.values(getState().records).filter((r) => r && r.srs);
  const due = all.filter((r) => r.srs.due <= now);
  const mastered = all.filter((r) => (r.srs.phase || 0) >= MAX_PHASE);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const today = all.filter((r) => r.srs.due <= todayEnd.getTime());
  const avgPhase = all.length ? all.reduce((a, r) => a + (r.srs.phase || 0), 0) / all.length : 0;
  return {
    total: all.length,
    due: due.length,
    dueList: due.sort((a, b) => a.srs.due - b.srs.due),
    today: today.length,
    todayList: today.sort((a, b) => a.srs.due - b.srs.due),
    mastered: mastered.length,
    avgPhase: Math.round(avgPhase * 10) / 10,
    maxPhase: MAX_PHASE,
  };
}

/**
 * "如果现在复习一次，什么时候回来" 的预告，用于 UI 展示
 */
export function nextDuePreview(rec, ok) {
  if (!rec || !rec.srs) return '';
  const phase = ok
    ? Math.min(MAX_PHASE, (rec.srs.phase || 0) + 1)
    : ((rec.srs.phase || 0) > 0 ? rec.srs.phase - 1 : 0);
  const idx = Math.min(phase, MAX_PHASE - 1);
  return INTERVALS[idx].label;
}

/** 用于错题本条目的短预览 */
export const shortPreview = (r) => preview(r.preview || r.title || '', 80);
