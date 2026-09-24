/**
 * verify-qrcode-decode.mjs —— 二维码**深度**校验：真的用解码器扫一遍
 *
 * 为什么单独一个文件、不放进 npm run check / CI：
 *   这一步需要 jsqr 与 pngjs 两个第三方包，而本项目是零依赖的。
 *   与其在 CI 里"缺依赖就静默跳过"（那等于没测，还会给人虚假的安心），
 *   不如把它拆成显式的开发期校验：**缺依赖就大声报错退出**。
 *
 * 检查内容：
 *   1. share-qrcode.png                  —— 解码，检查字符串与网址逐字符一致
 *   2. share-qrcode-<版本>.png            —— 同上（这张下面还画了文字标注）
 *   3. share-qrcode.svg                  —— 解析矢量路径还原成位图后再解码
 *   4. share-qrcode-<版本>.svg            —— 同上（二维码被 <g transform> 包了一层）
 *
 * 用法：
 *   node scripts/verify-qrcode-decode.mjs
 *   node scripts/make-qrcode.mjs --verify        （等价，转发到这里）
 *
 * 依赖怎么装（不会污染项目 —— 装完项目依然零依赖）：
 *   项目外任意目录，例如系统临时目录：
 *     cd "%TEMP%\dsh-qr2"      && npm install qrcode jsqr pngjs     # Windows
 *     cd "$TMPDIR/dsh-qr2"     && npm install qrcode jsqr pngjs     # Linux / macOS
 *   或者用 QR_MODULES 环境变量直接指定那个 node_modules 的路径。
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { createBitmap, fillRect, encodePng } from './lib/png.mjs';

const URL_EXPECTED = 'https://vanilla-icewagtail.github.io/math-improvement-plan/';
const SHARE = new URL('../share/', import.meta.url);

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const VERSION = `v${pkg.version}`;

// 跨平台解析临时目录：Windows 是 TEMP，Linux/macOS 是 TMPDIR。
// （这里曾经写死 process.env.TEMP，在 Linux 上 path.join(undefined) 直接抛错，
//   把 CI 整个搞挂了 —— 见 CHANGELOG。用 os.tmpdir() 一次解决。）
const TMP_ROOT = process.env.QR_TMP || path.join(os.tmpdir(), 'dsh-qr2');
const TMP_MODULES = process.env.QR_MODULES || path.join(TMP_ROOT, 'node_modules');

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

console.log('\n══════════ 二维码深度校验（用解码器反解）══════════\n');
console.log(`  解码依赖目录：${TMP_MODULES}\n`);

/* ---------------- 加载解码依赖（缺了就报错，不静默跳过） ---------------- */
async function loadDep(name, relPath) {
  const p = path.join(TMP_MODULES, relPath);
  try {
    return await import(pathToFileURL(p).href);
  } catch (err) {
    console.error(`  ✗ 加载不了 ${name}（${p}）`);
    console.error(`    ${String(err.message).split('\n')[0]}`);
    console.error('');
    console.error('  这一步是需要第三方解码器的开发期校验，项目本身仍然零依赖。');
    console.error('  请先装依赖（装在项目外，不会污染仓库）：');
    console.error(`    cd "${TMP_ROOT}" && npm install qrcode jsqr pngjs`);
    console.error('  或用 QR_MODULES=<那个 node_modules 的路径> 指定别处。');
    console.error('');
    process.exit(2);
  }
}

const jsQR = (await loadDep('jsqr', 'jsqr/dist/jsQR.js')).default;
const { PNG } = await loadDep('pngjs', 'pngjs/lib/png.js');

if (typeof jsQR !== 'function') {
  console.error('  ✗ jsqr 加载出来了但不是函数，依赖结构可能变了');
  process.exit(2);
}

/* ---------------- 1 & 2. 解码 PNG ---------------- */
console.log('【PNG 反解】');
const pngFiles = ['share-qrcode.png', `share-qrcode-${VERSION}.png`];
for (const f of pngFiles) {
  let buf;
  try {
    buf = await readFile(new URL(f, SHARE));
  } catch {
    check(`${f} 存在`, false, '文件缺失，先跑 node scripts/make-qrcode.mjs');
    continue;
  }
  try {
    const img = PNG.sync.read(buf);
    const res = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    check(`${f} 能扫出正确网址（${img.width}x${img.height}）`,
      Boolean(res) && res.data === URL_EXPECTED,
      res ? `扫出来的是 "${res.data}"` : '解码失败（图像里找不到二维码）');
  } catch (err) {
    check(`${f} 解码`, false, String(err.message).split('\n')[0]);
  }
}

/* ---------------- 3 & 4. 把 SVG 还原成位图再解码 ----------------
   qrcode 库输出的 SVG 是一串 "M x y h N m dx 0 h N ..." 的横线笔画，每个模块 1 个单位。
   我们按同样的语义把它画回像素，就能真正验证矢量版的内容，
   而不是只检查"文件里有 <path> 就算过"。

   注意：带标注那份的 viewBox 是最终像素画布（720x770），不是模块坐标系 ——
   所以模块数不能从 viewBox 推，必须从线段本身的坐标推。 */
console.log('\n【SVG 反解（先把矢量路径还原成位图）】');

/** 把 SVG 里所有描边路径解析成横线段 [{x, y, len}]（路径坐标单位） */
function svgSegments(svg) {
  const segs = [];
  const pathRe = /<path\b([^>]*?)\/?>/g;
  let m;
  while ((m = pathRe.exec(svg))) {
    const attrs = m[1];
    if (!/\bstroke=/.test(attrs)) continue; // 只有描边路径画的是黑模块
    const d = /\bd="([^"]+)"/.exec(attrs);
    if (!d) continue;

    const rowRe = /M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)([^M]*)/g;
    let row;
    while ((row = rowRe.exec(d[1]))) {
      let x = parseFloat(row[1]);
      const y = parseFloat(row[2]);
      const tokRe = /([hHmMvV])\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?/g;
      let t;
      while ((t = tokRe.exec(row[3]))) {
        const cmd = t[1];
        const v = parseFloat(t[2]);
        if (cmd === 'h' || cmd === 'H') {
          segs.push({ x: Math.min(x, x + v), y, len: Math.abs(v) });
          x += v; // ← 必须推进当前点，否则后续 m 的相对位移全错位
        } else if (cmd === 'm' || cmd === 'M') {
          x += v;
        } else {
          throw new Error(`SVG 里出现了没处理的笔画 "${cmd}"，还原逻辑需要补充`);
        }
      }
    }
  }
  if (!segs.length) throw new Error('SVG 里没找到描边路径');
  return segs;
}

/** 横线段 → 模块坐标集合，并推断出符号尺寸 */
function segmentsToModules(segs) {
  // 模块边长 = 相邻坐标的最小正差（本项目是 1；这样写也兼容被缩放过的情况）
  const uniq = (a) => [...new Set(a)].sort((p, q) => p - q);
  const xs = uniq(segs.map((s) => s.x));
  const ys = uniq(segs.map((s) => s.y));
  const gaps = [];
  for (const arr of [xs, ys]) {
    for (let i = 1; i < arr.length; i += 1) {
      const g = arr[i] - arr[i - 1];
      if (g > 1e-9) gaps.push(g);
    }
  }
  if (!gaps.length) throw new Error('推断不出模块边长');
  const pitch = Math.min(...gaps);

  const x0 = xs[0];
  const y0 = ys[0];
  const cells = new Set();
  let maxC = 0;
  let maxR = 0;
  for (const s of segs) {
    const r = Math.round((s.y - y0) / pitch);
    const c0 = Math.round((s.x - x0) / pitch);
    const n = Math.round(s.len / pitch);
    for (let i = 0; i < n; i += 1) {
      cells.add(`${c0 + i},${r}`);
      if (c0 + i > maxC) maxC = c0 + i;
      if (r > maxR) maxR = r;
    }
  }
  // 三个定位图案分别贴着左上/右上/左下角，所以黑模块的最外圈就是符号边界
  const count = Math.max(maxC, maxR) + 1;
  if (count < 21 || (count - 21) % 4 !== 0) {
    throw new Error(`推断出的符号尺寸 ${count} 不是合法的二维码尺寸（21 + 4k）`);
  }
  return { cells, count, pitch };
}

const matrices = new Map();
for (const f of ['share-qrcode.svg', `share-qrcode-${VERSION}.svg`]) {
  let svg;
  try {
    svg = await readFile(new URL(f, SHARE), 'utf8');
  } catch {
    check(`${f} 存在`, false, '文件缺失');
    continue;
  }
  try {
    const { cells, count } = segmentsToModules(svgSegments(svg));
    matrices.set(f, cells);

    // 画回位图：每模块 8px，静默区补到 4 个模块（QR 规范建议值）。
    // 补白不改变编码内容，所以不影响结论，只是让解码更稳。
    const SCALE = 8;
    const BORDER = 4;
    const side = (count + BORDER * 2) * SCALE;
    const bmp = createBitmap(side, side);
    for (const key of cells) {
      const [cx, cy] = key.split(',').map(Number);
      fillRect(bmp, (cx + BORDER) * SCALE, (cy + BORDER) * SCALE, SCALE, SCALE);
    }

    const img = PNG.sync.read(encodePng(bmp));
    const res = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
    check(`${f} 能扫出正确网址（${count}x${count} 符号，${cells.size} 个黑模块）`,
      Boolean(res) && res.data === URL_EXPECTED,
      res ? `扫出来的是 "${res.data}"` : '解码失败');
  } catch (err) {
    check(`${f} 反解`, false, String(err.message).split('\n')[0]);
  }
}

// 两份 SVG 必须内嵌同一个二维码矩阵（带标注那份只是外面套了标题文字）
if (matrices.size === 2) {
  const [a, b] = [...matrices.values()];
  const same = a.size === b.size && [...a].every((k) => b.has(k));
  check('两份 SVG 内嵌的二维码矩阵完全一致', same, same ? '' : `${a.size} vs ${b.size} 个模块`);
}

/* ---------------- 5. 反向对照：解码器必须"会拒绝" ----------------
   如果 jsQR 无论喂什么都返回同一个字符串，上面的 OK 就全是假的。
   这里喂两张必然不含二维码的图（全白、以及只有定位图案的假码），要求解不出来。 */
console.log('\n【反向对照（防止解码器假阳性）】');
{
  const blank = createBitmap(232, 232);
  const img = PNG.sync.read(encodePng(blank));
  const res = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  check('全白图解不出二维码（解码器确实在工作）', !res, res ? `竟然解出 "${res.data}"` : '');
}
{
  // 只有三个定位图案、数据区全空的"假二维码"
  const count = 33;
  const SCALE = 8;
  const BORDER = 4;
  const side = (count + BORDER * 2) * SCALE;
  const bmp = createBitmap(side, side);
  const finder = (cx, cy) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const ring = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (ring || core) fillRect(bmp, (cx + x + BORDER) * SCALE, (cy + y + BORDER) * SCALE, SCALE, SCALE);
      }
    }
  };
  finder(0, 0);
  finder(count - 7, 0);
  finder(0, count - 7);
  const img = PNG.sync.read(encodePng(bmp));
  const res = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  check('只有定位图案的假码解不出正确网址',
    !res || res.data !== URL_EXPECTED, res ? `竟然解出 "${res.data}"` : '');
}

/* ---------------- 汇总 ---------------- */
console.log('');
if (failed === 0) {
  console.log('  全部通过 ✅  四份素材都真的能扫出正确网址\n');
} else {
  console.log(`  ${failed} 项失败 ❌  发出去之前必须修好\n`);
}
process.exit(failed ? 1 : 0);
