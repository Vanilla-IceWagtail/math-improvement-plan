# 内容数据规范（Content Spec v1）

本项目所有教材内容与题目内容都是**纯数据**（普通 JavaScript 模块，导出对象），
不依赖任何后端、数据库或第三方服务。任何人（包括 AI）都可以按本规范批量贡献内容。

> 版权底线：教材中的**定义名、定理名、章节名**属于客观事实与标题，可以引用；
> 但**解释文字、证明文字、题目**必须是贡献者自己撰写的原创表述，禁止整段抄录教材原文。

---

## 1. 文件组织

```
data/books/<bookId>.js        一本书一个模块（如 tongji-gaoshu-1）
data/books/registry.js        教材登记表，新增教材只需在这里加一行
data/questions/<bookId>.js    一本书配套题库
data/questions/bank.js        题库汇总 + 校验
```

## 2. 教材模块结构

```js
export default {
  id: 'tongji-gaoshu-1',
  title: '高等数学（上册）',
  edition: '同济大学出版社 · 第八版',
  author: '同济大学数学科学学院',
  publisher: '高等教育出版社',
  licenseNote: '本书仅登记书名、章节名、定义名、定理名等事实性信息，全部讲解与证明均为本项目原创撰写。',
  subject: 'calculus',
  level: '大学本科一年级',
  tags: ['微积分', '一元函数'],
  chapters: [ /* Chapter[] */ ],
};
```

### Chapter

```js
{
  id: 'ch1',
  no: 1,
  title: '函数与极限',
  intro: '这一章在讲什么（1~3 句人话）',
  sections: [ /* Section[] */ ],
}
```

### Section

```js
{
  id: 'ch1-1',
  no: '1.1',
  title: '映射与函数',
  summary: '本节一句话概览',
  items: [ /* Item[] */ ],
}
```

### Item（定义 / 定理 / 公式 / 说明）

```js
{
  id: 'def-limit-sequence',
  kind: 'definition',        // definition | theorem | formula | note
  name: '数列极限的定义',
  aka: ['ε-N 定义'],          // 别名，用于搜索，可省略
  statement: '把结论用严谨的话写一遍（可含 <code> 行内标记）',
  plain: '用初中生也能听懂的话解释一遍',
  why: '为什么要这样定义 / 这个定理为什么成立、证明思路从哪来',
  proof: '证明过程（仅 theorem 必须；definition 可写“由定义可直接得到”类短证）',
  example: '一个最小例子，帮助理解',
  pitfalls: ['常见错误 1', '常见错误 2'],
  tags: ['极限', '数列'],
  related: ['thm-limit-unique'],  // 其它 item 的 id
}
```

**字段硬性要求**

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 全局唯一，只含小写字母、数字、连字符 |
| `kind` | ✅ | `definition` 与 `theorem` 必须区分清楚 |
| `name` | ✅ | 定义/定理名称 |
| `statement` | ✅ | 严谨陈述 |
| `plain` | ✅ | 通俗解释，**不允许出现未解释的术语堆砌** |
| `why` | theorem 必填 | 证明思路来源 |
| `proof` | theorem 必填 | 完整证明，步骤要有过渡句 |
| `example` | 建议 | 最小例子 |
| `pitfalls` | 建议 | 易错点 |

### 行内标记约定（不使用 LaTeX，保证零依赖离线可用）

| 写法 | 效果 |
| --- | --- |
| `<code>ε-N</code>` | 行内代码/数学 |
| `<b>重点</b>` | 加粗 |
| `<sup>2</sup>` / `<sub>n</sub>` | 上标 / 下标 |
| `[[tip:文本]]` | 小提示块 |
| `[[warn:文本]]` | 易错警示块 |

多行文本用 `\n` 分隔，渲染为段落。

> ⚠️ **不要用 HTML 实体写尖括号。** 早期内容里有人写成 `&gt;` / `&lt;` 来绕开转义，
> 结果渲染时被二次转义，浏览器显示成字面的 `&gt;`（实测 505 处，已修复）。
> 现在渲染管线会先把实体解码成真字符再统一转义，所以：
>
> - 想显示大于号，**直接写 `>`**，例如 `<code>ε > 0</code>`
> - `&gt;` 虽然也能正确显示，但**不推荐**，徒增一层间接
> - `<` 同理直接写。注意 `<b>` 是白名单标签，`a<b>c` 会被当成加粗，
>   不等式请写 `a < b`（两侧留空格）
>
> 回归测试见 `scripts/test-math.mjs` 第 2 节，会拦住任何双重转义。

### 极限号的写法（会被自动排成教科书样式）

不要为了让 `lim` 好看而手写 HTML。直接按下面任意一种写法写，
`js/math.js` 会在渲染时把趋近条件排到 `lim` 正下方（与教材排版一致）：

| 写法 | 说明 |
| --- | --- |
| `lim(x→0)` | 括号式，最常用 |
| `lim[x→0]` | 方括号式 |
| `lim_{n→∞}` | LaTeX 风格 |
| `lim<sub>x→a</sub>` | 直接写下标 |
| `lim(x→0<sup>+</sup>)` | 单侧极限 |
| `lim f(x)` | 前置式 —— **保持并列**，不会把 `f(x)` 塞进下标 |

示例：

```js
statement: '若 <code>lim(x→0) f(x) = f(0)</code>，则 <code>f</code> 在 <code>x = 0</code> 处连续。'
```

渲染结果：`lim` 下方居中显示 `x→0`。

完整的数学记号支持与实现说明见 `js/math.js` 顶部注释；
回归测试见 `node scripts/test-math.mjs`。

## 3. 题库结构

```js
export default {
  bookId: 'tongji-gaoshu-1',
  questions: [ /* Question[] */ ],
};
```

### Question

```js
{
  id: 'q-ch1-lim-001',
  chapterId: 'ch1',
  sectionId: 'ch1-2',        // 可省略
  concepts: ['def-limit-sequence'],  // 关联的教材 item id，用于“按知识点出题”
  tags: ['极限', '数列极限'],
  type: 'fill',              // choice | fill | judge | proof | compute
  difficulty: 2,             // 1 入门 / 2 基础 / 3 提高 / 4 挑战
  stem: '题干',
  options: ['A 选项', 'B 选项'],  // type=choice 必填
  answer: '答案（与 options 对应时写选项原文，或写选项序号如 "B"）',
  solution: '解析，要讲清思路而不只是给结果',
  source: 'original',        // original | imported
  license: 'CC0-1.0 / MIT / 教材原创题等',
  attribution: '若为导入题，写明来源与作者',
}
```

**难度递进约定**：`组题组` 只会把 `difficulty` 相同或相邻的题放在同一档，
并按 `concepts` 聚类，形成「同一知识点、难度阶梯上升」的题组。

## 4. 校验

```bash
node scripts/validate-content.mjs
```

会检查：id 唯一性、必填字段、`concepts`/`related` 引用是否存在、
choice 题是否有 options、难度是否在 1~4、行内标记是否闭合。
