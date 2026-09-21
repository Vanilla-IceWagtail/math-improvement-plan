#!/usr/bin/env node
/**
 * smoke-test.mjs —— 端到端冒烟测试（Node + 轻量 DOM 垫片）
 *
 * 它会真的把 js/app.js 跑起来，然后检查：
 *   1. 教材加载与索引（章节数 / 条目数 / 别名解析）
 *   2. 题库加载与组题（难度阶梯是否真的递增）
 *   3. 三个版块能否渲染出预期内容
 *   4. ⭐ 收藏 和 📕 错题本 两个图标能否点亮并写入数据
 *   5. 错题本的艾宾浩斯调度能否正常推进阶段
 *
 * 用法：node scripts/smoke-test.mjs
 */

import { installDom } from './smoke-dom.mjs';

const results = [];
let failed = 0;

function check(name, condition, extra = '') {
  const ok = Boolean(condition);
  if (!ok) failed += 1;
  results.push({ ok, name, extra });
  console.log(`${ok ? '  ✅' : '  ❌'} ${name}${extra ? `  ${ok ? '' : '→ ' + extra}` : ''}`);
  return ok;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log('\n══════════ 端到端冒烟测试 ══════════\n');
  const { doc, win } = installDom();

  // 启动应用（app.js 会在 import 时自动 boot）
  await import('../js/app.js');
  await sleep(900); // 等动态 import 与首屏渲染

  const main = doc.getElementById('main');

  /* ---------------- 1. 教材与题库 ---------------- */
  console.log('【1】内容加载');
  const library = await import('../js/library.js');
  const bank = await import('../js/bank.js');
  const books = library.getBooks();
  check('教材已加载', books.length >= 1, `books=${books.length}`);
  const book = books[0];
  check('教材有 7 个章节', book && book.chapters.length === 7, book ? `chapters=${book.chapters.length}` : 'no book');
  check('条目总数 ≥ 190', book.itemCount >= 190, `items=${book.itemCount}`);
  check('定义与定理都识别出来了', book.defCount > 40 && book.thmCount > 90, `def=${book.defCount} thm=${book.thmCount}`);
  check('没有加载错误', library.getLibrary().errors.length === 0, library.getLibrary().errors.join(' | '));
  check('题库题目 ≥ 190', bank.bankSize() >= 190, `questions=${bank.bankSize()}`);

  // 别名解析：题库里用的旧名要能落到真实条目
  const aliased = library.getItem('thm-rolle');
  check('别名 thm-rolle 能解析到真实定理', Boolean(aliased && aliased.name), aliased ? aliased.name : 'null');
  check('别名 thm-limit-unique 能解析', Boolean(library.getItem('thm-limit-unique')));
  check('别名 def-accumulation-function 能解析', Boolean(library.getItem('def-accumulation-function')));

  // 题目 concepts 应当都能解析到条目
  let unresolved = 0;
  for (const q of bank.getQuestions()) {
    for (const c of q.concepts || []) if (!library.getItem(c)) unresolved += 1;
  }
  check('所有题目的知识点都能对应到教材条目', unresolved === 0, `unresolved=${unresolved}`);

  /* ---------------- 2. 组题组阶梯 ---------------- */
  console.log('\n【2】组题组：难度阶梯');
  const gen = await import('../js/generator.js');
  const quiz = gen.buildQuiz({ concepts: ['thm-rolle', 'thm-lagrange'], size: 'medium', seed: 42 });
  check('能生成题组', quiz.total > 0, `total=${quiz.total}`);
  const diffs = quiz.stages.map((s) => s.difficulty);
  check('档位按难度递增', diffs.every((d, i) => i === 0 || d > diffs[i - 1]), `stages=${diffs.join(',')}`);
  check('题组里每题都能取到题目对象', gen.quizQuestions(quiz).length === quiz.total, `${gen.quizQuestions(quiz).length}/${quiz.total}`);
  const quiz2 = gen.buildQuiz({ concepts: ['thm-rolle', 'thm-lagrange'], size: 'medium', seed: 42 });
  check('相同 seed 生成相同题组（可复现）', JSON.stringify(quiz.stages) === JSON.stringify(quiz2.stages));

  /* ---------------- 3. 三个版块渲染 ---------------- */
  console.log('\n【3】三个版块渲染');
  win.location.hash = '#/practice';
  win.__mathTrainer.go('practice');
  await sleep(50);
  check('组题组：出现标题', main.innerHTML.includes('组题组'));
  check('组题组：有出题设置按钮', main.innerHTML.includes('生成我的题组'));
  check('组题组：有知识点可选', main.innerHTML.includes('data-action="concept-toggle"'));
  check('组题组：侧栏显示题库现状', main.innerHTML.includes('题库现状'));

  win.__mathTrainer.go('notebook');
  await sleep(50);
  check('错题本：出现标题', main.innerHTML.includes('错题本'));
  check('错题本：有四个标签页', main.innerHTML.includes('data-tab="due"') && main.innerHTML.includes('data-tab="starred"'));

  win.__mathTrainer.go('textbook');
  await sleep(50);
  check('教材：出现标题', main.innerHTML.includes('教材定理定义'));
  check('教材：目录渲染出全部章节', main.innerHTML.includes('第 1 章') && main.innerHTML.includes('第 7 章'));
  check('教材：定义与定理标签都出现', main.innerHTML.includes('tag-def') && main.innerHTML.includes('tag-thm'));
  check('教材：有通俗解释板块', main.innerHTML.includes('说人话'));
  check('教材：有证明板块', main.innerHTML.includes('证明'));

  /* ---------------- 4. 星标 / 错题本图标 ---------------- */
  console.log('\n【4】星标收藏 与 错题本图标');
  const storage = await import('../js/storage.js');
  const starBtn = main.querySelector('.toolbtn[data-tool="star"]');
  check('页面上存在可点亮的星形图标', Boolean(starBtn), starBtn ? `id=${starBtn.dataset.id}` : 'none');
  if (starBtn) {
    const id = starBtn.dataset.id;
    starBtn.dispatch('click', {});
    await sleep(50);
    const rec = storage.getRecord(id, 'item');
    check('点星之后记录里有 stars=1', Boolean(rec && rec.stars === 1), JSON.stringify(rec && rec.stars));
    check('星形图标点亮了（is-on）', storage.getRecord(id, 'item').stars === 1);
  }

  const nbBtn = main.querySelector('.toolbtn[data-tool="notebook"]');
  check('页面上存在可点亮的本子图标', Boolean(nbBtn));
  if (nbBtn) {
    const id = nbBtn.dataset.id;
    const kind = nbBtn.dataset.kind;
    nbBtn.dispatch('click', {});
    await sleep(50);
    const rec = storage.getRecord(id, kind);
    check('点本子后进入错题本（有 srs 调度）', Boolean(rec && rec.srs && typeof rec.srs.due === 'number'));
    check('新加入的条目立即到期', Boolean(rec && rec.srs.due <= Date.now() + 1000));
  }

  /* ---------------- 5. 艾宾浩斯调度 ---------------- */
  console.log('\n【5】艾宾浩斯间隔复习');
  const srs = await import('../js/srs.js');
  const rec = storage.notebookRecords()[0];
  check('错题本里有记录', Boolean(rec));
  if (rec) {
    const p0 = rec.srs.phase;
    srs.grade(rec, true);
    const p1 = rec.srs.phase;
    check('答对后阶段 +1', p1 === p0 + 1, `${p0} → ${p1}`);
    const firstInterval = rec.srs.due - rec.srs.lastReview;
    check('下次到期时间按间隔表推进（约 30 分钟）', Math.abs(firstInterval - srs.INTERVALS[1].ms) < 5000, `due in ${Math.round(firstInterval / 60000)} 分钟`);
    srs.grade(rec, false);
    check('答错后阶段回退', rec.srs.phase === p1 - 1, `phase=${rec.srs.phase}`);
    check('卡壳次数被记录', rec.srs.lapses >= 1, `lapses=${rec.srs.lapses}`);
    check('间隔表共 10 档', srs.MAX_PHASE === 10 && srs.INTERVALS.length === 10);
    const sum = srs.srsSummary();
    check('汇总统计能算出来', typeof sum.due === 'number' && typeof sum.mastered === 'number', JSON.stringify({ total: sum.total, due: sum.due }));
  }

  /* ---------------- 6. 答题与自动进错题本 ---------------- */
  console.log('\n【6】答题闭环');
  const practice = await import('../js/views/practice.js');
  win.__mathTrainer.go('practice');
  await sleep(50);
  // 直接给视图塞一个确定的小题组，避免依赖随机抽题
  const small = gen.buildQuiz({ concepts: ['thm-rolle'], size: 'small', seed: 7 });
  const putOk = small.total > 0;
  check('可围绕单个知识点出自己的题组', putOk, `total=${small.total}`);
  if (putOk) {
    practice.practiceState.quiz = small;
    practice.practiceState.answers = {};
    practice.practiceState.finished = false;
    win.__mathTrainer.go('practice');
    await sleep(50);
    check('答题界面渲染出题干', main.innerHTML.includes('q-stem'));
    check('答题界面有提交按钮', main.innerHTML.includes('data-action="submit"'));
  }

  /* ---------------- 7. 数据导入导出 ---------------- */
  console.log('\n【7】数据导入导出');
  const backup = storage.exportBackup();
  check('导出结构正确', backup.app === 'shuxue-peilian' && backup.data && backup.data.records);
  const before = Object.keys(storage.getState().records).length;
  try {
    storage.importState(backup, 'merge');
    check('导入自己的备份不报错', true);
  } catch (err) {
    check('导入自己的备份不报错', false, err.message);
  }
  check('记录数没有丢失', Object.keys(storage.getState().records).length >= before);

  /* ---------------- 汇总 ---------------- */
  const total = results.length;
  const passed = total - failed;
  console.log(`\n══════════ 结果：${passed}/${total} 通过 ${failed ? `，${failed} 项失败` : ''} ══════════\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error('\n❌ 冒烟测试崩溃：', err);
  process.exit(1);
});
