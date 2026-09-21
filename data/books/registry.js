/**
 * books/registry.js —— 教材登记表
 *
 * 新增一本教材只需两步：
 *   1. 新建 data/books/<你的书>.js，按 docs/content-spec.md 导出章节数组；
 *   2. 在下面 BOOK_FILES 里加一行。
 * 页面会自动出现在「教材定理定义」版块的教材下拉框里。
 *
 * 关于版权：本表只登记书名、版次、章节名、定义名、定理名这类事实性信息，
 * 所有讲解、通俗解释和证明都由本项目原创撰写，不抄录教材原文。
 */

/** 每本书由若干「章节模块」拼成，章节模块可拆文件，便于多人协作、减少冲突 */
export const BOOK_FILES = [
  {
    id: 'tongji-gaoshu-1',
    meta: {
      title: '高等数学（上册）',
      edition: '同济大学出版社 · 第八版',
      author: '同济大学数学科学学院',
      publisher: '高等教育出版社',
      subject: 'calculus',
      level: '大学本科一年级',
      tags: ['微积分', '一元函数'],
      licenseNote:
        '本项目仅登记本书书名、章节名、定义名、定理名等事实性信息；全部通俗解释、证明与例题均为原创撰写，未抄录教材原文。',
    },
    chapters: [
      'data/books/tongji-gaoshu-1.js', // 第 1 章：函数与极限
      'data/books/chapter-2.js',
      'data/books/chapter-3.js',
      'data/books/chapter-4.js',
      'data/books/chapter-5.js',
      'data/books/chapter-6.js',
      'data/books/chapter-7.js',
    ],
  },
];

/** 题库文件登记 */
export const QUESTION_FILES = [
  'data/questions/tongji-gaoshu-1-ch1-3.js',
  'data/questions/tongji-gaoshu-1-ch4-7.js',
];

/**
 * 一个「空壳教材」的示例，复制它就能开始写新书。
 * 只在 registry 里登记 BOOK_FILES 即可，不需要改任何 JS 逻辑。
 */
export const EXAMPLE_BOOK_SKELETON = {
  id: 'your-book-id',
  meta: {
    title: '线性代数',
    edition: '某出版社 · 第 1 版',
    author: '某作者',
    subject: 'linear-algebra',
    level: '大学本科一年级',
    tags: ['矩阵', '向量'],
    licenseNote: '……',
  },
  chapters: ['data/books/your-book-ch1.js'],
};
