/**
 * views/practice.js —— 版块一：组题组
 *
 * 交互流程：
 *   选题范围（知识点 / 章节 / 题型 / 难度区间 / 题量）
 *     → 生成题组（分档：入门→基础→提高→挑战）
 *     → 逐题作答（选择/填空/判断/计算/证明）
 *     → 每题可一键加入错题本、收藏
 *     → 结束时给出得分与"下一步练什么"
 */

import { icon } from '../icons.js';
import { rich, richInline } from '../text.js';
import { toast, confirmDialog } from '../dom.js';
import { getBooks, getItem, allItems } from '../library.js';
import { getQuestion, bankStats, conceptQuestionCount as qCount } from '../bank.js';
import { buildQuiz, buildQuizFromRecord, quizDistribution, collectCandidates, DIFFICULTY, SET_SIZES } from '../generator.js';
import { getState, setLastQuiz, bumpStats, toggleNotebook, toggleStar, getRecord } from '../storage.js';
import { emptyState, diffMeter, typeLabel, kindTag, esc, toolButtons } from '../components.js';

/* ------------------------------------------------------------------ 状态 */

const ui = {
  /** 当前正在做的题组 */
  quiz: null,
  /** 展开到第几档 */
  stageIndex: 0,
  /** 每题作答记录 { [qid]: { picked, submitted, correct, text } } */
  answers: {},
  /** 设置面板状态 */
  form: {
    mode: 'concept',       // concept | chapter | mixed
    concepts: [],
    chapterIds: [],
    types: [],
    size: 'medium',
    minDifficulty: 1,
    maxDifficulty: 4,
  },
  finished: false,
};

export const practiceState = ui;

/* ------------------------------------------------------------------ 渲染 */

export function renderPractice() {
  return `
  <section class="page">
    <div class="page-head">
      <h1>组题组</h1>
      <div class="sub">挑一个知识点，我按 <b>入门 → 基础 → 提高 → 挑战</b> 四档给你连续出题，做完一档才解锁下一档。</div>
    </div>
    <div class="practice-layout">
      <div>
        ${ui.quiz ? renderQuiz() : renderSetup()}
      </div>
      <aside class="side-panel">
        ${renderSidePanel()}
      </aside>
    </div>
  </section>`;
}

/* ---------------- 出题设置 ---------------- */

function renderSetup() {
  const books = getBooks();
  const book = books.find((b) => b.id === getState().settings.bookId) || books[0];
  const stats = bankStats();
  const f = ui.form;

  const chapterOptions = book
    ? book.chapters.map((c) => `<option value="${esc(c.id)}"${f.chapterIds.includes(c.id) ? ' selected' : ''}>第 ${c.no} 章 ${esc(c.title)}（${countOfChapter(c.id)} 题）</option>`).join('')
    : '';

  return `
  <div class="card setup-panel">
    <div class="field">
      <span class="field-label">① 想练什么？</span>
      <div class="chips" role="group" aria-label="出题范围">
        <button type="button" class="chip" data-action="mode" data-mode="concept" aria-pressed="${f.mode === 'concept'}">${icon('lightbulb', { size: 14 })} 按知识点（推荐）</button>
        <button type="button" class="chip" data-action="mode" data-mode="chapter" aria-pressed="${f.mode === 'chapter'}">${icon('layers', { size: 14 })} 按章节</button>
        <button type="button" class="chip" data-action="mode" data-mode="mixed" aria-pressed="${f.mode === 'mixed'}">${icon('sparkles', { size: 14 })} 全书混合</button>
      </div>
    </div>

    ${f.mode === 'concept' ? `
    <div class="field">
      <span class="field-label">② 点选知识点（可多选，会围绕它们组一条难度阶梯）</span>
      <input class="input" type="search" placeholder="搜索定义 / 定理名，例如：罗尔、夹逼、微分" data-action="concept-search" id="concept-search">
      <div class="chips" id="concept-chips" style="max-height:260px;overflow:auto;padding:2px">
        ${renderConceptChips('')}
      </div>
    </div>` : f.mode === 'chapter' ? `
    <div class="field">
      <span class="field-label">② 选择章节（可多选）</span>
      <select class="select" multiple size="7" data-action="chapter-select" id="chapter-select">${chapterOptions}</select>
      <span style="font-size:12.5px;color:var(--c-text-faint)">按住 Ctrl / ⌘ 可以多选</span>
    </div>` : `
    <div class="field">
      <span class="field-label">② 全书混合：${esc(book ? book.title : '')}，共 ${stats.total} 道题</span>
      <div style="font-size:13.5px;color:var(--c-text-soft)">从所有章节里挑题，难度仍然按梯队往上走。</div>
    </div>`}

    <div class="field">
      <span class="field-label">③ 题量</span>
      <div class="chips">
        ${SET_SIZES.map((s) => `<button type="button" class="chip" data-action="size" data-size="${s.id}" aria-pressed="${f.size === s.id}" title="${esc(s.desc)}">${esc(s.name)}</button>`).join('')}
      </div>
    </div>

    <div class="field">
      <span class="field-label">④ 难度范围</span>
      <div class="chips">
        ${[1, 2, 3, 4].map((d) => `<button type="button" class="chip" data-action="diff-toggle" data-d="${d}" aria-pressed="${d >= f.minDifficulty && d <= f.maxDifficulty}">${diffMeter(d)} ${DIFFICULTY[d].name}</button>`).join('')}
      </div>
      <span style="font-size:12.5px;color:var(--c-text-faint)">不选任何一档 = 四档全要</span>
    </div>

    <div class="field">
      <span class="field-label">⑤ 题型（不选＝全部题型）</span>
      <div class="chips">
        ${['choice', 'fill', 'judge', 'compute', 'proof'].map((t) => `<button type="button" class="chip" data-action="type-toggle" data-type="${t}" aria-pressed="${f.types.includes(t)}">${typeLabel(t)}</button>`).join('')}
      </div>
    </div>

    <div class="setup-actions">
      <button type="button" class="btn btn-primary btn-lg" data-action="start" ${collectCandidates(formToFilter()).length ? '' : 'disabled'}>
        ${icon('target', { size: 16 })} 生成我的题组
      </button>
      <button type="button" class="btn" data-action="random-concept">${icon('refresh', { size: 15 })} 随便来一个知识点</button>
      ${collectCandidates(formToFilter()).length ? '' : `<span class="tag tag-warn">这个组合暂时没有题，换个条件试试</span>`}
    </div>
  </div>`;
}

const countOfChapter = (chapterId) => collectCandidates({ chapterIds: [chapterId] }).length;

function renderConceptChips(keyword) {
  const kw = String(keyword || '').trim().toLowerCase();
  const items = allItems()
    .filter((i) => i.kind === 'definition' || i.kind === 'theorem' || i.kind === 'formula')
    .filter((i) => !kw || (i.name || '').toLowerCase().includes(kw) || (i.aka || []).some((a) => String(a).toLowerCase().includes(kw)))
    .slice(0, 120);
  if (!items.length) return `<span class="tag tag-soft">没找到，换个词试试</span>`;
  return items
    .map((i) => {
      const n = qCount(i.id);
      const on = ui.form.concepts.includes(i.id);
      return `<button type="button" class="chip${n ? '' : ' chip-static'}" data-action="concept-toggle" data-id="${esc(i.id)}"
        aria-pressed="${on}" ${n ? '' : 'disabled'}
        title="${esc(i.chapterTitle)} · ${esc(i.sectionTitle)}｜配套 ${n} 题">${kindTagMini(i.kind)} ${esc(i.name)}<span style="color:var(--c-text-faint);font-weight:600">${n ? ` ${n}` : ' 暂无题'}</span></button>`;
    })
    .join('');
}

const kindTagMini = (kind) =>
  `<span style="font-size:10.5px;font-weight:800;color:${kind === 'theorem' ? 'var(--c-thm)' : kind === 'definition' ? 'var(--c-def)' : 'var(--c-formula)'}">${kind === 'theorem' ? '定理' : kind === 'definition' ? '定义' : '公式'}</span>`;

function formToFilter() {
  const f = ui.form;
  const base = { minDifficulty: f.minDifficulty, maxDifficulty: f.maxDifficulty, types: f.types };
  if (f.mode === 'concept') return { ...base, concepts: f.concepts };
  if (f.mode === 'chapter') return { ...base, chapterIds: f.chapterIds };
  return base;
}

/* ---------------- 答题界面 ---------------- */

function renderQuiz() {
  const quiz = ui.quiz;
  if (ui.finished) return renderResult();

  const flat = flatten(quiz);
  const idx = flat.findIndex((x) => !ui.answers[x.q.id] || !ui.answers[x.q.id].submitted);
  const current = idx >= 0 ? flat[idx] : null;
  const done = flat.filter((x) => ui.answers[x.q.id] && ui.answers[x.q.id].submitted);
  const correct = done.filter((x) => ui.answers[x.q.id].correct).length;
  const stage = current ? current.stage : null;
  const stageQs = stage ? stage.questions.map((id) => getQuestion(id)).filter(Boolean) : [];

  return `
  <div class="card quiz-card">
    <div class="quiz-progress">
      <div class="row row-wrap">
        <span class="tag tag-soft">${icon('target', { size: 13 })} ${esc(quiz.title)}</span>
        ${stage ? `<span class="tag ${stage.difficulty === 1 ? 'tag-ok' : stage.difficulty === 2 ? 'tag-def' : stage.difficulty === 3 ? 'tag-warn' : 'tag-danger'}">第 ${stage.difficulty} 档 · ${stage.name}</span>` : ''}
        <span class="spacer"></span>
        <span style="font-size:13.5px;color:var(--c-text-soft)">已答 ${done.length}/${flat.length} 题 · 答对 ${correct}</span>
      </div>
      <div class="quiz-steps" role="progressbar" aria-valuemin="0" aria-valuemax="${flat.length}" aria-valuenow="${done.length}">
        ${flat.map((x) => {
          const a = ui.answers[x.q.id];
          const cls = a && a.submitted ? (a.correct ? 'done-ok' : 'done-bad') : (current && x.q.id === current.q.id ? 'current' : '');
          return `<i class="${cls}"></i>`;
        }).join('')}
      </div>
      ${stage ? `<div style="font-size:12.5px;color:var(--c-text-faint);margin-top:8px">${icon('info', { size: 12 })} 第 ${stage.difficulty} 档：${esc(stage.desc)}</div>` : ''}
    </div>

    ${current ? renderQuestion(current, flat.indexOf(current) + 1, flat.length) : renderAllDone()}

    <div class="quiz-footer">
      <button type="button" class="btn btn-ghost" data-action="abort-quiz">${icon('x', { size: 15 })} 结束这组</button>
      <span class="spacer"></span>
      ${current ? `<button type="button" class="btn" data-action="skip">${icon('arrowRight', { size: 15 })} 先跳过</button>` : ''}
      ${done.length === flat.length && flat.length ? `<button type="button" class="btn btn-primary" data-action="finish">${icon('trophy', { size: 15 })} 查看本组结果</button>` : ''}
    </div>
  </div>

  ${stageQs.length > 1 ? `
  <div class="card card-pad" style="margin-top:16px">
    <h3 style="font-size:14.5px;margin-bottom:10px">本档题目一览（难度相同，依次闯关）</h3>
    <div class="stack">
      ${stageQs.map((q, i) => {
        const a = ui.answers[q.id];
        const state = a && a.submitted ? (a.correct ? `<span class="tag tag-ok">已答对</span>` : `<span class="tag tag-danger">答错了</span>`) : `<span class="tag tag-soft">未作答</span>`;
        return `<div class="row"><span style="color:var(--c-text-faint);min-width:20px">${i + 1}</span><span style="flex:1">${richInline(truncate(q.stem, 60))}</span>${state}</div>`;
      }).join('')}
    </div>
  </div>` : ''}`;
}

function renderQuestion({ q, stage }, no, total) {
  const a = ui.answers[q.id] || {};
  const rec = getRecord(q.id, 'question');
  const isChoice = q.type === 'choice' && (q.options || []).length;

  return `
  <div class="quiz-body">
    <div class="q-meta">
      <span class="tag tag-soft">第 ${no} / ${total} 题</span>
      <span class="tag tag-soft">${typeLabel(q.type)}</span>
      ${diffMeter(q.difficulty)}
      ${a.correct === true ? '<span class="tag tag-ok">答对了</span>' : ''}
      ${a.correct === false ? '<span class="tag tag-danger">答错了</span>' : ''}
      <span class="spacer"></span>
      ${rec && rec.srs ? `<span class="due-pill soon">${icon('clock', { size: 12 })} 已在错题本</span>` : ''}
    </div>

    <div class="q-stem"><span class="q-index">${no}.</span>${richInline(q.stem)}</div>

    ${isChoice ? `
    <div class="options" role="group" aria-label="选项">
      ${q.options.map((o, i) => {
        const key = String.fromCharCode(65 + i);
        const picked = a.picked === key;
        let cls = '';
        if (a.submitted) {
          if (isCorrectKey(q, key)) cls = 'is-right';
          else if (picked) cls = 'is-wrong';
        } else if (picked) cls = 'is-picked';
        return `<button type="button" class="option ${cls}" data-action="pick" data-key="${key}" data-qid="${esc(q.id)}" ${a.submitted ? 'disabled' : ''}>
          <span class="key">${key}</span><span>${richInline(String(o).replace(/^[A-D][.、]\s*/, ''))}</span>
        </button>`;
      }).join('')}
    </div>` : `
    <div class="answer-area">
      ${q.type === 'judge' ? `
        <div class="chips">
          <button type="button" class="chip" data-action="pick" data-key="对" data-qid="${esc(q.id)}" ${a.submitted ? 'disabled' : ''} aria-pressed="${a.picked === '对'}">√ 对</button>
          <button type="button" class="chip" data-action="pick" data-key="错" data-qid="${esc(q.id)}" ${a.submitted ? 'disabled' : ''} aria-pressed="${a.picked === '错'}">× 错</button>
        </div>` : `
        <textarea class="textarea" data-action="answer-input" data-qid="${esc(q.id)}"
          placeholder="${q.type === 'proof' ? '把证明的主要步骤写下来，写不完整也没关系，先自己想一遍再看答案' : '写出你的答案（用键盘就能输入公式，例如 x^2/2 + C）'}"
          ${a.submitted ? 'disabled' : ''}>${esc(a.text || '')}</textarea>
        <div style="font-size:12.5px;color:var(--c-text-faint);margin-top:4px">建议先自己在纸上算，再回来看答案对照。</div>`}
    </div>`}

    ${a.submitted ? renderFeedback(q, a) : `
    <div class="quiz-footer" style="border-top:0;background:transparent;padding-left:0;padding-right:0">
      <button type="button" class="btn btn-primary" data-action="submit" data-qid="${esc(q.id)}" ${canSubmit(q, a) ? '' : 'disabled'}>${icon('check', { size: 15 })} 提交答案</button>
      <button type="button" class="btn btn-ghost" data-action="give-up" data-qid="${esc(q.id)}">不会，直接看答案</button>
      ${toolButtons(q.id, 'question')}
    </div>`}
  </div>`;
}

function renderFeedback(q, a) {
  return `
  <div class="answer-feedback ${a.correct ? 'ok' : 'bad'}">
    <div class="head">${a.correct ? `${icon('check', { size: 16 })} 答对了！` : `${icon('x', { size: 16 })} 这次没答对`}</div>
    <div class="solution-box">
      <div class="block-label">${icon('check', { size: 13 })} 正确答案</div>
      <div>${richInline(q.answer)}</div>
      ${q.solution ? `
      <div class="block-label" style="margin-top:12px">${icon('lightbulb', { size: 13 })} 解析</div>
      <div>${rich(q.solution)}</div>` : ''}
      ${!a.correct ? `<div class="block-label" style="margin-top:12px">${icon('alert', { size: 13 })} 你写的</div><div>${richInline(a.text || a.picked || '（空）')}</div>` : ''}
    </div>
    <div class="row row-wrap" style="margin-top:12px">
      <button type="button" class="btn btn-primary btn-sm" data-action="next">${icon('arrowRight', { size: 14 })} 下一题</button>
      ${!a.correct ? `<button type="button" class="btn btn-sm" data-action="add-wrong" data-qid="${esc(q.id)}">${icon('notebook', { size: 14 })} 加入错题本</button>` : ''}
      ${a.correct ? `<button type="button" class="btn btn-sm" data-action="add-wrong" data-qid="${esc(q.id)}">${icon('notebook', { size: 14 })} 这题我也要记下来</button>` : ''}
      ${q.concepts && q.concepts.length ? `<button type="button" class="btn btn-ghost btn-sm" data-action="practice-concept" data-concept="${esc(q.concepts[0])}">${icon('target', { size: 14 })} 再练这个知识点</button>` : ''}
    </div>
  </div>`;
}

function renderAllDone() {
  return `<div class="quiz-body">${emptyState({ iconName: 'trophy', title: '这组题做完了！', desc: '点下面的「查看本组结果」看统计，或者直接再来一组。' })}</div>`;
}

function renderResult() {
  const quiz = ui.quiz;
  const flat = flatten(quiz);
  const answered = flat.filter((x) => ui.answers[x.q.id] && ui.answers[x.q.id].submitted);
  const correct = answered.filter((x) => ui.answers[x.q.id].correct).length;
  const rate = answered.length ? Math.round((correct / answered.length) * 100) : 0;
  const wrong = answered.filter((x) => !ui.answers[x.q.id].correct);

  // 找出最薄弱的知识点，推荐下一步
  const weak = new Map();
  for (const x of wrong) {
    for (const c of x.q.concepts || []) weak.set(c, (weak.get(c) || 0) + 1);
  }
  const weakList = Array.from(weak.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const strongest = answered.filter((x) => ui.answers[x.q.id].correct).map((x) => x.q.concepts || []).flat();
  const strongCount = new Map();
  strongest.forEach((c) => strongCount.set(c, (strongCount.get(c) || 0) + 1));

  return `
  <div class="card quiz-card">
    <div class="quiz-body">
      <div class="row row-wrap" style="gap:20px;align-items:flex-end">
        <div class="score-ring">
          <div class="num">${rate}%</div>
          <div>
            <div style="font-weight:700">正确率</div>
            <div class="lbl">答对 ${correct} / 已答 ${answered.length}（共 ${flat.length} 题）</div>
          </div>
        </div>
        <span class="spacer"></span>
        <div style="text-align:right">
          <div style="font-size:13px;color:var(--c-text-soft)">本组知识点</div>
          <div style="font-weight:700">${esc(quiz.title)}</div>
        </div>
      </div>

      <div class="section-head"><h2>各难度档表现</h2><span class="line"></span></div>
      <div class="difficulty-ladder">
        ${quizDistribution(quiz).map((d) => {
          const qs = d.count;
          const doneQ = (quiz.stages.find((s) => s.difficulty === d.difficulty).questions || [])
            .map((id) => ui.answers[id]).filter((a) => a && a.submitted);
          const okQ = doneQ.filter((a) => a.correct).length;
          const pct = doneQ.length ? Math.round((okQ / doneQ.length) * 100) : 0;
          return `<div class="ladder-row">
            <span style="min-width:76px"><b>${d.name}</b></span>
            ${diffMeter(d.difficulty)}
            <span class="bar"><span style="width:${pct}%"></span></span>
            <span style="min-width:96px;text-align:right;color:var(--c-text-soft)">${okQ}/${doneQ.length || qs} 题正确</span>
          </div>`;
        }).join('')}
      </div>

      ${wrong.length ? `
      <div class="section-head"><h2>需要回头看的知识点</h2><span class="line"></span></div>
      <div class="stack">
        ${wrong.map((x) => `
        <div class="card card-pad" style="border-left:4px solid var(--c-danger)">
          <div class="row row-wrap">
            <span class="tag tag-danger">${typeLabel(x.q.type)} · 难度 ${x.q.difficulty}</span>
            <span class="spacer"></span>
            ${toolButtons(x.q.id, 'question')}
          </div>
          <div style="margin-top:8px">${richInline(truncate(x.q.stem, 90))}</div>
          <div style="margin-top:10px">${richInline(x.q.answer)}</div>
        </div>`).join('')}
      </div>` : `<div class="section-head"><h2>全部答对，漂亮</h2><span class="line"></span></div><p style="color:var(--c-text-soft)">要不要挑战一下更高难度？试着把难度区间拉到「提高 + 挑战」再生成一组。</p>`}

      ${weakList.length ? `
      <div class="section-head"><h2>薄弱点 → 下一组建议</h2><span class="line"></span></div>
      <div class="chips">
        ${weakList.map(([cid, n]) => {
          const it = getItem(cid);
          return `<button type="button" class="chip" data-action="practice-concept" data-concept="${esc(cid)}">${icon('target', { size: 13 })} ${esc(it ? it.name : cid)}（错 ${n} 次）</button>`;
        }).join('')}
      </div>` : ''}
    </div>
    <div class="quiz-footer">
      <button type="button" class="btn btn-primary" data-action="new-quiz">${icon('refresh', { size: 15 })} 再生成一组</button>
      <button type="button" class="btn" data-action="back-setup">${icon('settings', { size: 15 })} 回到出题设置</button>
      <span class="spacer"></span>
      <button type="button" class="btn btn-ghost" data-action="goto-notebook">${icon('notebook', { size: 15 })} 去错题本</button>
    </div>
  </div>`;
}

/* ---------------- 侧栏 ---------------- */

function renderSidePanel() {
  const st = bankStats();
  const settings = getState().settings;
  const books = getBooks();
  const book = books.find((b) => b.id === settings.bookId) || books[0];

  return `
  <div class="card side-card">
    <h3>${icon('briefcase', { size: 14 })} 题库现状</h3>
    <div class="stat-row"><span>可用题目</span><span class="v">${st.total} 道</span></div>
    <div class="stat-row"><span>其中内置原创</span><span class="v">${st.builtin} 道</span></div>
    ${st.imported ? `<div class="stat-row"><span>外部实时题库</span><span class="v">${st.imported} 道</span></div>` : ''}
    <div class="stat-row"><span>覆盖知识点</span><span class="v">${countConceptsWithQuestions()} 个</span></div>
    <div class="stat-row"><span>教材条目</span><span class="v">${book ? book.itemCount : 0} 条</span></div>
    <div style="margin-top:10px">
      <div class="field-label">难度分布</div>
      ${[1, 2, 3, 4].map((d) => {
        const n = st.byDifficulty[d] || 0;
        const pct = st.total ? Math.round((n / st.total) * 100) : 0;
        return `<div class="ladder-row"><span style="min-width:52px">${DIFFICULTY[d].name}</span><span class="bar"><span style="width:${pct}%"></span></span><span style="min-width:40px;text-align:right;color:var(--c-text-soft)">${n}</span></div>`;
      }).join('')}
    </div>
  </div>

  <div class="card side-card">
    <h3>${icon('info', { size: 14 })} 怎么用最有效</h3>
    <ol style="font-size:13.6px;color:var(--c-text-soft);padding-left:1.2em">
      <li>先只选 <b>1 个</b>知识点，做小份题组，把四档都走一遍。</li>
      <li>做错的题点本子图标进错题本，系统会按记忆规律安排复习。</li>
      <li>定义看不懂就切到「教材定理定义」版块，看「说人话」和「为什么要这样想」。</li>
      <li>第二天再回来做同一知识点，正确率会明显不同。</li>
    </ol>
  </div>

  <div class="card side-card">
    <h3>${icon('layers', { size: 14 })} 关于题库来源</h3>
    <p style="font-size:13.4px;color:var(--c-text-soft)">
      本项目的题目都是<b>原创编写</b>并以 CC-BY-4.0 发布，随仓库离线可用，不抓取任何付费题库。
      你可以在「数据与设置」里接入自己或开放许可（如 OpenStax, CC BY 4.0）的题库 JSON，实现实时拉取。
    </p>
  </div>`;
}

function countConceptsWithQuestions() {
  let n = 0;
  for (const i of allItems()) if (qCount(i.id) > 0) n += 1;
  return n;
}

/* ------------------------------------------------------------------ 事件 */

export function practiceActions(action, el, e) {
  const f = ui.form;

  switch (action) {
    case 'mode':
      f.mode = el.dataset.mode;
      break;

    case 'concept-toggle': {
      const id = el.dataset.id;
      if (!qCount(id)) { toast('这个知识点暂时没有配套题', 'warn'); return true; }
      f.concepts = f.concepts.includes(id) ? f.concepts.filter((x) => x !== id) : [...f.concepts, id];
      break;
    }

    case 'random-concept': {
      const pool = allItems().filter((i) => qCount(i.id) > 0);
      if (!pool.length) { toast('题库还是空的', 'warn'); return true; }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      f.mode = 'concept';
      f.concepts = [pick.id];
      toast(`这次练：${pick.name}`, 'ok');
      break;
    }

    case 'size':
      f.size = el.dataset.size;
      break;

    case 'diff-toggle': {
      const d = Number(el.dataset.d);
      const on = d >= f.minDifficulty && d <= f.maxDifficulty;
      // 点已选中的档位 -> 只保留该档；否则在区间上扩
      if (on && f.minDifficulty === d && f.maxDifficulty === d) { f.minDifficulty = 1; f.maxDifficulty = 4; }
      else if (!on) { f.minDifficulty = Math.min(f.minDifficulty, d); f.maxDifficulty = Math.max(f.maxDifficulty, d); }
      else if (d === f.minDifficulty) f.minDifficulty = d + 1;
      else if (d === f.maxDifficulty) f.maxDifficulty = d - 1;
      if (f.minDifficulty > f.maxDifficulty) { f.minDifficulty = 1; f.maxDifficulty = 4; }
      break;
    }

    case 'type-toggle': {
      const t = el.dataset.type;
      f.types = f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t];
      break;
    }

    case 'start': {
      const filter = formToFilter();
      const candidates = collectCandidates(filter);
      if (!candidates.length) { toast('这个条件下没有题目，放松一下条件吧', 'warn'); return true; }
      ui.quiz = buildQuiz({ ...filter, size: f.size, title: undefined });
      ui.answers = {};
      ui.finished = false;
      ui.stageIndex = 0;
      setLastQuiz(ui.quiz);
      bumpStats({ quizSets: 1 });
      toast(`生成成功：共 ${ui.quiz.total} 题，分 ${ui.quiz.stages.length} 档`, 'ok');
      break;
    }

    case 'practice-concept': {
      const cid = el.dataset.concept;
      ui.quiz = buildQuiz({ concepts: [cid], size: 'small', minDifficulty: 1, maxDifficulty: 4 });
      ui.answers = {};
      ui.finished = false;
      setLastQuiz(ui.quiz);
      toast(`围绕「${(getItem(cid) || {}).name || cid}」新开一组`, 'ok');
      break;
    }

    case 'pick': {
      const qid = el.dataset.qid;
      const key = el.dataset.key;
      const a = (ui.answers[qid] = ui.answers[qid] || {});
      if (a.submitted) return true;
      a.picked = key;
      // 选择题点完即可提交，判断题需要按提交按钮确认（判断题也直接提交更顺手）
      if (ui.quiz && isAutoSubmit(qid)) { submitAnswer(qid); }
      break;
    }

    case 'submit':
      submitAnswer(el.dataset.qid);
      break;

    case 'give-up': {
      const qid = el.dataset.qid;
      const a = (ui.answers[qid] = ui.answers[qid] || {});
      a.submitted = true;
      a.correct = false;
      a.gaveUp = true;
      markWrongBook(qid);
      bumpStats({ answered: 1 });
      break;
    }

    case 'next':
      advance();
      break;

    case 'skip': {
      const flat = flatten(ui.quiz);
      const cur = flat.find((x) => !ui.answers[x.q.id] || !ui.answers[x.q.id].submitted);
      if (!cur) { ui.finished = true; break; }
      const a = (ui.answers[cur.q.id] = ui.answers[cur.q.id] || {});
      a.submitted = true;
      a.correct = false;
      a.skipped = true;
      markWrongBook(cur.q.id);
      bumpStats({ answered: 1 });
      break;
    }

    case 'add-wrong': {
      const qid = el.dataset.qid;
      const q = getQuestion(qid);
      const on = toggleNotebook(qid, 'question', qMeta(q));
      toast(on ? '已加入错题本，会按记忆曲线提醒你复习' : '已从错题本移出', on ? 'ok' : 'info');
      break;
    }

    case 'abort-quiz':
      confirmDialog('结束这组题？已作答的记录会保留。', { okText: '结束' }).then((ok) => {
        if (ok) { ui.finished = true; rerender(); }
      });
      return true;

    case 'finish':
      ui.finished = true;
      break;

    case 'new-quiz': {
      const filter = ui.quiz ? ui.quiz.filter : formToFilter();
      ui.quiz = buildQuiz({ ...filter, size: ui.quiz ? ui.quiz.size : f.size });
      ui.answers = {};
      ui.finished = false;
      setLastQuiz(ui.quiz);
      bumpStats({ quizSets: 1 });
      break;
    }

    case 'back-setup':
      ui.quiz = null;
      ui.answers = {};
      ui.finished = false;
      break;

    case 'goto-notebook':
      location.hash = '#/notebook';
      return true;

    default:
      return false;
  }
  rerender();
  return true;
}

/** 输入类事件（不触发整页重渲染，避免光标丢失） */
export function practiceInput(action, el) {
  if (action === 'answer-input') {
    const qid = el.dataset.qid;
    const a = (ui.answers[qid] = ui.answers[qid] || {});
    a.text = el.value;
    // 动态启用/禁用提交按钮
    const card = el.closest('.quiz-body');
    const btn = card && card.querySelector('[data-action="submit"]');
    if (btn) btn.disabled = !String(a.text || '').trim();
    return true;
  }
  if (action === 'concept-search') {
    const box = document.getElementById('concept-chips');
    if (box) box.innerHTML = renderConceptChips(el.value);
    return true;
  }
  if (action === 'chapter-select') {
    ui.form.chapterIds = Array.from(el.selectedOptions).map((o) => o.value);
    return true;
  }
  return false;
}

/* ---------------- 内部工具 ---------------- */

function flatten(quiz) {
  if (!quiz) return [];
  const out = [];
  for (const stage of quiz.stages || []) {
    for (const id of stage.questions) {
      const q = getQuestion(id);
      if (q) out.push({ q, stage });
    }
  }
  return out;
}

const isAutoSubmit = (qid) => {
  const q = getQuestion(qid);
  return q && (q.type === 'choice' || q.type === 'judge');
};

const canSubmit = (q, a) => {
  if (q.type === 'choice' || q.type === 'judge') return Boolean(a.picked);
  return Boolean(String(a.text || '').trim());
};

/** 判断某个选项 key 是否是正确答案 */
function isCorrectKey(q, key) {
  const ans = String(q.answer || '').trim();
  if (/^[A-D]$/i.test(ans)) return ans.toUpperCase() === key.toUpperCase();
  // 答案写的是选项原文的情况
  const idx = (q.options || []).findIndex((o) => String(o).trim() === ans);
  if (idx >= 0) return String.fromCharCode(65 + idx) === key;
  return ans.startsWith(key);
}

/** 简易判分：选择题比对 key；填空题按去空白、去全角半角差异比对 */
function judge(q, a) {
  const ans = String(q.answer || '').trim();
  if (q.type === 'choice') return isCorrectKey(q, a.picked);
  if (q.type === 'judge') {
    const norm = (s) => String(s).replace(/[√对正确true是]/gi, '对').replace(/[×错错误false否]/gi, '错');
    return norm(ans) === norm(a.picked);
  }
  const norm = (s) =>
    String(s || '')
      .replace(/\s+/g, '')
      .replace(/[，。；：、（）()【】\[\]{}]/g, '')
      .replace(/[＋﹢]/g, '+')
      .replace(/[－ー—–]/g, '-')
      .replace(/[×✕]/g, '*')
      .replace(/[／]/g, '/')
      .replace(/[＝]/g, '=')
      .toLowerCase();
  const user = norm(a.text);
  const std = norm(ans);
  if (!user) return false;
  if (user === std) return true;
  // 多答案用分号分隔时，只要包含标准答案的关键部分也算对
  return std.length > 2 && (user.includes(std) || std.includes(user));
}

function submitAnswer(qid) {
  const q = getQuestion(qid);
  const a = (ui.answers[qid] = ui.answers[qid] || {});
  if (a.submitted) return;
  if (!canSubmit(q, a)) { toast('先写点答案再提交吧', 'warn'); return; }
  a.submitted = true;
  a.correct = judge(q, a);
  bumpStats({ answered: 1, correct: a.correct ? 1 : 0 });
  if (!a.correct) {
    markWrongBook(qid);
    toast('答错了，已自动记入错题本', 'bad');
  } else {
    toast('答对了！', 'ok');
  }
  rerender();
}

/** 做错的题自动加入错题本（用户还能手动移出） */
function markWrongBook(qid) {
  const q = getQuestion(qid);
  if (!q) return;
  const rec = getRecord(qid, 'question');
  if (!rec || !rec.srs) toggleNotebook(qid, 'question', qMeta(q));
}

function qMeta(q) {
  if (!q) return {};
  return {
    chapterId: q.chapterId,
    title: `${typeLabel(q.type)} · ${truncate(stripTags(q.stem), 40)}`,
    preview: stripTags(q.stem),
    extra: { concepts: q.concepts || [], tags: q.tags || [], difficulty: q.difficulty, answer: stripTags(q.answer) },
  };
}

export const questionMeta = qMeta;

function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[\[(?:tip|warn):([\s\S]*?)\]\]/g, '$1');
}

const truncate = (s, n) => {
  const t = String(s || '');
  return t.length > n ? t.slice(0, n) + '…' : t;
};

/** 推进到下一题；本档答完自动进入下一档并给出提示 */
function advance() {
  const flat = flatten(ui.quiz);
  const cur = flat.find((x) => !ui.answers[x.q.id] || !ui.answers[x.q.id].submitted);
  if (!cur) {
    ui.finished = true;
    rerender();
    return;
  }
  // 是否刚好完成某一档
  const stage = cur.stage;
  const stageDone = stage.questions.every((id) => {
    const a = ui.answers[id];
    return a && a.submitted;
  });
  rerender();
  if (stageDone) {
    const stageIdx = (ui.quiz.stages || []).findIndex((s) => s.difficulty === stage.difficulty);
    const next = (ui.quiz.stages || [])[stageIdx + 1];
    if (next) {
      toast(`第 ${stage.difficulty} 档完成！进入第 ${next.difficulty} 档「${next.name}」`, 'ok');
    } else {
      toast('全部档位完成！', 'ok');
    }
  }
}

/* 视图重渲染由 app.js 注入，避免循环依赖 */
let rerenderFn = () => {};
export function bindRerender(fn) { rerenderFn = fn; }
const rerender = () => rerenderFn();
