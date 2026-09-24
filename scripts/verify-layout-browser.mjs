/**
 * verify-layout-browser.mjs —— 真正开浏览器量像素的移动端布局校验（可选，不进 CI）
 *
 * 为什么单独一个文件：脚本要启动本机浏览器（Firefox 或 Chromium 内核的 Chrome/Edge），
 * 这既不是零依赖、也不是每个 runner 都有。与其在 CI 里"找不到浏览器就跳过"
 * （那等于没测，还会给人虚假的安心），不如把它拆成显式的开发期校验：
 * **找不到浏览器就报错退出**。
 *
 * 它要证明的事（都是 2026-09-24 那个手机端 bug 的直接症状）：
 *   1. 顶部那排图标（提醒 / 收藏 / 设置 / 主题）在每个宽度下都落在视口内
 *   2. 用 elementFromPoint 打在图标中心，命中的必须是图标自己 —— 而不是被别的元素盖住
 *   3. 窄屏时底部导航贴住**视口**底部（不是顶栏底部），宽屏时回到顶栏内部
 *   4. 底部导航与顶栏不重叠
 *
 * 用法：
 *   node scripts/verify-layout-browser.mjs
 *   node scripts/verify-layout-browser.mjs --keep   保留临时文件，便于排查
 */

import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const ROOT = path.resolve('.');
const PORT = Number(process.env.LAYOUT_PORT || 5199);
const KEEP = process.argv.includes('--keep');

/* ---------------- 找浏览器 ---------------- */
const CANDIDATES = [
  ['firefox', process.env.FIREFOX_PATH, 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'],
  ['firefox', null, '/usr/bin/firefox'],
  ['chromium', process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'],
  ['chromium', process.env.CHROME_PATH, 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'],
  ['chromium', null, '/usr/bin/chromium'],
  ['chromium', null, '/usr/bin/google-chrome'],
];

function findBrowser() {
  for (const [kind, envPath, guess] of CANDIDATES) {
    const p = envPath || guess;
    if (p && existsSync(p)) return { kind, path: p };
  }
  return null;
}

const browser = findBrowser();
console.log('\n══════════ 移动端布局浏览器校验 ══════════\n');
if (!browser) {
  console.error('  ✗ 找不到浏览器（Firefox 或 Chromium 内核）。');
  console.error('  这一步需要真实渲染引擎，属于可选的开发期校验，项目本身仍然零依赖。');
  console.error('  可用 FIREFOX_PATH / CHROME_PATH 环境变量指定浏览器路径。');
  console.error('  CI 里跑的是不依赖浏览器的 scripts/test-layout.mjs。\n');
  process.exit(2);
}
console.log(`  浏览器：${browser.kind}  ${browser.path}\n`);

/* ---------------- 临时目录与静态服务器 ---------------- */
const tmp = await mkdtemp(path.join(os.tmpdir(), 'dsh-layout-'));
const diagPath = path.join(tmp, 'diag.html');
const shotPath = path.join(tmp, 'shot.png');
const resultPath = path.join(tmp, 'result.txt');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  // 把父文档的 load 事件往后推，好让截图/取数等到脚本跑完
  if (req.url.startsWith('/__slow')) {
    await new Promise((r) => setTimeout(r, 4000));
    res.writeHead(200, { 'content-type': 'image/gif' });
    res.end(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
    return;
  }
  if (req.method === 'POST' && req.url === '/__result') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    await writeFile(resultPath, Buffer.concat(chunks));
    res.writeHead(204).end();
    return;
  }
  if (req.url.startsWith('/__diag.html')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(await readFile(diagPath));
    return;
  }
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(ROOT, rel === '/' ? '/index.html' : rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const buf = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
  }
});
await new Promise((resolve, reject) => {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`  ✗ 端口 ${PORT} 被占用。用 LAYOUT_PORT=别的端口 再试。\n`);
      process.exit(2);
    }
    reject(err);
  });
  server.listen(PORT, '127.0.0.1', resolve);
});
console.log(`  临时服务器：http://127.0.0.1:${PORT}`);

/* ---------------- 注入到被测页面里执行的探针 ---------------- */
const WIDTHS = [320, 375, 390, 414, 430, 768, 860, 861, 1024, 1440];

await writeFile(diagPath, `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>layout</title>
<style>body{margin:0;font:12px/1.4 monospace}#log{padding:8px;white-space:pre-wrap}</style></head><body>
<div id="log">…</div>
<img src="/__slow" width="1" height="1" alt="" style="position:absolute;left:-9999px">
<script>
const WIDTHS = ${JSON.stringify(WIDTHS)};
const frame = document.createElement('iframe');
frame.style.cssText = 'width:390px;height:844px;border:0;position:absolute;left:-9999px;top:0';
document.body.appendChild(frame);
frame.src = '/index.html';
let ticks = 0;
const timer = setInterval(() => {
  ticks += 1;
  const d = frame.contentDocument;
  const ready = d && d.querySelector('#btn-data .ico svg') && d.querySelector('#main').children.length > 0;
  if (ready || ticks > 80) { clearInterval(timer); setTimeout(run, 300); }
}, 100);

async function run() {
  const doc = frame.contentDocument, win = frame.contentWindow;
  const q = (s) => doc.querySelector(s);
  const rows = [];
  for (const w of WIDTHS) {
    frame.style.width = w + 'px';
    await new Promise((r) => setTimeout(r, 250));
    const nav = q('.mainnav'), navCs = win.getComputedStyle(nav), navR = nav.getBoundingClientRect();
    const topR = q('.topbar').getBoundingClientRect();
    const taR = q('.topbar-actions').getBoundingClientRect();
    const icons = [];
    for (const id of ['#btn-remind', '#btn-favorites', '#btn-data', '#btn-theme']) {
      const el = q(id), r = el.getBoundingClientRect();
      const inView = r.top >= 0 && r.left >= 0 && r.bottom <= win.innerHeight && r.right <= win.innerWidth;
      const hit = doc.elementFromPoint(Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2));
      const hittable = !!hit && (hit === el || el.contains(hit));
      icons.push({ id, inView, hittable, w: Math.round(r.width), h: Math.round(r.height),
                   hitTag: hit ? (hit.tagName + (hit.id ? '#' + hit.id : '') + (typeof hit.className === 'string' && hit.className ? '.' + hit.className : '')) : 'null' });
    }
    const navAtViewportBottom = Math.abs(navR.bottom - win.innerHeight) < 2;
    const navInsideTopbar = navR.top >= topR.top - 1 && navR.bottom <= topR.bottom + 1;
    rows.push({
      w, vw: win.innerWidth,
      navPosition: navCs.position,
      navTop: Math.round(navR.top), navBottom: Math.round(navR.bottom),
      navAtViewportBottom, navInsideTopbar,
      overlapsTopbar: navR.top < topR.bottom - 1 && navR.bottom > topR.top + 1,
      rightGap: Math.round(win.innerWidth - taR.right),
      icons,
      pageOpacity: win.getComputedStyle(q('#main .page') || q('#main')).opacity,
    });
  }
  const text = JSON.stringify({ rows }, null, 1);
  document.getElementById('log').textContent = text;
  fetch('/__result', { method: 'POST', body: text }).catch(() => {});
}
<\/script></body></html>`, 'utf8');

/* ---------------- 启动浏览器 ---------------- */
const url = `http://127.0.0.1:${PORT}/__diag.html`;
const args = browser.kind === 'firefox'
  ? ['--headless', '--no-remote', '-profile', path.join(tmp, 'profile'),
     '--window-size=700,900', '--screenshot', shotPath, url]
  : ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
     `--user-data-dir=${path.join(tmp, 'profile')}`, '--window-size=700,900',
     '--virtual-time-budget=20000', `--screenshot=${shotPath}`, url];

console.log('  正在渲染…');
const child = spawn(browser.path, args, { stdio: 'ignore' });
const code = await new Promise((r) => child.on('exit', r));
if (code !== 0) console.log(`  （浏览器退出码 ${code}）`);

/* ---------------- 读结果 ---------------- */
await new Promise((r) => setTimeout(r, 1200));
let data = null;
try {
  data = JSON.parse(await readFile(resultPath, 'utf8'));
} catch {
  console.error('  ✗ 没能拿到浏览器回传的结果。');
  console.error(`    可控排查：--keep 保留临时目录；截图在 ${shotPath}`);
  await new Promise((r) => server.close(r));
  if (!KEEP) await rm(tmp, { recursive: true, force: true });
  process.exit(2);
}

/* ---------------- 断言 ---------------- */
let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

console.log('');
console.log('  宽度   底栏定位   底栏bottom  贴视口底  在顶栏内  与顶栏重叠  图标可点  毛玻璃层');
for (const r of data.rows) {
  const bad = r.icons.filter((i) => !i.inView || !i.hittable);
  const overlapCol = r.navPosition === 'fixed' ? (r.overlapsTopbar ? 'Y ← 有问题' : 'N') : '—(宽屏本就在顶栏内)';
  console.log(`  ${String(r.w).padEnd(6)} ${r.navPosition.padEnd(9)} ${String(r.navBottom).padEnd(11)} `
    + `${(r.navPosition === 'fixed' ? (r.navAtViewportBottom ? 'Y' : 'n') : '—').padEnd(9)} `
    + `${(r.navInsideTopbar ? 'Y' : 'n').padEnd(9)} `
    + `${overlapCol.padEnd(11)} ${(bad.length ? 'n ' + bad.map((i) => i.id + '被' + i.hitTag + '挡住').join(',') : 'Y').padEnd(9)} `
    + `${r.pageOpacity}`);
}

console.log('');
console.log('【断言】');
for (const r of data.rows) {
  const narrow = r.navPosition === 'fixed';
  const bad = r.icons.filter((i) => !i.inView || !i.hittable);
  check(`w=${r.w}：四个图标都在视口内且未被遮挡`, bad.length === 0,
    bad.map((i) => `${i.id} 中心点被 ${i.hitTag} 接住`).join('；'));
  if (narrow) {
    check(`w=${r.w}：底栏贴住视口底部（bottom=${r.navBottom}，视口高 ${844}）`, r.navAtViewportBottom);
    // 只有窄屏时底栏才脱离了顶栏、fixed 到视口上，这时"不许压住顶栏"才是有意义的断言
    check(`w=${r.w}：底栏不与顶栏重叠`, !r.overlapsTopbar,
      `底栏 top=${r.navTop} bottom=${r.navBottom}`);
  } else {
    check(`w=${r.w}：宽屏下底栏回到顶栏内部（top=${r.navTop} bottom=${r.navBottom}）`, r.navInsideTopbar);
  }
}

console.log('');
console.log(failed === 0 ? '  全部通过 ✅\n' : `  ${failed} 项失败 ❌\n`);

await new Promise((r) => server.close(r));
if (KEEP) console.log(`  临时文件保留在：${tmp}\n`);
else await rm(tmp, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
