/**
 * text.js —— 轻量富文本渲染
 *
 * 内容作者只允许使用极少量的标记，防止 XSS，也保证零依赖、可离线：
 *   <code> <b> <i> <sup> <sub> <br>
 *   [[tip:文字]]  -> 提示块
 *   [[warn:文字]] -> 警示块
 * 其余 Markdown 语法一律不做渲染（原样显示），这样作者写错格式时不会静默丢内容。
 *
 * 数学记号的排版交给 js/math.js，调用顺序是：
 *   protectMath（换成占位符）→ escapeHtml（整体转义）→ expandMath（展开成真标签）
 * 必须在转义**之后**才插入真标签，否则属性里的引号会被转义掉。
 */

import { protectMath, expandMath } from './math.js';

const ALLOWED_TAGS = ['code', 'b', 'i', 'sup', 'sub', 'br', 'em', 'strong'];

const escapeHtml = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * 把内容里已经写好的 HTML 实体解码回真字符。
 *
 * 为什么需要这一步（这是一个真实 bug 的修复）：
 *   内容数据里有大量作者手写的 HTML 实体 —— 实测 `&gt;` 265 处、`&lt;` 240 处，
 *   例如 `<code>ε &gt; 0</code>`。这是当年为了绕开 HTML 转义用的权宜写法。
 *   但渲染管线会**再转义一次** `&`：
 *       作者写的 ε &gt; 0  →  ε &amp;gt; 0  →  浏览器显示字面的 "ε &gt; 0"
 *   用户看到的就是 "ε &gt; 0" 而不是 "ε > 0"，完全不符合教科书表达。
 *
 *   修法：在转义**之前**先把实体还原成真字符（`&gt;` → `>`），
 *   随后统一由 escapeHtml 做唯一一次转义，最终浏览器显示 `>`。
 *
 * 注意：只解码已知的几个实体，不做通用的"数字实体"解码 ——
 * 没有必要，而且能避免把奇怪输入意外变成字符。
 */
function decodeEntities(raw) {
  return raw
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    // &amp; 放最后：避免把 `&amp;lt;` 这类双重转义一步解成 `<`
    .replace(/&amp;/gi, '&');
}

/**
 * 白名单标签的转义还原。
 *
 * 数学排版标记不在这里处理 —— 它们由 expandMath() 在转义之后插入，
 * 全程不经过转义，因此不必也无法在这里匹配。
 */
function escapeKeepAllowed(raw) {
  let out = escapeHtml(raw);
  for (const tag of ALLOWED_TAGS) {
    const open = new RegExp(`&lt;(${tag})&gt;`, 'gi');
    const close = new RegExp(`&lt;/(${tag})&gt;`, 'gi');
    const selfClose = new RegExp(`&lt;(${tag})\\s*/&gt;`, 'gi');
    out = out.replace(open, '<$1>').replace(close, '</$1>').replace(selfClose, '<$1>');
  }
  return out;
}

/**
 * 完整的渲染前处理：
 *   ① decodeEntities  把作者手写的 HTML 实体还原成真字符
 *   ② protectMath     极限号等记号换成占位符（此时才能正确识别 `x→0<sup>+</sup>`）
 *   ③ escapeKeepAllowed  唯一一次 HTML 转义 + 还原白名单标签
 *   ④ expandMath      占位符展开成数学排版的真标签
 *   ⑤ blocks          处理 [[tip:]] / [[warn:]]
 * @param {string} raw
 */
function prepare(raw) {
  const step1 = decodeEntities(String(raw));
  const step2 = protectMath(step1);
  const step3 = escapeKeepAllowed(step2);
  return blocks(expandMath(step3));
}

/** 处理 [[tip:...]] / [[warn:...]] */
function blocks(html) {
  return html
    .replace(/\[\[tip:([\s\S]*?)\]\]/g, (_, t) => `<span class="tip-block">💡 ${t.trim()}</span>`)
    .replace(/\[\[warn:([\s\S]*?)\]\]/g, (_, t) => `<span class="warn-block">⚠️ ${t.trim()}</span>`);
}

/**
 * 渲染一段文本为 HTML（换行 -> 段落）
 * @param {string} raw
 * @returns {string}
 */
export function rich(raw) {
  if (raw == null || raw === '') return '';
  const safe = prepare(raw);
  return safe
    .split(/\n{2,}/)
    .map((chunk) => `<p>${chunk.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** 单行渲染（不包 <p>） */
export function richInline(raw) {
  if (raw == null) return '';
  return prepare(raw).replace(/\n/g, '<br>');
}

/** 纯文本版（用于搜索、预览、导出） */
export function plainText(raw) {
  if (raw == null) return '';
  return String(raw)
    .replace(/\[\[(?:tip|warn):([\s\S]*?)\]\]/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(?:code|b|i|sup|sub|em|strong)>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 截断为预览文本 */
export function preview(raw, n = 90) {
  const t = plainText(raw);
  return t.length > n ? t.slice(0, n) + '…' : t;
}

/** 高亮关键词（返回 HTML，输入已转义安全） */
export function highlight(raw, keyword) {
  const html = richInline(raw);
  if (!keyword) return html;
  const kw = escapeHtml(keyword);
  try {
    return html.replace(new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  } catch {
    return html;
  }
}

export { escapeHtml };
