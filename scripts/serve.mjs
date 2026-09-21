#!/usr/bin/env node
/**
 * serve.mjs —— 零依赖静态服务器（开发 / 自用）
 *
 * 用法：node scripts/serve.mjs [端口]
 * 然后浏览器打开 http://localhost:5173
 *
 * 说明：本项目是纯静态站点，任何静态服务器都能跑（python -m http.server、nginx、GitHub Pages…）。
 * 但直接用 file:// 打开是不行的 —— ES module 会被浏览器的同源策略拦住。
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 5173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    // 阻止目录穿越
    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    let target = filePath;
    let info = await stat(target).catch(() => null);
    if (info && info.isDirectory()) {
      target = path.join(target, 'index.html');
      info = await stat(target).catch(() => null);
    }
    if (!info) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 —— 找不到 ' + urlPath);
      return;
    }

    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      // 方便本地测试外部题库同步（如果你把题库放在别的端口）
      'Access-Control-Allow-Origin': '*',
    });
    createReadStream(target).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 —— ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n  数学陪练已启动：http://localhost:${PORT}\n`);
  console.log('  三个版块： #/practice  组题组');
  console.log('            #/notebook  错题本');
  console.log('            #/textbook  教材定理定义\n');
  console.log('  校验内容： node scripts/validate-content.mjs');
  console.log('  停止服务： Ctrl + C\n');
});
