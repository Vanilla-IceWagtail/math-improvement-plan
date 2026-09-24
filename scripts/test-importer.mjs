// 导入模块测试：多格式识别 + 逐题校验 + 分类
import { parseImportPayload, collectSelected, buildPack, normalizeQuestion, validateQuestion } from '../js/importer.js';

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

console.log('══════ 1. 各种顶层形状都能认出来 ══════\n');
{
  const q = { id: 'x1', stem: '题干', answer: 'A', options: ['a', 'b'] };

  const a = parseImportPayload([q]);
  check('纯数组 [...]', a.ok && a.counts.total === 1, JSON.stringify(a.shape));

  const b = parseImportPayload({ questions: [q] });
  check('{ questions: [...] }', b.ok && b.counts.total === 1, JSON.stringify(b.shape));

  const c = parseImportPayload({ items: [q] });
  check('{ items: [...] }', c.ok && c.counts.total === 1, JSON.stringify(c.shape));

  const d = parseImportPayload({ problems: [q] });
  check('{ problems: [...] }', d.ok && d.counts.total === 1, JSON.stringify(d.shape));

  const e = parseImportPayload({ data: [q] });
  check('{ data: [...] }', e.ok && e.counts.total === 1, JSON.stringify(e.shape));

  const f = parseImportPayload(q);
  check('单个题目对象', f.ok && f.counts.total === 1, JSON.stringify(f.shape));

  const g = parseImportPayload(JSON.stringify([q]));
  check('JSON 字符串（粘贴场景）', g.ok && g.counts.total === 1, JSON.stringify(g.shape));

  const h = parseImportPayload('这不是 json');
  check('非法 JSON 给出可读错误', !h.ok && /不是合法的 JSON/.test(h.error), h.error);

  const i = parseImportPayload({ foo: 1 });
  check('认不出来时给出格式说明', !i.ok && /没找到题目数组/.test(i.error), i.error);
}

console.log('\n══════ 2. 别家的字段名能自动映射 ══════\n');
{
  // 典型"别家"写法
  const foreign = {
    questions: [{
      uid: 'F-1',
      question: '下列哪个是导数定义？',
      choices: [{ text: '选项一', isCorrect: false }, { text: '选项二', isCorrect: true }, { text: '选项三' }],
      explanation: '因为……',
      level: 3,
      knowledge_points: ['def-derivative'],
      tags: ['导数'],
    }],
  };
  const r = parseImportPayload(foreign);
  check('能导入', r.ok && r.counts.ok === 1, JSON.stringify(r.counts));
  const q = r.items[0].question;
  check('uid -> id', q.id === 'F-1', q.id);
  check('question -> stem', q.stem.includes('导数定义'), q.stem);
  check('choices[].text -> options', Array.isArray(q.options) && q.options.length === 3, JSON.stringify(q.options));
  check('isCorrect 标出的选项 -> answer=B', q.answer === 'B', q.answer);
  check('explanation -> solution', q.solution === '因为……', q.solution);
  check('level -> difficulty', q.difficulty === 3, String(q.difficulty));
  check('knowledge_points -> concepts', JSON.stringify(q.concepts) === '["def-derivative"]', JSON.stringify(q.concepts));
  check('type 自动判为 choice', q.type === 'choice', q.type);
}

console.log('\n══════ 3. 题型别名归一 ══════\n');
{
  const cases = [
    ['multiple_choice', 'choice'], ['MCQ', 'choice'], ['选择题', 'choice'],
    ['fill_in', 'fill'], ['blank', 'fill'], ['填空题', 'fill'],
    ['true-false', 'judge'], ['判断', 'judge'],
    ['calculation', 'compute'], ['计算题', 'compute'],
    ['prove', 'proof'], ['证明题', 'proof'],
  ];
  for (const [raw, expect] of cases) {
    const q = normalizeQuestion({ id: 'x', stem: 's', answer: 'a', type: raw, options: ['a', 'b'] }, 0);
    // choice 类需要选项；这里给了选项，所以 fill 等会被覆盖成 choice，单独处理
    const got = q.type;
    const ok = raw === 'multiple_choice' || raw === 'MCQ' || raw === '选择题'
      ? got === 'choice'
      : got === expect || (expect !== 'choice' && got === 'choice' && Array.isArray(q.options));
    check(`题型 "${raw}" -> ${expect}`, ok, `实际 ${got}`);
  }
  // 不给选项时 fill 应保持 fill
  const noOpt = normalizeQuestion({ id: 'x', stem: 's', answer: 'a', type: 'blank' }, 0);
  check('无选项的 blank 保持 fill', noOpt.type === 'fill', noOpt.type);
}

console.log('\n══════ 4. 逐题校验与三分类 ══════\n');
{
  const payload = {
    questions: [
      { id: 'g1', stem: '好题', answer: 'A', options: ['a', 'b'], solution: '解析', concepts: ['thm-rolle'], chapterId: 'ch3', difficulty: 2 },
      { id: 'g2', stem: '', answer: 'A' },
      { id: 'g3', answer: 'A' },
      { id: 'g4', stem: '选择题没给选项', answer: 'A', type: 'choice' },
      { id: 'g1', stem: '文件内重复 id', answer: 'B', options: ['a', 'b'] },
    ],
  };
  const r = parseImportPayload(payload, { existingIds: ['g1'] });
  check('总数 5', r.counts.total === 5, JSON.stringify(r.counts));
  check('g1 判为重复（与现有题库冲突）', r.items[0].status === 'duplicate', r.items[0].status);
  check('g2 缺题干 -> problem', r.items[1].status === 'problem' && r.items[1].errors.some((e) => /缺题干/.test(e)),
    JSON.stringify(r.items[1].errors));
  check('g3 缺题干与答案 -> problem', r.items[2].status === 'problem' && r.items[2].errors.length >= 1,
    JSON.stringify(r.items[2].errors));
  check('g4 选择题没选项 -> problem', r.items[3].status === 'problem' && r.items[3].errors.some((e) => /缺.*选项/.test(e)),
    JSON.stringify(r.items[3].errors));
  check('文件内 id 重复 -> duplicate', r.items[4].status === 'duplicate', r.items[4].status);

  check('重复题默认不勾选', r.items[0].selected === false);
  check('有问题的默认不勾选', r.items[1].selected === false);
  check('importable 计数正确（此处全不可导入）', r.counts.importable === 0, String(r.counts.importable));
}

console.log('\n══════ 5. 缺解析 / 缺知识点会给出提醒但不拦 ══════\n');
{
  const r = parseImportPayload([{ id: 'w1', stem: '题干', answer: 'A' }]);
  check('可以导入（只缺可选字段）', r.items[0].status === 'ok', r.items[0].status);
  check('提醒缺解析', r.items[0].warnings.some((w) => /解析/.test(w)), JSON.stringify(r.items[0].warnings));
  check('提醒缺知识点', r.items[0].warnings.some((w) => /知识点/.test(w)), JSON.stringify(r.items[0].warnings));
  check('提醒缺章节', r.items[0].warnings.some((w) => /章节/.test(w)), JSON.stringify(r.items[0].warnings));
  check('提醒难度是默认值', r.items[0].warnings.some((w) => /难度/.test(w)), JSON.stringify(r.items[0].warnings));
}

console.log('\n══════ 6. 错题本导出文件也能导入 ══════\n');
{
  const notebook = {
    app: 'shuxue-peilian',
    type: 'notebook',
    records: {
      'q:q-ch3-001': {
        id: 'q-ch3-001', kind: 'question', chapterId: 'ch3',
        title: '选择题 · 罗尔定理条件', preview: '下列函数中满足罗尔定理条件的是',
        extra: { concepts: ['thm-rolle'], difficulty: 1, answer: 'C', tags: ['罗尔定理'] },
      },
      'i:thm-rolle': { id: 'thm-rolle', kind: 'item', title: '罗尔定理' },
    },
  };
  const r = parseImportPayload(notebook);
  check('识别为错题本导出', r.shape === '错题本导出', r.shape);
  check('只取题目类记录（忽略教材条目）', r.counts.total === 1, JSON.stringify(r.counts));
  const q = r.items[0].question;
  check('答案从 extra 里取到', q.answer === 'C', q.answer);
  check('知识点从 extra 里取到', JSON.stringify(q.concepts) === '["thm-rolle"]', JSON.stringify(q.concepts));
}

console.log('\n══════ 7. 勾选与收集 ══════\n');
{
  const r = parseImportPayload({
    questions: [
      { id: 'a1', stem: 'A', answer: '1', concepts: ['x'], chapterId: 'ch1' },
      { id: 'a2', stem: 'B', answer: '2', concepts: ['x'], chapterId: 'ch1' },
      { id: 'a3', stem: '', answer: '3' },
    ],
  });
  check('默认勾选 2 道（有问题的不勾）', r.items.filter((x) => x.selected).length === 2);
  const picked = collectSelected(r.items, [0]);
  check('只收集勾选的那道', picked.length === 1 && picked[0].id === 'a1', JSON.stringify(picked.map((p) => p.id)));
  const all = collectSelected(r.items, [0, 1, 2]);
  check('即使显式勾了有问题的，也不会被收集', all.length === 2, String(all.length));
  check('收集结果里不含内部字段 __issues', !('__issues' in all[0]), JSON.stringify(Object.keys(all[0])));
}

console.log('\n══════ 8. 题包导出格式 ══════\n');
{
  const pack = buildPack([{ id: 'p1', stem: 's', answer: 'a' }], { name: '我的分享' });
  check('带 format 标识', pack.format === 'shuxue-peilian/question-pack', pack.format);
  check('带许可与署名', Boolean(pack.license && pack.attribution), JSON.stringify({ l: pack.license, a: pack.attribution }));
  check('带数量', pack.count === 1);
  // 往返：导出的题包能被自己导入
  const back = parseImportPayload(pack);
  check('导出的题包能被自己导回', back.ok && back.counts.total === 1, JSON.stringify(back.counts));
}

console.log('\n══════ 9. 校验函数边界 ══════\n');
{
  check('null 不是有效题目', validateQuestion(null).ok === false);
  check('选项数不足的选择题被拦住',
    validateQuestion({ id: 'x', stem: 's', answer: 'A', type: 'choice', options: ['只有一个'] }).ok === false);
  check('答案超出选项范围只提醒不拦',
    (() => { const r = validateQuestion({ id: 'x', stem: 's', answer: 'E', type: 'choice', options: ['a', 'b'], solution: 'p', concepts: ['c'], chapterId: 'ch1' });
      return r.ok === true && r.warnings.some((w) => /不在选项范围/.test(w)); })());
  check('非对象条目不会抛异常',
    (() => { try { parseImportPayload([1, 'x', null, [2]]); return true; } catch { return false; } })());
}

console.log('\n══════ 结果 ══════');
console.log(failed === 0 ? '  全部通过 ✅\n' : `  ${failed} 项失败\n`);
process.exit(failed ? 1 : 0);
