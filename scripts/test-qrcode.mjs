/**
 * test-qrcode.mjs —— 二维码素材测试（不需要任何第三方依赖）
 *
 * 为什么值得测：二维码是"发出去就收不回"的东西。生成一个扫不出来的码，
 * 或者把版本号写错，用户不会发现，只会疑惑为什么朋友说扫不了。
 *
 * 本文件只做**不依赖图形库**的检查（各平台都能跑，CI 里也能跑）：
 *   1. share/ 下该有的文件都在，PNG 文件头正确、不是空壳
 *   2. SVG 里内嵌了二维码路径，且带版本标注的那份版本号与 package.json 一致
 *   3. share/README.md 与当前版本保持一致
 *   4. 自研 PNG 编码器的**字节级正确性**：直接解析自己写出的 PNG 结构
 *      （IHDR 尺寸/位深/颜色类型、IDAT 能解压、IEND 存在、CRC 校验通过）
 *
 * 真正"用解码器扫一遍"的验证在 scripts/verify-qrcode-decode.mjs ——
 * 那一步需要 jsqr / pngjs，属于可选的深度校验，不放在这里以免 CI 依赖第三方包。
 */

import { readFile, readdir } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

const SHARE = new URL('../share/', import.meta.url);

const URL_EXPECTED = 'https://vanilla-icewagtail.github.io/math-improvement-plan/';

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
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
  check('SVG 文件存在（用于内容检查）', false, '文件缺失');
}

/* ---------------- 3. 自研 PNG 编码器的字节级正确性 ----------------
   不依赖任何图形库：直接按 PNG 规范解析自己写出的字节流。 */
console.log('\n【PNG 编码器自检（直接解析字节流）】');
{
  const { createBitmap, fillRect, encodePng } = await import('./lib/png.mjs');
  const bmp = createBitmap(64, 48);
  fillRect(bmp, 8, 8, 16, 16);
  fillRect(bmp, 40, 24, 12, 12);
  const buf = encodePng(bmp);

  check('有 PNG 签名', buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])));

  // 按规范切块。CRC 这里**独立重写一遍**（不复用 png.mjs 里的实现），
  // 否则编码器算错了、校验也照错的算，等于没测。
  const crcTable = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c;
    }
    return t;
  })();
  const crc32 = (b) => {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < b.length; i += 1) c = crcTable[(c ^ b[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  };

  let off = 8;
  const chunks = [];
  let crcOk = true;
  while (off + 12 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    chunks.push({ type, data, crc: buf.readUInt32BE(off + 8 + len) });
    if (crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])) !== buf.readUInt32BE(off + 8 + len)) crcOk = false;
    off += 12 + len;
  }
  check('块解析正好吃到文件尾（没有多余/缺失字节）', off === buf.length, `停在 ${off}，文件 ${buf.length} 字节`);

  const types = chunks.map((c) => c.type);
  check(`块顺序正确（IHDR → IDAT → IEND）：${types.join(' → ')}`,
    types[0] === 'IHDR' && types.includes('IDAT') && types[types.length - 1] === 'IEND');
  check('每个块的 CRC32 都校验通过', crcOk);

  const ihdr = chunks.find((c) => c.type === 'IHDR').data;
  check('IHDR 宽高正确（64x48）', ihdr.readUInt32BE(0) === 64 && ihdr.readUInt32BE(4) === 48,
    `读到 ${ihdr.readUInt32BE(0)}x${ihdr.readUInt32BE(4)}`);
  check('IHDR 位深 8 位、灰度为 0、非隔行',
    ihdr[8] === 8 && ihdr[9] === 0 && ihdr[12] === 0);

  // IDAT 能解压，且长度等于每行 (宽+1) 字节
  const raw = inflateSync(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data).reduce((a, b) => Buffer.concat([a, b])));
  check('IDAT 解压后长度 = (宽+1) × 高', raw.length === (64 + 1) * 48, `实际 ${raw.length}，期望 ${(64 + 1) * 48}`);
  const px = (x, y) => raw[y * (64 + 1) + 1 + x];
  check('填充的黑块确实是黑（灰度 0）', px(10, 10) === 0 && px(45, 28) === 0);
  check('未填充区域是白（灰度 255）', px(30, 30) === 255 && px(2, 2) === 255);
  check('每行滤波字节为 0', [0, 20, 47].every((y) => raw[y * (64 + 1)] === 0));
}

/* ---------------- 4. 文档与版本一致 ---------------- */
console.log('\n【文档一致性】');
const shareReadme = await readFile(new URL('../share/README.md', import.meta.url), 'utf8').catch(() => '');
check('share/README.md 写明了网址', shareReadme.includes(URL_EXPECTED), '');
check('share/README.md 说明了重新生成的命令', shareReadme.includes('make-qrcode.mjs'), '');
check('share/README.md 提到版本标注的文件名', shareReadme.includes(`share-qrcode-${version}`), '');
check('share/README.md 说明了深度解码校验的入口',
  shareReadme.includes('verify-qrcode-decode') || shareReadme.includes('--verify'), '');

/* ---------------- 汇总 ---------------- */
console.log('');
console.log(failed === 0 ? '  全部通过 ✅' : `  ${failed} 项失败`);
console.log('  提示：真正"用解码器扫一遍"的深度校验见 node scripts/verify-qrcode-decode.mjs（需要 jsqr / pngjs）\n');
process.exit(failed ? 1 : 0);
