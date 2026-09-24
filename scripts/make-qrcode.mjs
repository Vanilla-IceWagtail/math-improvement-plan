// 生成二维码图片：纯二维码 PNG（聊天分享）+ 带版本标注的 SVG / PNG（打印张贴）
//
// 依赖说明：二维码矩阵由 qrcode 库（装在系统临时目录）生成；
// PNG 由本仓库自带的 scripts/lib/png.mjs 编码，字体用 scripts/lib/bitmap-font.mjs。
// 项目本身仍然是零依赖 —— 临时目录用完即删。
//
// 用法：
//   node scripts/make-qrcode.mjs                生成全部素材
//   node scripts/make-qrcode.mjs --dump-font    只打印字模供人工核对
//   node scripts/make-qrcode.mjs --verify       只反解已有 PNG，验证能扫出正确网址

import { pathToFileURL } from 'node:url';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createBitmap, fillRect, encodePng } from './lib/png.mjs';
import { drawText, textWidth } from './lib/bitmap-font.mjs';

const URL_TO_SHARE = 'https://vanilla-icewagtail.github.io/math-improvement-plan/';

// 版本号从 package.json 读取（而不是硬编码），避免发版后二维码标注与版本脱节。
// 可用 QR_VERSION 环境变量临时覆盖。
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const VERSION = process.env.QR_VERSION || `v${pkg.version}`;
const TAGLINE = 'GROUPED PRACTICE / MISTAKE BOOK / TEXTBOOK PROOFS';
const DATE = process.env.QR_DATE || new Date().toISOString().slice(0, 10);

const TMP_MODULES = path.join(process.env.TEMP, 'dsh-qr2', 'node_modules');
const OUT = path.resolve('share');

const args = process.argv.slice(2);

async function loadQR() {
  const p = path.join(TMP_MODULES, 'qrcode', 'lib', 'index.js');
  try {
    return (await import(pathToFileURL(p).href)).default;
  } catch {
    console.error('  找不到 qrcode 库。请先在临时目录安装：');
    console.error(`    cd "${path.join(process.env.TEMP, 'dsh-qr2')}" && npm install qrcode jsqr pngjs`);
    process.exit(1);
  }
}

/* ---------------- 只打印字模 ---------------- */
if (args.includes('--dump-font')) {
  const { dumpFont } = await import('./lib/bitmap-font.mjs');
  dumpFont();
  process.exit(0);
}

/* ---------------- 只反解已有 PNG ---------------- */
if (args.includes('--verify')) {
  const jsQR = (await import(pathToFileURL(path.join(TMP_MODULES, 'jsqr/dist/jsQR.js')).href)).default;
  const { PNG } = await import(pathToFileURL(path.join(TMP_MODULES, 'pngjs/lib/png.js')).href);
  let bad = 0;
  for (const f of ['share-qrcode.png', `share-qrcode-${VERSION}.png`]) {
    try {
      const png = PNG.sync.read(await readFile(path.join(OUT, f)));
      const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      const ok = res && res.data === URL_TO_SHARE;
      if (!ok) bad += 1;
      console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${f}  ${png.width}x${png.height}  ->  ${res ? res.data : '(无法解码)'}`);
    } catch (err) {
      bad += 1;
      console.log(`  FAIL ${f}  ${err.message}`);
    }
  }
  console.log(bad === 0 ? '\n  两张 PNG 都能扫出正确网址 ✅' : `\n  有 ${bad} 张不合格`);
  process.exit(bad ? 1 : 0);
}

/* ---------------- 生成全部素材 ---------------- */
const QR = await loadQR();
await mkdir(OUT, { recursive: true });

const qrOpts = { errorCorrectionLevel: 'M', margin: 1, color: { dark: '#0f172a', light: '#FFFFFF' } };

// 1) 纯二维码 SVG
const svgPlain = await QR.toString(URL_TO_SHARE, { ...qrOpts, type: 'svg', width: 512 });
await writeFile(path.join(OUT, 'share-qrcode.svg'), svgPlain, 'utf8');

// 2) 纯二维码 PNG（1024px，聊天软件里直接发）
const qrPng = await QR.toBuffer(URL_TO_SHARE, { ...qrOpts, type: 'png', width: 1024, margin: 4 });
await writeFile(path.join(OUT, 'share-qrcode.png'), qrPng);

// 3) 取二维码矩阵，自己画一张带版本标注的 PNG
//    （无头浏览器在本机沙箱里起不来，所以 PNG 由仓库自带的编码器生成）
const qrData = QR.create(URL_TO_SHARE, { errorCorrectionLevel: 'M' });
const modules = qrData.modules;
const count = modules.size;
const QUIET = 4;
const SCALE = 12;                       // 每个模块 12px
const QR_SIDE = (count + QUIET * 2) * SCALE;

const PAD = 36;
const LINE1_H = 60;   // 标题
const LINE2_H = 44;   // 版本
const LINE3_H = 36;   // 副标题
const LINE4_H = 40;   // 日期
const CAPTION_H = LINE1_H + LINE2_H + LINE3_H + LINE4_H + 26;

const W = QR_SIDE + PAD * 2;
const H = QR_SIDE + CAPTION_H + PAD * 2;

const bmp = createBitmap(W, H); // 默认全白（0）

// 画二维码：modules.get(row, col) 为 true 表示黑块
for (let r = 0; r < count; r += 1) {
  for (let c = 0; c < count; c += 1) {
    if (!modules.get(r, c)) continue;
    fillRect(bmp, PAD + (c + QUIET) * SCALE, PAD + (r + QUIET) * SCALE, SCALE, SCALE);
  }
}

// 画标注文字（5x7 点阵，居中）
let y = PAD + QR_SIDE + 26;
const t1 = 'MATH TRAINER';
drawText(bmp, t1, Math.round((W - textWidth(t1, 4)) / 2), y, 4);
y += LINE1_H;
const t2 = VERSION;
drawText(bmp, t2, Math.round((W - textWidth(t2, 4)) / 2), y, 4);
y += LINE2_H;
const t3 = TAGLINE;
drawText(bmp, t3, Math.round((W - textWidth(t3, 1)) / 2), y, 1);
y += LINE3_H;
const t4 = `GENERATED ${DATE}`;
drawText(bmp, t4, Math.round((W - textWidth(t4, 1)) / 2), y, 1);

const labelledPng = encodePng(bmp);
await writeFile(path.join(OUT, `share-qrcode-${VERSION}.png`), labelledPng);

// 4) 带版本标注的 SVG（矢量，含中文，适合打印张贴）
const inner = svgPlain
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');
const SW = 720;
const SQ = 560;
const ST = SQ + 26;
const SH = ST + 214;
const labelledSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">
  <rect width="${SW}" height="${SH}" fill="#FFFFFF"/>
  <g transform="translate(${(SW - SQ) / 2}, 0) scale(${(SQ / 512).toFixed(4)})">${inner}</g>
  <text x="${SW / 2}" y="${ST + 46}" text-anchor="middle" font-family="'Microsoft YaHei','PingFang SC',sans-serif" font-size="40" font-weight="700" fill="#0f172a">数学陪练 · 开源数学自学网站</text>
  <text x="${SW / 2}" y="${ST + 94}" text-anchor="middle" font-family="'Microsoft YaHei','PingFang SC',sans-serif" font-size="26" fill="#0f766e">${VERSION} · 组题组 · 错题本 · 教材定理定义</text>
  <text x="${SW / 2}" y="${ST + 138}" text-anchor="middle" font-family="Consolas,Menlo,monospace" font-size="19" fill="#55637a">vanilla-icewagtail.github.io/math-improvement-plan</text>
  <text x="${SW / 2}" y="${ST + 172}" text-anchor="middle" font-family="'Microsoft YaHei','PingFang SC',sans-serif" font-size="18" fill="#8a97ab">扫码即用，无需注册；也可在题库网站上导出题目后导入</text>
  <text x="${SW / 2}" y="${ST + 200}" text-anchor="middle" font-family="'Microsoft YaHei','PingFang SC',sans-serif" font-size="15" fill="#b0b9c6">生成于 ${DATE}</text>
</svg>
`;
await writeFile(path.join(OUT, `share-qrcode-${VERSION}.svg`), labelledSvg, 'utf8');

console.log('  URL      :', URL_TO_SHARE);
console.log('  版本     :', VERSION);
console.log('  已生成   :');
console.log(`    share/share-qrcode.png            纯二维码 1024px（聊天分享）`);
console.log(`    share/share-qrcode.svg            纯二维码 矢量`);
console.log(`    share/share-qrcode-${VERSION}.png  带版本标注 ${W}x${H}（可直接发/打印）`);
console.log(`    share/share-qrcode-${VERSION}.svg  带版本标注 矢量（含中文，打印更清晰）`);
console.log('');
console.log('  提示：生成后请跑一次验证：node scripts/make-qrcode.mjs --verify');
