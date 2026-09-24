/**
 * test-qrcode.mjs —— 二维码素材测试
 *
 * 为什么值得测：二维码是"发出去就收不回"的东西。生成一个扫不出来的码，
 * 或者把版本号写错，用户不会发现，只会疑惑为什么朋友说扫不了。
 * 所以每次重新生成后都该跑一遍：
 *   1. share/ 下该有的文件都在，且不是空壳
 *   2. 用真实解码器把 PNG 反解，必须得到**完全一致**的目标网址
 *   3. SVG 里必须内嵌二维码路径（不能只有文字标注）
 *   4. 带版本标注的那份，版本号必须与 package.json 一致
 *   5. PNG 编码器自检：自己写进去的位图能被解码器还原（编码正确性）
 *
 * 依赖：qrcode / jsqr / pngjs 装在系统临时目录（scripts/make-qrcode.mjs 会用到）。
 * 缺少依赖时本测试会**跳过**解码部分并明确说明，不会伪装成通过。
 */

import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url);
const SHARE = new URL('../share/', import.meta.url);
const TMP = path.join(process.env.TEMP, 'dsh-qr2', 'node_modules');

const URL_EXPECTED = 'https://vanilla-icewagtail.github.io/math-improvement-plan/';

let failed = 0;
let skipped = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};
const skip = (name, why) => {
  skipped += 1;
  console.log(`  SKIP ${name}  → ${why}`);
};

/* ---------------- 1. 文件齐备 ---------------- */
console.log('\n══════════ 二维码素材测试 ══════════\n');
console.log('【文件齐备】');

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const version = `v${pkg.version}`;

const files = await readdir(SHARE).catch(() => []);
const required = [
  'share-qrcode.png',
  'share-qrcode.svg',
  `share-qrcode-${version}.png`,
  `share-qrcode-${version}.svg`,
  'README.md',
];
for (const f of required) {
  const st = files.includes(f);
  check(`存在 ${f}`, st);
}

const readShare = (f) => readFile(new URL(f, SHARE)).catch(() => null);

const pngPlain = await readShare('share-qrcode.png');
const pngLabelled = await readShare(`share-qrcode-${version}.png`);
const svgPlain = await readShare('share-qrcode.svg');
const svgLabelled = await readShare(`share-qrcode-${version}.svg`);

check('纯二维码 PNG 不是空文件', pngPlain && pngPlain.length > 1000, pngPlain ? pngPlain.length + ' 字节' : '缺失');
check('带标注 PNG 不是空文件', pngLabelled && pngLabelled.length > 1000, pngLabelled ? pngLabelled.length + ' 字节' : '缺失');
check('PNG 文件头正确（89 50 4E 47）',
  pngPlain && pngPlain[0] === 0x89 && pngPlain[1] === 0x50 && pngPlain[2] === 0x4e && pngPlain[3] === 0x47);

/* ---------------- 2. SVG 内容 ---------------- */
console.log('\n【SVG 内容】');
if (svgPlain && svgLabelled) {
  const s1 = svgPlain.toString('utf8');
  const s2 = svgLabelled.toString('utf8');
  check('纯二维码 SVG 里有二维码路径', /<path|<rect/.test(s1) && s1.includes('<svg'));
  check('带标注 SVG 里有二维码路径', /<path|<rect/.test(s2));
  check(`带标注 SVG 里写明了版本 ${version}`, s2.includes(version), '');
  check('带标注 SVG 里含目标网址域名', s2.includes('vanilla-icewagtail.github.io'));
  check('SVG 是 UTF-8（中文标注不乱码）', s2.includes('数学陪练') || s2.includes('组题组'));
} else {
  skip('SVG 内容检查', '文件缺失');
}

/* ---------------- 3. 用真实解码器反解 PNG ---------------- */
console.log('\n【解码验证（二维码必须真能扫出正确网址）】');

let jsQR = null;
let PNG = null;
try {
  jsQR = (await import(pathToFileURL(path.join(TMP, 'jsqr/dist/jsQR.js')).href)).default;
  PNG = (await import(pathToFileURL(path.join(TMP, 'pngjs/lib/png.js')).href)).PNG;
} catch {
  jsQR = null;
}

if (!jsQR || !PNG) {
  skip('反解 PNG', `缺少解码依赖，请先 cd "${path.dirname(TMP)}" && npm install qrcode jsqr pngjs`);
} else {
  for (const [label, buf] of [['纯二维码 PNG', pngPlain], ['带版本标注 PNG', pngLabelled]]) {
    if (!buf) { skip(`反解 ${label}`, '文件缺失'); continue; }
    try {
      const png = PNG.sync.read(buf);
      const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      const ok = res && res.data === URL_EXPECTED;
      check(`${label} 能扫出正确网址（${png.width}x${png.height}）`, ok, res ? `扫出的是 "${res.data}"` : '解码失败');
    } catch (err) {
      check(`反解 ${label}`, false, String(err.message).split('\n')[0]);
    }
  }

  // 编码器自检：自己写进去的图案能被解回来
  const { createBitmap, fillRect, encodePng } = await import('./lib/png.mjs');
  const bmp = createBitmap(64, 64);
  fillRect(bmp, 8, 8, 16, 16);
  fillRect(bmp, 40, 40, 16, 16);
  const round = PNG.sync.read(encodePng(bmp));
  const pixel = (x, y) => round.data[(y * round.width + x) * 4];
  check('自研 PNG 编码器往返正确（黑块仍是黑）', pixel(10, 10) === 0 && pixel(45, 45) === 0);
  check('自研 PNG 编码器往返正确（白底仍是白）', pixel(30, 30) === 255 && pixel(2, 2) === 255);
  check('自研 PNG 编码器尺寸正确', round.width === 64 && round.height === 64);
}

/* ---------------- 4. 文档与版本一致 ---------------- */
console.log('\n【文档一致性】');
const shareReadme = await readFile(new URL('../share/README.md', import.meta.url), 'utf8').catch(() => '');
check('share/README.md 写明了网址', shareReadme.includes(URL_EXPECTED), '');
check('share/README.md 说明了重新生成的命令', shareReadme.includes('make-qrcode.mjs'), '');
check('share/README.md 提到版本标注的文件名', shareReadme.includes(`share-qrcode-${version}`), '');

/* ---------------- 汇总 ---------------- */
const total = failed + skipped + (failed === 0 && skipped === 0 ? 1 : 0);
void total;
console.log('');
if (skipped) console.log(`  注意：有 ${skipped} 项被跳过（缺依赖），解码未真正验证。`);
console.log(failed === 0 ? '  全部通过 ✅\n' : `  ${failed} 项失败\n`);
process.exit(failed ? 1 : 0);
