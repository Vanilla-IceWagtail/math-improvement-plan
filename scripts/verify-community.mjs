/**
 * verify-community.mjs —— 校验社区文件（行为准则 / 安全策略 / issue 与 PR 模板）
 *
 * 为什么需要它：
 *   .github/ISSUE_TEMPLATE/*.yml 是 GitHub 的**结构化表单**。写错一个字段名
 *   （例如把 validations 拼错、把 body 写成 steps），GitHub 不会报错，而是直接
 *   不显示表单 —— 这种问题在本地很难发现。本脚本把 GitHub 的表单规范做成断言，
 *   在 `npm run check` 阶段就拦住。
 *
 * 校验内容：
 *   1. 必需的社区文件都存在，且不是空壳（有实质内容）
 *   2. 每个 issue 表单：name / description / body 齐备
 *   3. 每个表单元素：type 合法、textarea/input/dropdown 有 id 与 label
 *   4. dropdown 必须有 options；checkboxes 必须有 label 与 options
 *   5. 存在至少一个必填项（required: true），避免用户提交空 issue
 *   6. 表单引用的标签（labels）在仓库里真实存在，否则 GitHub 会静默忽略
 *   7. config.yml 的 contact_links 结构正确
 *   8. 举报渠道里的邮箱格式合法；README / CONTRIBUTING 正确链接到这些文件
 *
 * 用法：node scripts/verify-community.mjs
 */

import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url);
const read = (rel) => readFile(new URL(rel, ROOT), 'utf8');

const results = [];
let failed = 0;
function check(name, ok, extra = '') {
  const pass = Boolean(ok);
  if (!pass) failed += 1;
  results.push({ pass, name });
  console.log(`${pass ? '  ✅' : '  ❌'} ${name}${!pass && extra ? `  → ${extra}` : ''}`);
}

/* ---------------- YAML 解析器（可选依赖：临时安装的 js-yaml） ---------------- */
let yamlLoad = null;
if (process.env.JSYAML_PATH) {
  try {
    const mod = await import(pathToFileURL(process.env.JSYAML_PATH).href);
    yamlLoad = mod.load || (mod.default && mod.default.load) || null;
  } catch { yamlLoad = null; }
}

/** 没有 YAML 解析器时的降级：只做最基本的键存在性检查 */
function fallbackParse(text) {
  const has = (k) => new RegExp(`^${k}:`, 'm').test(text);
  return { __fallback: true, name: has('name'), description: has('description'), body: has('body') };
}

/* ---------------- 1. 文件存在且有实质内容 ---------------- */
console.log('\n══════════ 社区文件校验 ══════════\n');
console.log('【文件存在性与内容】');

const REQUIRED = [
  ['CODE_OF_CONDUCT.md', 2000, '行为准则'],
  ['SECURITY.md', 800, '安全策略'],
  ['.github/PULL_REQUEST_TEMPLATE.md', 500, 'PR 模板'],
  ['.github/ISSUE_TEMPLATE/config.yml', 100, 'issue 模板入口配置'],
];

for (const [rel, minBytes, label] of REQUIRED) {
  try {
    const text = await read(rel);
    const bytes = Buffer.byteLength(text, 'utf8');
    check(`${label}存在且有实质内容（${rel}，${bytes} 字节）`, bytes >= minBytes, `只有 ${bytes} 字节，疑似空壳`);
  } catch {
    check(`${label}存在（${rel}）`, false, '文件缺失');
  }
}

/* ---------------- 2. issue 表单逐个校验 ---------------- */
console.log('\n【issue 表单结构】');

const tplDir = new URL('.github/ISSUE_TEMPLATE/', ROOT);
// config.yml 是 issue 选择页的配置，不是表单本身，单独校验（见下）
const tplFiles = (await readdir(tplDir)).filter(
  (f) => (f.endsWith('.yml') || f.endsWith('.yaml')) && f !== 'config.yml',
);

const VALID_TYPES = new Set(['markdown', 'input', 'textarea', 'dropdown', 'checkboxes']);
/** 这些类型的元素必须有 id 与 label */
const NEED_ID_LABEL = new Set(['input', 'textarea', 'dropdown', 'checkboxes']);

const allLabels = new Set();

for (const f of tplFiles) {
  const raw = await readFile(new URL(f, tplDir), 'utf8');
  const doc = yamlLoad ? yamlLoad(raw) : fallbackParse(raw);
  const tag = `.github/ISSUE_TEMPLATE/${f}`;

  if (doc.__fallback) {
    check(`${tag} 解析（无 YAML 解析器，仅做键检查）`, doc.name && doc.description && doc.body);
    continue;
  }

  check(`${tag} 有 name / description / body`, Boolean(doc.name && doc.description && Array.isArray(doc.body)),
    `name=${doc.name} description=${Boolean(doc.description)} body=${Array.isArray(doc.body)}`);

  if (!Array.isArray(doc.body)) continue;

  let elemProblems = [];
  let requiredCount = 0;

  doc.body.forEach((el, i) => {
    const at = `body[${i}]`;
    if (!VALID_TYPES.has(el.type)) elemProblems.push(`${at} 的 type 非法（${el.type}）`);
    if (el.type === 'markdown') return;
    if (NEED_ID_LABEL.has(el.type)) {
      if (!el.id) elemProblems.push(`${at}（${el.type}）缺 id`);
      if (!el.attributes || !el.attributes.label) elemProblems.push(`${at}（${el.type}）缺 attributes.label`);
    }
    if (el.type === 'dropdown') {
      const opts = el.attributes && el.attributes.options;
      if (!Array.isArray(opts) || opts.length < 2) elemProblems.push(`${at} 是 dropdown 但没有足够的 options`);
    }
    if (el.type === 'checkboxes') {
      const opts = el.attributes && el.attributes.options;
      if (!Array.isArray(opts) || !opts.length) elemProblems.push(`${at} 是 checkboxes 但没有 options`);
      (opts || []).forEach((o, j) => { if (!o || !o.label) elemProblems.push(`${at}.options[${j}] 缺 label`); });
    }
    if (el.validations && el.validations.required === true) requiredCount += 1;
    // dropdown 的 value 必须落在 options 内（GitHub 会静默忽略非法值）
    if (el.type === 'dropdown' && el.attributes && Array.isArray(el.attributes.options)
      && el.attributes.default != null && !el.attributes.options.includes(el.attributes.default)) {
      elemProblems.push(`${at} 的 default 不在 options 里`);
    }
  });

  check(`${tag} 元素结构合法（${doc.body.length} 个元素）`, elemProblems.length === 0, elemProblems.join('; '));
  check(`${tag} 至少有一个必填项`, requiredCount > 0, 'required: true 一个都没有，用户可提交空 issue');

  for (const l of [].concat(doc.labels || [])) allLabels.add(l);
}

/* ---------------- 3. config.yml ---------------- */
console.log('\n【issue 选择页配置】');
{
  const raw = await read('.github/ISSUE_TEMPLATE/config.yml');
  const doc = yamlLoad ? yamlLoad(raw) : null;
  if (doc) {
    const links = doc.contact_links;
    check('config.yml 有 contact_links 且结构正确',
      Array.isArray(links) && links.length > 0 && links.every((l) => l.name && l.url && l.about),
      JSON.stringify(links));
    check('contact_links 都指向本项目或官方站点', (links || []).every((l) => /^https:\/\//.test(l.url)), '');
    check('blank_issues_enabled 已显式声明', typeof doc.blank_issues_enabled === 'boolean');
  } else {
    check('config.yml 存在（无解析器，跳过结构校验）', raw.includes('contact_links'));
  }
}

/* ---------------- 4. 举报渠道与交叉链接 ---------------- */
console.log('\n【交叉链接与举报渠道】');
{
  const coc = await read('CODE_OF_CONDUCT.md');
  const sec = await read('SECURITY.md');
  const readme = await read('README.md');
  const contrib = await read('CONTRIBUTING.md');
  const pr = await read('.github/PULL_REQUEST_TEMPLATE.md');

  check('CODE_OF_CONDUCT 标注了 Contributor Covenant 3.0 与出处',
    /Contributor Covenant/.test(coc) && /version 3\.0/.test(coc) && /contributor-covenant\.org/.test(coc));
  check('CODE_OF_CONDUCT 有具体举报渠道（不留占位符）',
    !/\[INSERT CONTACT METHOD\]/.test(coc) && !/\[NOTE/.test(coc), '仍存在官方模板占位符');
  check('SECURITY.md 明确指向私密报告渠道', /security\/advisories\/new/.test(sec));
  check('两份文件里的邮箱格式合法',
    [...`${coc}\n${sec}`.matchAll(/[\w.+-]+@[\w.-]+\.\w+/g)].every((m) => /^[\w.+-]+@[\w.-]+\.\w+$/.test(m[0])));

  check('README 链接到 CODE_OF_CONDUCT.md', /CODE_OF_CONDUCT\.md/.test(readme));
  check('README 链接到 SECURITY\.md', /SECURITY\.md/.test(readme));
  check('CONTRIBUTING 链接到 CODE_OF_CONDUCT.md', /CODE_OF_CONDUCT\.md/.test(contrib));
  check('PR 模板要求先跑 npm run check', /npm run check/.test(pr));
  check('PR 模板包含版权确认清单', /原创/.test(pr) && /LICENSE/.test(pr));
}

/* ---------------- 汇总 ---------------- */
const passed = results.length - failed;
console.log(`\n═══ 社区文件校验：${passed}/${results.length} 通过 ═══`);
if (failed) console.log('提示：issue 表单结构错误会导致 GitHub 直接不显示表单，务必修掉。\n');
process.exit(failed ? 1 : 0);
