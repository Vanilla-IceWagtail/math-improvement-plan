// 端到端测试：题库导入 / 分享界面
// 真实模拟：拖入文件 -> 预览 -> 勾选 -> 导入 -> 题库变大
import { installDom } from './smoke-dom.mjs';

const { doc, win } = installDom();
await import('../js/app.js');
await new Promise((r) => setTimeout(r, 900));

const main = doc.getElementById('main');
const modalHost = doc.getElementById('modal-host');
const bank = await import('../js/bank.js');
const importer = await import('../js/importer.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failed = 0;
const check = (name, cond, detail = '') => {
  if (!cond) failed += 1;
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}${cond || !detail ? '' : '  → ' + detail}`);
};

const beforeSize = bank.bankSize();
const F = win.File;
/**
 * 面板实时内容。
 * 两个垫片陷阱（都踩过，记在这里免得再犯）：
 *   1. 子元素被赋 innerHTML 后，父元素缓存的 _html 不会同步 —— 所以要从实时的
 *      [data-preview] 节点读，而不是 .modal-body（后者永远是创建时的初始模板）。
 *   2. 该节点的子元素 parentNode 指向它自己（垫片实现所致），所以从 modalHost
 *      往下 querySelector 查不到实时内容 —— 必须直接从 [data-preview] 出发查。
 */
const livePanel = () => modalHost.querySelector('[data-preview]') || modalHost.querySelector('.modal-body');
const panelHtml = () => {
  const p = livePanel();
  return p ? p.innerHTML : '';
};

/**
 * 面板静态文案（拖拽区、说明段落等）。
 * 垫片不会同步父元素缓存的 _html，所以只能逐个节点读它们各自的 _html。
 */
const staticHtml = () => {
  let out = '';
  if (modalHost._html) out += modalHost._html;
  modalHost.querySelectorAll('*').forEach((n) => { if (n._html) out += n._html; });
  return out;
};

// 用带"别家字段名"的文件，顺便验证自动映射在真实拖拽路径上生效
const foreignFile = new F(
  [JSON.stringify({
    name: '某开放题库',
    license: 'CC BY 4.0',
    attribution: '某某某',
    questions: [
      // 别家写法 1：正确答案标在选项对象里
      { uid: 'imp-1', question: '求导：y = x² 的导数是？', choices: [{ text: '2x', isCorrect: true }, { text: 'x' }, { text: 'x²' }, { text: '2' }], explanation: '幂函数求导公式', level: 1, knowledge_points: ['def-derivative'], chapterId: 'ch2' },
      // 别家写法 2：答案是顶层标量字段
      { uid: 'imp-2', question: '求 ∫₀¹ x dx 的值', correct: '1/2', level: 2, explanation: '定积分计算', chapterId: 'ch5' },
      // 故意漏掉题干，应被拦下
      { uid: 'imp-3', question: '', correct: '缺题干应被拦下', level: 2 },
    ],
  })],
  'open-bank.json',
  { type: 'application/json' },
);

console.log('══════ 1. 打开导入面板 ══════\n');
const { openBankImport } = await import('../js/views/bank-import.js');
openBankImport();
await sleep(80);

check('面板已打开', Boolean(modalHost.querySelector('.modal')));
check('有拖拽区', Boolean(modalHost.querySelector('[data-dropzone]')));
check('有文件选择输入', Boolean(modalHost.querySelector('[data-file-input]')));
check('有粘贴入口', Boolean(modalHost.querySelector('[data-act="paste"]')));
check('有网址拉取入口', Boolean(modalHost.querySelector('[data-act="url"]')));
check('有格式说明入口', Boolean(modalHost.querySelector('[data-act="schema"]')));
check('有导出入口', Boolean(modalHost.querySelector('[data-act="export-mine"]')));
check('提到了不做账号密码（避免误导）',
  staticHtml().includes('不会') && staticHtml().includes('要求你输入其他网站的账号密码'));

console.log('\n══════ 2. 拖入文件 ══════\n');
const zone = modalHost.querySelector('[data-dropzone]');
const fileInput = modalHost.querySelector('[data-file-input]');
check('拿到拖拽区与 file input', Boolean(zone && fileInput));

// 走真实的 change 事件路径（与拖拽后读文件是同一段逻辑）
fileInput.files = [foreignFile];
fileInput.dispatch('change', {});
await sleep(120);

const preview = modalHost.querySelector('.import-preview');
check('出现了预览区', Boolean(preview));
const summaryText = preview ? preview.textContent : '';
check('预览显示识别到的格式', /识别格式/.test(panelHtml()));
check('预览显示来源名', /某开放题库/.test(panelHtml()));
check('预览显示许可', /CC BY 4.0/.test(panelHtml()));
check('预览显示署名', /某某某/.test(panelHtml()));
check('计数正确：2 可导入 / 1 有问题',
  /可导入 2/.test(panelHtml()) && /有问题 1/.test(panelHtml()), summaryText.slice(0, 120));

console.log('\n══════ 3. 逐题展示与勾选 ══════\n');
const items = livePanel().querySelectorAll('.import-item');
check('三道题都列出来了', items.length === 3, String(items.length));
check('别家字段名被映射（题干出现）', /求导：y = x² 的导数是？/.test(panelHtml()));
check('选项里 isCorrect 推出的答案被展示（答案：A）', /答案：A/.test(panelHtml()), '');
check('顶层标量 correct 被当作答案展示（答案：1/2）', /答案：1\/2/.test(panelHtml()), '');
check('缺题干的那道被标为有问题', /缺题干/.test(panelHtml()));
const badItem = livePanel().querySelector('.import-item.is-bad');
check('有问题的题不可勾选', Boolean(badItem && badItem.querySelector('input[disabled]')));

const boxes = livePanel().querySelectorAll('[data-pv="pick"]:not([disabled])');
const checkedCount = Array.from(boxes).filter((b) => b.checked).length;
check('可导入的两道默认勾选', checkedCount === 2, String(checkedCount));

// 通过 data-index 反查"这个复选框对应哪道题"，而不是假设顺序
// （早先就是假设了 boxes[0] 是 imp-1，结果断言全错）
const idsByIndex = new Map(
  importer.parseImportPayload(await foreignFile.text(), { existingIds: new Set(bank.getQuestions().map((q) => q.id)) })
    .items.map((x) => [x.index, x.question.id]),
);
const uncheckBox = boxes[0];
const uncheckId = idsByIndex.get(Number(uncheckBox.dataset.index));
const keepId = idsByIndex.get(Number(boxes[1].dataset.index));
check('能按 data-index 定位到题目 id', Boolean(uncheckId && keepId), `${uncheckId} / ${keepId}`);

// 反选一道，验证"自己选择导入什么"
uncheckBox.checked = false;
uncheckBox.dispatch('change', {});
await sleep(40);
// 计数以"确认按钮文案"为准：
// 垫片里 .import-summary 的实时文本取不到（innerHTML / textContent 都不同步），
// 而按钮的 innerHTML 是直接赋值、可读的，且它与计数用的是同一个 picked.size。
check('取消勾选后计数变为 1',
  /导入勾选的 1 道题/.test(livePanel().querySelector('[data-pv="confirm"]').innerHTML),
  livePanel().querySelector('[data-pv="confirm"]').innerHTML);

const state = (await import('../js/views/bank-import.js')).importState();
check('勾选状态被记录为 1 个', state.picked.length === 1, JSON.stringify(state.picked));

console.log('\n══════ 4. 确认导入 ══════\n');
livePanel().querySelector('[data-pv="confirm"]').dispatch('click', {});
await sleep(200);
check('题库变大了 1 道', bank.bankSize() === beforeSize + 1, `${beforeSize} -> ${bank.bankSize()}`);
check(`勾选的那道（${keepId}）被导入`, Boolean(bank.getQuestion(keepId)), '(未找到)');
check(`反选的那道（${uncheckId}）没被导入`, !bank.getQuestion(uncheckId));
check('有问题的题没被导入', !bank.getQuestion('imp-3'));

console.log('\n══════ 5. 重复题被识别为重复 ══════\n');
{
  // 用刚刚真正导入成功的那道题（keepId）来测重复，而不是随便挑一个 id
  const dupFile = new F([JSON.stringify({ questions: [{ uid: keepId, question: '重复题', correct: 'A', choices: ['A', 'B'] }] })], 'dup.json');
  const r = importer.parseImportPayload(await dupFile.text(), { existingIds: new Set(bank.getQuestions().map((q) => q.id)) });
  check(`已在库中的 ${keepId} 判为重复`, r.items[0].status === 'duplicate', r.items[0].status);
  check('重复题默认不勾选', r.items[0].selected === false);

  // 库里没有的 id 不应被判重
  const fresh = importer.parseImportPayload(
    [{ id: 'brand-new-id', stem: '新题', answer: 'A', options: ['A', 'B'], solution: 'p', concepts: ['c'], chapterId: 'ch1' }],
    { existingIds: new Set(bank.getQuestions().map((q) => q.id)) },
  );
  check('库里没有的 id 不算重复', fresh.items[0].status === 'ok', fresh.items[0].status);
}

console.log('\n══════ 6. 粘贴 JSON 也能进 ══════\n');
{
  const r = importer.parseImportPayload(JSON.stringify([{ id: 'paste-1', stem: '粘贴进来的题', answer: 'A', options: ['A', 'B'] }]));
  check('粘贴的 JSON 能解析', r.ok && r.counts.ok === 1, JSON.stringify(r.counts));
}

console.log('\n══════ 7. 题包往返（导出后可再导入） ══════\n');
{
  const pack = importer.buildPack([{ id: 'round-1', stem: '往返题', answer: 'A', options: ['A', 'B'], concepts: ['x'], chapterId: 'ch1', solution: 'p' }], { name: '测试题包' });
  const back = importer.parseImportPayload(pack, { existingIds: new Set() });
  check('导出的题包能被导入', back.ok && back.counts.ok === 1, JSON.stringify(back.counts));
  check('题包名被识别', back.meta.name === '测试题包', back.meta.name);
}

console.log('\n══════ 8. 格式说明表 ══════\n');
{
  modalHost.querySelector('[data-act="schema"]').dispatch('click', {});
  await sleep(80);
  // 格式说明弹窗是另一个 modal（在 modal-host 里），要从它里面查
  const schemaBody = modalHost.querySelectorAll('.modal-body').slice(-1)[0];
  const text = schemaBody ? schemaBody.innerHTML + (schemaBody.querySelectorAll('*').map((n) => n._html || '').join('')) : '';
  check('打开格式说明后出现映射表', Boolean(schemaBody && schemaBody.querySelector('.fmt-table')), '');
  check('说明了必填三项', text.includes('必填只有三项'));
  check('列出了别家字段名映射', text.includes('knowledge_points') && text.includes('explanation'));
  // 关掉最上层弹窗
  const closes = modalHost.querySelectorAll('.modal-head [data-close]');
  if (closes.length) closes[closes.length - 1].dispatch('click', {});
  await sleep(50);
}

void main;
console.log('\n══════ 结果 ══════');
console.log(failed === 0 ? '  全部通过 ✅\n' : `  ${failed} 项失败\n`);
process.exit(failed ? 1 : 0);
