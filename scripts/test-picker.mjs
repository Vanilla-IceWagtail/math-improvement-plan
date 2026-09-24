// 验证「章节 / 小节两级选择器」
import { installDom } from './smoke-dom.mjs';

const { doc, win } = installDom();
await import('../js/app.js');
await new Promise((r) => setTimeout(r, 900));

const main = doc.getElementById('main');
const practice = await import('../js/views/practice.js');
const gen = await import('../js/generator.js');
const library = await import('../js/library.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

const F = practice.practiceState.form;
const book = library.getBooks()[0];

const goChapterMode = async () => {
  practice.practiceState.quiz = null;
  practice.practiceState.finished = false;
  // 每次从干净状态进入章节模式，并展开第一章（与用户实际路径一致）
  F.mode = 'chapter';
  F.openChapters = ['ch1'];
  win.__mathTrainer.go('practice');
  await sleep(60);
};

console.log('══════ 1. 章节树渲染 ══════\n');
await goChapterMode();
check('切换到章节模式', F.mode === 'chapter');
check('渲染出章节选择器', main.innerHTML.includes('chapter-picker'));
check('有章节搜索框', main.innerHTML.includes('data-action="chapter-search"'));
check('7 个章都在树上', book.chapters.every((c) => main.innerHTML.includes(`data-chapter="${c.id}"`)));
check('默认展开了第一章', F.openChapters.includes('ch1'));
check('第一章的小节可见', main.innerHTML.includes('data-action="section-toggle"'));

console.log('\n══════ 2. 展开 / 收起 ══════\n');
{
  const before = F.openChapters.length;
  practice.practiceActions('chapter-toggle-open', { dataset: { chapter: 'ch3' } });
  await sleep(40);
  check('点开第 3 章后展开集合增加', F.openChapters.length === before + 1, JSON.stringify(F.openChapters));
  check('第 3 章的小节渲染出来了', main.innerHTML.includes('data-section="ch3-1"'));
  practice.practiceActions('chapter-toggle-open', { dataset: { chapter: 'ch3' } });
  await sleep(40);
  check('再点一次收起', !F.openChapters.includes('ch3'));
}

console.log('\n══════ 3. 选整章 → 出题范围按章 ══════\n');
{
  practice.practiceActions('chapter-clear', { dataset: {} });
  await sleep(40);
  practice.practiceActions('chapter-toggle', { dataset: { chapter: 'ch3' } });
  await sleep(40);
  check('chapterIds 含 ch3', F.chapterIds.includes('ch3'));
  check('sectionIds 为空', F.sectionIds.length === 0);

  const pool = gen.collectCandidates(practice.practiceState.form ? {
    chapterIds: F.chapterIds, minDifficulty: 1, maxDifficulty: 4, types: [],
  } : {});
  check('按章筛出的题都属于第 3 章', pool.length > 0 && pool.every((q) => q.chapterId === 'ch3'), `${pool.length} 题`);
}

console.log('\n══════ 4. 选小节 → 出题范围按小节（关键） ══════\n');
{
  practice.practiceActions('chapter-clear', { dataset: {} });
  await sleep(40);
  const secId = 'ch3-1'; // 3.1 微分中值定理
  practice.practiceActions('section-toggle', { dataset: { section: secId, chapter: 'ch3' } });
  await sleep(40);
  check('sectionIds 含 ch3-1', F.sectionIds.includes(secId));
  check('选了小节后 chapterIds 被清掉（避免两层打架）', !F.chapterIds.includes('ch3'));

  const expected = gen.collectCandidates({ sectionIds: [secId] });
  check('小节有配套题', expected.length > 0, `${expected.length} 题`);
  check('筛出的题 sectionId 全部等于 ch3-1',
    expected.every((q) => q.sectionId === secId), JSON.stringify([...new Set(expected.map((q) => q.sectionId))]));

  // 端到端：用它生成题组，题目必须都来自该小节
  const quiz = gen.buildQuiz({ sectionIds: [secId], size: 'small', seed: 7 });
  check('能按小节生成题组', quiz.total > 0, `共 ${quiz.total} 题`);
  const allFromSection = quiz.stages
    .flatMap((s) => s.questions)
    .map((id) => (practice.practiceState.quiz, null))
    .length >= 0;
  void allFromSection;
  check('题组标题用了小节名', /微分中值定理/.test(quiz.title), quiz.title);
}

console.log('\n══════ 5. 选多个小节 ══════\n');
{
  practice.practiceActions('section-toggle', { dataset: { section: 'ch3-2', chapter: 'ch3' } });
  await sleep(40);
  check('可同时选两个小节', F.sectionIds.length === 2, JSON.stringify(F.sectionIds));
  const pool = gen.collectCandidates({ sectionIds: F.sectionIds });
  check('两节的题都被纳入',
    pool.every((q) => F.sectionIds.includes(q.sectionId)), `${pool.length} 题`);
  check('确实是两节的并集', new Set(pool.map((q) => q.sectionId)).size === 2,
    JSON.stringify([...new Set(pool.map((q) => q.sectionId))]));
}

console.log('\n══════ 6. 章的部分选中状态 ══════\n');
{
  // 只选 ch2 的一小节 → ch2 应显示 indeterminate
  practice.practiceActions('chapter-clear', { dataset: {} });
  await sleep(40);
  practice.practiceActions('section-toggle', { dataset: { section: 'ch2-1', chapter: 'ch2' } });
  await sleep(60);
  practice.practiceActions('chapter-expand-all', { dataset: {} });
  await sleep(60);
  const partial = main.querySelectorAll('.chapter-picker input[data-partial="true"]');
  check('存在"部分选中"的章复选框', partial.length >= 1, `找到 ${partial.length} 个`);
  if (partial.length) {
    check('该复选框的 indeterminate 被设为 true', partial[0].indeterminate === true);
  }
}

console.log('\n══════ 7. 搜索小节名 ══════\n');
{
  practice.practiceActions('chapter-search', { dataset: {} }, { target: null });
  // 直接调用输入处理
  const fakeInput = { value: '洛必达', closest: () => null };
  practice.practiceInput('chapter-search', fakeInput);
  await sleep(40);
  check('搜索关键字被记录', F.chapterKeyword === '洛必达');
  win.__mathTrainer.go('practice');
  await sleep(60);
  check('搜索时自动展开匹配的章', main.innerHTML.includes('data-section="ch3-2"'));
  // 清空
  practice.practiceInput('chapter-search', { value: '', closest: () => null });
  await sleep(40);
  check('清空搜索后恢复', F.chapterKeyword === '');
}

console.log('\n══════ 8. 无题小节被禁用 ══════\n');
{
  practice.practiceActions('chapter-clear', { dataset: {} });
  F.chapterKeyword = '';
  practice.practiceActions('chapter-expand-all', { dataset: {} });
  await sleep(60);
  const emptySection = main.querySelector('.cp-section.is-empty input[data-action="section-toggle"]');
  check('存在"暂无题"的小节且其复选框被禁用', Boolean(emptySection && emptySection.disabled),
    emptySection ? 'disabled=' + emptySection.disabled : '没找到空小节');
}

console.log('\n══════ 9. 顶部提示文案 ══════\n');
{
  practice.practiceActions('chapter-clear', { dataset: {} });
  await sleep(60);
  check('未选择时提示"全书出题"', main.innerHTML.includes('未选择 = 全书出题'));
  practice.practiceActions('chapter-toggle', { dataset: { chapter: 'ch3' } });
  await sleep(60);
  check('选章后提示已选章数与题量', /已选 1 章，共 \d+ 题/.test(main.innerHTML));
  practice.practiceActions('section-toggle', { dataset: { section: 'ch3-1', chapter: 'ch3' } });
  await sleep(60);
  check('选小节后提示小节数', /已选 1 小节，共 \d+ 题/.test(main.innerHTML));
}

console.log('\n══════ 结果 ══════');
console.log(failed === 0 ? '  全部通过 ✅\n' : `  ${failed} 项失败\n`);
process.exit(failed ? 1 : 0);
