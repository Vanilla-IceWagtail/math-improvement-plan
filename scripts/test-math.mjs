/**
 * test-math.mjs —— 数学记号排版的单元测试 + 全量回归
 *
 * 1) 单元用例：各种极限写法的期望输出（括号式 / 花括号式 / 下标式 / 前置式 / 单侧极限）
 * 2) 管线检查：确认渲染产物是<b>真标签</b>而不是被转义成 &lt;span，且 XSS 仍被拦住
 * 3) 全量回归：把 data/ 下所有内容文件的字符串过一遍渲染，确认
 *    没有残留 "lim(…→…)" 抽象写法、没有未转换的 lim&lt;sub&gt;、span 标签全部配平
 *
 * 用法：node scripts/test-math.mjs
 */
import { renderMath } from '../js/math.js';
import { richInline, rich } from '../js/text.js';
import { readFileSync, readdirSync } from 'node:fs';

let failed = 0;
/**
 * 断言
 * @param {string} name   用例名
 * @param {boolean} cond  条件（真为通过）
 * @param {string} [detail] 失败时打印的说明
 */
const check = (name, cond, detail = '') => {
  const ok = Boolean(cond);
  if (!ok) failed += 1;
  console.log(`${ok ? '  OK  ' : '  FAIL'} ${name}`);
  if (!ok && detail) console.log('        ' + detail);
};

/** 断言两个字符串相等（带可读的 diff 输出） */
const checkEq = (name, actual, expect) => {
  const ok = actual === expect;
  if (!ok) failed += 1;
  console.log(`${ok ? '  OK  ' : '  FAIL'} ${name}`);
  if (!ok) {
    console.log('        期望: ' + JSON.stringify(expect));
    console.log('        实际: ' + JSON.stringify(actual));
  }
};

console.log('══════ 1. 单元用例 ══════\n');

// 括号式 → 下标
checkEq('lim(x→0) 括号式',
  renderMath('lim(x→0) sin x / x = 1'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→0</span></span> sin x / x = 1');

// 方括号式
checkEq('lim[x→0] 方括号',
  renderMath('lim[x→0] f(x)'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→0</span></span> f(x)');

// LaTeX 下标式
checkEq('lim_{n→∞} 花括号',
  renderMath('lim_{n→∞} aₙ = A'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">n→∞</span></span> aₙ = A');

// 已有的 <sub> 写法
checkEq('lim<sub>x→a</sub>',
  renderMath('lim<sub>x→a</sub> f(x)'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→a</span></span> f(x)');

// 单侧极限（带 sup 标签）
checkEq('lim(x→0<sup>+</sup>) 单侧极限',
  renderMath('lim(x→0<sup>+</sup>) f(x)'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→0<sup>+</sup></span></span> f(x)');

// 前置式：不能把表达式塞进下标
checkEq('lim f(x) 前置式保持并列',
  renderMath('lim f(x)/g(x) = A'),
  'lim f(x)/g(x) = A');

// 裸 lim
checkEq('独立的 lim 不加下标', renderMath('极限 lim 的值'), '极限 lim 的值');

// 括号为空时不渲染空下标
checkEq('lim() 空括号保持原样', renderMath('lim() 写法有误'), 'lim() 写法有误');

// 多个极限连续出现
checkEq('一行两个极限',
  renderMath('lim(x→0) A = lim(x→0) B'),
  '<span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→0</span></span> A = <span class="math-lim"><span class="lim-op">lim</span><span class="lim-under">x→0</span></span> B');

console.log('\n══════ 2. HTML 实体解码（曾经的 bug：ε &gt; 0 显示成字面量） ══════\n');

// 内容里作者手写的 HTML 实体（实测 &gt; 265 处、&lt; 240 处）必须还原成真字符，
// 否则会被二次转义成 &amp;gt;，浏览器显示字面的 "&gt;"。
{
  const cases = [
    ['<code>ε &gt; 0</code>', '&gt;', '&amp;gt;', '大于号实体'],
    ['<code>a &lt; b</code>', '&lt;', '&amp;lt;', '小于号实体'],
    ['<code>0 &lt; x &lt; 1</code>', '&lt;', '&amp;lt;', '连续小于号'],
    ['x &gt; 0 且 y &lt; 1', '&gt;', '&amp;gt;', '实体在 code 标签外'],
  ];
  for (const [src, good, bad, label] of cases) {
    const out = richInline(src);
    check(`${label}：单次转义为 ${good}`, out.includes(good) && !out.includes(bad), `${src} → ${out}`);
  }

  // 解码步骤不能破坏白名单标签的还原
  check('实体解码后 <b> 仍是加粗标签',
    richInline('<b>重点</b>').includes('<b>重点</b>'));
  check('实体解码后 <code> 仍是行内代码',
    richInline('<code>f(x)</code> 在 <code>x=0</code>').includes('<code>f(x)</code>'));
  // 已知取舍：把 &lt;b&gt; 解码成 <b> 后，它会命中白名单而被当成加粗标签。
  // 这不是安全问题 —— 白名单只有 code/b/i/sup/sub/br/em/strong 这些无害标签，
  // 没有 script/img/iframe，不存在"用实体绕过转义注入脚本"的可能；
  // 而内容是项目自己维护的，实测 `&lt;b&gt;` 与 `&lt;code&gt;` 的写法出现 0 次。
  // 这里记录该行为，避免以后误以为它能显示字面量。
  check('&lt;b&gt; 会被当成加粗标签（已知取舍，见注释）',
    richInline('&lt;b&gt;x&lt;/b&gt;').includes('<b>'));
  check('用实体无法绕过白名单注入脚本',
    (() => {
      const out = richInline('&lt;script&gt;alert(1)&lt;/script&gt;');
      return !out.includes('<script');
    })());
  check('&amp;amp; 这类双重转义只解一层',
    richInline('&amp;amp;').includes('&amp;amp;'),
    richInline('&amp;amp;'));
}

console.log('\n══════ 3. 经完整渲染管线（含 HTML 转义） ══════\n');
const h = richInline('lim(x→0) <code>sin x / x</code> = 1');
console.log('  输入: lim(x→0) <code>sin x / x</code> = 1');
console.log('  输出: ' + h);
check('管线里 math-lim 标记被正确还原（不是 &lt;span）', h.includes('<span class="math-lim">'));
check('管线里保留了白名单 code 标签', h.includes('<code>sin x / x</code>'));

// 安全性：内容里混入恶意脚本必须被转义
const evil = richInline('lim(x→0) <script>alert(1)</script> <img src=x onerror=alert(1)>');
check('恶意 script 被转义（不产生真标签）', !evil.includes('<script>'), evil);
check('恶意 img 被转义（不产生真标签）', !evil.includes('<img'), evil);
check('尖括号被转义成实体', evil.includes('&lt;script&gt;'));

console.log('\n══════ 4. 全量回归（内容文件全部字段） ══════\n');

const files = [
  ...readdirSync('data/books').filter((f) => f.endsWith('.js')).map((f) => 'data/books/' + f),
  ...readdirSync('data/questions').filter((f) => f.endsWith('.js')).map((f) => 'data/questions/' + f),
];

globalThis.localStorage = {
  getItem: () => null, setItem() {}, removeItem() {}, clear() {},
  get length() { return 0; }, key: () => null,
};

let fieldCount = 0;
let leftoverParen = 0;
let leftoverSub = 0;
let unbalanced = 0;
let doubleEscaped = 0;
const leftoverSamples = [];

function walk(value, where) {
  // 收集所有字符串字段
  const strings = [];
  const collect = (v, path) => {
    if (typeof v === 'string') strings.push([path, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => collect(x, `${path}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) collect(x, `${path}.${k}`);
  };
  collect(value, where);

  for (const [path, s] of strings) {
    fieldCount += 1;
    const rendered = rich(s);

    // 1) 不应再有 "lim(" 这种抽象写法残留
    if (/lim\s*\([^)]*→/.test(rendered)) {
      leftoverParen += 1;
      if (leftoverSamples.length < 6) leftoverSamples.push(path + ' :: ' + s.slice(0, 70).replace(/\n/g, ' '));
    }
    // 2) 不应再有 lim<sub> 残留
    if (/lim\s*<sub>/.test(rendered)) {
      leftoverSub += 1;
      if (leftoverSamples.length < 6) leftoverSamples.push('[sub] ' + path + ' :: ' + s.slice(0, 70));
    }
    // 3) span 标签必须配平
    const open = (rendered.match(/<span/g) || []).length;
    const close = (rendered.match(/<\/span>/g) || []).length;
    if (open !== close) {
      unbalanced += 1;
      if (leftoverSamples.length < 6) leftoverSamples.push('[span 不配平 ' + open + '/' + close + '] ' + path);
    }
  }
}

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  // 直接对源文件做渲染，覆盖面比 import 更广（含所有字符串字面量）
  const strings = [...text.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\n/g, '\n').replace(/\\'/g, "'"));
  for (let i = 0; i < strings.length; i += 1) {
    const s = strings[i];
    if (s.length < 3) continue;
    const rendered = richInline(s);
    fieldCount += 1;
    if (/lim\s*\([^)]*→/.test(rendered)) {
      leftoverParen += 1;
      if (leftoverSamples.length < 8) leftoverSamples.push(f + '#' + i + ' :: ' + s.slice(0, 60).replace(/\n/g, ' '));
    }
    if (/lim\s*<sub>/.test(rendered)) {
      leftoverSub += 1;
      if (leftoverSamples.length < 8) leftoverSamples.push('[sub] ' + f + '#' + i);
    }
    const open = (rendered.match(/<span/g) || []).length;
    const close = (rendered.match(/<\/span>/g) || []).length;
    if (open !== close) {
      unbalanced += 1;
      if (leftoverSamples.length < 8) leftoverSamples.push('[span 不配平] ' + f + '#' + i);
    }
    // 关键：源文件里的 HTML 实体（&gt; / &lt;）渲染后不得出现双重转义 &amp;gt; / &amp;lt;
    if (/&amp;(?:gt|lt|quot|amp|#0*39|nbsp);/i.test(rendered)) {
      doubleEscaped += 1;
      if (leftoverSamples.length < 8) {
        leftoverSamples.push('[双重转义] ' + f + '#' + i + ' :: ' + s.slice(0, 60).replace(/\n/g, ' '));
      }
    }
  }
}

void walk;
console.log(`  扫描字符串字段: ${fieldCount} 个`);
console.log(`  残留 "lim(…→…)" 抽象写法: ${leftoverParen} 处`);
console.log(`  残留 "lim<sub>" 未转换: ${leftoverSub} 处`);
console.log(`  span 标签不配平: ${unbalanced} 处`);
console.log(`  HTML 实体双重转义（&amp;gt; 之类）: ${doubleEscaped} 处`);
if (leftoverSamples.length) {
  console.log('  样例：');
  for (const s of leftoverSamples) console.log('    ' + s);
}
check('没有残留的抽象极限写法', leftoverParen === 0, `${leftoverParen} 处`);
check('没有残留未转换的 lim<sub>', leftoverSub === 0, `${leftoverSub} 处`);
check('全部 span 标签配平', unbalanced === 0, `${unbalanced} 处`);
check('没有 HTML 实体被双重转义', doubleEscaped === 0, `${doubleEscaped} 处`);

console.log('\n══════ 结果 ══════');
console.log(failed === 0 ? `  全部通过（单元用例 + 全量回归）\n` : `  ${failed} 项失败\n`);
process.exit(failed ? 1 : 0);
