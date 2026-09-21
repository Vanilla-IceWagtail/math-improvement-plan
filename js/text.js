/**
 * text.js —— 轻量富文本渲染
 *
 * 内容作者只允许使用极少量的标记，防止 XSS，也保证零依赖、可离线：
 *   <code> <b> <i> <sup> <sub> <br>
 *   [[tip:文字]]  -> 提示块
 *   [[warn:文字]] -> 警示块
 * 其余 Markdown 语法一律不做渲染（原样显示），这样作者写错格式时不会静默丢内容。
 */

const ALLOWED_TAGS = ['code', 'b', 'i', 'sup', 'sub', 'br', 'em', 'strong'];

const escapeHtml = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * 转义全部 HTML，然后只把白名单标签还原回来。
 */
function escapeKeepAllowed(raw) {
  let out = escapeHtml(raw);
  for (const tag of ALLOWED_TAGS) {
    const open = new RegExp(`&lt;(${tag})&gt;`, 'gi');
    const close = new RegExp(`&lt;/(${tag})&gt;`, 'gi');
    const selfClose = new RegExp(`&lt;(${tag})\\s*/&gt;`, 'gi');
    out = out.replace(open, '<$1>').replace(close, '</$1>').replace(selfClose, '<$1>');
    // 允许带 class 的少量属性？不需要，保持最简。
  }
  return out;
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
  const safe = blocks(escapeKeepAllowed(String(raw)));
  return safe
    .split(/\n{2,}/)
    .map((chunk) => `<p>${chunk.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** 单行渲染（不包 <p>） */
export function richInline(raw) {
  if (raw == null) return '';
  return blocks(escapeKeepAllowed(String(raw))).replace(/\n/g, '<br>');
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
