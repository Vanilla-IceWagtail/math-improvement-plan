/**
 * test-layout.mjs —— 移动端布局的静态回归测试（零依赖，CI 里跑）
 *
 * 为什么需要它：2026-09-24 线上出现过一个只在手机端复现的严重 bug ——
 * 顶部那排图标（提醒 / 收藏 / 设置 / 主题）在手机上完全看不到、点不到。
 *
 * 根因是 CSS 规范里一个很隐蔽的规则：
 *   **元素只要有 backdrop-filter（或 filter / perspective / transform /
 *   will-change / contain），就会成为它所有后代的包含块 —— position: fixed 的后代也不例外。**
 *
 * 而 .topbar 上有 `backdrop-filter: saturate(1.4) blur(12px)`，
 * 移动端的底部导航 .mainnav 又恰好是 .topbar 的子元素，并在窄屏下变成
 * `position: fixed; bottom: 0`。于是这个 bottom: 0 指的是"顶栏的底部"而不是
 * "视口的底部"，底栏被画到了屏幕顶端，正好盖住右上角那排图标。
 * 实测：.mainnav 的 y = -1（= 顶栏内边距盒高 61 − 自身高 62），
 *       #btn-data 中心点的 elementFromPoint 命中的是 BUTTON.navbtn。
 *
 * 桌面端完全正常，因为那时 .mainnav 是流内元素 —— 所以这个 bug 只在手机上出现。
 *
 * 本文件不启动浏览器，只做**结构性断言**：把"不能这么写"的规则固化成断言，
 * 让同样的错误改法在 CI 就被挡住。
 * 真正开浏览器量像素的验证在 scripts/verify-layout-browser.mjs（可选，不进 CI）。
 */

import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (p) => readFile(new URL(p, root), 'utf8');

const html = await read('index.html');
const css = await read('styles/app.css');

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

console.log('\n══════════ 移动端布局静态回归测试 ══════════\n');

/* ---------------- 0. 提取 CSS 规则 ---------------- */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** 把 CSS 切成 { selector, body, media } 列表（@media 内部的规则带 media 前缀） */
function parseRules(text) {
  const rules = [];
  let i = 0;
  const walk = (end, media) => {
    while (i < end) {
      const braceAt = text.indexOf('{', i);
      if (braceAt === -1 || braceAt >= end) break;
      // 选择器里要先去掉注释，否则 ".topbar" 前面会粘上一整段 /* ... */
      const selector = stripComments(text.slice(i, braceAt)).trim();
      let depth = 1;
      let j = braceAt + 1;
      while (j < end && depth > 0) {
        if (text[j] === '{') depth += 1;
        else if (text[j] === '}') depth -= 1;
        j += 1;
      }
      const body = text.slice(braceAt + 1, j - 1);
      if (selector.startsWith('@media')) {
        const save = i;
        i = braceAt + 1;
        walk(j - 1, selector);
        i = save;
        rules.push({ selector, body, media: null, isMedia: true });
      } else {
        rules.push({ selector, body, media });
      }
      i = j;
    }
  };
  walk(text.length, null);
  return rules;
}

const rules = parseRules(css);
console.log(`  （解析出 ${rules.length} 条 CSS 规则）`);
console.log('');

/* ---------------- 1. 前提：.mainnav 确实是 .topbar 的后代 ---------------- */
console.log('【前提：DOM 结构】');
const headerOpen = html.indexOf('<header class="topbar"');
const headerClose = html.indexOf('</header>', headerOpen);
const navAt = html.indexOf('class="mainnav"');
check('index.html 里能找到 .topbar 与 .mainnav', headerOpen !== -1 && navAt !== -1);
check('.mainnav 位于 .topbar 内部（这正是 bug 的前提）',
  headerOpen !== -1 && navAt > headerOpen && navAt < headerClose,
  '若把 .mainnav 移出 .topbar，本文件的这条断言与其后的推理都需要重新审视');

/* ---------------- 2. 核心：.mainnav 的祖先不得制造包含块 ---------------- */
console.log('\n【核心：祖先不得成为 fixed 后代的包含块】');
const CONTAINING_BLOCK_PROPS = ['backdrop-filter', 'filter', 'perspective', 'transform', 'will-change', 'contain'];
// html → body → header.topbar 是 .mainnav 的祖先链
const ANCESTORS = ['html', 'body', '.topbar'];

const offenders = [];
for (const r of rules) {
  if (r.isMedia) continue;
  const sels = r.selector.split(',').map((s) => s.trim());
  for (const anc of ANCESTORS) {
    if (!sels.includes(anc)) continue;
    const body = stripComments(r.body);
    for (const prop of CONTAINING_BLOCK_PROPS) {
      // 只匹配作为属性名出现（避免误伤 --x-transform 之类的自定义属性）
      const re = new RegExp(`(^|[;{\\s])${prop}\\s*:`, 'm');
      if (re.test(body)) offenders.push(`${r.selector} 里的 ${prop}`);
    }
  }
}
check(`.mainnav 的祖先（${ANCESTORS.join(' / ')}）都没有 backdrop-filter / filter / transform 等属性`,
  offenders.length === 0,
  offenders.length ? `发现：${offenders.join('；')} —— 这会让移动端底栏以顶栏为基准定位，跑到屏幕顶部盖住图标` : '');

/* ---------------- 3. 毛玻璃效果仍然保留（改由 ::before 承担） ---------------- */
console.log('\n【毛玻璃效果不能被顺手删掉】');
const beforeRule = rules.find((r) => !r.isMedia && r.selector.includes('.topbar::before'));
check('.topbar::before 存在', Boolean(beforeRule));
check('.topbar::before 承担了 backdrop-filter（顶栏的毛玻璃效果没丢）',
  Boolean(beforeRule && /backdrop-filter\s*:/.test(beforeRule.body)));
check('.topbar::before 绝对定位于顶栏之内（inset/position）',
  Boolean(beforeRule && /position\s*:\s*absolute/.test(beforeRule.body) && /inset\s*:/.test(beforeRule.body)));
check('.topbar::before 不拦截鼠标事件（pointer-events: none）',
  Boolean(beforeRule && /pointer-events\s*:\s*none/.test(beforeRule.body)));

/* ---------------- 4. 移动端的关键规则仍要在位 ---------------- */
console.log('\n【移动端（max-width: 860px）规则】');
const mobile = rules.filter((r) => !r.isMedia && r.media && r.media.includes('max-width: 860px'));
check('存在 max-width: 860px 的媒体查询', mobile.length > 0, `解析到 ${mobile.length} 条规则`);

const findInMobile = (sel) => mobile.find((r) => r.selector.split(',').map((s) => s.trim()).includes(sel));
const mainnavM = findInMobile('.mainnav');
check('媒体查询里 .mainnav 变成 position: fixed', Boolean(mainnavM && /position\s*:\s*fixed/.test(mainnavM.body)));
check('媒体查询里 .mainnav 贴住视口底部（bottom: 0 + left/right: 0）',
  Boolean(mainnavM && /bottom\s*:\s*0/.test(mainnavM.body) && /left\s*:\s*0/.test(mainnavM.body) && /right\s*:\s*0/.test(mainnavM.body)));

const actionsM = findInMobile('.topbar-actions');
check('媒体查询里 .topbar-actions 自己靠右（margin-left: auto）',
  Boolean(actionsM && /margin-left\s*:\s*auto/.test(actionsM.body)),
  '.mainnav 一走开，就没有任何人把图标推到右边了');

/* ---------------- 5. iPhone 刘海安全区 ---------------- */
console.log('\n【iPhone 刘海 / 灵动岛安全区】');
const topbarRule = rules.find((r) => !r.isMedia && r.selector.trim() === '.topbar');
const topbarM = findInMobile('.topbar');
check('index.html 声明了 viewport-fit=cover', /viewport-fit=cover/.test(html));
check('.topbar 的高度给 safe-area-inset-top 留了位置',
  Boolean(topbarRule && /env\(\s*safe-area-inset-top/.test(topbarRule.body)),
  '不然在刘海屏上顶栏会被状态栏压住');
check('.topbar 的 padding 也保留了 safe-area-inset-top',
  Boolean(topbarRule && /padding\s*:[^;]*env\(\s*safe-area-inset-top/.test(topbarRule.body)));
check('移动端 .topbar 覆盖 padding 时没有把 safe-area-inset-top 冲掉',
  Boolean(topbarM && /env\(\s*safe-area-inset-top/.test(topbarM.body)),
  '写成 padding: 0 var(--sp-3) 会把上边距的安全区抹掉');

/* ---------------- 6. 设置入口确实接着处理器 ---------------- */
console.log('\n【设置入口的接线】');
const appJs = await read('js/app.js');
const dataBtnTag = html.match(/<button\b[^>]*id="btn-data"[^>]*>/);
check('index.html 里有 #btn-data（设置按钮）', Boolean(dataBtnTag));
check('js/app.js 里给 #btn-data 绑定了点击处理',
  /getElementById\(\s*['"]btn-data['"]\s*\)\s*\.addEventListener/.test(appJs));
check('#btn-data 自身没有 hidden 属性（不会在窄屏被藏起来）',
  Boolean(dataBtnTag) && !/\bhidden\b/.test(dataBtnTag[0]),
  dataBtnTag ? dataBtnTag[0] : '');

/* ---------------- 7. 「推荐的免费数学资源」在手机上要能被找到 ----------------
   2026-09-24 的第二轮反馈：修好顶栏之后能进设置了，但**找不到网站推荐**。
   实测（Firefox 无头，390×844）当时的数据：
     设置面板内容高 2057px、可视 741px
     「题库导入 / 分享」标题 y=1099、「打开导入 / 导出面板」按钮 y=1263
     —— 按钮在首屏下方 522px 处，得滚 1.5 屏才看得到。
   于是做了三件事，这里把它们固化下来。 */
console.log('\n【推荐资源在手机上要能找到】');
const bankImport = await read('js/views/bank-import.js');

check('设置面板把「题库导入 / 分享 / 找题资源」放在「学习数据」之前（首屏可见）',
  appJs.includes('题库导入 / 分享 / 找题资源')
  && appJs.indexOf('题库导入 / 分享 / 找题资源') < appJs.indexOf('<h2>学习数据</h2>'),
  '排在「学习数据」之后的话，6 张统计卡会把它顶到两屏之外');

check('设置面板有直达推荐资源的按钮（data-act="open-resources"）',
  /data-act="open-resources"/.test(appJs));
check('该按钮的点击处理会带着 focus 打开导入面板',
  /open-resources[\s\S]{0,300}openBankImport\(\s*\{\s*focus:\s*['"]#rec-sites['"]/.test(appJs),
  '不跳转的话，推荐区在面板中部，用户仍然容易以为"没有网站推荐"');

check('导入面板给推荐区加了可定位的锚点 id="rec-sites"', /id="rec-sites"/.test(bankImport));
check('openBankImport 支持 focus 选项并自行设置 scrollTop',
  /export function openBankImport\(\s*opts\s*=\s*\{\}\s*\)/.test(bankImport)
  && /modal\.scrollTop\s*=/.test(bankImport),
  '用 scrollTop 自己算偏移，而不是 scrollIntoView（后者会把整页一起滚）');

check('移动端把 .grid-3 排成两列（统计卡不再堆成一列白占一屏）',
  Boolean(findInMobile('.grid-3') && /minmax\(\s*\d{3}px/.test(findInMobile('.grid-3').body)
    && /minmax\(\s*(1[0-9][0-9])px/.test(findInMobile('.grid-3').body)),
  '默认 minmax(220px, 1fr) 在 ~318px 内容宽下只排得下一列，6 张卡白占约 540px');

/* ---------------- 汇总 ---------------- */
console.log('');
console.log(failed === 0 ? '  全部通过 ✅' : `  ${failed} 项失败 ❌`);
console.log('  说明：本文件只做结构与规则断言，不渲染页面。');
console.log('  真正开浏览器量像素的验证：node scripts/verify-layout-browser.mjs（需本机有 Firefox / Chrome）\n');
process.exit(failed ? 1 : 0);
