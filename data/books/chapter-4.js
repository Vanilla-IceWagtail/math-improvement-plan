// 同济《高等数学》上册（第八版）· 第4章 不定积分
//
// 说明：本书目仅登记章节名、定义名、定理名等事实性信息，全部讲解、证明与例题
// 均为本项目原创撰写。行内标记只使用 <code> <b> <i> <sup> <sub> <br> 与
// [[tip:...]]、[[warn:...]]，不使用 LaTeX 与 Markdown。

export default {
  id: 'ch4',
  no: 4,
  title: '不定积分',
  intro:
    '前面几章一直在做一件事：给你一个函数，求它的导数。这一章把方向盘打反，反过来问——已知一个函数的导数，能不能把原来那个函数找回来？这个"倒着求导"的操作叫不定积分。' +
    '\n它是整个微积分里最像手艺活的一章：概念其实只有两三个，剩下的全是方法（凑微分、换元、分部、部分分式）和熟练度。' +
    '\n更要紧的是，第 5 章的定积分、第 6 章的微分方程都要靠这一章吃饭。这一章算不利索，后面全是空谈。',
  sections: [
    // ================= 4.1 =================
    {
      id: 'ch4-1',
      no: '4.1',
      title: '不定积分的概念与性质',
      summary:
        '先回答"原函数是什么、存不存在、有多少个"，再把"求原函数"这件事正式命名为不定积分，最后给出一张必须背熟的积分表和两条运算法则。',
      items: [
        {
          id: 'def-antiderivative',
          kind: 'definition',
          name: '原函数',
          aka: ['反导数', 'antiderivative'],
          statement:
            '设函数 <code>f(x)</code> 在区间 <code>I</code> 上有定义。如果存在一个函数 <code>F(x)</code>，使得对区间 <code>I</code> 上每一点 <code>x</code> 都有\n<code>F′(x) = f(x)</code>，\n那么就称 <code>F(x)</code> 是 <code>f(x)</code> 在区间 <code>I</code> 上的一个<b>原函数</b>。',
          plain:
            '原函数就是"倒着求导"求出来的那个函数。\n举个生活里的例子：你的手机只记录速度（每秒跑几米），没记录位置。现在你想还原"走了多远"。那"位置"就是"速度"的原函数——因为位置对时间求导，得到的正好是速度。\n注意原函数是"整段路"上的概念，必须在一整个区间上都成立，只在某一个点凑巧对上不算数。',
          why:
            '我们要造一个新词，就必须先把它定义得没有歧义。这里的关键词有三个：<b>存在</b>（有这个函数）、<b>每一点</b>（不是个别点）、<b>区间</b>（不能是散点集）。考研和期末最爱埋的坑就是"在某点可导"和"在某区间上 F′(x)=f(x)"的区别。',
          proof:
            '这是定义，不需要证明。但要立刻会做一种最基础的验证：<b>检验某个函数是不是原函数，就是把它求导，看等不等于被积函数。</b>\n例如取 <code>F(x) = x<sup>2</sup></code>，求导得 <code>2x</code>，所以 <code>x<sup>2</sup></code> 是 <code>2x</code> 在整条实轴上（区间取 <code>(-∞, +∞)</code>）的原函数。\n再试 <code>F(x) = ln x</code>，它在区间 <code>(0, +∞)</code> 上求导得 <code>1/x</code>，所以它是 <code>1/x</code> 在 <code>(0, +∞)</code> 上的原函数；但在区间 <code>(-∞, 0)</code> 上它根本没定义，所以不能说它是 <code>1/x</code> 在整条实轴上的原函数——这就是"区间"三个字的分量。',
          example:
            '<code>2x</code> 的原函数有哪些？<code>x<sup>2</sup></code> 是，<code>x<sup>2</sup> + 1</code> 是，<code>x<sup>2</sup> - 100</code> 也是。因为它们求导都得到 <code>2x</code>。\n而 <code>x<sup>2</sup> + x</code> 就不是，因为它求导得到 <code>2x + 1</code>，多出来一个 1。',
          pitfalls: [
            '把"原函数"和"导数"搞反方向：<code>F</code> 是 <code>f</code> 的原函数，意思是 <code>F′ = f</code>，不是 <code>f′ = F</code>。',
            '忘记写区间：<code>1/x</code> 在 <code>(0, +∞)</code> 上的原函数是 <code>ln x</code>，但在 <code>(-∞, 0)</code> 上要写成 <code>ln(-x)</code>，两个区间的结论不能混着用。',
            '以为原函数只能有一个。事实上原函数一旦存在就有无穷多个（见下一条定理）。',
          ],
          tags: ['不定积分', '原函数', '概念'],
          related: ['thm-antiderivative-structure', 'def-indefinite-integral', 'thm-antiderivative-existence-ch4'],
        },
        {
          id: 'thm-antiderivative-existence-ch4',
          kind: 'theorem',
          name: '原函数存在定理',
          aka: ['连续函数必有原函数', '变上限积分'],
          statement:
            '如果函数 <code>f(x)</code> 在区间 <code>I</code> 上连续，那么 <code>f(x)</code> 在 <code>I</code> 上一定存在原函数。\n更具体地说：在 <code>I</code> 上取定一点 <code>a</code>，令\n<code>Φ(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt</code>，\n则 <code>Φ(x)</code> 在 <code>I</code> 上可导，并且 <code>Φ′(x) = f(x)</code>。也就是说，<b>连续函数的变上限积分就是它的一个原函数</b>。',
          plain:
            '这句话给了我们一颗定心丸：只要是连续的函数，原函数一定找得到，不会白费力气。\n注意它说的是"存在"，没说"能用基本公式写出来"。这就像"每个整数都有质因数分解"，但分解好不好算完全是另一回事——所以后面 4.2、4.3、4.4 三节全在教技巧。\n至于用积分号 <code>∫<sub>a</sub><sup>x</sup></code> 造出来的那个 <code>Φ(x)</code>：它的意思不是"算出面积"，而是"用一块会动的面积当函数"。这种"用积分定义出来的新函数"是数学里极常见的造函数手法。',
          why:
            '为什么偏偏要用变上限积分来造原函数？因为求导需要"函数值之差除以自变量之差"，而积分天生就是"把一小块一小块加起来"。把上限从 <code>x</code> 挪到 <code>x + Δx</code>，增加的恰好是又一条细长条，这条细长条的"高"约等于 <code>f(x)</code>、"宽"是 <code>Δx</code>。于是"增量 ÷ Δx"就约等于 <code>f(x)</code>——这正是导数的形式。\n<b>证明思路一句话：导数是增量的商，积分是细条的累加，两者一相除，细条的高就露出来了。</b>',
          proof:
            '第一步，先说明 <code>Φ</code> 有定义。因为 <code>f</code> 在 <code>I</code> 上连续，而连续函数在闭区间上可积，所以对 <code>I</code> 内任意 <code>x</code>，积分 <code>∫<sub>a</sub><sup>x</sup> f(t) dt</code> 都是一个确定的数，<code>Φ</code> 确实是一个函数。\n\n第二步，写出 <code>Φ</code> 在 <code>x</code> 处的增量。设 <code>x</code> 是 <code>I</code> 的内点，<code>Δx</code> 足够小使 <code>x + Δx</code> 仍在 <code>I</code> 内。由积分的区间可加性，\n<code>Φ(x + Δx) - Φ(x) = ∫<sub>a</sub><sup>x+Δx</sup> f(t) dt - ∫<sub>a</sub><sup>x</sup> f(t) dt = ∫<sub>x</sub><sup>x+Δx</sup> f(t) dt</code>。\n\n第三步，把 <code>f(x)</code> 也写成一个同区间的积分，好让两者相减：常数可以搬进积分号，于是\n<code>f(x) · Δx = ∫<sub>x</sub><sup>x+Δx</sup> f(x) dt</code>。\n相减得\n<code>Φ(x + Δx) - Φ(x) - f(x)Δx = ∫<sub>x</sub><sup>x+Δx</sup> [f(t) - f(x)] dt</code>。\n\n第四步，控制误差。因为 <code>f</code> 在 <code>x</code> 处连续，给定任意 <code>ε &gt; 0</code>，只要 <code>|Δx|</code> 足够小，就能保证当 <code>t</code> 落在 <code>x</code> 与 <code>x + Δx</code> 之间时，<code>|f(t) - f(x)| &lt; ε</code>。对这个不等式在长度为 <code>|Δx|</code> 的区间上积分，得到\n<code>|∫<sub>x</sub><sup>x+Δx</sup> [f(t) - f(x)] dt| ≤ ε |Δx|</code>。\n\n第五步，两边除以 <code>|Δx|</code>：\n<code>|(Φ(x + Δx) - Φ(x))/Δx - f(x)| ≤ ε</code>。\n这正是"差商与 <code>f(x)</code> 的距离可以任意小"的意思，也就是\n<code>lim<sub>Δx→0</sub> (Φ(x + Δx) - Φ(x))/Δx = f(x)</code>，即 <code>Φ′(x) = f(x)</code>。\n\n第六步，收尾。上面证的是内点。若 <code>x</code> 是 <code>I</code> 的端点，则只考虑单侧增量，同样的估计逐字照搬即可得单侧导数。于是 <code>Φ</code> 在整个 <code>I</code> 上可导且 <code>Φ′ = f</code>，即 <code>Φ</code> 是 <code>f</code> 的一个原函数。<b>证毕。</b>\n\n[[tip:这个证明是第 5 章"微积分基本定理"的雏形。等学到定积分时你会发现，正是它把"求面积"和"求原函数"这两件看似无关的事焊在了一起。]]',
          example:
            '取 <code>f(t) = t<sup>2</sup></code>，它在整条实轴上连续，所以 <code>Φ(x) = ∫<sub>0</sub><sup>x</sup> t<sup>2</sup> dt</code> 是它的原函数。\n我们还能直接验证：把积分算出来得 <code>Φ(x) = x<sup>3</sup>/3</code>，求导得 <code>x<sup>2</sup></code>，确实等于 <code>f(x)</code>。\n更有意思的是像 <code>f(t) = e<sup>-t<sup>2</sup></sup></code> 这种"基本公式算不出来"的函数：它连续，所以原函数一定存在，只是写不成初等函数的形式，只能用 <code>∫<sub>0</sub><sup>x</sup> e<sup>-t<sup>2</sup></sup> dt</code> 这个记号来代表它。',
          pitfalls: [
            '把定理用反：定理说"连续 ⇒ 有原函数"，不能反过来说"有原函数 ⇒ 连续"。',
            '误以为"存在原函数"等于"能写出初等表达式"。存在性和可计算性是两回事。',
            '证 <code>Φ′(x) = f(x)</code> 时忘了把常数 <code>f(x)</code> 写成同区间上的积分 <code>∫<sub>x</sub><sup>x+Δx</sup> f(x) dt</code>，导致两项无法相减。',
            '把 <code>Φ′(x)</code> 写成 <code>f(t)</code>：求导之后积分变量已经消失，结果里只能出现 <code>x</code>。',
          ],
          tags: ['原函数', '存在定理', '变上限积分', '定理'],
          related: ['def-antiderivative', 'thm-antiderivative-structure', 'def-basic-integral-table'],
        },
        {
          id: 'thm-antiderivative-structure',
          kind: 'theorem',
          name: '原函数的结构定理（相差常数）',
          aka: ['原函数族', '原函数之差为常数'],
          statement:
            '设 <code>F(x)</code> 与 <code>G(x)</code> 都是 <code>f(x)</code> 在<b>同一个区间</b> <code>I</code> 上的原函数，则\n<code>G(x) - F(x) = C</code>（<code>C</code> 是常数）。\n反过来，若 <code>F</code> 是 <code>f</code> 的一个原函数，<code>C</code> 是任意常数，则 <code>F(x) + C</code> 也是 <code>f</code> 的原函数。\n合起来就是：<b><code>f</code> 的全部原函数恰好是 <code>F(x) + C</code>（<code>C</code> 取遍全体实数）。</b>',
          plain:
            '一句话：原函数们长得一模一样，区别只在于整体上下平移了多少。\n想象你在高速上开车，全程只看了速度表（速度 = 位移的导数）。让你倒推"到哪儿了"，你能推出一小时开了 100 公里，但推不出出发点在哪——出发点在东边 10 公里还是西边 50 公里，速度表永远不会告诉你。所以答案注定是一个"形状确定的曲线 + 任意上下平移"。\n那个任意平移量就是常数 <code>C</code>。它不神秘，它就是"你丢掉的出发位置信息"。',
          why:
            '为什么只能差一个常数、不能差别的？因为"导数恒为零的函数必是常数"这条结论（拉格朗日中值定理的直接推论）把路堵死了：两个原函数相减后导数为零，只好是常数。\n<b>为什么要强调"同一个区间"？因为区间一旦断开，"常数"就可以在不同段上取不同值。</b>这是本定理唯一的技术性细节。',
          proof:
            '第一部分：设 <code>F</code>、<code>G</code> 都是 <code>f</code> 在区间 <code>I</code> 上的原函数。\n作差函数 <code>H(x) = G(x) - F(x)</code>。由于 <code>F</code>、<code>G</code> 都在 <code>I</code> 上可导，<code>H</code> 也可导，并且由求导的减法法则\n<code>H′(x) = G′(x) - F′(x) = f(x) - f(x) = 0</code> 对一切 <code>x ∈ I</code> 成立。\n\n于是问题化为：<b>导数恒为零的函数必为常数。</b>用拉格朗日中值定理来证。任取 <code>x<sub>1</sub>, x<sub>2</sub> ∈ I</code>，且 <code>x<sub>1</sub> &lt; x<sub>2</sub></code>。因为区间 <code>I</code> 是区间，<code>[x<sub>1</sub>, x<sub>2</sub>] ⊂ I</code>，且 <code>H</code> 在 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上连续、在 <code>(x<sub>1</sub>, x<sub>2</sub>)</code> 内可导。对 <code>H</code> 在 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上用拉格朗日中值定理，存在 <code>ξ ∈ (x<sub>1</sub>, x<sub>2</sub>)</code> 使\n<code>H(x<sub>2</sub>) - H(x<sub>1</sub>) = H′(ξ)(x<sub>2</sub> - x<sub>1</sub>)</code>。\n而 <code>H′(ξ) = 0</code>，所以 <code>H(x<sub>2</sub>) = H(x<sub>1</sub>)</code>。既然 <code>x<sub>1</sub></code>、<code>x<sub>2</sub></code> 是任取的，<code>H</code> 在 <code>I</code> 上恒等于一个常数 <code>C</code>，即 <code>G(x) - F(x) = C</code>。\n\n第二部分：反过来，若 <code>F′ = f</code>，<code>C</code> 为常数，则 <code>(F(x) + C)′ = F′(x) + 0 = f(x)</code>，所以 <code>F(x) + C</code> 也是原函数。\n\n两部分合起来：全体原函数恰为 <code>{F(x) + C : C ∈ ℝ}</code>。<b>证毕。</b>',
          example:
            '<code>f(x) = 2x</code> 在 <code>(-∞, +∞)</code> 上的全部原函数是 <code>x<sup>2</sup> + C</code>。\n取 <code>C = 0, 1, 2</code> 就是三条形状相同、只是上下错开的抛物线，它们在同一个 <code>x</code> 处的切线斜率完全一样。\n反例（体会"同一区间"的必要性）：函数 <code>f(x) = 1/x</code> 的定义域被 0 分成两段。在 <code>(0, +∞)</code> 上原函数是 <code>ln x + C<sub>1</sub></code>，在 <code>(-∞, 0)</code> 上是 <code>ln(-x) + C<sub>2</sub></code>，两段的常数<b>可以互不相干</b>。所以 <code>∫ dx/x = ln|x| + C</code> 这个公式，严格说只在单个连通区间上成立。',
          pitfalls: [
            '漏掉 <code>C</code>，或把 <code>C</code> 写成某个具体的数。原函数是"一族"，不是一个。',
            '在不同区间上强行用同一个 <code>C</code>（例如跨过 <code>x = 0</code> 讨论 <code>1/x</code> 的原函数）。',
            '<code>∫ dx/x = ln|x| + C</code> 里的绝对值不是装饰，去掉就错了一半的定义域。',
          ],
          tags: ['原函数', '常数C', '定理', '拉格朗日中值定理'],
          related: ['def-antiderivative', 'def-indefinite-integral', 'thm-antiderivative-existence-ch4'],
        },
        {
          id: 'def-indefinite-integral',
          kind: 'definition',
          name: '不定积分',
          aka: ['求不定积分', 'integral'],
          statement:
            '在区间 <code>I</code> 上，函数 <code>f(x)</code> 的<b>全体原函数</b>组成的函数族，称为 <code>f(x)</code> 在 <code>I</code> 上的不定积分，记作\n<code>∫ f(x) dx = F(x) + C</code>，\n其中 <code>F</code> 是 <code>f</code> 的任意一个原函数，<code>C</code> 是任意常数，称为<b>积分常数</b>。\n符号里：<code>∫</code> 是积分号，<code>f(x)</code> 是被积函数，<code>f(x) dx</code> 是被积表达式，<code>x</code> 是积分变量，<code>C</code> 是积分常数。',
          plain:
            '不定积分就是"求原函数"这个动作的正式名字，而且答案一律带一个 <code>+ C</code>。\n打个比方：求导像用扳手把螺丝拧紧，不定积分就是反过来把螺丝拧松、把原来那个零件取出来。所以它们是一对互逆的操作，图形上表现为"同一个 <code>+ C</code> 家族里的任何一条曲线，求导之后都变回同一个 <code>f</code>"。\n再强调一遍：<code>∫ f(x) dx</code> 的结果<b>不是一个数</b>，而是一整族函数。写成 <code>∫ 2x dx = x<sup>2</sup></code> 是错的，等于把无穷多个答案硬删到只剩一个。',
          why:
            '为什么会允许答案"不唯一、留个尾巴 <code>C</code>"？因为求导会丢失信息（丢失的正是"常数"这个自由度），所以反过来的操作必然要把它补回来。这和"解方程 x<sup>2</sup> = 4 有两个解"是同一类现象：操作不是一对一的，答案就必须成族出现。\n至于记号 <code>∫ f(x) dx</code> 里的 <code>dx</code>：现在它只是"我是对 <code>x</code> 积分"的标记，到换元法那一节你会看到它是真正参与运算的——它会被我们主动地"换掉"。',
          proof:
            '这是定义。但有两个立刻能用的直接推论，它们说明了"不定积分"和"求导"到底互逆到什么程度：\n<b>推论一</b>：<code>(∫ f(x) dx)′ = f(x)</code>。因为 <code>∫ f(x) dx = F(x) + C</code>，而 <code>F′ = f</code>、常数的导数为 0，所以求导后回到 <code>f(x)</code>。\n<b>推论二</b>：<code>∫ F′(x) dx = F(x) + C</code>。因为 <code>F</code> 本身就是 <code>F′</code> 的一个原函数，而全部原函数就是把 <code>F</code> 加上任意常数。\n把两条并排看：<b>先积后导，原样返回；先导后积，返回时多带一个 <code>C</code>。</b>这个不对称正是因为求导会吃掉常数，而积分补不回来具体值，只能写成待定常数。',
          example:
            '<code>∫ 3x<sup>2</sup> dx = x<sup>3</sup> + C</code>。验证：把 <code>x<sup>3</sup> + C</code> 求导得 <code>3x<sup>2</sup></code>，对上了。\n再比如 <code>∫ cos x dx = sin x + C</code>；<code>∫ e<sup>x</sup> dx = e<sup>x</sup> + C</code>（指数函数求导还是自己，所以它就是自己的原函数家族）。\n对照推论二看：<code>∫ (cos x)′ dx = ∫ (-sin x) dx = cos x + C</code>，正是把 <code>cos x</code> "转了一圈"又回来了。',
          pitfalls: [
            '<b>漏写 <code>+ C</code></b>，这是本章最高频的失分点。',
            '把 <code>+ C</code> 加在错误的位置，写成 <code>∫ 2x dx = x<sup>2</sup> + C + 1</code> 这类画蛇添足的式子（多余的常数已经并入 <code>C</code>）。',
            '把 <code>dx</code> 漏掉或乱写。没有 <code>dx</code> 就不知道对谁积分，记号不完整。',
            '在计算中途多次引入常数，最后忘了合并成一个 <code>C</code>。规范做法是：<b>计算过程中不写 <code>C</code>，只在最后一步补上</b>。',
          ],
          tags: ['不定积分', '定义', '积分常数'],
          related: ['def-antiderivative', 'thm-antiderivative-structure', 'thm-indefinite-linear', 'thm-indefinite-inverse'],
        },
        {
          id: 'thm-indefinite-linear',
          kind: 'theorem',
          name: '不定积分的线性性质',
          aka: ['积分的线性', '和差与数乘'],
          statement:
            '设 <code>f(x)</code>、<code>g(x)</code> 的原函数都存在，<code>k</code> 是非零常数，则\n<code>∫ [f(x) ± g(x)] dx = ∫ f(x) dx ± ∫ g(x) dx</code>，\n<code>∫ k·f(x) dx = k ∫ f(x) dx</code>。\n两条合起来常说成：不定积分是<b>线性运算</b>——可以逐项积、可以把常数提出来。',
          plain:
            '通俗地说就是"加法可以拆开算，常数可以拎出去"。\n比如要给一堆东西分别称重再求和，可以一件一件称完再加，也可以先把托盘重量扣掉（把常数提出来）再称，结果一样。积分的线性性质说的就是这件朴素的事。\n[[warn:注意它只对<b>加减和数乘</b>成立。乘法、除法、复合都没有这种好事：<code>∫ f·g dx</code> 绝不等于 <code>(∫ f dx)·(∫ g dx)</code>，后面的换元法和分部积分法，正是为了对付这些"不线性"的情形。]]',
          why:
            '为什么积分会有线性性质？因为它的"上游"——求导——是线性的。既然求导满足 <code>(F ± G)′ = F′ ± G′</code> 和 <code>(kF)′ = kF′</code>，那么反过来"求原函数"自然继承同样的规则。\n<b>证明思路一句话：在等式两边同时求导，用求导的线性法则把两边对上，再引用"原函数只差常数"把常数收进 <code>C</code> 里。</b>',
          proof:
            '先证加法那一条。设 <code>F</code> 是 <code>f</code> 的某个原函数，<code>G</code> 是 <code>g</code> 的某个原函数，于是 <code>F′ = f</code>，<code>G′ = g</code>。\n\n作函数 <code>F(x) + G(x)</code>，对它求导，用求导的加法法则：\n<code>(F(x) + G(x))′ = F′(x) + G′(x) = f(x) + g(x)</code>。\n这说明 <code>F(x) + G(x)</code> 是 <code>f(x) + g(x)</code> 的一个原函数，因此它属于 <code>∫ [f(x) + g(x)] dx</code> 这一族。\n\n再看右边：<code>∫ f(x) dx + ∫ g(x) dx = (F(x) + C<sub>1</sub>) + (G(x) + C<sub>2</sub>) = F(x) + G(x) + (C<sub>1</sub> + C<sub>2</sub>)</code>。由于 <code>C<sub>1</sub> + C<sub>2</sub></code> 仍是任意常数，把它整体记作 <code>C</code>，右边就等于 <code>F(x) + G(x) + C</code>，恰好是 <code>f + g</code> 的全部原函数。\n\n两边都是同一个函数族，故等式成立。减法完全一样，只需把加法法则换成减法法则，故 <code>∫ [f(x) - g(x)] dx = ∫ f(x) dx - ∫ g(x) dx</code>。\n\n再证数乘那一条。设 <code>k ≠ 0</code>，<code>F′ = f</code>。由求导的数乘法则，\n<code>(k·F(x))′ = k·F′(x) = k·f(x)</code>，\n所以 <code>kF(x)</code> 是 <code>kf(x)</code> 的一个原函数。而 <code>k∫ f(x) dx = k(F(x) + C) = kF(x) + kC</code>，由于 <code>k ≠ 0</code> 时 <code>kC</code> 仍能取遍全体实数，它就是 <code>kf</code> 的全部原函数。故\n<code>∫ k·f(x) dx = k ∫ f(x) dx</code>。<b>证毕。</b>\n\n[[tip:顺便看 <code>k = 0</code> 的情形：左边 <code>∫ 0 dx = C</code>，右边 <code>0 · ∫ f dx = 0</code>，两者都是"常数族"，按函数族的意义仍然一致。所以教材常直接说 <code>k</code> 为任意常数。]]',
          example:
            '<code>∫ (3x<sup>2</sup> - 4x + 5) dx = 3·(x<sup>3</sup>/3) - 4·(x<sup>2</sup>/2) + 5x + C = x<sup>3</sup> - 2x<sup>2</sup> + 5x + C</code>。\n每一步都只用了线性性质，再加上幂函数积分公式。最后必须补一个统一的 <code>C</code>。\n注意 <code>5</code> 这一项怎么处理的：<code>∫ 5 dx = 5x + C</code>，常数函数 <code>5</code> 的原函数是一次函数 <code>5x</code>。很多初学者会写成 <code>0</code>，这是把"积分"当成了"求导"。',
          pitfalls: [
            '把积分当成求导来算：<code>∫ 5 dx</code> 是 <code>5x</code>，不是 <code>0</code>。',
            '错误地推广到乘法：<code>∫ x·e<sup>x</sup> dx ≠ (x<sup>2</sup>/2)·e<sup>x</sup></code>。乘法的情形要用分部积分法。',
            '逐项积分时每一项都写一个 <code>C</code>，最后没有合并。',
            '把 <code>∫ [f(x)/g(x)] dx</code> 拆成两个积分相除，这是把线性性质用到了除法上，完全无效。',
          ],
          tags: ['不定积分', '线性性质', '定理'],
          related: ['def-indefinite-integral', 'thm-indefinite-inverse', 'def-basic-integral-table'],
        },
        {
          id: 'thm-indefinite-inverse',
          kind: 'theorem',
          name: '不定积分与微分（导数）的互逆关系',
          aka: ['先积后导', '先导后积', '微积分互逆'],
          statement:
            '在 <code>f</code> 连续、<code>F</code> 可导的前提下：\n<b>（1）先积后导（或先积后微）原样返回：</b>\n<code>d/dx (∫ f(x) dx) = f(x)</code>，<code>d(∫ f(x) dx) = f(x) dx</code>；\n<b>（2）先导后积，还原时多一个常数：</b>\n<code>∫ F′(x) dx = F(x) + C</code>，<code>∫ dF(x) = F(x) + C</code>。',
          plain:
            '这就是"拧螺丝 / 松螺丝"的关系。\n如果你先松一颗螺丝再把它拧回去，它跟原来完全一样（第 1 条）。但如果你先拧紧一颗螺丝再松回来，你会发现"原来拧了多少圈"这个信息已经丢了——你只知道松回到了原来的松紧程度，具体圈数无从考证。所以第二条必须保留一个"待定"的量，也就是 <code>C</code>。\n这条互逆关系是整章的"抽水机"：一切计算方法最终都靠它来验收。你算完一个积分，最稳妥的检查手段就是<b>把答案求导，看能不能变回被积函数</b>。',
          why:
            '为什么会有这么漂亮的一对关系？因为不定积分从定义起就是"求导的逆运算"，而逆运算天然满足这两条：连续做两次相反的操作，要么回到原样，要么丢掉一点信息。\n真正值得体会的是"为什么第 1 条不需要常数、第 2 条需要"。原因在于：<code>∫ f dx</code> 本身就已经是一个"家族"，你从族里随便挑一个代表 <code>F + C</code> 去求导，那个 <code>C</code> 被导数吃掉，结果必然唯一。而反过来，你给的是确定的一个 <code>F</code>，积分之后补出的那个常数无从确定，只好留着。',
          proof:
            '<b>（1）的证明。</b>设 <code>F</code> 是 <code>f</code> 的一个原函数（<code>f</code> 连续时由原函数存在定理保证其存在），则按定义 <code>∫ f(x) dx = F(x) + C</code>。两边对 <code>x</code> 求导，左边记作 <code>A(x)</code>：\n<code>A(x) = F(x) + C ⇒ A′(x) = F′(x) + (C)′ = f(x) + 0 = f(x)</code>。\n这就是 <code>d/dx (∫ f(x) dx) = f(x)</code>。写成微分形式，两边同乘 <code>dx</code> 即得 <code>d(∫ f(x) dx) = f(x) dx</code>。\n\n<b>（2）的证明。</b>设 <code>F</code> 可导。由定义，<code>∫ F′(x) dx</code> 表示 <code>F′(x)</code> 的全部原函数。而 <code>F</code> 本身满足 <code>F′(x) = F′(x)</code>，所以 <code>F</code> 就是 <code>F′(x)</code> 的一个原函数。由原函数的结构定理，全部原函数为 <code>F(x) + C</code>。故\n<code>∫ F′(x) dx = F(x) + C</code>。\n再用一次微分的记号 <code>dF(x) = F′(x) dx</code>，把上式里的 <code>F′(x) dx</code> 换成 <code>dF(x)</code>，即得 <code>∫ dF(x) = F(x) + C</code>。<b>证毕。</b>',
          example:
            '验证 <code>∫ (2x + 1) dx</code>：算出来是 <code>x<sup>2</sup> + x + C</code>。用第 1 条验收——把 <code>x<sup>2</sup> + x + C</code> 求导，得 <code>2x + 1</code>，正好是被积函数。\n再看第 2 条：<code>∫ d(x<sup>2</sup>) = ∫ 2x dx = x<sup>2</sup> + C</code>，还原出了 <code>x<sup>2</sup></code>，但多带了 <code>C</code>。\n这个"求导验收"的习惯，请从今天开始每算一题都用一次。它是自学微积分时最可靠的老师。',
          pitfalls: [
            '在 <code>d/dx (∫ f(x) dx) = f(x)</code> 的结果里还留着 <code>dx</code> 或积分号，记号混乱。',
            '把两条记反：以为 <code>∫ f′(x) dx = f(x)</code>（漏了 <code>C</code>）。',
            '用第 1 条检查时对 <code>F(x) + C</code> 整体求导却漏掉链式法则（例如答案里含 <code>sin(2x)</code> 这类复合结构）。',
          ],
          tags: ['不定积分', '互逆', '微分', '定理'],
          related: ['def-indefinite-integral', 'thm-indefinite-linear', 'thm-substitution-rule'],
        },
        {
          id: 'def-basic-integral-table',
          kind: 'formula',
          name: '基本积分公式表',
          aka: ['积分表', '基本积分公式'],
          statement:
            '下面这些公式是本章所有计算的"字母表"，必须做到看到左边立刻写出右边（都要加 <code>+ C</code>，表中省略）：\n<b>幂与指数</b>\n<code>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n+1) + C (n ≠ -1)</code>\n<code>∫ dx/x = ln|x| + C</code>\n<code>∫ a<sup>x</sup> dx = a<sup>x</sup>/ln a + C (a &gt; 0, a ≠ 1)</code>\n<code>∫ e<sup>x</sup> dx = e<sup>x</sup> + C</code>\n<b>三角</b>\n<code>∫ sin x dx = -cos x + C</code>\n<code>∫ cos x dx = sin x + C</code>\n<code>∫ sec<sup>2</sup>x dx = tan x + C</code>\n<code>∫ csc<sup>2</sup>x dx = -cot x + C</code>\n<code>∫ sec x tan x dx = sec x + C</code>\n<code>∫ csc x cot x dx = -csc x + C</code>\n<code>∫ tan x dx = -ln|cos x| + C</code>\n<code>∫ cot x dx = ln|sin x| + C</code>\n<code>∫ sec x dx = ln|sec x + tan x| + C</code>\n<code>∫ csc x dx = ln|csc x - cot x| + C</code>\n<b>反三角与含根式的</b>\n<code>∫ dx/(1 + x<sup>2</sup>) = arctan x + C</code>\n<code>∫ dx/√(1 - x<sup>2</sup>) = arcsin x + C</code>\n<code>∫ dx/(a<sup>2</sup> + x<sup>2</sup>) = (1/a)arctan(x/a) + C (a &gt; 0)</code>\n<code>∫ dx/√(a<sup>2</sup> - x<sup>2</sup>) = arcsin(x/a) + C (a &gt; 0)</code>\n<code>∫ dx/(x<sup>2</sup> - a<sup>2</sup>) = (1/(2a))·ln|(x - a)/(x + a)| + C</code>\n<code>∫ dx/√(x<sup>2</sup> + a<sup>2</sup>) = ln(x + √(x<sup>2</sup> + a<sup>2</sup>)) + C</code>\n<code>∫ dx/√(x<sup>2</sup> - a<sup>2</sup>) = ln|x + √(x<sup>2</sup> - a<sup>2</sup>)| + C</code>\n<code>∫ √(a<sup>2</sup> - x<sup>2</sup>) dx = (x/2)√(a<sup>2</sup> - x<sup>2</sup>) + (a<sup>2</sup>/2)arcsin(x/a) + C</code>',
          plain:
            '把它当成乘法口诀表来背。学乘法要先背"三七二十一"，学积分就得先背"<code>∫ cos x dx = sin x + C</code>"。\n背的方法不是死记，而是<b>反过来想求导</b>：因为 <code>(sin x)′ = cos x</code>，所以 <code>∫ cos x dx = sin x + C</code>。每一个积分公式在你脑子里，都应该伴着一个"它的导数是什么"的验证动作。\n表格看着长，其实只有四类来源：幂函数、指数函数、三角函数、以及"三角代换算出来的那几个反三角和对数型"。后两类到 4.2 节会讲清楚它们是怎么来的，现在先安心记住形状。',
          why:
            '为什么必须把这张表背到"条件反射"？因为后面所有的方法——凑微分、第二类换元、分部积分、部分分式——本质上都是<b>把陌生的积分变形，直到它变成表上的某一条</b>。表不熟，就像手里有工具却不知道要拧哪颗螺丝。\n<b>为什么特别要记住 <code>n ≠ -1</code> 这个例外？</b>因为一旦 <code>n = -1</code>，分母 <code>n + 1</code> 变成 0，公式失效；而此时 <code>∫ dx/x</code> 恰好由取对数的办法解决。这不是数学的缺陷，而是幂函数的原函数族在 <code>n = -1</code> 处"恰好漏掉了对数"这一有趣事实——它和 <code>∫ x<sup>n</sup>dx</code> 的公式在 <code>n → -1</code> 时的极限正好衔接。',
          proof:
            '这些公式<b>不需要"证明"，只需要逐条"验证"</b>——验证手段就是求导。<b>不定积分等式的验证准则：把右边的函数族求导，若得到左边的被积函数，等式即成立。</b>逐条验：\n<code>(x<sup>n+1</sup>/(n+1))′ = (n+1)x<sup>n</sup>/(n+1) = x<sup>n</sup></code>，第一条成立（<code>n ≠ -1</code> 保证分母不为零）。\n<code>(ln|x|)′ = 1/x</code>（<code>x &gt; 0</code> 时是 <code>ln x</code>，<code>x &lt; 0</code> 时是 <code>ln(-x)</code>，求导都得 <code>1/x</code>，绝对值正是为了让两个区间统一成一个式子），第二条成立。\n<code>(a<sup>x</sup>/ln a)′ = a<sup>x</sup> ln a/ln a = a<sup>x</sup></code>，第三条成立；取 <code>a = e</code> 得第四条。\n<code>(-cos x)′ = sin x</code>，<code>(sin x)′ = cos x</code>，<code>(tan x)′ = sec<sup>2</sup>x</code>，<code>(-cot x)′ = csc<sup>2</sup>x</code>，<code>(sec x)′ = sec x tan x</code>，<code>(-csc x)′ = csc x cot x</code>，逐条对上。\n<code>(-ln|cos x|)′ = -(-sin x)/cos x = tan x</code>，成立；同理 <code>(ln|sin x|)′ = cot x</code>。\n<code>(arctan x)′ = 1/(1 + x<sup>2</sup>)</code>、<code>(arcsin x)′ = 1/√(1 - x<sup>2</sup>)</code>，直接对上。\n把 <code>x</code> 换成 <code>x/a</code> 再用链式法则，得 <code>(arctan(x/a))′ = (1/a)/(1 + x<sup>2</sup>/a<sup>2</sup>) = a/(a<sup>2</sup> + x<sup>2</sup>)</code>，所以 <code>((1/a)arctan(x/a))′ = 1/(a<sup>2</sup> + x<sup>2</sup>)</code>，成立；<code>arcsin(x/a)</code> 那条同理。\n\n剩下几条稍复杂，留到 4.2 节用三角代换推导（<code>∫ sec x dx</code> 与 <code>∫ dx/√(x<sup>2</sup> + a<sup>2</sup>)</code>），或现在直接验证：\n<code>(ln|sec x + tan x|)′ = (sec x tan x + sec<sup>2</sup>x)/(sec x + tan x) = sec x(sec x + tan x)/(sec x + tan x) = sec x</code>，成立。\n<code>(ln(x + √(x<sup>2</sup> + a<sup>2</sup>)))′</code>：用链式法则，外层是 <code>ln</code>，内层导数为 <code>1 + x/√(x<sup>2</sup> + a<sup>2</sup>) = (√(x<sup>2</sup> + a<sup>2</sup>) + x)/√(x<sup>2</sup> + a<sup>2</sup>)</code>，两者相除恰好约掉 <code>√(x<sup>2</sup> + a<sup>2</sup>) + x</code>，只剩 <code>1/√(x<sup>2</sup> + a<sup>2</sup>)</code>，成立。\n<code>(1/(2a))·ln|(x - a)/(x + a)|</code> 求导：内层 <code>(x - a)/(x + a)</code> 的导数为 <code>((x + a) - (x - a))/(x + a)<sup>2</sup> = 2a/(x + a)<sup>2</sup></code>，除以 <code>(x - a)/(x + a)</code> 得 <code>2a/((x + a)(x - a)) = 2a/(x<sup>2</sup> - a<sup>2</sup>)</code>，再乘系数 <code>1/(2a)</code> 得 <code>1/(x<sup>2</sup> - a<sup>2</sup>)</code>，成立。\n<b>全部验证完毕。可见这张表没有一条需要"记住结果"，全部可以由求导法则现场推出来。</b>',
          example:
            '用表直接算三个：\n<code>∫ x<sup>5</sup> dx = x<sup>6</sup>/6 + C</code>（幂公式，<code>n = 5</code>）。\n<code>∫ √x dx = ∫ x<sup>1/2</sup> dx = x<sup>3/2</sup>/(3/2) + C = (2/3)x<sup>3/2</sup> + C</code>（先把根号写成幂，这是最常用的预处理）。\n<code>∫ dx/(4 + x<sup>2</sup>) = (1/2)arctan(x/2) + C</code>（<code>a = 2</code> 的反正切公式，注意前面的 <code>1/a</code> 不能丢）。',
          pitfalls: [
            '把 <code>∫ dx/x</code> 写成 <code>x<sup>0</sup>/0</code> 或直接套幂公式，忘了 <code>n = -1</code> 是例外。',
            '丢掉 <code>ln|x|</code> 的绝对值，或把 <code>ln|x|</code> 写成 <code>ln x</code> 后不考虑定义域。',
            '把 <code>∫ dx/(a<sup>2</sup> + x<sup>2</sup>)</code> 的系数 <code>1/a</code> 漏掉，写成 <code>arctan(x/a) + C</code>。',
            '把 <code>∫ sec<sup>2</sup>x dx</code> 和 <code>∫ sec x dx</code> 搞混：前者是 <code>tan x</code>，后者是 <code>ln|sec x + tan x|</code>，难度天差地别。',
            '把 <code>∫ a<sup>x</sup> dx</code> 写成 <code>a<sup>x</sup> + C</code>（漏了 <code>/ln a</code>）；只有 <code>e<sup>x</sup></code> 才有 "原样返回" 的特权。',
          ],
          tags: ['积分表', '基本公式', '公式'],
          related: ['def-indefinite-integral', 'thm-indefinite-linear', 'thm-substitution-rule', 'def-trig-substitution'],
        },
      ],
    },
    {
      id: 'ch4-2',
      no: '4.2',
      title: '换元积分法',
      summary:
        '把不会积的积分"变形"成表上的公式：第一类换元（凑微分）靠识别链式法则留下的指纹，第二类换元（三角代换、根式代换、倒代换）靠主动替换自变量把根号消掉。',
      items: [
        {
          id: 'thm-substitution-rule',
          kind: 'theorem',
          name: '第一类换元积分法（凑微分法）',
          aka: ['凑微分', '换元公式一'],
          statement:
            '设 <code>F(u)</code> 是 <code>f(u)</code> 的一个原函数（即 <code>F′(u) = f(u)</code>），<code>u = φ(x)</code> 可导，则\n<code>∫ f(φ(x))·φ′(x) dx = F(φ(x)) + C</code>。\n实际使用时通常把 <code>φ′(x) dx</code> 写成 <code>dφ(x)</code>，于是公式变成更顺手的形状：\n<code>∫ f(φ(x)) dφ(x) = F(φ(x)) + C</code>，即 <code>∫ f(u) du = F(u) + C</code>，其中 <code>u = φ(x)</code>。\n这就是<b>一阶微分形式不变性</b>：不管 <code>u</code> 是自变量还是中间变量，<code>∫ f(u) du = F(u) + C</code> 都成立。',
          plain:
            '凑微分的操作极其朴素：<b>把被积表达式里的一部分东西，想方设法塞到 <code>d</code> 的后面去，让整个积分看起来像表上的某一条。</b>\n比如算 <code>∫ 2x·cos(x<sup>2</sup>) dx</code>。表上没有这一条，但注意 <code>2x dx = d(x<sup>2</sup>)</code>——把 <code>2x</code> 塞进 <code>d</code> 后面，式子立刻变成 <code>∫ cos(x<sup>2</sup>) d(x<sup>2</sup>)</code>。现在把 <code>x<sup>2</sup></code> 看成一个整体（就叫它 <code>u</code>），这就是表上的 <code>∫ cos u du = sin u + C</code>，答案是 <code>sin(x<sup>2</sup>) + C</code>。\n<b>为什么可以"随便"把东西塞进 <code>d</code> 后面？</b>因为 <code>d</code> 后面的东西没变，只是"记账方式"变了：<code>d(x<sup>2</sup>)</code> 和 <code>2x dx</code> 是同一个东西的两种写法，就像"三块钱"和"三十角"是一回事。',
          why:
            '<b>凑微分到底在凑什么？</b>在凑"一个整体"。\n求导有个麻烦事：复合函数求导会<b>多乘出来一个内层导数</b>（链式法则）。所以很多函数之所以积不出来，正是因为它们身上带着这个"多出来的因子"。凑微分的全部工作，就是识破这个因子、并把它收进 <code>d</code> 里，把复合结构<b>还原成一个整体</b>。<code>∫ 2x·cos(x<sup>2</sup>) dx</code> 里那个 <code>2x</code> 不是垃圾，它正是 <code>x<sup>2</sup></code> 的导数，是链式法则留下的指纹。找到指纹，就能倒推出"里面藏着一个 <code>cos u</code>"。\n<b>所以凑微分的实质是"逆向识别链式法则"。</b>这也是为什么它被叫作"第一类换元"——我们引入的 <code>u</code> 并不改变积分变量，只是把眼睛看到的东西"看成"一个新的整体而已。',
          proof:
            '要证的是 <code>d/dx [F(φ(x))] = f(φ(x))·φ′(x)</code>。这是一次直接的复合函数求导。\n\n设 <code>F′(u) = f(u)</code>，<code>u = φ(x)</code> 可导。令 <code>G(x) = F(φ(x))</code>，即 <code>G = F ∘ φ</code>。\n\n把 <code>φ</code> 在 <code>x</code> 处的可导性写成差商形式：\n<code>φ(x + Δx) = φ(x) + φ′(x)Δx + o(Δx)</code>，\n记 <code>Δu = φ(x + Δx) - φ(x)</code>，则 <code>Δu = φ′(x)Δx + o(Δx)</code>。特别地，当 <code>Δx → 0</code> 时 <code>Δu → 0</code>（这一步用到 <code>φ</code> 在 <code>x</code> 处连续，而可导蕴含连续）。\n\n把 <code>F</code> 在 <code>u</code> 处的可导性也写成差商形式：\n<code>F(u + Δu) = F(u) + F′(u)Δu + o(Δu) = F(u) + f(u)Δu + o(Δu)</code>。\n\n两式串联，得到\n<code>G(x + Δx) - G(x) = F(φ(x) + Δu) - F(φ(x)) = f(φ(x))·Δu + o(Δu)</code>。\n代入 <code>Δu = φ′(x)Δx + o(Δx)</code>：\n<code>= f(φ(x))·[φ′(x)Δx + o(Δx)] + o(Δu) = f(φ(x))φ′(x)Δx + o(Δx) + o(Δu)</code>。\n\n最后处理误差项：由于 <code>Δu → 0</code> 时 <code>o(Δu)/Δx = [o(Δu)/Δu]·[Δu/Δx] → 0 · φ′(x) = 0</code>，所以 <code>o(Δu)</code> 也是 <code>Δx</code> 的高阶无穷小，可以并为 <code>o(Δx)</code>。于是\n<code>G(x + Δx) - G(x) = f(φ(x))φ′(x)Δx + o(Δx)</code>。\n两边除以 <code>Δx</code> 并令 <code>Δx → 0</code>，得\n<code>G′(x) = f(φ(x))·φ′(x)</code>。\n\n这就说明 <code>G(x) = F(φ(x))</code> 是 <code>f(φ(x))φ′(x)</code> 的一个原函数，因此\n<code>∫ f(φ(x))·φ′(x) dx = F(φ(x)) + C</code>。<b>证毕。</b>\n\n[[tip:教材上常见的写法是"令 <code>u = φ(x)</code>，则 <code>du = φ′(x) dx</code>，于是 <code>∫ f(φ(x))φ′(x) dx = ∫ f(u) du = F(u) + C = F(φ(x)) + C</code>"。这套写法之所以合法、之所以不用把 <code>x</code> 换回去，靠的就是上面这个证明——它保证了积分变量在"整体"与"原变量"之间切换时结果不变。]]',
          example:
            '<b>例 1（基本型）</b>：<code>∫ 2x·cos(x<sup>2</sup>) dx</code>。\n凑微分：<code>2x dx = d(x<sup>2</sup>)</code>，于是原式 <code>= ∫ cos(x<sup>2</sup>) d(x<sup>2</sup>)</code>。令 <code>u = x<sup>2</sup></code>，得 <code>∫ cos u du = sin u + C = sin(x<sup>2</sup>) + C</code>。\n验收：<code>(sin(x<sup>2</sup>))′ = cos(x<sup>2</sup>)·2x</code>，正好是被积函数。\n\n<b>例 2（线性型）</b>：<code>∫ e<sup>3x</sup> dx</code>。因为 <code>dx = (1/3)d(3x)</code>，所以原式 <code>= (1/3)∫ e<sup>3x</sup> d(3x) = (1/3)e<sup>3x</sup> + C</code>。\n这里出现的 <code>1/3</code> 是最常见的"配系数"动作：<b>你往 <code>d</code> 里塞进去一个 3，就必须在外面赔一个 <code>1/3</code>。</b>\n\n<b>例 3（分母型）</b>：<code>∫ (2x + 1)/(x<sup>2</sup> + x + 5) dx</code>。观察分母 <code>x<sup>2</sup> + x + 5</code> 的导数正是 <code>2x + 1</code>，于是原式 <code>= ∫ d(x<sup>2</sup> + x + 5)/(x<sup>2</sup> + x + 5) = ln|x<sup>2</sup> + x + 5| + C</code>。\n这就是"分子恰是分母的导数 ⇒ 直接套对数公式"的经典信号。',
          pitfalls: [
            '忘记"配系数"。往 <code>d</code> 后面塞了一个因子，就必须在外面除掉它：<code>dx = (1/2)d(2x)</code>，漏掉 <code>1/2</code> 是最常见的错误。',
            '没有验证。凑微分之后一定回头看一眼"<code>d</code> 后面的东西，导数是不是正好等于留在外面的因子"。',
            '硬凑不存在的因子。若外面的因子与内层导数差一个非常数倍（例如差一个 <code>x</code>），<code>x</code> 是变量、不能提到积分号外，此时凑微分失败，要考虑别的方法。',
            '变量替换后又把 <code>u</code> 和 <code>x</code> 混在一个式子里，例如写出 <code>sin(x<sup>2</sup>) + u</code> 这种既不是自变量也不是中间量的怪物。',
          ],
          tags: ['换元积分法', '凑微分', '第一类换元', '定理'],
          related: ['thm-substitution-rule-2', 'def-basic-integral-table', 'thm-indefinite-inverse', 'def-common-substitutions'],
        },
        {
          id: 'def-common-substitutions',
          kind: 'note',
          name: '常用凑微分模式与配系数技巧',
          aka: ['凑微分套路', '常用微分式'],
          statement:
            '下面这些"微分式"要像积分表一样熟，它们是凑微分时手里的零件：\n<code>x dx = (1/2)d(x<sup>2</sup>)</code>　<code>dx = (1/a)d(ax + b)</code>　<code>dx/x = d(ln|x|)</code>\n<code>e<sup>x</sup> dx = d(e<sup>x</sup>)</code>　<code>dx/√x = 2d(√x)</code>　<code>dx/x<sup>2</sup> = -d(1/x)</code>\n<code>cos x dx = d(sin x)</code>　<code>sin x dx = -d(cos x)</code>　<code>sec<sup>2</sup>x dx = d(tan x)</code>\n<code>dx/(1 + x<sup>2</sup>) = d(arctan x)</code>　<code>dx/√(1 - x<sup>2</sup>) = d(arcsin x)</code>\n<b>通用配系数口诀</b>：若需要凑出的内层导数是 <code>k</code>（常数），就写\n<code>∫ f(ax + b) dx = (1/a)∫ f(ax + b) d(ax + b)</code>。\n更一般地，若被积函数形如 <code>f(φ(x))·φ′(x)</code> 的常数倍，先把常数配平再套公式。',
          plain:
            '这一条不是新知识，就是一张"零件表"，本质上是把上一节的证明<b>反过来用</b>：既然 <code>d(x<sup>2</sup>) = 2x dx</code>，那反过来就有 <code>x dx = (1/2)d(x<sup>2</sup>)</code>。\n熟悉这张表之后，看到题目你会像修理工看到螺丝一样，先扫一眼"哪个部分是另一个部分的导数"。这个"扫一眼"的能力，几乎等于本章一半的功力。',
          why:
            '为什么要专门整理这些模式？因为换元法本身没有统一的算法，全靠"认脸"。而有经验的老师会发现，考卷上来来去去就那么十几种脸。把它们提前背成条件反射，就能把"思考题"降级成"套动作"。\n<b>关于配系数口诀的来历</b>：设 <code>k ≠ 0</code> 是常数。因为 <code>d(kx) = k dx</code>，所以 <code>dx = (1/k)d(kx)</code>。把这个等式代进积分，常数 <code>1/k</code> 由线性性质提到积分号外，就得到口诀。注意<b>它之所以管用，全靠 <code>k</code> 是常数</b>——如果乘上去的因子含 <code>x</code>，就提不出来，口诀立刻失效。',
          proof:
            '本条目是操作清单，按规范给出其依据（每一条都是某个求导公式的变形）：\n由 <code>(x<sup>2</sup>)′ = 2x</code> 得 <code>d(x<sup>2</sup>) = 2x dx</code>，两边除以 2，得 <code>x dx = (1/2)d(x<sup>2</sup>)</code>。\n由 <code>(ax + b)′ = a</code> 得 <code>d(ax + b) = a dx</code>，故 <code>dx = (1/a)d(ax + b)</code>，其中 <code>a ≠ 0</code>。\n由 <code>(ln|x|)′ = 1/x</code> 得 <code>d(ln|x|) = dx/x</code>。\n由 <code>(e<sup>x</sup>)′ = e<sup>x</sup></code> 得 <code>d(e<sup>x</sup>) = e<sup>x</sup> dx</code>。\n由 <code>(√x)′ = 1/(2√x)</code> 得 <code>d(√x) = dx/(2√x)</code>，故 <code>dx/√x = 2d(√x)</code>。\n由 <code>(1/x)′ = -1/x<sup>2</sup></code> 得 <code>d(1/x) = -dx/x<sup>2</sup></code>，故 <code>dx/x<sup>2</sup> = -d(1/x)</code>。\n由 <code>(sin x)′ = cos x</code>、<code>(cos x)′ = -sin x</code>、<code>(tan x)′ = sec<sup>2</sup>x</code>、<code>(arctan x)′ = 1/(1 + x<sup>2</sup>)</code>、<code>(arcsin x)′ = 1/√(1 - x<sup>2</sup>)</code>，相应得到余下五条。<b>全部由求导公式两边同乘 <code>dx</code> 得到，无额外假设。</b>',
          example:
            '<b>用模式 2 秒杀线性内层</b>：<code>∫ sin(5x + 1) dx = (1/5)∫ sin(5x + 1) d(5x + 1) = -(1/5)cos(5x + 1) + C</code>。\n\n<b>用模式 4</b>：<code>∫ e<sup>x</sup>/(1 + e<sup>x</sup>) dx</code>。注意分子 <code>e<sup>x</sup> dx = d(e<sup>x</sup>)</code>，原式 <code>= ∫ d(e<sup>x</sup>)/(1 + e<sup>x</sup>) = ln(1 + e<sup>x</sup>) + C</code>。\n（这里不需要绝对值，因为 <code>1 + e<sup>x</sup> &gt; 0</code> 恒成立。）\n\n<b>用模式 5</b>：<code>∫ dx/√x·(1 + √x)</code> 不便书写，改看 <code>∫ dx/(√x(1 + √x))</code>：由 <code>dx/√x = 2d(√x)</code>，原式 <code>= 2∫ d(√x)/(1 + √x) = 2ln(1 + √x) + C</code>。\n\n<b>配系数口诀的示范</b>：<code>∫ dx/(2x + 3) = (1/2)∫ d(2x + 3)/(2x + 3) = (1/2)ln|2x + 3| + C</code>。',
          pitfalls: [
            '把 <code>sin x dx = -d(cos x)</code> 的负号漏掉，这是三角类凑微分的第一大坑。',
            '试图凑一个含 <code>x</code> 的因子：<code>x dx</code> 能凑成 <code>d(x<sup>2</sup>)</code> 的 <code>1/2</code> 倍，但 <code>x<sup>2</sup> dx</code> 凑进 <code>d(x<sup>2</sup>)</code> 就会多出一个变量 <code>x</code>，提不出来，此路不通。',
            '<code>∫ f(x) dx = (1/k)∫ f(x) d(kx)</code> 里要求 <code>k</code> 是<b>非零常数</b>。取 <code>k = 0</code> 或取 <code>k</code> 为 <code>x</code> 的函数都是错的。',
            '看到 <code>dx/x</code> 就一律写成 <code>d(ln x)</code> 而不加绝对值，实际应为 <code>d(ln|x|)</code>。',
          ],
          tags: ['凑微分', '微分式', '技巧', '说明'],
          related: ['thm-substitution-rule', 'def-basic-integral-table', 'def-trig-substitution'],
        },
        {
          id: 'thm-substitution-rule-2',
          kind: 'theorem',
          name: '第二类换元积分法（变量代换）',
          aka: ['第二类换元', '反函数代换', '换元公式二'],
          statement:
            '设 <code>x = ψ(t)</code> 在区间上<b>单调、可导且 <code>ψ′(t) ≠ 0</code></b>，又设\n<code>∫ f(ψ(t))·ψ′(t) dt = Φ(t) + C</code>，\n则\n<code>∫ f(x) dx = Φ(ψ<sup>-1</sup>(x)) + C</code>，\n其中 <code>t = ψ<sup>-1</sup>(x)</code> 是 <code>ψ</code> 的反函数。\n实际计算时写成：令 <code>x = ψ(t)</code>，则 <code>dx = ψ′(t) dt</code>，原积分化为 <code>∫ f(ψ(t))ψ′(t) dt</code>，算出结果后再把 <code>t</code> 用 <code>x</code> 换回去。',
          plain:
            '第一类换元是"把外面的东西塞进 <code>d</code> 里"，第二类换元是<b>直接换掉自变量本身</b>：把 <code>x</code> 换成一个关于新字母 <code>t</code> 的表达式。\n为什么要这么干？因为有些式子长得太别扭，比如带根号 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>。硬啃啃不动，但如果你令 <code>x = a·sin t</code>，那个根号就变成 <code>a·cos t</code>——<b>根号被三角恒等式吃掉了</b>，剩下的全是熟悉的三角函数积分。\n用生活比喻：这就像遇到一段拗口的外语，你先整体音译成拼音（换元），处理完再翻回中文（回代）。音译本身不难，难的是回代——所以最后<b>必须把 <code>t</code> 换回 <code>x</code></b>，这一点不能偷懒。',
          why:
            '<b>第二类换元为什么能"反过来换"，而且换完还能换回来？</b>两个关键点：\n第一，<b>"能换回来"靠的是单调性</b>。因为要求 <code>x = ψ(t)</code> 单调，所以对每个 <code>x</code> 只有唯一一个 <code>t</code> 与之对应，反函数 <code>t = ψ<sup>-1</sup>(x)</code> 才存在。如果不单调，同一个 <code>x</code> 对应好几个 <code>t</code>，回代就会出现"到底换哪个"的歧义，公式就废了。\n第二，<b>"换了不亏"靠的是 <code>ψ′(t) ≠ 0</code> 和反函数求导公式</b>。<code>dx = ψ′(t) dt</code> 这个微分关系是双向的：<code>dt = dx/ψ′(t)</code> 也成立，而这一步正是反函数求导定理 <code>dt/dx = 1/(dx/dt)</code> 的内容，它要求分母不为零。\n所以三个条件（单调、可导、导数非零）不是数学家的洁癖，每一个都对应着一次实际要用的操作。',
          proof:
            '要证：<code>Φ(ψ<sup>-1</sup>(x))</code> 是 <code>f(x)</code> 的一个原函数。\n\n设 <code>G(x) = Φ(ψ<sup>-1</sup>(x))</code>，记反函数 <code>t = ψ<sup>-1</sup>(x)</code>，即 <code>G(x) = Φ(t)</code> 而 <code>x = ψ(t)</code>。\n\n对 <code>x</code> 求导。用复合函数求导法则，外层是 <code>Φ</code>、内层是 <code>ψ<sup>-1</sup></code>：\n<code>G′(x) = Φ′(t)·(ψ<sup>-1</sup>)(x)′</code>。\n\n第一，由假设 <code>Φ′(t) = f(ψ(t))·ψ′(t)</code>（因为 <code>Φ</code> 是 <code>f(ψ(t))ψ′(t)</code> 的原函数）。\n第二，由反函数求导定理，<code>(ψ<sup>-1</sup>)′(x) = 1/ψ′(t)</code>；这一步合法正因为 <code>ψ′(t) ≠ 0</code>。\n\n代入，两个因子恰好相消：\n<code>G′(x) = f(ψ(t))·ψ′(t)·(1/ψ′(t)) = f(ψ(t))</code>。\n\n最后，因为 <code>x = ψ(t)</code>，所以 <code>ψ(t) = x</code>，于是 <code>G′(x) = f(x)</code>。\n\n这就证明了 <code>∫ f(x) dx = Φ(ψ<sup>-1</sup>(x)) + C</code>。<b>证毕。</b>\n\n[[tip:注意证明里 <code>ψ′(t)</code> "恰好约掉"这一幕——它解释了为什么 <code>dx = ψ′(t) dt</code> 这条看似随意的替换是真定理而不是记法游戏。]]',
          example:
            '<b>例</b>：<code>∫ dx/(1 + √x)</code>。\n这题用第一类换元很难受，改用第二类。令 <code>x = t<sup>2</sup></code>（<code>t &gt; 0</code>，单调递增，<code>ψ′(t) = 2t ≠ 0</code>，条件满足）。则 <code>dx = 2t dt</code>，<code>√x = t</code>，原式化为\n<code>∫ 2t/(1 + t) dt = 2∫ (1 - 1/(1 + t)) dt = 2t - 2ln(1 + t) + C</code>。\n回代 <code>t = √x</code>：<code>= 2√x - 2ln(1 + √x) + C</code>。\n验收：对 <code>2√x - 2ln(1 + √x)</code> 求导，得 <code>1/√x - 2·(1/(2√x))/(1 + √x) = 1/√x - 1/(√x(1 + √x)) = (1 + √x - 1)/(√x(1 + √x)) = 1/(1 + √x)</code>，正确。\n\n<b>再看一个"开根号型"</b>：<code>∫ dx/(1 + ∛(x + 1))</code>。令 <code>x + 1 = t<sup>3</sup></code>，则 <code>dx = 3t<sup>2</sup> dt</code>，原式 <code>= ∫ 3t<sup>2</sup>/(1 + t) dt</code>，用多项式除法拆开即可。',
          pitfalls: [
            '<b>回代这一步被忘掉</b>，最后答案里还留着 <code>t</code>。不定积分的答案必须用原来的自变量表示。',
            '换元时忘了同步换 <code>dx</code>：只把 <code>x</code> 换成 <code>t</code> 却留着 <code>dx</code>，这是根本性错误。',
            '忽略条件的检验。例如令 <code>x = sin t</code> 时若不限制 <code>t ∈ (-π/2, π/2)</code>，就不单调，回代时会出现符号歧义（<code>cos t</code> 到底是正还是负）。',
            '回代时把 <code>t = ψ<sup>-1</sup>(x)</code> 写错方向，例如把 <code>t = √x</code> 写成 <code>t = x<sup>2</sup></code>。',
          ],
          tags: ['换元积分法', '第二类换元', '反函数', '定理'],
          related: ['thm-substitution-rule', 'def-trig-substitution', 'def-reciprocal-substitution', 'thm-integration-by-parts'],
        },
        {
          id: 'def-trig-substitution',
          kind: 'note',
          name: '三角代换（及其辅助三角形回代）',
          aka: ['三角换元', 'a²-x² 型代换', '辅助三角形'],
          statement:
            '遇到含二次根式 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>、<code>√(a<sup>2</sup> + x<sup>2</sup>)</code>、<code>√(x<sup>2</sup> - a<sup>2</sup>)</code> 的积分（<code>a &gt; 0</code>），按下列方式代换，用三角恒等式把根号去掉：\n<b>（1）含 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>：</b>令 <code>x = a·sin t</code>，<code>t ∈ (-π/2, π/2)</code>；则 <code>√(a<sup>2</sup> - x<sup>2</sup>) = a·cos t</code>（<code>cos t &gt; 0</code>，可放心开方）。\n<b>（2）含 <code>√(a<sup>2</sup> + x<sup>2</sup>)</code>：</b>令 <code>x = a·tan t</code>，<code>t ∈ (-π/2, π/2)</code>；则 <code>√(a<sup>2</sup> + x<sup>2</sup>) = a·sec t</code>。\n<b>（3）含 <code>√(x<sup>2</sup> - a<sup>2</sup>)</code>：</b>令 <code>x = a·sec t</code>（<code>t ∈ (0, π/2)</code> 时对应 <code>x &gt; a</code>）；则 <code>√(x<sup>2</sup> - a<sup>2</sup>) = a·tan t</code>。\n<b>回代办法（辅助三角形）</b>：把代换写成 <code>sin t = x/a</code> 这种"对边 / 斜边"的形式，画一个直角三角形标上三条边，就能直接从图上读出 <code>cos t</code>、<code>tan t</code>、<code>sec t</code> 对应的是哪两条边的比，从而把 <code>t</code> 的三角函数换回 <code>x</code> 的表达式。',
          plain:
            '三角代换的动机可以一句话说完：<b>根号最难对付，而三角恒等式天生就是"消根号"的机器。</b>\n看 <code>1 - sin<sup>2</sup>t = cos<sup>2</sup>t</code>：左边是"1 减去一个平方"，右边是"一个平方"。所以只要把 <code>x<sup>2</sup></code> 设成 <code>a<sup>2</sup>sin<sup>2</sup>t</code>，<code>√(a<sup>2</sup> - x<sup>2</sup>)</code> 立刻变成 <code>a cos t</code>，根号没了。另外两个公式 <code>1 + tan<sup>2</sup>t = sec<sup>2</sup>t</code>、<code>sec<sup>2</sup>t - 1 = tan<sup>2</sup>t</code> 分别管另外两种根号。\n<b>为什么选正弦而不是余弦？</b>其实选余弦也行，但两套混用容易记错符号。统一用正弦的好处是 <code>t</code> 限制在 <code>(-π/2, π/2)</code> 时 <code>cos t &gt; 0</code>，开根号时不用讨论正负号——这个"不用讨论正负"就是我们要的省心。\n至于回代时用的辅助三角形：它只是一个"查表工具"。已知 <code>sin t = x/a</code>，就画一个直角三角形，对边写 <code>x</code>、斜边写 <code>a</code>，勾股定理算出邻边是 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>。这样 <code>cos t = √(a<sup>2</sup> - x<sup>2</sup>)/a</code> 一眼就读出来了，不必去背反三角函数的复杂表达式。',
          why:
            '为什么三种根号对应三种代换，而不是随便挑一种？因为每种代换都必须让根号里的东西"恰好"变成某个三角恒等式的左边：\n<code>a<sup>2</sup> - x<sup>2</sup></code> 是"常数减平方"，对应 <code>1 - sin<sup>2</sup></code>；\n<code>a<sup>2</sup> + x<sup>2</sup></code> 是"常数加平方"，对应 <code>1 + tan<sup>2</sup></code>；\n<code>x<sup>2</sup> - a<sup>2</sup></code> 是"平方减常数"，对应 <code>sec<sup>2</sup> - 1</code>。\n<b>记住这条对应关系，比死背三个公式可靠得多：看到"减平方"就想正弦，看到"加平方"就想正切，看到"平方减"就想正割。</b>',
          proof:
            '本条目是换元方案清单，按规范给出方案的正确性依据，并演示两条核心公式的完整推导。\n\n<b>（一）方案为何能消根号（代数核对）。</b>\n方案（1）：<code>x = a sin t</code> 时，<code>a<sup>2</sup> - x<sup>2</sup> = a<sup>2</sup> - a<sup>2</sup>sin<sup>2</sup>t = a<sup>2</sup>(1 - sin<sup>2</sup>t) = a<sup>2</sup>cos<sup>2</sup>t</code>。由于 <code>t ∈ (-π/2, π/2)</code> 保证 <code>cos t &gt; 0</code>，开方得 <code>√(a<sup>2</sup> - x<sup>2</sup>) = a cos t</code>，符号确定。\n方案（2）：<code>x = a tan t</code> 时，<code>a<sup>2</sup> + x<sup>2</sup> = a<sup>2</sup>(1 + tan<sup>2</sup>t) = a<sup>2</sup>sec<sup>2</sup>t</code>，同样由 <code>t ∈ (-π/2, π/2)</code> 得 <code>sec t &gt; 0</code>，故等于 <code>a sec t</code>。\n方案（3）：<code>x = a sec t</code> 时，<code>x<sup>2</sup> - a<sup>2</sup> = a<sup>2</sup>(sec<sup>2</sup>t - 1) = a<sup>2</sup>tan<sup>2</sup>t</code>，在 <code>t ∈ (0, π/2)</code> 上 <code>tan t &gt; 0</code>，故等于 <code>a tan t</code>。\n\n<b>（二）用方案（2）推出 <code>∫ dx/√(x<sup>2</sup> + a<sup>2</sup>) = ln(x + √(x<sup>2</sup> + a<sup>2</sup>)) + C</code>。</b>\n令 <code>x = a tan t</code>（<code>t ∈ (-π/2, π/2)</code>），则 <code>dx = a sec<sup>2</sup>t dt</code>，且 <code>√(x<sup>2</sup> + a<sup>2</sup>) = a sec t</code>。代入：\n<code>∫ dx/√(x<sup>2</sup> + a<sup>2</sup>) = ∫ a sec<sup>2</sup>t/(a sec t) dt = ∫ sec t dt</code>。\n而 <code>∫ sec t dt</code> 用凑微分技巧（分子分母同乘 <code>sec t + tan t</code>）：\n<code>∫ sec t dt = ∫ sec t(sec t + tan t)/(sec t + tan t) dt = ∫ d(sec t + tan t)/(sec t + tan t) = ln|sec t + tan t| + C</code>。\n回代。由辅助三角形（邻边 <code>a</code>、对边 <code>x</code>、斜边 <code>√(x<sup>2</sup> + a<sup>2</sup>)</code>）得 <code>sec t = √(x<sup>2</sup> + a<sup>2</sup>)/a</code>、<code>tan t = x/a</code>，所以\n<code>ln|sec t + tan t| = ln|(√(x<sup>2</sup> + a<sup>2</sup>) + x)/a| = ln(x + √(x<sup>2</sup> + a<sup>2</sup>)) - ln a</code>。\n末项 <code>-ln a</code> 是常数，并入 <code>C</code>，于是\n<code>∫ dx/√(x<sup>2</sup> + a<sup>2</sup>) = ln(x + √(x<sup>2</sup> + a<sup>2</sup>)) + C</code>。这里可以去掉绝对值，因为 <code>√(x<sup>2</sup> + a<sup>2</sup>) &gt; |x|</code> 恒成立，括号内恒为正。<b>推导完毕。</b>\n\n<b>（三）用方案（1）推出 <code>∫ √(a<sup>2</sup> - x<sup>2</sup>) dx</code>。</b>\n令 <code>x = a sin t</code>，则 <code>dx = a cos t dt</code>，<code>√(a<sup>2</sup> - x<sup>2</sup>) = a cos t</code>，代入：\n<code>∫ √(a<sup>2</sup> - x<sup>2</sup>) dx = ∫ a<sup>2</sup>cos<sup>2</sup>t dt</code>。\n降幂：<code>cos<sup>2</sup>t = (1 + cos 2t)/2</code>，故\n<code>= (a<sup>2</sup>/2)∫ (1 + cos 2t) dt = (a<sup>2</sup>/2)(t + (1/2)sin 2t) + C = (a<sup>2</sup>/2)t + (a<sup>2</sup>/4)sin 2t + C</code>。\n用 <code>sin 2t = 2 sin t cos t</code> 回代：<code>sin t = x/a</code>、<code>cos t = √(a<sup>2</sup> - x<sup>2</sup>)/a</code>，于是\n<code>(a<sup>2</sup>/4)·sin 2t = (a<sup>2</sup>/2)·sin t cos t = (a<sup>2</sup>/2)·(x/a)·(√(a<sup>2</sup> - x<sup>2</sup>)/a) = (x/2)√(a<sup>2</sup> - x<sup>2</sup>)</code>，\n且 <code>t = arcsin(x/a)</code>。合起来：\n<code>∫ √(a<sup>2</sup> - x<sup>2</sup>) dx = (x/2)√(a<sup>2</sup> - x<sup>2</sup>) + (a<sup>2</sup>/2)arcsin(x/a) + C</code>。\n这个结果的几何意义很直白：它是单位圆里那段"弦长乘以高再加扇形"的面积公式。<b>推导完毕。</b>',
          example:
            '<b>例 1</b>：<code>∫ dx/√(a<sup>2</sup> - x<sup>2</sup>)</code>（<code>|x| &lt; a</code>）。令 <code>x = a sin t</code>，<code>dx = a cos t dt</code>，分母 <code>= a cos t</code>，原式 <code>= ∫ dt = t + C = arcsin(x/a) + C</code>。\n<b>例 2</b>：<code>∫ √(4 - x<sup>2</sup>) dx</code>（<code>a = 2</code>）。令 <code>x = 2 sin t</code>，直接套上面的公式得 <code>(x/2)√(4 - x<sup>2</sup>) + 2 arcsin(x/2) + C</code>。\n<b>例 3</b>：<code>∫ dx/(x<sup>2</sup>√(x<sup>2</sup> + 1))</code>。令 <code>x = tan t</code>，则 <code>dx = sec<sup>2</sup>t dt</code>，<code>√(x<sup>2</sup> + 1) = sec t</code>，<code>x<sup>2</sup> = tan<sup>2</sup>t</code>，原式 <code>= ∫ sec<sup>2</sup>t/(tan<sup>2</sup>t·sec t) dt = ∫ sec t/tan<sup>2</sup>t dt = ∫ cos t/sin<sup>2</sup>t dt = -1/sin t + C</code>。\n回代用辅助三角形：<code>tan t = x/1</code>，斜边 <code>√(x<sup>2</sup> + 1)</code>，故 <code>sin t = x/√(x<sup>2</sup> + 1)</code>，答案为 <code>-√(x<sup>2</sup> + 1)/x + C</code>。',
          pitfalls: [
            '忘记限定 <code>t</code> 的范围，导致开根号时 <code>√(cos<sup>2</sup>t) = cos t</code> 这一步没依据（真值是 <code>|cos t|</code>）。',
            '回代时不用辅助三角形，硬凑反三角表达式，结果把 <code>arcsin</code> 和 <code>arctan</code> 用错。',
            '把三种代换的对应关系搞混，例如给 <code>√(a<sup>2</sup> + x<sup>2</sup>)</code> 用 <code>x = a sin t</code>，结果根号里出现 <code>a<sup>2</sup>cos<sup>2</sup>t</code> 却带着减号，越算越乱。',
            '答案形式不统一时误判自己算错。例如 <code>∫ dx/(a<sup>2</sup> + x<sup>2</sup>)</code> 写成 <code>(1/a)arctan(x/a) + C</code> 是对的，写成 <code>(1/a)arccot(...)</code> 也可能对，只差一个常数——<b>用求导验收，不要靠"长得像不像"下判断</b>。',
          ],
          tags: ['三角代换', '换元积分法', '辅助三角形', '技巧'],
          related: ['thm-substitution-rule-2', 'def-reciprocal-substitution', 'def-basic-integral-table', 'thm-substitution-rule'],
        },
        {
          id: 'def-reciprocal-substitution',
          kind: 'note',
          name: '倒代换与根式代换',
          aka: ['倒数代换', 'x=1/t', '根号整体代换'],
          statement:
            '<b>（1）倒代换：</b>令 <code>x = 1/t</code>（<code>t ≠ 0</code>），则 <code>dx = -dt/t<sup>2</sup></code>。适合被积函数分母关于 <code>x</code> 的次数明显高于分子（例如分母含 <code>x<sup>n</sup></code> 而分子接近常数）的情形。\n<b>（2）根式代换：</b>若被积函数只含 <code>x</code> 与 <code>√(ax + b)</code> 的有理式（<code>a ≠ 0</code>），令 <code>t = √(ax + b)</code>，则 <code>x = (t<sup>2</sup> - b)/a</code>，<code>dx = (2t/a) dt</code>，积分化为 <code>t</code> 的有理函数积分。\n更一般：被积函数是 <code>x</code> 与若干个 <code>x</code> 的方根的有理式时，取各根指数的最小公倍数 <code>n</code>，令 <code>t = x<sup>1/n</sup></code>，可一次把全部根号消掉。',
          plain:
            '<b>倒代换</b>是把"大个子分母"翻到上面来。比如 <code>∫ dx/(x<sup>4</sup>√(x<sup>2</sup> + 1))</code>，分母次数太高，硬积很难受。令 <code>x = 1/t</code> 之后，原来分母里的 <code>x<sup>4</sup></code> 变成分子上的 <code>t<sup>4</sup></code>，正好被 <code>dx = -dt/t<sup>2</sup></code> 平衡掉一部分，式子清爽很多。\n<b>根式代换</b>更直白：既然根号讨厌，那就<b>把整个根号取个名字</b>。比如 <code>√x</code> 看着碍事，就说"我叫它 <code>t</code>"，于是 <code>x = t<sup>2</sup></code>、<code>dx = 2t dt</code>，全变成 <code>t</code> 的多项式分式——这类积分在 4.4 节有通用解法，一定能算完。\n注意这里和三角代换的分工：三角代换处理"二次根号里带平方和常数"（<code>√(a<sup>2</sup> ± x<sup>2</sup>)</code> 等），根式代换处理"一次式在根号里"（<code>√(ax + b)</code>）。两者不冲突。',
          why:
            '为什么这两个代换值得单独记？因为它们各自消掉一类"结构性的麻烦"：\n<b>倒代换消掉的是"次数失衡"。</b>它把 <code>x<sup>n</sup></code> 变成 <code>t<sup>-n</sup></code>，相当于把分子分母的次数同时翻个方向。当分母次数远高于分子时，一翻就变得平衡，积分随之变成基本型。\n<b>根式代换消掉的是"根号本身"。</b>它的本质是第二类换元 + 反函数思想：令 <code>t = √(ax + b)</code>，等价于 <code>x = (t<sup>2</sup> - b)/a</code>，这是一个多项式代换，单调性、可导性都极容易检验（<code>t &gt; 0</code> 时严格单调），条件天然满足，所以用起来最省心。\n而"取最小公倍数"的技巧则来自一个朴素观察：<b>只要让所有根号都变成同一个新字母的整数次幂，根号就全军覆没。</b>例如同时有 <code>√x</code> 和 <code>∛x</code>，令 <code>x = t<sup>6</sup></code> 就够了。',
          proof:
            '两条代换都是第二类换元积分法的特例，正确性直接由该定理保证。这里补上条件核验与化简过程。\n\n<b>（1）倒代换的条件核验。</b>取 <code>ψ(t) = 1/t</code>，定义域 <code>t ∈ (0, +∞)</code>（或 <code>(-∞, 0)</code>）。在此区间上 <code>ψ′(t) = -1/t<sup>2</sup> ≠ 0</code>，且 <code>ψ</code> 严格单调（在正半轴上递减），故反函数 <code>t = 1/x</code> 存在。第二类换元的条件全部满足，代换合法。由 <code>dx = -dt/t<sup>2</sup></code> 即可把 <code>x</code> 的积分整体化为 <code>t</code> 的积分。\n\n<b>（2）根式代换的条件核验。</b>取 <code>ψ(t) = (t<sup>2</sup> - b)/a</code>，限定 <code>t &gt; 0</code>。则 <code>ψ′(t) = 2t/a</code>，在 <code>t &gt; 0</code> 上不为零（因为 <code>a ≠ 0</code>、<code>t &gt; 0</code>），且 <code>ψ</code> 在 <code>t &gt; 0</code> 上严格单调，反函数 <code>t = √(ax + b)</code>（取正根）存在。于是\n<code>dx = (2t/a) dt</code>，而原被积函数中的每个 <code>√(ax + b)</code> 都可以换成 <code>t</code>。因为原被积函数是 <code>x</code> 与 <code>√(ax + b)</code> 的有理式，且 <code>x = (t<sup>2</sup> - b)/a</code> 是 <code>t</code> 的多项式，所以代入后整体成为 <code>t</code> 的<b>有理函数</b>。\n\n<b>（3）为什么有理函数一定能积（预告 4.4 节）。</b>有理函数的积分有系统化的部分分式分解算法，其每一步的结果都可以用基本积分表算出来（详见"有理函数的部分分式分解"与"有理函数积分的一般步骤"两条）。因此在根式代换之后，题目从"没法下手的无理式"变成了"一定能算完的有理式"，这就是这条代换的价值所在。<b>核验完毕。</b>',
          example:
            '<b>例 1（根式代换）</b>：<code>∫ dx/(1 + √x)</code>。令 <code>t = √x</code>（<code>t &gt; 0</code>），则 <code>x = t<sup>2</sup></code>，<code>dx = 2t dt</code>，原式\n<code>= ∫ 2t/(1 + t) dt = 2∫ (1 - 1/(1 + t)) dt = 2t - 2ln(1 + t) + C = 2√x - 2ln(1 + √x) + C</code>。\n\n<b>例 2（根式代换处理不同次根）</b>：<code>∫ dx/(√x + ∛x)</code>。两个根指数分别是 2 和 3，最小公倍数是 6，故令 <code>x = t<sup>6</sup></code>（<code>t &gt; 0</code>），则 <code>dx = 6t<sup>5</sup> dt</code>，<code>√x = t<sup>3</sup></code>，<code>∛x = t<sup>2</sup></code>，原式\n<code>= ∫ 6t<sup>5</sup>/(t<sup>3</sup> + t<sup>2</sup>) dt = 6∫ t<sup>3</sup>/(t + 1) dt</code>。做多项式除法：<code>t<sup>3</sup>/(t + 1) = t<sup>2</sup> - t + 1 - 1/(t + 1)</code>，于是\n<code>= 6(t<sup>3</sup>/3 - t<sup>2</sup>/2 + t - ln|t + 1|) + C = 2t<sup>3</sup> - 3t<sup>2</sup> + 6t - 6ln(t + 1) + C</code>。\n回代 <code>t = x<sup>1/6</sup></code>，即 <code>t<sup>3</sup> = √x</code>、<code>t<sup>2</sup> = ∛x</code>，得\n<code>= 2√x - 3∛x + 6x<sup>1/6</sup> - 6ln(x<sup>1/6</sup> + 1) + C</code>。\n\n<b>例 3（倒代换）</b>：<code>∫ dx/(x<sup>2</sup>√(x<sup>2</sup> + 1))</code> 也可用 <code>x = 1/t</code> 来解：<code>dx = -dt/t<sup>2</sup></code>，<code>x<sup>2</sup> = 1/t<sup>2</sup></code>，<code>√(x<sup>2</sup> + 1) = √(1 + t<sup>2</sup>)/t</code>（取 <code>t &gt; 0</code>），故原式\n<code>= ∫ (-dt/t<sup>2</sup>)/((1/t<sup>2</sup>)·√(1 + t<sup>2</sup>)/t) = -∫ t/√(1 + t<sup>2</sup>) dt = -√(1 + t<sup>2</sup>) + C</code>。\n回代 <code>t = 1/x</code>：<code>-√(1 + 1/x<sup>2</sup>) + C = -√(x<sup>2</sup> + 1)/|x| + C</code>，在 <code>x &gt; 0</code> 上与三角代换的结果一致。',
          pitfalls: [
            '倒代换后忘记 <code>dx = -dt/t<sup>2</sup></code> 里的负号，答案整体差一个符号。',
            '根式代换里取根号时不做正负讨论。例如由 <code>t = √x</code> 得 <code>x = t<sup>2</sup></code> 时，必须坚持 <code>t &gt; 0</code>；若允许 <code>t &lt; 0</code>，回代会出现歧义。',
            '同时出现多个不同次根式时，取了错误的公倍数（例如 <code>√x</code> 与 <code>∛x</code> 取 <code>n = 5</code>），结果根号没消干净。',
            '把根式代换和三角代换用错场合：对 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code> 令 <code>t = √(a<sup>2</sup> - x<sup>2</sup>)</code>，会得到 <code>x<sup>2</sup> = a<sup>2</sup> - t<sup>2</sup></code>，回代时符号麻烦，不如直接三角代换。',
          ],
          tags: ['倒代换', '根式代换', '换元积分法', '技巧'],
          related: ['thm-substitution-rule-2', 'def-trig-substitution', 'def-rational-function', 'def-partial-fractions'],
        },
      ],
    },
    {
      id: 'ch4-3',
      no: '4.3',
      title: '分部积分法',
      summary:
        '把乘积求导法则两边积分，就得到 ∫u dv = uv - ∫v du。它专治"两类不同函数相乘"的积分，核心难题是选对 u 和 dv。',
      items: [
        {
          id: 'thm-integration-by-parts',
          kind: 'theorem',
          name: '分部积分法',
          aka: ['分部积分公式', '∫u dv = uv - ∫v du'],
          statement:
            '设 <code>u = u(x)</code>、<code>v = v(x)</code> 都有连续导数，则\n<code>∫ u dv = uv - ∫ v du</code>，\n写成完整形式就是\n<code>∫ u(x)v′(x) dx = u(x)v(x) - ∫ u′(x)v(x) dx</code>。\n<b>适用信号</b>：被积函数是两类"不同种类"函数的乘积，例如"幂函数 × 指数函数"、"幂函数 × 三角函数"、"幂函数 × 对数函数"、"幂函数 × 反三角函数"、"指数函数 × 三角函数"。',
          plain:
            '分部积分的来历非常朴素：它就是把<b>乘积求导法则</b>两边积分。<code>(uv)′ = u′v + uv′</code> 这条法则你一定熟，把它整理一下就是 <code>uv′ = (uv)′ - u′v</code>。两边同时积分，左边就是 <code>∫ u v′ dx</code>，右边第一项 <code>∫ (uv)′ dx = uv</code>（先导后积回到原样），于是就有了 <code>∫ u v′ dx = uv - ∫ u′ v dx</code>。\n它的实际作用像"交换人质"：本来要算 <code>∫ u dv</code>，算不动；换个角度去算 <code>∫ v du</code>，可能就轻松了。<b>注意这不是"化简"，而是"换一个更简单的积分"。</b>所以用分部积分时，一定要先想清楚：换完之后那个新积分是不是真的更容易？如果换完更难，说明 <code>u</code> 和 <code>dv</code> 选反了。\n最适合的场合是"多项式 × 超越函数"。因为多项式求一次导就降一次幂，多求几次就变成常数（甚至变 0），而指数、三角函数求导或积分后形状不变。这样反复用分部积分，多项式被"磨"没了，题就做完了。',
          why:
            '<b>分部积分公式是怎么从乘积求导法则变出来的？</b>分三步：\n第一步，写出乘积求导法则：<code>(uv)′ = u′v + uv′</code>。这一步不需要任何灵感，是现成的。\n第二步，把它移项，让"我们想算的那一项"单独留在一边。我们想算的是 <code>uv′</code> 的积分（也就是 <code>∫ u dv</code>），所以移项得 <code>uv′ = (uv)′ - u′v</code>。\n第三步，两边同时求不定积分。左边得 <code>∫ uv′ dx</code>。右边第一项用"先导后积"的互逆关系：<code>∫ (uv)′ dx = uv + C</code>。右边第二项就是 <code>∫ u′v dx</code>。把常数收进去、把微分记号写成 <code>dv = v′dx</code>、<code>du = u′dx</code>，就得到 <code>∫ u dv = uv - ∫ v du</code>。\n<b>所以整件事的秘密只有一句话：把它看成"乘积求导法则的积分版本"。</b>这也解释了为什么它和换元法地位相当——换元法是链式法则的逆用，分部积分是乘积法则的逆用，两条求导法则各自对应一个积分方法。',
          proof:
            '设 <code>u(x)</code>、<code>v(x)</code> 在区间 <code>I</code> 上可导且导数连续。\n\n<b>第一步</b>，写出乘积的求导法则：\n<code>(u(x)v(x))′ = u′(x)v(x) + u(x)v′(x)</code>，对一切 <code>x ∈ I</code> 成立。\n\n<b>第二步</b>，把 <code>u(x)v′(x)</code> 解出来：\n<code>u(x)v′(x) = (u(x)v(x))′ - u′(x)v(x)</code>。\n\n<b>第三步</b>，两边求不定积分。由不定积分的线性性质，右边的积分可以拆成两项之差：\n<code>∫ u(x)v′(x) dx = ∫ (u(x)v(x))′ dx - ∫ u′(x)v(x) dx</code>。\n\n<b>第四步</b>，处理右边第一项。由"先导后积"的互逆关系（<code>∫ F′(x) dx = F(x) + C</code>），取 <code>F = uv</code>，得\n<code>∫ (u(x)v(x))′ dx = u(x)v(x) + C</code>。\n\n<b>第五步</b>，代回并合并常数：\n<code>∫ u(x)v′(x) dx = u(x)v(x) + C - ∫ u′(x)v(x) dx</code>。把 <code>C</code> 吸进右边那个积分将要产生的任意常数里（反正最终都要写成 <code>+ C</code>，多一个常数不影响函数族），得\n<code>∫ u(x)v′(x) dx = u(x)v(x) - ∫ u′(x)v(x) dx</code>。\n\n<b>第六步</b>，写成微分形式。由 <code>dv = v′(x) dx</code>、<code>du = u′(x) dx</code>，上式即\n<code>∫ u dv = uv - ∫ v du</code>。<b>证毕。</b>\n\n[[tip:注意整个推导里没有用到任何额外假设，只用了"乘积求导法则"和"积分与导数互逆"这两件事。也就是说，分部积分公式并不是新知识，它只是我们已经会的东西的一次重组。]]',
          example:
            '<b>例 1（幂函数 × 指数）</b>：<code>∫ x e<sup>x</sup> dx</code>。\n取 <code>u = x</code>，<code>dv = e<sup>x</sup> dx</code>，则 <code>du = dx</code>，<code>v = e<sup>x</sup></code>。代入公式：\n<code>∫ x e<sup>x</sup> dx = x e<sup>x</sup> - ∫ e<sup>x</sup> dx = x e<sup>x</sup> - e<sup>x</sup> + C</code>。\n验收：把 <code>x e<sup>x</sup> - e<sup>x</sup></code> 求导得 <code>(e<sup>x</sup> + x e<sup>x</sup>) - e<sup>x</sup> = x e<sup>x</sup></code>，正确。\n\n<b>例 2（幂函数 × 三角）</b>：<code>∫ x cos x dx</code>。\n取 <code>u = x</code>，<code>dv = cos x dx</code>，则 <code>du = dx</code>，<code>v = sin x</code>：\n<code>∫ x cos x dx = x sin x - ∫ sin x dx = x sin x + cos x + C</code>。\n\n<b>例 3（幂函数 × 对数，多项式当 <code>v</code>）</b>：<code>∫ ln x dx</code>。\n这里没有乘积，但可以看作 <code>u = ln x</code>、<code>dv = dx</code>，则 <code>du = dx/x</code>，<code>v = x</code>：\n<code>∫ ln x dx = x ln x - ∫ x·(1/x) dx = x ln x - x + C</code>。\n这个技巧请牢记：<b>单个对数、单个反三角函数，都可以用"乘一个 1"的办法套分部积分。</b>\n\n<b>例 4（幂函数 × 反三角）</b>：<code>∫ x arctan x dx</code>。\n取 <code>u = arctan x</code>，<code>dv = x dx</code>，则 <code>du = dx/(1 + x<sup>2</sup>)</code>，<code>v = x<sup>2</sup>/2</code>：\n<code>= (x<sup>2</sup>/2)arctan x - (1/2)∫ x<sup>2</sup>/(1 + x<sup>2</sup>) dx = (x<sup>2</sup>/2)arctan x - (1/2)∫ (1 - 1/(1 + x<sup>2</sup>)) dx</code>\n<code>= (x<sup>2</sup>/2)arctan x - x/2 + (1/2)arctan x + C</code>。\n\n<b>例 5（指数 × 三角，循环型）</b>：<code>∫ e<sup>x</sup> cos x dx</code>。\n取 <code>u = cos x</code>，<code>dv = e<sup>x</sup> dx</code>，得 <code>∫ e<sup>x</sup> cos x dx = e<sup>x</sup>cos x + ∫ e<sup>x</sup> sin x dx</code>；对后者再用一次分部（<code>u = sin x</code>，<code>dv = e<sup>x</sup> dx</code>）得 <code>∫ e<sup>x</sup> sin x dx = e<sup>x</sup>sin x - ∫ e<sup>x</sup>cos x dx</code>。两式合并：设 <code>I = ∫ e<sup>x</sup>cos x dx</code>，则 <code>I = e<sup>x</sup>cos x + e<sup>x</sup>sin x - I</code>，解得 <code>I = e<sup>x</sup>(cos x + sin x)/2 + C</code>。\n\n<b>例 6（递推型）</b>：<code>∫ x<sup>2</sup> e<sup>x</sup> dx</code>。\n第一次取 <code>u = x<sup>2</sup></code>、<code>dv = e<sup>x</sup>dx</code>：得 <code>x<sup>2</sup>e<sup>x</sup> - 2∫ x e<sup>x</sup> dx</code>；第二次用上面例 1 的结果：\n<code>= x<sup>2</sup>e<sup>x</sup> - 2(x e<sup>x</sup> - e<sup>x</sup>) + C = e<sup>x</sup>(x<sup>2</sup> - 2x + 2) + C</code>。',
          pitfalls: [
            '<b>把 <code>u</code> 和 <code>dv</code> 选反</b>，换出来的新积分比原来还难。典型错误：算 <code>∫ x e<sup>x</sup> dx</code> 时取 <code>u = e<sup>x</sup></code>、<code>dv = x dx</code>，结果是 <code>(x<sup>2</sup>/2)e<sup>x</sup> - (1/2)∫ x<sup>2</sup>e<sup>x</sup> dx</code>，次数反而升高了。',
            '<b>求 <code>v</code> 时漏掉"选哪个原函数"的自觉</b>。<code>dv = e<sup>x</sup> dx</code> 时理论上 <code>v = e<sup>x</sup> + C<sub>0</sub></code>，但取 <code>C<sub>0</sub> = 0</code> 最省事（多出来的常数最终会被 <code>+C</code> 吸收），<b>千万不要把 <code>C<sub>0</sub></code> 带进后续计算</b>。',
            '符号写错：公式里是 <code>uv <b>减去</b> ∫v du</code>，不是加。这个负号错了整题全错。',
            '循环型题目算到 <code>I = e<sup>x</sup>cos x + e<sup>x</sup>sin x - I</code> 就停住，忘了把 <code>I</code> 当未知数解出来（移项得 <code>2I = ...</code>）。',
            '把一个积分反复分部却始终没有进展（<code>u</code> 和 <code>dv</code> 每次都选同一类函数），陷入死循环还不自知。',
          ],
          tags: ['分部积分', '乘积求导', '定理', '核心方法'],
          related: ['thm-choice-of-u-dv', 'thm-substitution-rule', 'def-rational-function', 'thm-indefinite-inverse'],
        },
        {
          id: 'thm-choice-of-u-dv',
          kind: 'note',
          name: '分部积分中 u 与 dv 的选取原则',
          aka: ['反对幂指三', '怎样选u和dv'],
          statement:
            '<b>总原则</b>：选取要使得 <code>∫ v du</code> 比原来的 <code>∫ u dv</code> 更容易算。具体两条经验规则：\n<b>（1）降次优先</b>：若被积函数中含正整数次幂 <code>x<sup>n</sup></code>（或多项式），应当把它选作 <code>u</code>，因为求导一次就降一次幂，反复分部就能把它"磨"成常数乃至 0；而把指数、三角函数选作 <code>dv</code>（它们积分后形状不变）。\n<b>（2）口诀"反对幂指三"</b>：当被积函数是两类函数之积时，按\n<b>反</b>三角函数 → <b>对</b>数函数 → <b>幂</b>函数 → <b>指</b>数函数 → <b>三</b>角函数\n的顺序，<b>排在前面的优先当 <code>u</code></b>，排在后面的当 <code>dv</code>。\n例如 <code>∫ x<sup>2</sup> ln x dx</code> 中"对"在"幂"前，故取 <code>u = ln x</code>；<code>∫ x e<sup>x</sup> dx</code> 中"幂"在"指"前，故取 <code>u = x</code>。\n<b>（3）单独出现的对数、反三角</b>：直接取它们为 <code>u</code>，取 <code>dv = dx</code>（相当于乘一个 1）。',
          plain:
            '口诀听着玄，其实逻辑很简单：<b>谁求导之后"变得更简单"，就让它当 <code>u</code>；谁积分之后"还是老样子"，就让它当 <code>dv</code>。</b>\n对数函数求导变成 <code>1/x</code>，从"难缠的对数"变成了"简单的分式"，所以它排最前面当 <code>u</code>。反三角函数求导变成代数式，同理排前面。幂函数求导降一次幂，排在中间。而指数和三角函数求导、积分之后函数类型不变，压根不怕被积分，所以当 <code>dv</code>。\n用一个比喻：分部积分像"处理一对打架的搭档"。你要让那个<b>越打越弱的</b>去当 <code>u</code>（它会被微分一次次削弱），让那个<b>打不死的</b>去当 <code>dv</code>（它被积分也不变形）。这样几轮下来，弱的一方被彻底消灭，题目就结束了。\n反过来，如果让"打不死的"当 <code>u</code>，那每一轮它都活着，永远结束不了——这就是死循环，说明选错了。',
          why:
            '为什么一定要"降次的那一方当 <code>u</code>"？因为分部积分每用一次，就会把 <code>u</code> 求一次导、把 <code>dv</code> 积一次分。求导对多项式是"降次"，积分对多项式是"升次"。如果选错了，让多项式当 <code>dv</code>，那每用一次它的次数就涨一次，<code>∫ v du</code> 里的 <code>v</code> 越来越大，问题越来越复杂，永远做不完。\n所以这条原则不是死记的口诀，而是对"每一次分部积分做了什么"的直接推论：<b>分部积分只奖励一种选择——让求导那一方承担"会越来越简单"的角色。</b>',
          proof:
            '本条目是方法性说明，按规范给出其推理依据。\n\n<b>（一）规则（1）的论证。</b>设被积函数形如 <code>x<sup>n</sup>·g(x)</code>，其中 <code>n</code> 是正整数，<code>g</code> 的积分容易求出（如 <code>g = e<sup>x</sup></code>、<code>g = cos x</code>）。取 <code>u = x<sup>n</sup></code>、<code>dv = g(x) dx</code>，设 <code>G</code> 是 <code>g</code> 的原函数，则 <code>du = n x<sup>n-1</sup> dx</code>、<code>v = G(x)</code>，代入公式得\n<code>∫ x<sup>n</sup> g(x) dx = x<sup>n</sup> G(x) - n∫ x<sup>n-1</sup> G(x) dx</code>。\n观察右边那个新积分：被积函数中多项式的次数已经从 <code>n</code> 降到 <code>n - 1</code>，其余的因子只是把 <code>g</code> 换成了它的原函数 <code>G</code>，复杂程度没有本质变化。于是每用一次分部积分，幂次就降 1，最多 <code>n</code> 次之后多项式变成常数，再积一次即得结果。<b>这就证明了按规则（1）选取，过程一定终止。</b>\n\n反证规则写反的后果：若取 <code>u = g(x)</code>、<code>dv = x<sup>n</sup> dx</code>，则 <code>v = x<sup>n+1</sup>/(n+1)</code>，新积分为 <code>∫ x<sup>n+1</sup> G(x)/(n+1)·(与 g′ 相关的东西) dx</code>，多项式次数从 <code>n</code> 升到 <code>n + 1</code>，且每用一次继续升一次，过程永不终止。\n\n<b>（二）规则（2）的合理性说明。</b>口诀顺序的依据是"求导后复杂度的变化"：\n反三角函数求导得代数式（复杂度下降，适合当 <code>u</code>）；\n对数函数求导得 <code>1/x</code>，即有理式（复杂度大幅下降，适合当 <code>u</code>）；\n幂函数求导降次（复杂度缓慢下降，适合当 <code>u</code>）；\n指数函数求导与积分后仍是 <code>e<sup>x</sup></code> 的倍数（复杂度不变，适合当 <code>dv</code>）；\n三角函数求导或积分后仍是 <code>sin</code>、<code>cos</code> 的组合（复杂度不变，适合当 <code>dv</code>）。\n把"下降快的"排在前面当 <code>u</code>，就能尽快把难缠的部分消掉，这正是口诀的顺序。<b>注意口诀是经验规则而非定理</b>：遇到具体题目，仍以"<code>∫ v du</code> 是否更好算"为最终判据。',
          example:
            '<b>正例（按口诀选，一次到位）</b>：<code>∫ x<sup>2</sup> ln x dx</code>。"对"在"幂"前，取 <code>u = ln x</code>、<code>dv = x<sup>2</sup> dx</code>，则 <code>du = dx/x</code>、<code>v = x<sup>3</sup>/3</code>：\n<code>= (x<sup>3</sup>/3)ln x - ∫ (x<sup>3</sup>/3)(1/x) dx = (x<sup>3</sup>/3)ln x - (1/3)∫ x<sup>2</sup> dx = (x<sup>3</sup>/3)ln x - x<sup>3</sup>/9 + C</code>。\n如果选反了（取 <code>u = x<sup>2</sup></code>、<code>dv = ln x dx</code>），就需要先知道 <code>∫ ln x dx</code>，白绕一圈。\n\n<b>反例（选反了会变难）</b>：<code>∫ x e<sup>x</sup> dx</code> 若取 <code>u = e<sup>x</sup></code>、<code>dv = x dx</code>，得 <code>(x<sup>2</sup>/2)e<sup>x</sup> - (1/2)∫ x<sup>2</sup>e<sup>x</sup> dx</code>，幂次升高，越算越乱。正确选择见上一条的例 1。\n\n<b>例（单独对数）</b>：<code>∫ ln(x + 1) dx</code>。取 <code>u = ln(x + 1)</code>、<code>dv = dx</code>，<code>du = dx/(x + 1)</code>、<code>v = x</code>：\n<code>= x ln(x + 1) - ∫ x/(x + 1) dx = x ln(x + 1) - ∫ (1 - 1/(x + 1)) dx = x ln(x + 1) - x + ln(x + 1) + C</code>。\n（答案是 <code>(x + 1)ln(x + 1) - x + C</code>，两种写法只差常数。）',
          pitfalls: [
            '把口诀当成不可违背的定理。例如 <code>∫ x<sup>3</sup>e<sup>x<sup>2</sup></sup> dx</code> 需要先换元 <code>t = x<sup>2</sup></code> 再分部，直接套"幂当 <code>u</code>"反而费劲。',
            '<code>∫ e<sup>x</sup>sin x dx</code> 这类循环型：两边都"打不死"，任选一个当 <code>u</code> 都可以，但<b>两次分部必须选同一类函数当 <code>u</code></b>，中途换边会导致循环式子互相抵消、回到原点。',
            '选了 <code>u</code> 之后忘记求 <code>du</code>，或者求 <code>v</code> 时把 <code>dv</code> 直接照抄。',
            '把"降次"误用到对数上：<code>ln x</code> 不能当 <code>dv</code>（因为 <code>∫ ln x dx</code> 本身就要用分部积分求），所以对数只能当 <code>u</code>。',
          ],
          tags: ['分部积分', 'u与dv选取', '反对幂指三', '技巧'],
          related: ['thm-integration-by-parts', 'thm-substitution-rule', 'def-basic-integral-table'],
        },
      ],
    },
    {
      id: 'ch4-4',
      no: '4.4',
      title: '有理函数的积分',
      summary:
        '有理函数的积分有一套必然成功的算法：把真分式拆成部分分式，逐项套公式。三角函数有理式和无理函数则先换元化归到有理函数，从而"一定能积出来"。',
      items: [
        {
          id: 'def-rational-function',
          kind: 'definition',
          name: '有理函数（真分式与假分式）',
          aka: ['有理分式', '真分式', '假分式'],
          statement:
            '两个多项式的商\n<code>R(x) = P(x)/Q(x)</code>（<code>Q(x)</code> 不恒为零）\n称为<b>有理函数</b>。当 <code>P</code> 的次数小于 <code>Q</code> 的次数时，称它为<b>真分式</b>；否则称为<b>假分式</b>。\n<b>关键事实</b>：任何假分式都可以用多项式除法写成一个多项式与一个真分式之和：\n<code>P(x)/Q(x) = S(x) + P<sub>1</sub>(x)/Q(x)</code>，\n其中 <code>S</code> 是多项式（商），<code>P<sub>1</sub></code> 的次数小于 <code>Q</code> 的次数（余式）。',
          plain:
            '有理函数就是"一个多项式除以另一个多项式"，和小学里的分数长得很像，只不过分子分母不是数，是整式。\n真分式、假分式的区分跟小学的"真分数 / 假分数"完全一样：分子的"规模"（次数）比分母小，就叫真分式；比分母大，就叫假分式。\n<b>为什么要分真假？</b>因为后面的部分分式分解只对真分式有标准套路。所以遇到假分式，第一件事是"先做除法，把整数部分拎出来"。\n这跟把 <code>7/4</code> 写成 <code>1 + 3/4</code> 一模一样：<code>1</code> 是整数部分（多项式），<code>3/4</code> 是真分数（真分式）。多项式部分直接积分就行，真分式部分才需要拆开。\n\n例如 <code>(x<sup>3</sup> + 1)/(x<sup>2</sup> + 1)</code> 是假分式，做除法得 <code>= x - x/(x<sup>2</sup> + 1) + ...</code> 这类"多项式 + 真分式"的形状，于是积分变成"<code>∫ x dx</code> 减去一个真分式的积分"。',
          why:
            '为什么一定要先把假分式化开？因为整个有理函数积分理论是<b>围绕真分式建立的</b>：部分分式分解定理只保证"真分式可以拆成简单的部分分式"。对假分式，定理的前提不满足，硬拆会得到一堆带多项式尾巴的怪东西。\n所以这一步不是"化简技巧"，而是<b>进入理论适用范围的门槛</b>。就像解分式方程先要去分母、算极限先要看未定式类型一样，它是流程的第一步而不是可选项。',
          proof:
            '本条目含一个需要论证的事实：多项式除法（带余除法）的可行性。\n\n<b>结论</b>：设 <code>P</code>、<code>Q</code> 是多项式，<code>Q</code> 不恒为零。则存在唯一的多项式 <code>S</code> 与 <code>P<sub>1</sub></code>，使得\n<code>P(x) = S(x)Q(x) + P<sub>1</sub>(x)</code>，且 <code>deg P<sub>1</sub> &lt; deg Q</code>（约定零多项式的次数为 <code>-∞</code>）。两边除以 <code>Q</code> 即得 <code>P/Q = S + P<sub>1</sub>/Q</code>。\n\n<b>存在性（用辗转相除的算法思想说明）</b>。记 <code>m = deg P</code>，<code>n = deg Q</code>。\n若 <code>m &lt; n</code>，取 <code>S = 0</code>、<code>P<sub>1</sub> = P</code> 即可，命题成立。\n若 <code>m ≥ n</code>：设 <code>P</code> 的首项为 <code>a x<sup>m</sup></code>，<code>Q</code> 的首项为 <code>b x<sup>n</sup></code>（<code>a, b ≠ 0</code>）。令 <code>c = a/b</code>，考察\n<code>P(x) - (c x<sup>m-n</sup>)·Q(x)</code>。\n这个差值中，最高次项 <code>a x<sup>m</sup></code> 与 <code>c x<sup>m-n</sup> · b x<sup>n</sup> = a x<sup>m</sup></code> 恰好相消，所以结果的次数严格小于 <code>m</code>。记这个新多项式为 <code>P<sup>(1)</sup></code>，于是\n<code>P(x) = (c x<sup>m-n</sup>)·Q(x) + P<sup>(1)</sup>(x)</code>，其中 <code>deg P<sup>(1)</sup> &lt; m</code>。\n对 <code>P<sup>(1)</sup></code> 重复同样的操作：只要它的次数仍不小于 <code>n</code>，就再消去一次最高次项。每一步都会让次数至少下降 1，而次数是非负整数，不可能无限下降，所以过程必然在有限步后停止。停止时得到的余式次数小于 <code>n</code>。把各步消去的项累加成 <code>S(x)</code>，最后剩下的就是 <code>P<sub>1</sub>(x)</code>，满足 <code>deg P<sub>1</sub> &lt; deg Q</code>。存在性得证。\n\n<b>唯一性</b>。若有两组解 <code>P = S<sub>1</sub>Q + P<sub>1</sub></code> 与 <code>P = S<sub>2</sub>Q + P<sub>2</sub></code>，相减得 <code>(S<sub>1</sub> - S<sub>2</sub>)Q = P<sub>2</sub> - P<sub>1</sub></code>。右边次数小于 <code>deg Q</code>；左边若非零多项式，其次数至少为 <code>deg Q</code>（因为 <code>Q</code> 非零）。矛盾，故 <code>S<sub>1</sub> - S<sub>2</sub> = 0</code>，进而 <code>P<sub>1</sub> = P<sub>2</sub></code>。<b>证毕。</b>',
          example:
            '把假分式 <code>(x<sup>3</sup> + 1)/(x<sup>2</sup> + 1)</code> 化为"多项式 + 真分式"。\n做长除法：<code>x<sup>3</sup> + 1</code> 除以 <code>x<sup>2</sup> + 1</code>。第一步商 <code>x</code>，因为 <code>x·(x<sup>2</sup> + 1) = x<sup>3</sup> + x</code>，相减余 <code>-x + 1</code>，其次数 1 小于 2，停止。\n于是 <code>(x<sup>3</sup> + 1)/(x<sup>2</sup> + 1) = x + (1 - x)/(x<sup>2</sup> + 1)</code>。\n积分就分成两块：<code>∫ x dx</code> 好算，<code>∫ (1 - x)/(x<sup>2</sup> + 1) dx = arctan x - (1/2)ln(x<sup>2</sup> + 1) + C</code> 也好算，合起来即可。',
          pitfalls: [
            '不检查真假就直接分解。真分式的前提不满足，分解出来必然错。',
            '做多项式除法时漏项。例如 <code>x<sup>3</sup> + 1</code> 要写成 <code>x<sup>3</sup> + 0x<sup>2</sup> + 0x + 1</code> 再除，漏掉缺项很容易算错。',
            '把"真分式"和"分子次数小于分母次数"记反，导致判断颠倒。',
            '误以为所有有理函数都能积成初等函数就万事大吉——虽然确实能，但分母的因式分解可能是难点（见下一条）。',
          ],
          tags: ['有理函数', '真分式', '假分式', '多项式除法'],
          related: ['def-partial-fractions', 'def-rational-steps', 'def-trig-rational-integral'],
        },
        {
          id: 'def-partial-fractions',
          kind: 'theorem',
          name: '真分式的部分分式分解',
          aka: ['部分分式', '拆项', '待定系数法'],
          statement:
            '设 <code>P(x)/Q(x)</code> 是真分式（<code>deg P &lt; deg Q</code>），把分母 <code>Q(x)</code> 在实数范围内分解为一次因式与二次不可约因式的乘积：\n<code>Q(x) = (x - a)<sup>k</sup> · ... · (x<sup>2</sup> + px + q)<sup>m</sup> · ...</code>\n（其中每个二次因式满足 <code>p<sup>2</sup> - 4q &lt; 0</code>，即不能再分解）。那么该真分式可以唯一地写成下列两类简单分式之和：\n<b>（1）对应一次因式 <code>(x - a)<sup>k</sup></code> 的项：</b>\n<code>A<sub>1</sub>/(x - a) + A<sub>2</sub>/(x - a)<sup>2</sup> + ... + A<sub>k</sub>/(x - a)<sup>k</sup></code>；\n<b>（2）对应二次不可约因式 <code>(x<sup>2</sup> + px + q)<sup>m</sup></code> 的项：</b>\n<code>(B<sub>1</sub>x + C<sub>1</sub>)/(x<sup>2</sup> + px + q) + (B<sub>2</sub>x + C<sub>2</sub>)/(x<sup>2</sup> + px + q)<sup>2</sup> + ... + (B<sub>m</sub>x + C<sub>m</sub>)/(x<sup>2</sup> + px + q)<sup>m</sup></code>。\n其中 <code>A<sub>i</sub></code>、<code>B<sub>j</sub></code>、<code>C<sub>j</sub></code> 都是待定常数。\n<b>注意两类项的分子形状不同</b>：一次因式对应的分子是常数；二次因式对应的分子必须是<b>一次式</b> <code>Bx + C</code>。',
          plain:
            '部分分式分解就是"把一个大分式拆成几个小分式之和"，和小学的\n<code>1/6 = 1/2 - 1/3</code> 是同一件事。\n为什么拆开就好算了？因为 <code>1/(x - a)</code> 的积分是 <code>ln|x - a|</code>，<code>1/(x - a)<sup>2</sup></code> 的积分是 <code>-1/(x - a)</code>，都是表上的东西。大分式看不出来，拆开之后每一项都认得出来——这就是全部动机。\n<b>怎么记住要写哪些项？</b>两个要点：\n第一，<b>因式的次数是几，就要写几项。</b>分母有 <code>(x - 1)<sup>3</sup></code>，就要写 <code>A/(x - 1) + B/(x - 1)<sup>2</sup> + C/(x - 1)<sup>3</sup></code> 三项，不能只写一项。可以这样理解：<code>(x - 1)<sup>3</sup></code> 里其实"藏着"1 次、2 次、3 次三种结构，都要给它们留位置。\n第二，<b>二次因式的分子要写成一次式。</b>这是最容易忘的规矩。原因可以这样记：分子次数必须比分母次数低一级——<code>1/(x - a)</code> 分母是一次，分子就是 0 次（常数）；<code>(Bx + C)/(x<sup>2</sup> + px + q)</code> 分母是二次，分子就是 1 次。',
          why:
            '<b>为什么有理函数一定能拆成这样、而且拆完一定能积出来？</b>三个层次的原因：\n第一层，<b>代数上一定能拆</b>：实数范围内任何多项式都能分解成一次因式和二次不可约因式的乘积（代数基本定理的推论），所以分母的形状总是上面那两种。而真分式在"分母是高次"的压力下，只能以这些简单分式的组合形式存在——这一条可以用待定系数法配合"两边乘 <code>Q(x)</code> 后比较系数"直接验证：未知量个数恰好等于方程个数，方程组有唯一解。\n第二层，<b>拆出来的每一项都能积</b>，因为只有四种基本型：\n<code>∫ A/(x - a) dx = A ln|x - a| + C</code>；\n<code>∫ A/(x - a)<sup>k</sup> dx = A(x - a)<sup>1-k</sup>/(1 - k) + C</code>（<code>k ≥ 2</code>）；\n<code>∫ (Bx + C)/(x<sup>2</sup> + px + q) dx</code>：拆成 <code>∫ B(2x + p)/(2(x<sup>2</sup> + px + q)) dx</code> 用对数，加上一个用 <code>arctan</code> 的项（配方后用反正切公式）；\n<code>∫ (Bx + C)/(x<sup>2</sup> + px + q)<sup>m</sup> dx</code>（<code>m ≥ 2</code>）：同样拆成对数项与一个递推的反正切型积分。\n第三层，<b>不存在"卡住"的情形</b>：分母的因式只有两种，两种都处理得了，所以有理函数的积分一定能在有限步内完成。这就是"有理函数必可积"的含义。\n[[tip:注意"必可积"指的是"结果能用初等函数表示"，没说过程短。分母次数很高时，待定系数的手工计算可能非常繁琐，这时用计算机代数系统更实际。]]',
          proof:
            '严格证明要用到多项式理论（部分分式分解定理的标准證法依赖辗转相除与线性方程组解的存在唯一性），这里给出完整可核验的<b>分解与求解流程论证</b>，并证明"拆完必可积"。\n\n<b>第一步：为什么可以只考虑真分式。</b>由带余除法（见"有理函数"一条的证明），任何有理函数都能写成多项式加真分式。多项式直接逐项积分，故只需处理真分式。\n\n<b>第二步：为什么分解式里恰好是那些项（以最简单情形说明）。</b>设 <code>Q(x) = (x - a)(x - b)</code>，<code>a ≠ b</code>，<code>P</code> 的次数小于 2。设分解式为\n<code>P(x)/[(x - a)(x - b)] = A/(x - a) + B/(x - b)</code>。\n两边乘以 <code>(x - a)(x - b)</code>，得\n<code>P(x) = A(x - b) + B(x - a)</code>。\n这是关于 <code>A</code>、<code>B</code> 的两个方程（比较 <code>x<sup>1</sup></code> 与 <code>x<sup>0</sup></code> 的系数）。其系数行列式为 <code>b - a ≠ 0</code>，故方程组有唯一解。\n更快的求法（<b>赋值法 / 掩盖法</b>）：在上面那个恒等式里令 <code>x = a</code>，得 <code>P(a) = A(a - b)</code>，即 <code>A = P(a)/(a - b)</code>；令 <code>x = b</code>，得 <code>B = P(b)/(b - a)</code>。这就是为什么可以"把某个因式遮住、代入它的根"直接读出系数。\n\n<b>第三步：重复因式为什么每一层都要写。</b>设 <code>Q(x) = (x - a)<sup>2</sup></code>，<code>deg P &lt; 2</code>。设\n<code>P(x)/(x - a)<sup>2</sup> = A/(x - a) + B/(x - a)<sup>2</sup></code>。\n两边乘 <code>(x - a)<sup>2</sup></code>：<code>P(x) = A(x - a) + B</code>。右边确实能表示任何次数小于 2 的多项式（它们构成 2 维空间，<code>{1, x - a}</code> 是一组基），所以一定能取到合适的 <code>A</code>、<code>B</code>。若只写 <code>B/(x - a)<sup>2</sup></code> 一项，则 <code>P(x) = B</code> 只能是常数，无法表示像 <code>x</code> 这样的分子，所以必须补上低次那一项。<b>这就是"次数是几就写几项"的原因。</b>\n\n<b>第四步：二次不可约因式的分子为什么是一次式。</b>设 <code>Q(x) = x<sup>2</sup> + px + q</code>，<code>p<sup>2</sup> - 4q &lt; 0</code>，<code>deg P &lt; 2</code>。此时直接取\n<code>P(x)/(x<sup>2</sup> + px + q) = (Bx + C)/(x<sup>2</sup> + px + q)</code>，\n即分子取 <code>P</code> 本身（它次数小于 2，正好是一次式或常数），分解式成立。这说明二次因式对应的分子一般必须允许含 <code>x</code>。若强行写成常数 <code>C/(x<sup>2</sup> + px + q)</code>，就无法表示如 <code>x/(x<sup>2</sup> + 1)</code> 这样的分式。<b>这就是"二次因式配一次分子"的原因。</b>\n\n<b>第五步：拆出来的项确实都能积出来。</b>\n<b>（a）</b><code>∫ A/(x - a) dx = A ln|x - a| + C</code>，由基本积分表。\n<b>（b）</b>当 <code>k ≥ 2</code>，<code>∫ A(x - a)<sup>-k</sup> dx = A(x - a)<sup>1-k</sup>/(1 - k) + C</code>，由幂函数公式（此时指数 <code>-k ≠ -1</code>，公式适用）。\n<b>（c）</b>处理 <code>(Bx + C)/(x<sup>2</sup> + px + q)</code>。先把分母配方：<code>x<sup>2</sup> + px + q = (x + p/2)<sup>2</sup> + (q - p<sup>2</sup>/4)</code>。记 <code>a<sup>2</sup> = q - p<sup>2</sup>/4 &gt; 0</code>（这正是 <code>p<sup>2</sup> - 4q &lt; 0</code> 的含义：配方后是"平方加正常数"）。再把分子配成"分母的导数的倍数 + 常数"：\n<code>Bx + C = (B/2)(2x + p) + (C - Bp/2)</code>。\n于是积分分成两块：\n第一块 <code>(B/2)∫ (2x + p)/(x<sup>2</sup> + px + q) dx = (B/2)ln(x<sup>2</sup> + px + q) + C</code>（因为分子恰是分母的导数，套 <code>∫ du/u</code>）；\n第二块 <code>(C - Bp/2)∫ dx/[(x + p/2)<sup>2</sup> + a<sup>2</sup>] = ((C - Bp/2)/a)·arctan((x + p/2)/a) + C</code>（套反正切公式，其中 <code>a = √(q - p<sup>2</sup>/4)</code>）。\n习惯上把两块合并记作\n<code>∫ (Bx + C)/(x<sup>2</sup> + px + q) dx = (B/2)ln(x<sup>2</sup> + px + q) + ((2C - Bp)/√(4q - p<sup>2</sup>))·arctan((2x + p)/√(4q - p<sup>2</sup>)) + C</code>。\n<b>（d）</b>高次幂 <code>(x<sup>2</sup> + px + q)<sup>m</sup></code>（<code>m ≥ 2</code>）的情形：同样拆成"分子是分母导数的倍数"的一块（可直接积成对数或幂函数）加上一块纯反正切型，后者用分部积分建立递推公式，逐次把 <code>m</code> 降到 1。故有限步内也能算完。\n\n综上：真分式必可分解为上述简单分式之和，而每个简单分式的积分都能用基本积分表与换元法完成，所以<b>有理函数的积分一定可以积出来</b>。<b>证毕。</b>',
          example:
            '<b>例 1（单重一次因式）</b>：<code>∫ dx/(x<sup>2</sup> - a<sup>2</sup>)</code>（<code>a &gt; 0</code>）。\n分母 <code>x<sup>2</sup> - a<sup>2</sup> = (x - a)(x + a)</code>。设 <code>1/[(x - a)(x + a)] = A/(x - a) + B/(x + a)</code>。\n用掩盖法：<code>A = 1/(a + a) = 1/(2a)</code>，<code>B = 1/(-a - a) = -1/(2a)</code>。于是\n<code>∫ dx/(x<sup>2</sup> - a<sup>2</sup>) = (1/(2a))ln|x - a| - (1/(2a))ln|x + a| + C = (1/(2a))·ln|(x - a)/(x + a)| + C</code>。\n\n<b>例 2（重复一次因式）</b>：<code>∫ (x + 2)/(x + 1)<sup>2</sup> dx</code>。\n设 <code>(x + 2)/(x + 1)<sup>2</sup> = A/(x + 1) + B/(x + 1)<sup>2</sup></code>，两边乘 <code>(x + 1)<sup>2</sup></code>：<code>x + 2 = A(x + 1) + B</code>。\n比较系数：<code>A = 1</code>；令 <code>x = -1</code> 得 <code>B = 1</code>。于是\n<code>∫ (x + 2)/(x + 1)<sup>2</sup> dx = ∫ [1/(x + 1) + 1/(x + 1)<sup>2</sup>] dx = ln|x + 1| - 1/(x + 1) + C</code>。\n\n<b>例 3（二次不可约因式）</b>：<code>∫ (x + 1)/(x<sup>2</sup> + 1) dx</code>。\n设 <code>(x + 1)/(x<sup>2</sup> + 1) = (Bx + C)/(x<sup>2</sup> + 1)</code>，得 <code>B = 1</code>、<code>C = 1</code>。于是\n<code>∫ (x + 1)/(x<sup>2</sup> + 1) dx = ∫ x/(x<sup>2</sup> + 1) dx + ∫ dx/(x<sup>2</sup> + 1) = (1/2)ln(x<sup>2</sup> + 1) + arctan x + C</code>。\n第一块用凑微分（分子是分母导数的一半），第二块用反正切公式。\n\n<b>例 4（综合：既有一次因式又有二次因式）</b>：\n<code>∫ (2x + 3)/[(x - 1)(x<sup>2</sup> + 1)] dx</code>。\n设 <code>= A/(x - 1) + (Bx + C)/(x<sup>2</sup> + 1)</code>，两边乘分母：<code>2x + 3 = A(x<sup>2</sup> + 1) + (Bx + C)(x - 1)</code>，即 <code>2x + 3 = (A + B)x<sup>2</sup> + (C - B)x + (A - C)</code>。\n比较系数：<code>A + B = 0</code>，<code>C - B = 2</code>，<code>A - C = 3</code>。解得 <code>A = 5/2</code>、<code>B = -5/2</code>、<code>C = -1/2</code>。于是\n<code>= (5/2)∫ dx/(x - 1) - (1/2)∫ (5x + 1)/(x<sup>2</sup> + 1) dx</code>\n<code>= (5/2)ln|x - 1| - (5/4)ln(x<sup>2</sup> + 1) - (1/2)arctan x + C</code>。',
          pitfalls: [
            '<b>重复因式只写一项</b>。分母是 <code>(x - 1)<sup>2</sup></code> 却只设 <code>A/(x - 1)<sup>2</sup></code>，必然解不出来或解错。',
            '<b>二次因式的分子写成常数</b>。<code>(x<sup>2</sup> + 1)</code> 对应的分子必须设成 <code>Bx + C</code>；只写 <code>C</code> 会漏掉解。',
            '分解前忘了判断真假分式，对假分式直接套部分分式公式。',
            '分母没有分解彻底。二次因式必须先验证判别式为负才能当作不可约因式；<code>x<sup>2</sup> - 1</code> 不能再当二次因式，它要拆成 <code>(x - 1)(x + 1)</code>。',
            '用赋值法求系数时，代入了不是因式根的数，或者两边乘分母后化简出错，导致方程组不一致。',
            '算出系数后忘了乘回原式就积分，或者漏掉某些项。',
          ],
          tags: ['部分分式', '待定系数', '有理函数', '定理'],
          related: ['def-rational-function', 'def-rational-steps', 'def-trig-rational-integral', 'def-reciprocal-substitution'],
        },
        {
          id: 'def-rational-steps',
          kind: 'note',
          name: '有理函数积分的一般步骤',
          aka: ['有理函数积分流程', '解题步骤'],
          statement:
            '计算 <code>∫ P(x)/Q(x) dx</code> 的标准流程：\n<b>第 1 步：判真假。</b>若 <code>deg P ≥ deg Q</code>（假分式），先做多项式除法，写成 <code>S(x) + P<sub>1</sub>(x)/Q(x)</code>；若已是真分式，直接进入第 2 步。\n<b>第 2 步：分解分母。</b>把 <code>Q(x)</code> 在实数范围内分解为一次因式 <code>(x - a)<sup>k</sup></code> 与二次不可约因式 <code>(x<sup>2</sup> + px + q)<sup>m</sup></code> 的乘积。\n<b>第 3 步：写分解式。</b>按上一节的规则设出全部待定系数：一次因式对应 <code>A<sub>1</sub>/(x - a) + ... + A<sub>k</sub>/(x - a)<sup>k</sup></code>；二次因式对应 <code>(B<sub>1</sub>x + C<sub>1</sub>)/(x<sup>2</sup> + px + q) + ... + (B<sub>m</sub>x + C<sub>m</sub>)/(x<sup>2</sup> + px + q)<sup>m</sup></code>。\n<b>第 4 步：定系数。</b>两边乘 <code>Q(x)</code>，用<b>比较同类项系数</b>或<b>赋值法</b>（代入各因式的根）解出全部常数。\n<b>第 5 步：逐项积分。</b>对形如 <code>A/(x - a)<sup>k</sup></code> 的项用对数公式或幂函数公式；对 <code>(Bx + C)/(x<sup>2</sup> + px + q)</code> 的项，把分子配成"分母导数倍 + 常数"，分别套对数公式与反正切公式。',
          plain:
            '这五步就是一套"照做就行"的流水线。别怕它步骤多，它的好处恰恰在于：<b>没有需要灵感的地方</b>。\n- 假分式？做除法。\n- 分母不会分解？先求根（一次因式找根，二次的用判别式判断能否再分）。\n- 不会猜系数？两边乘分母，比较系数，解方程组。\n- 拆出来的项不会积？只有四种基本型，表上都有。\n每一步都是机械操作，就像做菜时按菜谱走：先切、再腌、然后下锅。真正花时间的往往只是第 4 步的解方程组，那是体力活，不是智力活。\n[[tip:遇到分母次数很高、或者因式很复杂的题目，与其耗在待定系数上，不如换思路：看看能不能先用换元法化简（比如倒代换、根式代换），再回到这条流水线。]]',
          why:
            '为什么要强调"照这个顺序"？因为顺序错了会做无用功甚至做错：\n不提真假分式就先分解，会得到分母次数不够高的分解式，方程组无解；\n不先分解分母就设系数，根本不知道该设几项；\n设完系数不两边乘分母而直接比较，容易漏项；\n积到一半才想起二次因式要配方，符号容易乱。\n<b>这条流程的价值是"把创造性劳动降到零"。</b>而它能成立的根本原因，就是上一条定理：真分式必可分解为简单分式，而简单分式的积分都能算。',
          proof:
            '本条目是流程性说明，其每一步的合法性依据如下（均引用前面已证结论）：\n\n<b>第 1 步的合法性</b>来自带余除法（见"有理函数"一条的证明）：假分式 <code>P/Q</code> 必可唯一写成 <code>S + P<sub>1</sub>/Q</code>，其中 <code>deg P<sub>1</sub> &lt; deg Q</code>。积分由线性性质拆成 <code>∫ S dx + ∫ P<sub>1</sub>/Q dx</code>，第一项直接逐项积多项式。\n\n<b>第 2 步的合法性</b>来自实系数多项式的因式分解定理：实数范围内，任何次数大于等于 1 的多项式都可分解为一次因式与二次不可约因式（判别式为负）的乘积。这一步就是反复提取已知根、再用二次判别式判断剩余部分。\n\n<b>第 3 步的合法性</b>来自部分分式分解定理（上一条已证）：对每个一次因式 <code>(x - a)<sup>k</sup></code> 写 <code>k</code> 项、每个二次不可约因式 <code>(x<sup>2</sup> + px + q)<sup>m</sup></code> 写 <code>m</code> 项，且二次因式的分子取一次式，即得成立且唯一的分解。<b>唯一性</b>由该定理的方程组系数行列式非零保证，所以只要算出一个解，它就是答案，不必担心"还有别的分解"。\n\n<b>第 4 步的合法性</b>：两边乘 <code>Q(x)</code> 后得到一个关于待定系数的线性方程组。由第 3 步的唯一性，该方程组有唯一解。两种解法（比较系数、赋值法）都只是解同一方程组的技巧，两者混用也完全合法——赋值法更快的场合就用它，剩下的系数用比较系数补齐。\n\n<b>第 5 步的合法性</b>见上一条证明的第五步：四种基本型的积分都可由基本积分表与凑微分完成。<b>故整个流程在有限步内一定给出正确结果。</b>',
          example:
            '<b>完整走一遍流程</b>：求 <code>∫ (x<sup>2</sup> + 2x + 3)/(x<sup>2</sup> + x) dx</code>。\n<b>第 1 步</b>：分子分母同为 2 次，是假分式。做除法：<code>(x<sup>2</sup> + 2x + 3) ÷ (x<sup>2</sup> + x)</code> 商 <code>1</code>，余 <code>x + 3</code>，故\n<code>(x<sup>2</sup> + 2x + 3)/(x<sup>2</sup> + x) = 1 + (x + 3)/(x<sup>2</sup> + x)</code>。\n<b>第 2 步</b>：<code>x<sup>2</sup> + x = x(x + 1)</code>。\n<b>第 3 步</b>：设 <code>(x + 3)/[x(x + 1)] = A/x + B/(x + 1)</code>。\n<b>第 4 步</b>：两边乘 <code>x(x + 1)</code> 得 <code>x + 3 = A(x + 1) + Bx</code>。令 <code>x = 0</code> 得 <code>A = 3</code>；令 <code>x = -1</code> 得 <code>2 = -B</code>，即 <code>B = -2</code>。\n<b>第 5 步</b>：\n<code>∫ [1 + 3/x - 2/(x + 1)] dx = x + 3ln|x| - 2ln|x + 1| + C</code>。\n验收：对 <code>x + 3ln|x| - 2ln|x + 1|</code> 求导得 <code>1 + 3/x - 2/(x + 1)</code>，通分后为 <code>1 + (3x + 3 - 2x)/(x(x + 1)) = 1 + (x + 3)/(x(x + 1))</code>，正是原被积函数。',
          pitfalls: [
            '第 1 步被跳过——这是最常见的错误，尤其当分子分母次数相等时（此时商是常数，很多人看不见）。',
            '第 2 步分解不彻底，例如把 <code>x<sup>3</sup> - x</code> 写成 <code>x(x<sup>2</sup> - 1)</code> 就收工，忘了 <code>x<sup>2</sup> - 1 = (x - 1)(x + 1)</code>。',
            '第 4 步解方程组时抄错系数，尤其在有二次因式的时候，展开 <code>(Bx + C)(x - 1)</code> 时漏项。',
            '第 5 步积分 <code>∫ A/(x - a)<sup>k</sup> dx</code>（<code>k ≥ 2</code>）时又套对数公式，忘了此时应该用幂函数公式。',
            '最后忘了合并 <code>+ C</code>，或者把对数里的绝对值丢掉。',
          ],
          tags: ['有理函数', '积分步骤', '流程', '说明'],
          related: ['def-partial-fractions', 'def-rational-function', 'def-trig-rational-integral', 'def-irrational-integral'],
        },
        {
          id: 'def-trig-rational-integral',
          kind: 'note',
          name: '三角函数有理式的积分（万能代换）',
          aka: ['万能代换', 't=tan(x/2)', '三角有理式'],
          statement:
            '由 <code>sin x</code>、<code>cos x</code> 与常数经过有限次加、减、乘、除得到的式子，称为<b>三角函数有理式</b>，记作 <code>R(sin x, cos x)</code>。\n<b>万能代换</b>：令\n<code>t = tan(x/2)</code>（<code>x ≠ (2k + 1)π</code>），\n则\n<code>sin x = 2t/(1 + t<sup>2</sup>)</code>，<code>cos x = (1 - t<sup>2</sup>)/(1 + t<sup>2</sup>)</code>，<code>dx = 2dt/(1 + t<sup>2</sup>)</code>。\n代入后，<code>∫ R(sin x, cos x) dx</code> 化为 <code>t</code> 的<b>有理函数</b>的积分，从而可以用部分分式法算出。\n<b>优先使用的简化代换</b>（能省大量计算）：\n<b>（1）</b>若 <code>R(-sin x, cos x) = -R(sin x, cos x)</code>（关于 <code>sin x</code> 为奇函数），令 <code>u = cos x</code>；\n<b>（2）</b>若 <code>R(sin x, -cos x) = -R(sin x, cos x)</code>（关于 <code>cos x</code> 为奇函数），令 <code>u = sin x</code>；\n<b>（3）</b>若 <code>R(-sin x, -cos x) = R(sin x, cos x)</code>（同时变号不变），令 <code>u = tan x</code>。\n只有在以上都不适用时，才动用万能代换。',
          plain:
            '万能代换的精髓在名字里：<b>它什么都能换</b>。不管 <code>sin x</code>、<code>cos x</code> 怎么组合，只要令 <code>t = tan(x/2)</code>，一律变成 <code>t</code> 的有理函数，而"有理函数一定能积"是我们已经证明过的。所以这是三角有理式积分的<b>保底方案</b>——最坏情况下也做得出来。\n它的原理不难理解：<code>tan(x/2)</code> 这个量非常特殊，<code>sin x</code>、<code>cos x</code> 都能只用它一个字母表示出来（这来自半角公式），所以只要设了它，两个三角函数就合并成了一个 <code>t</code>。\n<b>但"万能"不等于"好用"。</b>代换之后分母常常出现 <code>(1 + t<sup>2</sup>)</code> 的高次幂，待定系数解到手酸。所以实战里先检查三种简化情形（<code>u = cos x</code>、<code>u = sin x</code>、<code>u = tan x</code>），能用就用，实在不行再上万能代换。',
          why:
            '<b>为什么必须有一个"万能"的办法？</b>因为前面学的换元、分部都不是"通用算法"——它们靠观察。数学上不能接受"有些题目看运气"，所以要给三角有理式配一个必然成功的算法，这就是万能代换的地位：它保证了三角有理式的积分一定可算。\n<b>那三个简化代换凭什么能简化？</b>它们的思路是"用奇偶性把多余的那个三角函数带走"。以情形（1）为例：若式子关于 <code>sin x</code> 是奇函数，那么把 <code>sin x</code> 提取出来一个因子之后，剩下的部分只含 <code>sin<sup>2</sup>x</code>（偶次幂）。而 <code>sin<sup>2</sup>x = 1 - cos<sup>2</sup>x</code>，全部可以换成 <code>cos x</code>；同时提取出来的那个 <code>sin x dx</code> 恰好等于 <code>-d(cos x)</code>。于是整个积分变成 <code>cos x</code> 的有理函数，令 <code>u = cos x</code> 就彻底变成有理函数积分了。<b>没有奇偶性配合，就提取不出那个 <code>sin x dx</code>，所以要用万能代换兜底。</b>',
          proof:
            '<b>（一）万能代换三个公式的推导。</b>令 <code>t = tan(x/2)</code>。\n由半角公式的变形，<code>sin x = 2 sin(x/2)cos(x/2)</code>。把它写成"除以 1"的形式，并用 <code>1 = sin<sup>2</sup>(x/2) + cos<sup>2</sup>(x/2)</code>：\n<code>sin x = 2 sin(x/2)cos(x/2) / [sin<sup>2</sup>(x/2) + cos<sup>2</sup>(x/2)]</code>。\n分子分母同除以 <code>cos<sup>2</sup>(x/2)</code>，得\n<code>sin x = 2t/(1 + t<sup>2</sup>)</code>。\n同理，<code>cos x = cos<sup>2</sup>(x/2) - sin<sup>2</sup>(x/2)</code>，除以同一个分母 <code>sin<sup>2</sup>(x/2) + cos<sup>2</sup>(x/2)</code> 并同除 <code>cos<sup>2</sup>(x/2)</code>：\n<code>cos x = (1 - t<sup>2</sup>)/(1 + t<sup>2</sup>)</code>。\n最后求微分：<code>dt = (1/2)sec<sup>2</sup>(x/2) dx</code>，而 <code>sec<sup>2</sup>(x/2) = 1 + tan<sup>2</sup>(x/2) = 1 + t<sup>2</sup></code>，故\n<code>dt = (1 + t<sup>2</sup>)/2 · dx</code>，即 <code>dx = 2dt/(1 + t<sup>2</sup>)</code>。\n\n<b>（二）为什么代换后一定得到有理函数。</b>设原被积函数为 <code>R(sin x, cos x)</code>，其中 <code>R</code> 表示只涉及加减乘除的运算。把上面三式代入：<code>sin x</code>、<code>cos x</code> 各变成 <code>t</code> 的两个多项式之商，<code>dx</code> 也是 <code>t</code> 的两个多项式之商。有理式经过加减乘除仍然是有理式（这正是"有理函数"这个名字的含义：对四则运算封闭），所以整体成为 <code>t</code> 的有理函数。再引用"有理函数积分的一般步骤"，该积分必可算出，最后把 <code>t = tan(x/2)</code> 回代即可。\n<b>条件核验</b>：代换要求 <code>cos(x/2) ≠ 0</code>，即 <code>x ≠ (2k + 1)π</code>；在这些点附近 <code>t</code> 趋于无穷，但只要积分区间不含这些点，代换就合法（第二类换元要求单调可导、导数非零，<code>t = tan(x/2)</code> 在每个这样的区间上满足）。\n\n<b>（三）三个简化代换的推导。</b>以情形（1）为例。设 <code>R(-sin x, cos x) = -R(sin x, cos x)</code>。把 <code>R</code> 看成 <code>sin x</code> 的多项式（系数是 <code>cos x</code> 的有理式），则"关于 <code>sin x</code> 为奇函数"意味着 <code>sin x</code> 只以奇次幂出现。于是可以提出一个 <code>sin x</code> 因子：\n<code>R(sin x, cos x) = sin x · S(sin<sup>2</sup>x, cos x)</code>，\n其中 <code>S</code> 只含 <code>sin<sup>2</sup>x</code> 与 <code>cos x</code>。用 <code>sin<sup>2</sup>x = 1 - cos<sup>2</sup>x</code> 把 <code>S</code> 全部换成 <code>cos x</code>，记 <code>S = T(cos x)</code>。再注意\n<code>sin x dx = -d(cos x)</code>。\n于是\n<code>∫ R(sin x, cos x) dx = ∫ T(cos x)·sin x dx = -∫ T(u) du</code>（<code>u = cos x</code>），\n成为 <code>u</code> 的有理函数积分。<b>情形（2）、（3）同理</b>：情形（2）提出 <code>cos x</code> 并用 <code>cos x dx = d(sin x)</code>；情形（3）的式子只含偶次幂，可用 <code>1/cos<sup>2</sup>x = 1 + tan<sup>2</sup>x</code> 与 <code>dx/cos<sup>2</sup>x = d(tan x)</code> 化为 <code>u = tan x</code> 的有理函数。<b>推导完毕。</b>',
          example:
            '<b>例 1（该用简化代换）</b>：<code>∫ sin<sup>3</sup>x dx</code>。\n这里 <code>R = sin<sup>3</sup>x</code> 关于 <code>sin x</code> 为奇函数，属于情形（1），令 <code>u = cos x</code>：\n<code>∫ sin<sup>3</sup>x dx = ∫ (1 - cos<sup>2</sup>x) sin x dx = -∫ (1 - u<sup>2</sup>) du = -u + u<sup>3</sup>/3 + C = -cos x + cos<sup>3</sup>x/3 + C</code>。\n用万能代换也能算，但计算量大得多。\n\n<b>例 2（情形（2））</b>：<code>∫ cos<sup>3</sup>x dx</code>。关于 <code>cos x</code> 为奇函数，令 <code>u = sin x</code>：\n<code>= ∫ (1 - sin<sup>2</sup>x)cos x dx = ∫ (1 - u<sup>2</sup>) du = sin x - sin<sup>3</sup>x/3 + C</code>。\n\n<b>例 3（情形（3））</b>：<code>∫ dx/(1 + tan<sup>2</sup>x)</code> 的变体，看 <code>∫ dx/cos<sup>2</sup>x·(1 + tan x)</code> 即 <code>∫ sec<sup>2</sup>x/(1 + tan x) dx</code>：\n令 <code>u = tan x</code>，<code>du = sec<sup>2</sup>x dx</code>，原式 <code>= ∫ du/(1 + u) = ln|1 + u| + C = ln|1 + tan x| + C</code>。\n\n<b>例 4（必须上万能代换）</b>：<code>∫ dx/(2 + cos x)</code>。\n这个式子对 <code>sin x</code>、<code>cos x</code> 单独变号都不改变形状，三种简化代换都不适用，用万能代换。令 <code>t = tan(x/2)</code>：\n<code>= ∫ [2dt/(1 + t<sup>2</sup>)] / (2 + (1 - t<sup>2</sup>)/(1 + t<sup>2</sup>)) = ∫ 2dt/[2(1 + t<sup>2</sup>) + 1 - t<sup>2</sup>] = ∫ 2dt/(t<sup>2</sup> + 3)</code>。\n套公式 <code>∫ dx/(x<sup>2</sup> + a<sup>2</sup>) = (1/a)arctan(x/a) + C</code>（<code>a = √3</code>）：\n<code>= (2/√3)arctan(t/√3) + C = (2/√3)arctan(tan(x/2)/√3) + C</code>。',
          pitfalls: [
            '<b>一上来就用万能代换</b>，明明 <code>∫ sin<sup>3</sup>x dx</code> 三步就能做完，却去解一堆待定系数。',
            '万能代换的三个公式记错符号：<code>cos x</code> 的分子是 <code>1 - t<sup>2</sup></code>，不是 <code>t<sup>2</sup> - 1</code>；<code>sin x</code> 的分子是 <code>2t</code>。',
            '忘记 <code>dx = 2dt/(1 + t<sup>2</sup>)</code> 里的 <code>2</code>。',
            '代换后忘了回代 <code>t = tan(x/2)</code>，答案里留 <code>t</code>。',
            '忽略代换的适用区间。在 <code>x = π</code> 处 <code>tan(x/2)</code> 无定义，若积分区间包含它，需要单独讨论。',
            '判断奇偶性时看错对象：要判断的是"把 <code>sin x</code> 整体换成 <code>-sin x</code> 后整个式子是否变号"，而不是"<code>sin x</code> 本身是否奇函数"。',
          ],
          tags: ['三角有理式', '万能代换', '换元积分法', '技巧'],
          related: ['def-partial-fractions', 'def-rational-steps', 'thm-substitution-rule', 'def-irrational-integral'],
        },
        {
          id: 'def-irrational-integral',
          kind: 'note',
          name: '简单无理函数的积分方法',
          aka: ['无理函数积分', '根式有理化', '根号代换'],
          statement:
            '处理含根式的积分，核心目标是<b>把无理式化为有理式</b>，常用三种手段：\n<b>（1）根式代换（<code>n</code> 次根）</b>：若被积函数含 <code>ⁿ√(ax + b)</code>，令 <code>t = ⁿ√(ax + b)</code>（<code>a ≠ 0</code>，<code>t</code> 取使代换单调的符号），则 <code>x = (t<sup>n</sup> - b)/a</code>，<code>dx = (n/a)t<sup>n-1</sup> dt</code>。若含 <code>x</code> 的多个不同次根，取各根指数的<b>最小公倍数</b> <code>N</code>，令 <code>t = x<sup>1/N</sup></code>。\n<b>（2）三角代换</b>：若含 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>、<code>√(a<sup>2</sup> + x<sup>2</sup>)</code>、<code>√(x<sup>2</sup> - a<sup>2</sup>)</code>，按三角代换处理（见"三角代换"一条）。\n<b>（3）根式有理化 / 配完全平方</b>：把根号内的二次式配方，凑成上述三种标准型之一，再作三角代换。例如\n<code>∫ dx/√(x<sup>2</sup> + 2x + 5) = ∫ dx/√((x + 1)<sup>2</sup> + 4)</code>，令 <code>u = x + 1</code>、<code>a = 2</code>，套公式得 <code>ln(u + √(u<sup>2</sup> + 4)) + C</code>。\n<b>补充说明</b>：含 <code>√(ax<sup>2</sup> + bx + c)</code> 的积分若配方后属于 <code>√(a<sup>2</sup> - x<sup>2</sup>)</code>、<code>√(x<sup>2</sup> ± a<sup>2</sup>)</code> 型，一定可以积成初等函数；一般的高次无理式没有通用办法。',
          plain:
            '无理函数积分的思路只有一句话：<b>根号是唯一的问题，把它干掉。</b>\n怎么干掉？三条路：\n<b>路一：把整个根号起个名字。</b><code>√(2x + 1)</code> 讨厌，就令 <code>t = √(2x + 1)</code>，反解出 <code>x = (t<sup>2</sup> - 1)/2</code>。这样根号是最"廉价"的类型——它在根号里只有一次式，反解毫无难度。\n<b>路二：用三角恒等式消掉根号。</b>当根号里是"平方 ± 常数"或"常数 - 平方"时，三角代换是唯一顺手的办法。\n<b>路三：先"整容"再用路二。</b>根号里是 <code>x<sup>2</sup> + 2x + 5</code> 这种"不标准"的二次式，先用配方法把它变成 <code>(x + 1)<sup>2</sup> + 4</code>，也就是标准的"平方加常数"，再上路二。\n<b>怎么选？</b>看根号里的东西：<b>一次式（<code>ax + b</code>）走"路一"；二次式（<code>ax<sup>2</sup> + bx + c</code>）先配方法整形，再走"路二"。</b>这就是全部判断标准。',
          why:
            '<b>为什么"化成有理式"就等于"做完了"？</b>因为有理函数的积分有已证明的通用算法（部分分式 + 基本积分表），一定能算完。所以无理函数积分的全部难点，就压缩成了一句：能不能化成有理式。\n<b>为什么这些代换一定能化成有理式？</b>看"路一"：<code>t = ⁿ√(ax + b)</code> 反解出 <code>x</code> 是 <code>t</code> 的多项式，<code>dx</code> 是 <code>t</code> 的多项式乘 <code>dt</code>，而原来的根号就是 <code>t</code> 本身。于是所有出现的量都是 <code>t</code> 的多项式或有理式，结果必然是有理函数。\n看"路二"：三角代换把根号换成 <code>a cos t</code> 或 <code>a sec t</code> 或 <code>a tan t</code>，三角函数之间又满足有理关系（万能代换可以把它们全变成有理式），所以最终也归到有理函数。\n<b>所以这三条路的共同本质是：找一个能把根号表示成"某个新变量的有理函数"的代换。</b>只要找到了，问题就归约到已解决的领域。',
          proof:
            '本条目是方法清单，其合法性全部来自第二类换元积分法，逐条核验条件如下。\n\n<b>（1）根式代换的条件核验。</b>设 <code>t = ⁿ√(ax + b)</code>，等价于 <code>x = ψ(t) = (t<sup>n</sup> - b)/a</code>。限定 <code>t &gt; 0</code>（<code>n</code> 为偶数时这是必须的，因为偶次根取非负；<code>n</code> 为奇数时可选 <code>t ∈ (-∞, +∞)</code>）。在此范围内 <code>ψ′(t) = n t<sup>n-1</sup>/a</code>，除 <code>t = 0</code>、<code>n &gt; 1</code> 这一点外恒不为零；在避开该点的区间上 <code>ψ</code> 严格单调，反函数 <code>t = ⁿ√(ax + b)</code> 存在。第二类换元的三个条件满足。<code>x</code> 与 <code>ⁿ√(ax + b)</code> 的有理式代入后成为 <code>t</code> 的有理式（因为 <code>x</code> 是 <code>t</code> 的多项式，根号就是 <code>t</code>），于是化为有理函数积分。\n\n<b>多个不同次根的情形。</b>设出现的根指数为 <code>n<sub>1</sub>, ..., n<sub>r</sub></code>，取 <code>N</code> 为它们的最小公倍数，令 <code>t = x<sup>1/N</sup></code>（<code>x &gt; 0</code>，保证单调可导）。则每个 <code>x<sup>1/n<sub>i</sub></sup> = t<sup>N/n<sub>i</sub></sup></code> 都是 <code>t</code> 的正整数次幂（因为 <code>n<sub>i</sub></code> 整除 <code>N</code>），所有根号同时消失，问题化为 <code>t</code> 的有理函数积分。<b>这就是"取最小公倍数"的根据。</b>\n\n<b>（2）三角代换</b>的合法性与公式见"三角代换"一条的证明，此处不重复。\n\n<b>（3）配方法的恒等变形合法性。</b>对 <code>ax<sup>2</sup> + bx + c</code>（<code>a &gt; 0</code>），有恒等式\n<code>ax<sup>2</sup> + bx + c = a[(x + b/(2a))<sup>2</sup> + (4ac - b<sup>2</sup>)/(4a<sup>2</sup>)]</code>，\n验证方法：把右边展开，<code>a(x<sup>2</sup> + bx/a + b<sup>2</sup>/(4a<sup>2</sup>)) + a(4ac - b<sup>2</sup>)/(4a<sup>2</sup>) = ax<sup>2</sup> + bx + b<sup>2</sup>/(4a) + c - b<sup>2</sup>/(4a) = ax<sup>2</sup> + bx + c</code>，恒等成立。\n于是令 <code>u = x + b/(2a)</code>、<code>k<sup>2</sup> = (4ac - b<sup>2</sup>)/(4a<sup>2</sup>)</code>：若 <code>4ac - b<sup>2</sup> &gt; 0</code>，根式为 <code>√a·√(u<sup>2</sup> + k<sup>2</sup>)</code>，属 <code>√(x<sup>2</sup> + a<sup>2</sup>)</code> 型；若 <code>4ac - b<sup>2</sup> &lt; 0</code>，根式为 <code>√a·√(u<sup>2</sup> - k<sup>2</sup>)</code>，属 <code>√(x<sup>2</sup> - a<sup>2</sup>)</code> 型（<code>a &lt; 0</code> 时提取负号后类似可得 <code>√(a<sup>2</sup> - u<sup>2</sup>)</code> 型）。三种标准型都有现成的三角代换，故配方之后必可积出。<b>核验完毕。</b>',
          example:
            '<b>例 1（一次式在根号里）</b>：<code>∫ dx/(1 + √x)</code>。令 <code>t = √x</code>（<code>t &gt; 0</code>），<code>x = t<sup>2</sup></code>，<code>dx = 2t dt</code>：\n<code>= ∫ 2t/(1 + t) dt = 2t - 2ln(1 + t) + C = 2√x - 2ln(1 + √x) + C</code>。\n\n<b>例 2（多个不同次根，取最小公倍数）</b>：<code>∫ dx/(∛x + √x)</code>。根指数 3 与 2，最小公倍数 6，令 <code>t = x<sup>1/6</sup></code>（<code>t &gt; 0</code>），则 <code>x = t<sup>6</sup></code>、<code>dx = 6t<sup>5</sup>dt</code>、<code>∛x = t<sup>2</sup></code>、<code>√x = t<sup>3</sup></code>：\n<code>= ∫ 6t<sup>5</sup>/(t<sup>2</sup> + t<sup>3</sup>) dt = 6∫ t<sup>3</sup>/(1 + t) dt</code>。多项式除法：<code>t<sup>3</sup>/(1 + t) = t<sup>2</sup> - t + 1 - 1/(1 + t)</code>，\n<code>= 6[t<sup>3</sup>/3 - t<sup>2</sup>/2 + t - ln(1 + t)] + C = 2t<sup>3</sup> - 3t<sup>2</sup> + 6t - 6ln(1 + t) + C</code>。\n回代 <code>t = x<sup>1/6</sup></code>：<code>= 2√x - 3∛x + 6x<sup>1/6</sup> - 6ln(1 + x<sup>1/6</sup>) + C</code>。\n\n<b>例 3（先配方再三角代换）</b>：<code>∫ √(x<sup>2</sup> + 2x + 5) dx</code>。配方：<code>x<sup>2</sup> + 2x + 5 = (x + 1)<sup>2</sup> + 4</code>。令 <code>u = x + 1</code>（<code>du = dx</code>），得 <code>∫ √(u<sup>2</sup> + 4) du</code>。\n再令 <code>u = 2 tan t</code>，<code>du = 2 sec<sup>2</sup>t dt</code>，<code>√(u<sup>2</sup> + 4) = 2 sec t</code>：\n<code>= ∫ 4 sec<sup>3</sup>t dt</code>。用分部积分可推得 <code>∫ sec<sup>3</sup>t dt = (1/2)(sec t tan t + ln|sec t + tan t|) + C</code>，\n于是原式 <code>= 2 sec t tan t + 2 ln|sec t + tan t| + C</code>。回代（<code>tan t = u/2</code>，<code>sec t = √(u<sup>2</sup> + 4)/2</code>，<code>u = x + 1</code>）：\n<code>= ((x + 1)/2)√(x<sup>2</sup> + 2x + 5) + 2 ln((x + 1) + √(x<sup>2</sup> + 2x + 5)) + C</code>。\n\n<b>例 4（倒代换配合）</b>：<code>∫ dx/(x√(x<sup>2</sup> + 1))</code>。令 <code>x = 1/t</code>（<code>t &gt; 0</code>），则 <code>dx = -dt/t<sup>2</sup></code>，<code>√(x<sup>2</sup> + 1) = √(1 + t<sup>2</sup>)/t</code>：\n<code>= ∫ (-dt/t<sup>2</sup>)/((1/t)·√(1 + t<sup>2</sup>)/t) = -∫ dt/√(1 + t<sup>2</sup>) = -ln(t + √(1 + t<sup>2</sup>)) + C</code>。\n回代 <code>t = 1/x</code>（<code>x &gt; 0</code>）：<code>= -ln((1 + √(x<sup>2</sup> + 1))/x) + C = ln x - ln(1 + √(x<sup>2</sup> + 1)) + C</code>。',
          pitfalls: [
            '根号里是一次式却去做三角代换，徒增计算量。判断标准要记牢：<b>一次式 → 根式代换；二次式 → 配方 + 三角代换</b>。',
            '配方时漏项或符号错，例如把 <code>x<sup>2</sup> - 4x + 7</code> 配成 <code>(x - 2)<sup>2</sup> + 7</code>（应为 <code>(x - 2)<sup>2</sup> + 3</code>）。验算办法：把结果展开看是否回到原式。',
            '取最小公倍数时算错，导致根号没消干净就以为做完了。',
            '根式代换后没有把 <code>dx</code> 一起换，或者反解 <code>x</code> 时出错（例如由 <code>t = √(2x + 1)</code> 错解成 <code>x = t<sup>2</sup> - 1</code>，漏掉除以 2）。',
            '回代时把平方根的符号弄错，尤其在偶数次根的情况下忘了限定 <code>t &gt; 0</code>。',
          ],
          tags: ['无理函数', '根式代换', '配方', '换元积分法'],
          related: ['def-reciprocal-substitution', 'def-trig-substitution', 'def-rational-steps', 'thm-substitution-rule-2'],
        },
      ],
    },
  ],
};
