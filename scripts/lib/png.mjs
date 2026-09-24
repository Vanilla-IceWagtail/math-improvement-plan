// 纯 Node PNG 编码器（只写 8 位灰度），用于给二维码出图 —— 项目保持零依赖
// 参考 PNG 规范：签名 + IHDR + IDAT(zlib) + IEND，每块带 CRC32

import { deflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

/** CRC32（PNG 规范附录 D） */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * 把单通道位图（1 = 黑）编码成 8 位灰度 PNG
 * @param {{width:number, height:number, data:Uint8Array}} bitmap
 * @returns {Buffer}
 */
export function encodePng(bitmap) {
  const { width, height, data } = bitmap;

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);    // 位深 8
  ihdr.writeUInt8(0, 9);    // 颜色类型 0 = 灰度
  ihdr.writeUInt8(0, 10);   // 压缩方法
  ihdr.writeUInt8(0, 11);   // 滤波方法
  ihdr.writeUInt8(0, 12);   // 非隔行

  // 每行前面加一个滤波类型字节（0 = None）
  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width + 1)] = 0;
    for (let x = 0; x < width; x += 1) {
      raw[y * (width + 1) + 1 + x] = data[y * width + x] ? 0x00 : 0xFF;
    }
  }

  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** 新建位图（默认全白） */
export function createBitmap(width, height) {
  return { width, height, data: new Uint8Array(width * height) };
}

/** 画一个实心矩形 */
export function fillRect(bitmap, x, y, w, h) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      const px = x + dx;
      const py = y + dy;
      if (px >= 0 && px < bitmap.width && py >= 0 && py < bitmap.height) {
        bitmap.data[py * bitmap.width + px] = 1;
      }
    }
  }
}
