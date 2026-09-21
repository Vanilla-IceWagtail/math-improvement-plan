/**
 * scripts/ci-actions.mjs —— CI 所用 GitHub Actions 的版本清单（单一事实来源）
 *
 * 为什么单独抽一个文件：
 *   v4 系列的 action 运行在 node20 上，GitHub 已标记 deprecated，会在每次运行的
 *   日志里刷警告；v5 起改用 node24。这类问题很容易在"照抄旧模板"时复发，
 *   所以把版本号集中在这里，由 scripts/verify-readme.mjs 自动校验工作流
 *   没有退回旧版本。
 *
 * 维护方式：升级某个 action 时，改这里的 min 和工作流里的 tag，两处保持一致即可。
 */

export const CI_ACTIONS = [
  { name: 'actions/checkout', min: 5, why: 'v4 用 node20（已 deprecated），v5 起用 node24' },
  { name: 'actions/setup-node', min: 5, why: '同上' },
  { name: 'actions/configure-pages', min: 6, why: 'v5 仍用 node20，v6 起才用 node24' },
  { name: 'actions/upload-pages-artifact', min: 5, why: 'composite action，无 node 运行时问题' },
  { name: 'actions/deploy-pages', min: 5, why: 'v4 用 node20，v5 起用 node24' },
];

/**
 * 从一段 workflow YAML 文本里抽出所有 `uses: owner/repo@tag`
 * @param {string} yml
 * @returns {{name:string, tag:string, major:number}[]}
 */
export function extractUses(yml) {
  const out = [];
  for (const m of String(yml).matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@(\S+)/g)) {
    const major = Number(String(m[2]).replace(/^v/, '').split('.')[0]);
    out.push({ name: m[1], tag: m[2], major: Number.isFinite(major) ? major : -1 });
  }
  return out;
}

/**
 * 校验一批 workflow 文本里的 action 版本是否都满足 min 要求
 * @param {Record<string,string>} files 文件名 -> 内容
 * @returns {{ok:boolean, problems:string[]}}
 */
export function checkActionVersions(files) {
  const problems = [];
  for (const [file, yml] of Object.entries(files)) {
    for (const u of extractUses(yml)) {
      const spec = CI_ACTIONS.find((a) => a.name === u.name);
      if (!spec) continue; // 未登记的 action 不检查
      if (u.major < spec.min) {
        problems.push(`${file}: ${u.name}@${u.tag} 低于要求的 v${spec.min}（${spec.why}）`);
      }
    }
  }
  return { ok: problems.length === 0, problems };
}
