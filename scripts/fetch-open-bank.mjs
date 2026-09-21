#!/usr/bin/env node
/**
 * fetch-open-bank.mjs —— 开放许可题库导入管道
 *
 * ⚖️ 这个脚本只做**格式转换**，不内置任何题库、不绕过任何限制。
 *    你给它一个 JSON 文件或 http(s) 地址，它把里面的题目转成本项目
 *    data/questions/*.js 和运行时能直接 fetch 的 bank JSON。
 *
 *    请只使用以下来源，并在发布时保留署名与许可：
 *      · OpenStax（CC BY 4.0）           https://openstax.org
 *      · MIT OpenCourseWare（CC BY-NC-SA）
 *      · Wikibooks / Wikiversity（CC BY-SA）
 *      · 你自己或你所在学校自编的题库
 *    不要用商业题库、考研机构题库、扫描版教辅 —— 那会真的惹上版权问题。
 *
 * 用法：
 *   # 1) 把开放题库的 JSON 转成本项目格式（生成一个运行时可直接 fetch 的 bank）
 *   node scripts/fetch-open-bank.mjs --in openstax-calculus.json --out public/banks/openstax.json \
 *        --name "OpenStax Calculus Volume 1" --license "CC BY 4.0" \
 *        --attribution "OpenStax, Calculus Volume 1" --book tongji-gaoshu-1
 *
 *   # 2) 直接从一个 http(s) 地址拉取（对方需允许 CORS 或你本地跑）
 *   node scripts/fetch-open-bank.mjs --url https://example.org/bank.json --out public/banks/x.json --name "我的题库"
 *
 *   # 3) 打印本项目运行时期望的 JSON 结构说明
 *   node scripts/fetch-open-bank.mjs --schema
 *
 * 生成的文件可以在网站「数据与设置 → 实时题库」里填地址加载，
 * 也可以放进 data/questions/ 并在 data/books/registry.js 的 QUESTION_FILES 里登记。
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const get = (flag, def = '') => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};

const SCHEMA_DOC = `
本项目题库 JSON 结构（运行时可直接 fetch）：

{
  "name": "OpenStax Calculus Volume 1",
  "bookId": "tongji-gaoshu-1",            // 可选，用于按教材筛选
  "license": "CC BY 4.0",
  "attribution": "OpenStax, Calculus Volume 1",
  "questions": [
    {
      "id": "os-calc1-1-2-001",           // 必填，全局唯一
      "chapterId": "ch1",                 // 可选，用于按章出题
      "concepts": ["thm-squeeze"],        // 可选，关联教材知识点 id（见 data/books/*.js）
      "tags": ["极限"],
      "type": "choice",                   // choice | fill | judge | compute | proof
      "difficulty": 2,                    // 1 入门 / 2 基础 / 3 提高 / 4 挑战
      "stem": "题干，可用 <code> 写公式",
      "options": ["A 选项", "B 选项"],     // type=choice 时必填
      "answer": "B",                      // choice 填选项字母；其它题型填答案全文
      "solution": "解析（建议写清思路与易错点）",
      "source": "imported",
      "license": "CC BY 4.0",
      "attribution": "OpenStax, Calculus Volume 1"
    }
  ]
}

字段要求：id / stem / answer 必填；difficulty 必须在 1~4；
type=choice 必须有至少 2 个 options。校验逻辑见 js/bank.js 的 validateQuestion。
`;

if (has('--schema') || argv.length === 0) {
  console.log(SCHEMA_DOC);
  process.exit(0);
}

/** 把各种可能的输入字段名归一化 */
function normalizeQuestion(raw, idx, meta) {
  const stem = raw.stem || raw.question || raw.prompt || raw.text || raw.title || '';
  const optionsRaw = raw.options || raw.choices || raw.answers || null;
  let options = null;
  let answer = raw.answer ?? raw.correct ?? raw.correctAnswer ?? raw.solution ?? '';

  if (Array.isArray(optionsRaw)) {
    options = optionsRaw.map((o) => (typeof o === 'string' ? o : (o.text || o.content || o.label || String(o))));
    // 有些开放题库用 isCorrect 标记正确项
    if (Array.isArray(optionsRaw) && optionsRaw.some((o) => o && (o.isCorrect || o.correct))) {
      const i = optionsRaw.findIndex((o) => o && (o.isCorrect || o.correct));
      answer = String.fromCharCode(65 + i);
    } else if (typeof answer === 'number') {
      answer = String.fromCharCode(65 + answer);
    }
  } else if (optionsRaw && typeof optionsRaw === 'object') {
    options = Object.values(optionsRaw).map(String);
  }

  const id = raw.id || raw.uid || raw.slug || `${meta.prefix}-${String(idx + 1).padStart(3, '0')}`;

  return {
    id,
    chapterId: raw.chapterId || raw.chapter || meta.chapterId || '',
    sectionId: raw.sectionId || '',
    concepts: Array.isArray(raw.concepts) ? raw.concepts : [],
    tags: Array.isArray(raw.tags) ? raw.tags : (raw.tag ? [raw.tag] : []),
    type: options ? 'choice' : (raw.type || 'fill'),
    difficulty: Math.min(4, Math.max(1, Number(raw.difficulty || raw.level || 2))),
    stem: String(stem),
    ...(options ? { options } : {}),
    answer: String(answer),
    solution: String(raw.solution || raw.explanation || raw.rationale || '（本题来自导入题库，原题库未提供解析）'),
    source: 'imported',
    license: meta.license,
    attribution: meta.attribution,
  };
}

async function main() {
  const meta = {
    name: get('--name', '导入题库'),
    license: get('--license', '未标注（请自行确认来源许可）'),
    attribution: get('--attribution', ''),
    bookId: get('--book', ''),
    prefix: get('--prefix', 'imp'),
    chapterId: get('--chapter', ''),
  };

  let payload;
  const url = get('--url');
  const inFile = get('--in');

  if (url) {
    console.log(`拉取：${url}`);
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`服务器返回 ${res.status} ${res.statusText}`);
    payload = await res.json();
  } else if (inFile) {
    console.log(`读取：${inFile}`);
    payload = JSON.parse(await readFile(inFile, 'utf8'));
  } else {
    console.error('需要 --in <文件> 或 --url <地址>，或者用 --schema 查看结构说明');
    process.exit(1);
  }

  // 支持三种常见外层结构
  const list = Array.isArray(payload) ? payload
    : Array.isArray(payload.questions) ? payload.questions
      : Array.isArray(payload.items) ? payload.items
        : Array.isArray(payload.problems) ? payload.problems
          : null;

  if (!list) throw new Error('输入里找不到题目数组（期望顶层是数组，或有 questions / items / problems 字段）');

  const questions = list.map((q, i) => normalizeQuestion(q, i, meta)).filter((q) => q.stem && q.answer);

  const seen = new Set();
  const unique = [];
  let dup = 0;
  for (const q of questions) {
    if (seen.has(q.id)) { dup += 1; continue; }
    seen.add(q.id);
    unique.push(q);
  }

  const out = {
    name: meta.name,
    bookId: meta.bookId,
    license: meta.license,
    attribution: meta.attribution,
    generatedAt: new Date().toISOString(),
    generatedBy: 'scripts/fetch-open-bank.mjs',
    count: unique.length,
    questions: unique,
  };

  const outPath = path.resolve(get('--out', 'public/banks/imported.json'));
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');

  console.log(`\n✅ 转换完成`);
  console.log(`   题目：${unique.length} 道${dup ? `（跳过重复 id ${dup} 条）` : ''}`);
  console.log(`   输出：${outPath}`);
  console.log(`   许可：${meta.license}`);
  if (meta.attribution) console.log(`   署名：${meta.attribution}`);
  console.log(`
下一步二选一：
  A. 在网站「数据与设置 → 实时题库」里填这个文件的访问地址（例如
     http://localhost:5180/public/banks/imported.json），点「拉取并合并」。
  B. 把它放进 data/questions/，并在 data/books/registry.js 的 QUESTION_FILES 里加一行。
`);
}

main().catch((err) => {
  console.error('\n❌ 失败：' + err.message);
  process.exit(1);
});
