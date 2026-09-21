/**
 * math.js —— 数学记号排版（把内容里的写法渲染成教科书样式）
 *
 * 背景 / 为什么要单独一层：
 *   内容数据是纯文本，作者写极限时有三套写法（统计自现有 204 个条目 + 194 道题）：
 *
 *     A 括号式   lim(Δx→0) Δy/Δx          341 处   ← 主流
 *     E 前置式   lim f(x)/g(x) = A        266 处   ← 教科书本来就这么写
 *     F 下标式   lim<sub>x→a</sub> f(x)    77 处
 *
 *   直接显示出来会变成 "lim(Δx→0)" 这种抽象写法，和教科书里
 *   "lim 下方挂着 Δx→0" 的样子不一样。这个模块负责在渲染时统一成教科书样式。
 *
 * 支持的写法（贡献者按任意一种写都可以）：
 *
 *   lim(x→0)             → lim 下方居中显示 x→0
 *   lim[x→0]             → 同上
 *   lim_{x→0}            → 同上（LaTeX 风格）
 *   lim(x→0⁺)            → 支持单侧极限记号
 *   lim<sub>x→a</sub>    → 同上
 *   lim f(x)             → 前置式：lim 与表达式并列（教科书写法）
 *   只有 lim 后面什么都不跟 → 只渲染 lim 本身
 *
 * 不在括号里的前置式（`lim f(x)`）**不会**把表达式塞进下标 ——
 * 教科书里这类极限就是 lim 与表达式并列，塞进下标反而是错的。
 *
 * ⚠️ 实现要点（踩过的坑，别改回去）：
 *   本模块在 HTML 转义**之前**运行，但**不能**直接插入 `<span>` 标签。
 *   因为随后的转义会把属性里的引号变成 &quot;，标签就再也还原不回来了。
 *   正确做法是分两步：
 *     ① protectMath()  把匹配到的数学片段换成**纯 ASCII 占位符**（如 M0M），
 *        占位符只含字母数字，能安全穿过转义；
 *     ② expandMath()   在转义之后把占位符替换成真正的 span 标签。
 *   调用顺序：protectMath → escapeHtml → expandMath。
 */

/** 占位符前缀。用控制字符 \u0000 打头，确保不会与正文内容冲突 */
const PH_OPEN = '\u0000M';
const PH_CLOSE = 'M\u0000';

/** 匹配一个"下标表达式"：允许括号内出现上下标标签（例如 Δx→0<sup>+</sup>） */
const OPERAND = String.raw`(?:<su[bp]>[^<]*</su[bp]>|[^()\[\]<>])*`;

const RE_LIM_PAREN = new RegExp(String.raw`\blim\s*[\(\[]\s*(${OPERAND}?)\s*[\)\]]`, 'g');
const RE_LIM_SUB = /\blim\s*<sub>([\s\S]*?)<\/sub>/g;
const RE_LIM_BRACE = /\blim\s*_\{([^{}]*)\}/g;

/** 把 lim 及下方条件渲染成教科书样式 */
function limMarkup(under) {
  const body = String(under).trim();
  if (!body) return 'lim';
  return `<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">${body}</span></span>`;
}

/**
 * 第 ① 步：把数学记号替换成占位符（在 HTML 转义之前调用）
 * @param {string} text
 * @returns {string}
 */
export function protectMath(text) {
  if (text == null || text === '') return '';
  let out = String(text);

  // lim_{...}（LaTeX 风格）
  out = out.replace(RE_LIM_BRACE, (_, body) => `${PH_OPEN}${String(body).trim()}${PH_CLOSE}`);

  // lim(...) / lim[...] —— 括号里的内容移到 lim 下方
  out = out.replace(RE_LIM_PAREN, (whole, body) => {
    const under = String(body).trim();
    // 括号为空（例如误写 "lim()"）就保持原样，避免渲染出空下标
    return under ? `${PH_OPEN}${under}${PH_CLOSE}` : whole;
  });

  // lim<sub>...</sub> —— 已经写成下标，统一成同样的结构
  out = out.replace(RE_LIM_SUB, (_, body) => `${PH_OPEN}${String(body).trim()}${PH_CLOSE}`);

  return out;
}

/**
 * 第 ② 步：把占位符展开成真正的标签（在 HTML 转义之后调用）
 * @param {string} escaped 已经过 HTML 转义、且仍含占位符的文本
 * @returns {string}
 */
export function expandMath(escaped) {
  if (escaped == null || escaped === '') return '';
  const re = new RegExp(`${PH_OPEN}([\\s\\S]*?)${PH_CLOSE}`, 'g');
  return String(escaped).replace(re, (_, under) => limMarkup(under));
}

/**
 * 便利函数：一次完成两步（用于测试与不经过转义的场景）。
 * 注意它产出的字符串里含真实标签，**不要**再送去 HTML 转义。
 * @param {string} text
 */
export function renderMath(text) {
  return expandMath(protectMath(text));
}

/**
 * 判断一段内容里是否含极限记号（供测试与校验使用）
 * @param {string} text
 */
export function hasLimit(text) {
  return /\blim\b/.test(String(text || ''));
}
