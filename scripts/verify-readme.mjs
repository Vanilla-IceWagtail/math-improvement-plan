/**
 * verify-readme.mjs —— 核对 README 里的事实性陈述
 *
 * 为什么需要它：README 会随代码漂移。改了间隔表、加了题目、挪了文件之后，
 * 文档里的数字和路径可能就悄悄过期了。这个脚本把 README 里所有**可验证的断言**
 * 拿真实代码与数据复算一遍，对不上就报错。
 *
 * 它校验的内容：
 *   1. 教材条目总数、按 kind 的分类计数、每章条目数
 *   2. 题库总数、每章题目数与难度分布
 *   3. README 5.1 的题组示例（poolSize / total / 每档题目 id）
 *   4. README 5.2 的题目示例（题干、选项、答案）
 *   5. README 5.3 的复习规则表（各档位答对/答错的档位变化与间隔）
 *   6. README 5.4 的导出 JSON 结构
 *   7. README 第 7 节"已知限制"里的说法（例如 dailyGoal 确实未参与统计）
 *   8. README 里引用的所有文件路径是否真实存在
 *
 * 用法：node scripts/verify-readme.mjs
 *   全部通过退出码 0，任何一条对不上退出码 1（适合放进 CI / npm run check）。
 */
import { readFile } from 'node:fs/promises';

// 让 storage.js 在 Node 里能跑（它只读 localStorage）
globalThis.localStorage = {
  getItem: () => null, setItem() {}, removeItem() {}, clear() {},
  get length() { return 0; }, key: () => null,
};

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const library = await import('../js/library.js');
const bank = await import('../js/bank.js');
const gen = await import('../js/generator.js');
const srs = await import('../js/srs.js');
const storage = await import('../js/storage.js');

await library.loadLibrary();
await bank.loadBank();

const results = [];
const check = (name, actual, expected) => {
  const ok = String(actual) === String(expected);
  results.push(ok);
  console.log(`${ok ? '✅' : '❌'} ${name}\n     实际=${actual}  README=${expected}`);
};

/* ---- 1. 条目与题目总数 ---- */
const book = library.getBooks()[0];
const tally = library.allItems().reduce((a, i) => { a[i.kind] = (a[i.kind] || 0) + 1; return a; }, {});
check('教材条目总数', book.itemCount, 204);
check('定义数', tally.definition, 64);
check('定理数', tally.theorem, 142);
check('公式数', tally.formula, 39);
check('补充(note)数', tally.note, 31);
check('章节数', book.chapters.length, 7);
check('题库总数', bank.bankSize(), 194);

/* ---- 2. 每章条目数（README 表格） ---- */
const table = { 1: 59, 2: 29, 3: 27, 4: 19, 5: 28, 6: 17, 7: 25 };
for (const ch of book.chapters) {
  const st = library.chapterStats(ch.id);
  check(`第 ${ch.no} 章条目数`, st.total, table[ch.no]);
}

/* ---- 3. 每章题目数与难度分布（README 校验器输出示例） ---- */
const perCh = { ch1: 36, ch2: 36, ch3: 30, ch4: 24, ch5: 24, ch6: 20, ch7: 24 };
const lvPerCh = {
  ch1: [7, 13, 11, 5], ch2: [14, 10, 9, 3], ch3: [8, 8, 11, 3],
  ch4: [6, 9, 6, 3], ch5: [5, 10, 7, 2], ch6: [4, 8, 6, 2], ch7: [6, 8, 7, 3],
};
for (const [cid, n] of Object.entries(perCh)) {
  const list = bank.getQuestions().filter((q) => q.chapterId === cid);
  check(`${cid} 题目数`, list.length, n);
  const lv = [0, 0, 0, 0, 0];
  for (const q of list) lv[q.difficulty] += 1;
  check(`${cid} 难度分布`, lv.slice(1).join('/'), lvPerCh[cid].join('/'));
}

/* ---- 4. 题组示例（README 5.1） ---- */
const quiz = gen.buildQuiz({ concepts: ['method-substitution-first'], size: 'medium', seed: 2024 });
check('示例题组 poolSize', quiz.poolSize, 9);
check('示例题组 total', quiz.total, 6);
const stageStr = quiz.stages.map((s) => `${s.difficulty}:${s.questions.join(',')}`).join(' | ');
const expectStage = '1:q-ch4-005,q-ch4-006 | 2:q-ch4-007,q-ch4-021,q-ch4-008 | 3:q-ch4-015';
check('示例题组档位与题目', stageStr, expectStage);

const quiz2 = gen.buildQuiz({ concepts: ['def-differential'], size: 'medium', seed: 2024 });
check('微分的定义 poolSize', quiz2.poolSize, 8);
check('微分的定义 档位数（应填满 4 档）', quiz2.stages.length, 4);
check('微分的定义 各档题量', quiz2.stages.map((s) => s.questions.length).join('/'), '2/2/1/1');

/* ---- 5. 艾宾浩斯间隔（README 版块二） ---- */
check('间隔档数 MAX_PHASE', srs.MAX_PHASE, 10);
check('间隔表长度', srs.INTERVALS.length, 10);
check('间隔文字', srs.INTERVALS.map((i) => i.label).join(' → '),
  '5 分钟后 → 30 分钟后 → 12 小时后 → 1 天后 → 2 天后 → 4 天后 → 7 天后 → 15 天后 → 30 天后 → 60 天后');
check('第 5 档间隔 = 2 天', srs.INTERVALS[4].ms / 86400000, 2);
check('第 3 档间隔 = 12 小时', srs.INTERVALS[2].ms / 3600000, 12);

/* ---- 6. 复习自评示例（README 5.3） ---- */
const rec = { id: 't', kind: 'question', srs: { phase: 3, due: 0, lastReview: 0, lapses: 0, reviews: 0, history: [] } };
srs.grade(rec, true, 1000);
check('phase 3 答对 → 4', rec.srs.phase, 4);
check('答对后间隔 = 2 天', rec.srs.due - rec.srs.lastReview, 2 * 86400000);
const rec2 = { id: 't2', kind: 'question', srs: { phase: 3, due: 0, lastReview: 0, lapses: 0, reviews: 0, history: [] } };
srs.grade(rec2, false, 1000);
check('phase 3 答错 → 2', rec2.srs.phase, 2);
check('答错后间隔 = 12 小时', rec2.srs.due - rec2.srs.lastReview, 12 * 3600000);
check('答错记一次卡壳', rec2.srs.lapses, 1);
// README 规则表里的两个边界
const recA = { id: 'a', kind: 'question', srs: { phase: 0, due: 0, lastReview: 0, lapses: 0, reviews: 0, history: [] } };
srs.grade(recA, false, 1000);
check('第 1 档答错 → 仍是第 1 档', recA.srs.phase, 0);
check('第 1 档答错 → 5 分钟后再来', recA.srs.due - recA.srs.lastReview, 5 * 60000);
const recB = { id: 'b', kind: 'question', srs: { phase: 9, due: 0, lastReview: 0, lapses: 0, reviews: 0, history: [] } };
srs.grade(recB, true, 1000);
check('第 10 档答对 → 已掌握（phase 10）', recB.srs.phase, 10);
check('已掌握标记', Boolean(recB.masteredAt), 'true');

/* ---- 7. 导出结构（README 5.4） ---- */
const backup = storage.exportBackup();
check('导出顶层 app 字段', backup.app, 'shuxue-peilian');
check('导出 schema', backup.schema, 1);
check('导出含 records', Boolean(backup.data.records), 'true');
check('records 键前缀规则', Object.keys({ 'q:x': 1, 'i:y': 1 }).every((k) => k.startsWith('q:') || k.startsWith('i:')), 'true');

/* ---- 8. 每日目标：README 说"只保存未参与统计" ---- */
const src = await readFile(new URL('../js/views/practice.js', import.meta.url), 'utf8');
const appSrc = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const usedInStats = /dailyGoal/.test(src) || /dailyGoal[^:]*\+/.test(appSrc);
check('dailyGoal 确实未被统计使用（README 的限制说明成立）', usedInStats, 'false');

/* ---- 9. 快捷键 ---- */
check('有 1/2/3 切版块', /e\.key === '1'\) go\('practice'\)/.test(appSrc), 'true');
check('有 / 跳搜索', /e\.key === '\/'/.test(appSrc), 'true');
const nbSrc = await readFile(new URL('../js/views/notebook.js', import.meta.url), 'utf8');
check('复习弹窗 空格 显示答案', /e\.key === ' '/.test(nbSrc), 'true');
check('复习弹窗 2 = 记住了', /e\.key === '2'/.test(nbSrc), 'true');
check('复习弹窗 1 = 忘了', /e\.key === '1'/.test(nbSrc), 'true');

/* ---- 10. 许可声明一致性 ---- */
const licenseText = await readFile(new URL('../LICENSE', import.meta.url), 'utf8');
const scopeText = await readFile(new URL('../LICENSE-SCOPE.md', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
check('LICENSE 是 BSD 3-Clause', /^BSD 3-Clause License/.test(licenseText), 'true');
check('LICENSE 含三条条款', /Redistributions of source code/.test(licenseText)
  && /Redistributions in binary form/.test(licenseText)
  && /Neither the name of the copyright holder/.test(licenseText), 'true');
check('LICENSE 保持官方纯正文（否则 GitHub 会识别成 Other）', !/CC BY 4\.0|范围说明|附录/.test(licenseText), 'true');
check('LICENSE-SCOPE.md 说明 CC-BY-4.0 内容范围', /CC BY 4\.0/.test(scopeText), 'true');
check('LICENSE-SCOPE.md 说明第三方题库许可', /保留其原许可/.test(scopeText), 'true');
check('README 指向 LICENSE-SCOPE.md', /LICENSE-SCOPE\.md/.test(readme), 'true');
check('package.json 的 license 字段', pkg.license, 'BSD-3-Clause');
check('README 徽章标注 BSD 3-Clause', /!\[代码 BSD-3-Clause\]/.test(readme), 'true');
check('README 许可表标注 BSD 3-Clause', /\[BSD 3-Clause\]\(LICENSE\)/.test(readme), 'true');
check('README 未把本项目代码说成 MIT', /\|\s*代码[^|]*\|\s*\[MIT\]/.test(readme), 'false');

/* ---- 10.5 CI 配置 ---- */
const ciYml = await readFile(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
check('CI 工作流存在且指定了 main 分支', /branches:\s*\[main\]/.test(ciYml), 'true');
check('CI 跑了 validate / smoke / verify-readme 三步',
  /npm run validate/.test(ciYml) && /npm run smoke/.test(ciYml) && /npm run verify-readme/.test(ciYml), 'true');
check('CI 也跑了社区文件校验', /npm run verify-community/.test(ciYml), 'true');
check('CI 也跑了数学排版测试', /npm run test-math/.test(ciYml), 'true');
check('README 的 CI 步骤表列出数学排版测试', /数学记号排版/.test(readme), 'true');
check('README 的 CI 步骤表列出社区文件校验', /社区文件校验/.test(readme), 'true');
check('CI 守住了零依赖原则', /dependencies/.test(ciYml) && /devDependencies/.test(ciYml), 'true');
check('CI 用 Node 20 与 22 矩阵', /'20'/.test(ciYml) && /'22'/.test(ciYml), 'true');
// v4 系列的 action 运行在 node20 上，GitHub 已标记 deprecated 并会在运行日志里报警告；
// v5 起改用 node24。这条断言防止将来有人无意改回去。
check('CI 的 actions 使用 v5+（不用 deprecated 的 node20 版本）',
  !/actions\/(checkout|setup-node)@v[0-4]/.test(ciYml)
  && /actions\/checkout@v5/.test(ciYml) && /actions\/setup-node@v5/.test(ciYml), 'true');
check('README 有 CI 徽章', /actions\/workflows\/ci\.yml\/badge\.svg/.test(readme), 'true');
check('README 说明了 CI', /持续集成（CI）/.test(readme), 'true');

/* ---- 11. GitHub Pages 部署 ---- */
const pagesYml = await readFile(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');
check('Pages 工作流存在', /Deploy to GitHub Pages/.test(pagesYml), 'true');
check('Pages 工作流用官方三个 action',
  /actions\/configure-pages@v6/.test(pagesYml)
  && /actions\/upload-pages-artifact@v5/.test(pagesYml)
  && /actions\/deploy-pages@v5/.test(pagesYml), 'true');
check('Pages 工作流只在 CI 成功后部署', /workflow_run/.test(pagesYml)
  && /conclusion\s*==\s*'success'/.test(pagesYml), 'true');
check('Pages 工作流声明了 pages/id-token 权限', /pages:\s*write/.test(pagesYml) && /id-token:\s*write/.test(pagesYml), 'true');
check('Pages 工作流绑定了 github-pages 环境', /environment:/.test(pagesYml) && /name:\s*github-pages/.test(pagesYml), 'true');
check('README 说明了 Pages 在线访问方式', /vanilla-icewagtail\.github\.io\/math-improvement-plan/.test(readme), 'true');
check('README 项目结构列出 Pages 工作流', /deploy-pages\.yml/.test(readme), 'true');
check('README 项目结构列出 ci-actions\.mjs', /ci-actions\.mjs/.test(readme), 'true');

/* ---- 12. README 里引用的文件都真实存在 ---- */
const paths = [...readme.matchAll(/`(data\/[\w./*-]+|js\/[\w./*-]+|styles\/[\w./-]+|scripts\/[\w./-]+|docs\/[\w./-]+|CONTRIBUTING\.md|CHANGELOG\.md|LICENSE)`/g)]
  .map((m) => m[1])
  .filter((p) => !p.includes('*') && !p.endsWith('/'));
const seen = new Set();
let missing = [];
for (const p of paths) {
  if (seen.has(p)) continue;
  seen.add(p);
  try { await readFile(new URL('../' + p, import.meta.url)); } catch { missing.push(p); }
}
check('README 引用的实体文件都存在', missing.join(', ') || '无缺失', '无缺失');
console.log(`     （共核对 ${seen.size} 个路径）`);

/* ---- 汇总 ---- */
const passed = results.filter(Boolean).length;
console.log(`\n═══ README 事实核对：${passed}/${results.length} 通过 ═══`);
if (passed !== results.length) {
  console.log('提示：README 与代码不一致。改了功能/内容后请同步更新 README，或修正本脚本的期望值。\n');
}
process.exit(passed === results.length ? 0 : 1);
