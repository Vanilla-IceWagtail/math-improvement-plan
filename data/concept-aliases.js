/**
 * concept-aliases.js —— 知识点别名表
 *
 * 为什么需要它：
 *   题库里的每道题用 `concepts: ['xxx']` 标注它考的是教材里哪一条定义/定理。
 *   写题库和写教材的可能是不同的人（甚至不同的 AI 贡献者），命名习惯很难天然一致：
 *   题库里可能写 `thm-rolle`，教材里可能写成 `thm-rolle-theorem`。
 *
 *   与其强行要求所有人改 id（会破坏已有的 related 交叉引用），
 *   不如在这里维护一张**别名表**：把题库用的 id 映射到教材里真实存在的条目 id。
 *   组题组时两者都会解析到同一个条目，用户看到的知识点名称也统一了。
 *
 * 贡献方式：
 *   运行 `node scripts/validate-content.mjs`，报告里会列出"题目引用了但教材里没有的知识点"，
 *   逐个把它们加进下面的表即可。别名表里右边的值必须是教材里真实存在的 item id。
 *
 * 这是一个**可选**文件：表为空也能正常运行，只是那些题不会归到任何知识点上。
 */

/** @type {Record<string,string>} 题库/旧名 -> 教材真实 item id */
export const CONCEPT_ALIASES = {
  /* ---------- 第 1 章 函数与极限 ---------- */
  'def-limit-function': 'def-limit-finite',
  'def-limit-left-right': 'def-limit-one-sided',
  'def-infinitesimal': 'def-infinitesimal',
  'def-infinitesimal-order': 'def-infinitesimal-order',
  'def-continuity': 'def-continuity-point',
  'def-discontinuity-types': 'def-discontinuity-types',
  'def-uniform-continuity': 'def-uniform-continuity',
  'thm-limit-unique': 'thm-lim-unique',
  'thm-limit-bounded': 'thm-conv-bounded',
  'thm-limit-sign': 'thm-lim-sign-preserve',
  'thm-limit-arith': 'thm-lim-operations',
  'thm-cauchy-criterion': 'thm-cauchy-criterion',
  'thm-squeeze': 'thm-squeeze',
  'thm-monotone-bounded': 'thm-monotone-bounded',
  'thm-equivalent-substitution': 'thm-equivalent-substitution',
  'thm-elementary-continuity': 'thm-elementary-continuity',
  'thm-max-min-theorem': 'thm-extreme-value',
  'thm-intermediate-value': 'thm-intermediate-value',
  'thm-bolzano-zero': 'thm-zero-point',
  'thm-uniform-continuity': 'thm-cantor',
  'thm-infinitesimal-reciprocal': 'thm-infinitesimal-infinity-relation',
  'lim-sin-x-over-x': 'thm-important-limit-one',
  'lim-one-plus-x': 'thm-important-limit-two',

  /* ---------- 第 2 章 导数与微分 ---------- */
  'form-basic-derivatives': 'thm-basic-derivative-formulas',
  'thm-derivative-arith': 'thm-derivative-rules',
  'thm-derivative-inverse': 'thm-inverse-function-derivative',
  'method-implicit-differentiation': 'met-implicit-differentiation',
  'method-log-derivative': 'met-logarithmic-differentiation',
  'method-parametric-derivative': 'met-parametric-differentiation',
  'def-related-rates': 'thm-related-rates',
  'def-higher-derivative': 'def-higher-order-derivative',
  'thm-differential-invariance': 'thm-differential-form-invariance',
  'app-linear-approximation': 'thm-approx-computation',

  /* ---------- 第 3 章 微分中值定理与导数的应用 ---------- */
  'thm-rolle': 'thm-rolle',
  'thm-lagrange-mvt': 'thm-lagrange',
  'thm-lhopital': 'thm-lhopital-00',
  'def-inflection-point': 'def-inflection',
  'thm-monotonicity-test': 'thm-monotonicity',
  'thm-first-derivative-extremum': 'thm-extremum-first',
  'thm-second-derivative-extremum': 'thm-extremum-second',
  'form-maclaurin': 'mclaurin-formula',
  'form-curvature': 'thm-curvature-formula',
  'method-bisection': 'meth-bisection',
  'method-newton': 'meth-newton',

  /* ---------- 第 4 章 不定积分 ---------- */
  'form-basic-integrals': 'def-basic-integral-table',
  'method-substitution-first': 'thm-substitution-rule',
  'method-substitution-second': 'thm-substitution-rule-2',
  'method-trig-substitution': 'def-trig-substitution',
  'method-integration-by-parts': 'thm-integration-by-parts',
  'form-partial-fractions': 'def-partial-fractions',
  'method-rational-integral': 'def-rational-steps',
  'method-universal-trig-sub': 'def-trig-rational-integral',

  /* ---------- 第 5 章 定积分 ---------- */
  'prop-definite-integral': 'thm-integral-properties',
  'thm-integral-mean-value': 'thm-integral-mean-value',
  'def-accumulation-function': 'def-variable-upper-integral',
  'thm-accumulation-derivative': 'thm-variable-upper-derivative',
  'form-definite-substitution': 'thm-integral-substitution',
  'form-definite-by-parts': 'thm-integral-by-parts',
  'prop-definite-symmetry': 'prop-integral-even-odd',
  'def-improper-singular': 'def-improper-unbounded',
  'thm-comparison-test': 'thm-comparison-infinite',
  'thm-antiderivative-existence': 'thm-antiderivative-existence',
  'thm-integrable-sufficient': 'thm-integral-sufficient-condition',
  'def-gamma-function': 'def-gamma-function',

  /* ---------- 第 6 章 定积分的应用 ---------- */
  'method-element': 'fml-element-method-steps',
  'form-area-cartesian': 'fml-area-cartesian',
  'form-area-polar': 'fml-area-polar',
  'form-volume-disk': 'fml-volume-disk',
  'form-volume-shell': 'fml-volume-shell',
  'form-volume-cross-section': 'fml-volume-cross-section',
  'form-arc-length': 'fml-arc-length-cartesian',
  'form-surface-area': 'fml-surface-area-revolution',
  'form-work': 'fml-work-variable-force',
  'form-water-pressure': 'fml-water-pressure',
  'form-gravity': 'fml-gravitation',
  'form-average-value': 'fml-average-value',

  /* ---------- 第 7 章 微分方程 ---------- */
  'def-general-solution': 'def-general-particular-solution',
  'def-initial-value': 'def-initial-condition',
  'method-separable': 'def-separable-equation',
  'method-homogeneous-substitution': 'thm-homogeneous-substitution',
  'def-first-order-linear': 'def-first-order-linear',
  'form-first-order-linear-solution': 'thm-first-order-linear-formula',
  'method-constant-variation': 'thm-constant-variation',
  'method-reduction-of-order': 'thm-reducible-type-xp',
  'method-characteristic-equation': 'thm-char-equation',
  'method-undetermined-coefficients': 'thm-undetermined-coeff-poly',
  'def-linear-independence': 'def-linear-dependence',
  'thm-linear-solution-structure': 'thm-homogeneous-general-solution',
};

/**
 * 把题库里的知识点 id 解析成教材里真实存在的 item id。
 * 解析不到时原样返回（这样界面仍能显示 id，方便贡献者发现并补别名）。
 * @param {string} id
 * @returns {string}
 */
export const resolveConcept = (id) => CONCEPT_ALIASES[id] || id;

/**
 * 由上面的"别名 -> 真实 id"表推导出**反向**表（真实 id -> 常用别名）。
 * 好处：题库里写 `thm-rolle`、教材里写 `thm-lagrange`，两边互相引用时都能对上，
 * 贡献者不必记住用的是哪一套命名。
 */
export const REVERSE_ALIASES = (() => {
  const rev = {};
  for (const [alias, target] of Object.entries(CONCEPT_ALIASES)) {
    if (alias === target) continue;
    if (!rev[target]) rev[target] = alias;
  }
  return rev;
})();

/** 双向解析：先查正表，再查反表，都没有就原样返回 */
export const resolveConceptBoth = (id) => CONCEPT_ALIASES[id] || REVERSE_ALIASES[id] || id;

/** 反向：教材 item id -> 是否被当作别名映射过（用于诊断） */
export const aliasSourcesOf = (itemId) =>
  Object.entries(CONCEPT_ALIASES).filter(([, v]) => v === itemId).map(([k]) => k);
