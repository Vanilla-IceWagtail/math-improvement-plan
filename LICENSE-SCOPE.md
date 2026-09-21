# 许可范围说明

本文件说明**哪部分内容适用哪份许可**。许可正文见 [`LICENSE`](LICENSE)（代码）与
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)（原创内容）。

> 为什么单独放一个文件：GitHub 的许可证识别是对 `LICENSE` 做**严格全文匹配**，
> 只要在里面附加任何一段说明文字，就会被归类成 "Other"，仓库不再显示
> `BSD-3-Clause` 徽章。所以 `LICENSE` 保持官方纯正文，范围说明挪到这里。

---

## 一、适用 BSD 3-Clause 的部分

以下内容适用 [`LICENSE`](LICENSE) 里的 BSD 3-Clause：

| 路径 | 内容 |
| --- | --- |
| `index.html` | 页面入口 |
| `js/**` | 全部前端逻辑（含 `js/views/`） |
| `styles/**` | 样式表 |
| `scripts/**` | 静态服务器、内容校验器、冒烟测试、题库导入管道 |
| `package.json` | 项目清单 |
| `README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`、`docs/**`、本文件 | 文档 |

BSD 3-Clause 允许自由使用、修改、分发和商用，条件是：

1. 保留版权声明与免责声明；
2. 以二进制形式分发时，在文档中复现上述声明；
3. **不得用本项目的名义或贡献者的名字为你的衍生产品背书**。

---

## 二、适用 CC BY 4.0 的部分

`data/` 目录下的**原创内容**适用
[Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)：

| 路径 | 内容 |
| --- | --- |
| `data/books/**` | 教材条目的通俗解释、证明、例题、易错点 |
| `data/questions/**` | 题库题目与解析 |
| `data/concept-aliases.js` | 知识点别名表 |

CC BY 4.0 允许自由复制、修改、分发、翻译、商用，**只需保留署名**。

选择 CC BY 4.0 而不是 BSD 的原因：内容的价值在于被尽可能广地传播和改编，
署名即可，不需要 BSD 第 3 条那种对"背书"的限制。

---

## 三、第三方内容

本项目**不内置**任何第三方题库。若你通过「数据与设置 → 实时题库」或
`scripts/fetch-open-bank.mjs` 导入外部题目，那部分内容**保留其原许可**，
你必须按原题库的许可使用并保留其署名与许可声明。

建议的合法来源与对应许可：

| 来源 | 许可 |
| --- | --- |
| [OpenStax](https://openstax.org) | CC BY 4.0 |
| [MIT OpenCourseWare](https://ocw.mit.edu) | CC BY-NC-SA 4.0（非商用） |
| [Wikibooks](https://www.wikibooks.org) / Wikiversity | CC BY-SA 4.0 |
| 你自己或你所在学校自编题库 | 由你决定 |

---

## 四、关于教材引用

本项目收录了同济大学《高等数学》上册（第八版）的**知识结构**，具体边界：

**收录（属于事实性信息，不受版权保护）**

- 书名、作者、出版社、版次
- 章节编号与章节标题
- 定义名与定理名
- 数学命题与证明方法本身

**未收录**

- 教材正文的任何段落原文
- 教材的例题、习题、习题解答原文
- 教材的插图、排版、图表

`data/books/*.js` 里每个条目的 `statement`、`plain`、`why`、`proof`、`example`、
`pitfalls` 字段均为本项目原创撰写。也就是说：**教材提供"有哪些定理"，本项目提供"怎么讲才听得懂"。**

如果你希望移除某本教材，删掉 `data/books/registry.js` 里对应条目即可，代码无需改动。

---

## 五、免责

- 本项目是学习辅助工具，不保证覆盖教学大纲，也不替代课堂教学与教材。
- 内容由社区贡献，虽经过 `npm run validate`、`npm run smoke`、`npm run verify-readme`
  三重自动校验，但**仍可能存在数学错误**。发现错误欢迎提 Issue。
- 如权利人认为本项目某处内容侵犯其权利，请提 Issue 说明具体条目与理由，我们会立即删除或改写。

更完整的版权与隐私说明见 [`docs/legal.md`](docs/legal.md)。
