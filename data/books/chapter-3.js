// 同济《高等数学》上册（第八版）· 第3章 微分中值定理与导数的应用
export default {
  id: 'ch3',
  no: 3,
  title: '微分中值定理与导数的应用',
  intro: '前面我们已经会求导数了，但导数只是一堆"瞬时速率"。这一章要回答一个更值钱的问题：知道了导数，能不能反过来推断函数本身长什么样？微分中值定理就是那座桥——它说函数在区间上的平均变化率，一定在某个瞬间被精确地达到。靠着这座桥，我们才能用导数判断单调、凹凸、极值，画出一张像样的函数图形。',
  sections: [
    {
      id: 'ch3-1',
      no: '3.1',
      title: '微分中值定理',
      summary: '从费马引理出发，用"最值"这一个工具依次推出罗尔、拉格朗日、柯西三大中值定理，它们是整章的地基。',
      items: [
        {
          id: 'def-extremum-local-global',
          kind: 'definition',
          name: '极值与最值的定义',
          aka: ['局部极值', '全局最值', '极大值极小值'],
          statement: '设函数 <code>f(x)</code> 在点 <code>x<sub>0</sub></code> 的某邻域 <code>U(x<sub>0</sub>)</code> 内有定义。\n若对一切 <code>x ∈ U(x<sub>0</sub>)</code> 都有 <code>f(x) ≤ f(x<sub>0</sub>)</code>，则称 <code>f(x<sub>0</sub>)</code> 是 <code>f(x)</code> 的一个<b>极大值</b>，<code>x<sub>0</sub></code> 称为<b>极大值点</b>；把 <code>≤</code> 换成 <code>≥</code> 就是<b>极小值</b>与<b>极小值点</b>，两者统称<b>极值</b>。\n若对区间 <code>I</code> 上一切 <code>x</code> 都有 <code>f(x) ≤ f(x<sub>0</sub>)</code>，则称 <code>f(x<sub>0</sub>)</code> 是 <code>f</code> 在 <code>I</code> 上的<b>最大值</b>；同理定义<b>最小值</b>，两者统称<b>最值</b>。',
          plain: '极值是"我这一片街区内最有钱的人"，只要在自己家门口这一小圈里排第一就算；最值是"全省首富"，得在整个区间里排第一才算。\n所以极值可能是若干个，最值最多各一个（也可能取不到，比如开区间上的 <code>x</code>）。另外，极大值完全可能比极小值还小——就像某个小县城的首富，可能比大城市里的穷人还穷。',
          why: '为什么要分"局部"和"整体"两套名字？因为求导只能看清一个点附近的情况，导数为零只说明"这一小圈里我最高或最低"，管不了远处。而实际问题（造最省的罐子、走最快的路线）要的是整体冠军，所以必须先用极值当候选人，再把端点和不可导点一起拉进决赛比较，这就是后面 3.5 求最值的完整流程。',
          example: '<code>f(x) = x<sup>3</sup> − 3x</code> 在 <code>ℝ</code> 上：<code>x = −1</code> 处取极大值 <code>2</code>，<code>x = 1</code> 处取极小值 <code>−2</code>。\n若把范围限定在闭区间 <code>[−1, 2]</code>：候选值有 <code>f(−1) = 2</code>、<code>f(1) = −2</code>、端点 <code>f(2) = 2</code>，所以最大值是 <code>2</code>，最小值是 <code>−2</code>。注意最大值在 <code>x = −1</code> 和 <code>x = 2</code> 两处都取到，但 <code>x = 2</code> 只是端点，并不是极值点。',
          pitfalls: [
            '把"极大值"理解成"很大的值"。极大值只跟附近比，<code>f(x) = x<sup>3</sup> − 3x</code> 的极大值 <code>2</code> 就比它在 <code>x = 10</code> 处的函数值 <code>970</code> 小得多。',
            '认为"极值点一定是导数为零的点"。<code>f(x) = |x|</code> 在 <code>x = 0</code> 处是极小值，但那里根本不可导。',
            '认为"导数为零的点一定是极值点"。<code>f(x) = x<sup>3</sup></code> 在 <code>x = 0</code> 处导数为零，可它不是极值点。'
          ],
          tags: ['微分中值定理', '极值', '最值'],
          related: ['thm-fermat', 'thm-extreme-value-ch3', 'thm-extremum-first']
        },
        {
          id: 'thm-extreme-value-ch3',
          kind: 'theorem',
          name: '最值定理（闭区间上连续函数的最值存在性）',
          aka: ['有界性与最大值最小值定理'],
          statement: '若函数 <code>f(x)</code> 在闭区间 <code>[a, b]</code> 上连续，则 <code>f(x)</code> 在 <code>[a, b]</code> 上<b>有界</b>，且必能取到最大值与最小值。即存在 <code>x<sub>1</sub>, x<sub>2</sub> ∈ [a, b]</code>，使得对一切 <code>x ∈ [a, b]</code> 有\n<code>f(x<sub>1</sub>) ≤ f(x) ≤ f(x<sub>2</sub>)</code>。',
          plain: '想象用一支笔在纸上从左到右画一条<b>一笔不断</b>的线，起点和终点都落在纸上。那这条线一定有最高的一点和最低的一点——它不可能一边画一边冲向无穷高，因为中间不许抬笔，也不许断。\n这两个条件都很关键："不断"就是连续，"不许跑出纸外"就是闭区间（端点也要算数，不能是开区间）。',
          why: '这条定理本身属于实数完备性，严格证明要用确界原理，属于极限论的内容，这里只作结论使用。它的价值在于给罗尔定理<b>提供"最值能取到"这个前提</b>：正是因为闭区间上连续函数一定取到最值，我们才能说"最大值点 <code>ξ</code> 存在"，再对 <code>ξ</code> 用费马引理。<b>没有它，中值定理整条链子就断在起点。</b>',
          proof: '（本定理的严格证明依赖实数系的确界存在原理，属于第 1 章极限理论的范围，此处从略，仅作为已知结论引用。）\n下面说明两个条件为什么都不能少。\n第一步，去掉"闭"：取 <code>f(x) = x</code> 在开区间 <code>(0, 1)</code> 上，它连续、有界，但既取不到最大值也取不到最小值，因为 <code>0</code> 与 <code>1</code> 都被挖掉了。\n第二步，去掉"连续"：取 <code>f(x) = 1/x</code> 在 <code>(0, 1]</code> 上，它虽然在 <code>x = 1</code> 处取到最小值 <code>1</code>，但当 <code>x → 0<sup>+</sup></code> 时函数值趋于 <code>+∞</code>，所以它在 <code>(0, 1]</code> 上无界，更没有最大值；若改用 <code>[0, 1]</code>，则函数在 <code>x = 0</code> 处没有定义，谈不上连续。\n可见"闭区间 + 连续"这两个条件是紧咬合的。',
          example: '<code>f(x) = x<sup>2</sup></code> 在 <code>[−1, 2]</code> 上连续，所以最值必定存在：最小值 <code>f(0) = 0</code>，最大值 <code>f(2) = 4</code>。\n同样这个函数放到开区间 <code>(−1, 2)</code> 上，最小值 <code>0</code> 仍能取到，但最大值 <code>4</code> 取不到——这就是闭区间两个字的价值。',
          pitfalls: [
            '在开区间上套用最值定理。考研题里最常见的坑就是"在 <code>(a, b)</code> 上连续"却直接说"存在最大值"，这是无效的。',
            '忘记检查连续性，例如 <code>f(x) = 1/x</code> 在 <code>[−1, 1]</code> 上并不连续（<code>x = 0</code> 无定义），定理不适用。'
          ],
          tags: ['微分中值定理', '连续性', '最值'],
          related: ['def-extremum-local-global', 'thm-fermat', 'thm-rolle']
        },
        {
          id: 'thm-fermat',
          kind: 'theorem',
          name: '费马引理',
          aka: ['费马定理', 'Fermat 引理'],
          statement: '设函数 <code>f(x)</code> 在点 <code>x<sub>0</sub></code> 的某邻域 <code>U(x<sub>0</sub>)</code> 内有定义，并在 <code>x<sub>0</sub></code> 处<b>可导</b>。若对一切 <code>x ∈ U(x<sub>0</sub>)</code> 有 <code>f(x) ≤ f(x<sub>0</sub>)</code>（即 <code>x<sub>0</sub></code> 是极大值点），则\n<code>f ′(x<sub>0</sub>) = 0</code>。\n对极小值点同理。',
          plain: '一座山的山顶，如果你脚下是<b>光滑</b>的（可导），那你站的地方一定是平的。因为只要还有点斜，你就能顺着斜的方向再往上走一点，那你就没到顶。\n反过来注意：平的地方不一定是山顶，也可能是山腰的一个小平台，甚至是一个拐弯的鞍部——所以"导数为零"只是当冠军的<b>报名条件</b>，不是当选通知书。',
          why: '费马引理是整个中值定理家族唯一的"发动机"。它的想法极朴素：极值点处左看右看都比自己低（或高），于是左右两侧的差商一侧非负、一侧非正，夹一夹只能等于零。\n<b>为什么必须可导？</b>因为只有可导时左右两侧的差商极限才必须相等。看 <code>f(x) = |x|</code>：<code>x = 0</code> 明明是山谷底（极小值），但左侧差商恒为 <code>−1</code>、右侧差商恒为 <code>+1</code>，两个单侧极限不相等，所以导数不存在，结论"导数为零"自然无从谈起——这个例子说明可导条件是硬性的。',
          proof: '不妨设 <code>x<sub>0</sub></code> 为极大值点，即存在 <code>δ &gt; 0</code>，当 <code>|x − x<sub>0</sub>| &lt; δ</code> 时 <code>f(x) ≤ f(x<sub>0</sub>)</code>。\n第一步，先看左半边。取 <code>x = x<sub>0</sub> + Δx</code> 且 <code>−δ &lt; Δx &lt; 0</code>，此时分子 <code>f(x<sub>0</sub> + Δx) − f(x<sub>0</sub>) ≤ 0</code>，分母 <code>Δx &lt; 0</code>，两个负数相除得非负，所以差商\n<code>[f(x<sub>0</sub> + Δx) − f(x<sub>0</sub>)] / Δx ≥ 0</code>。\n令 <code>Δx → 0<sup>−</sup></code>，由极限的保号性得左导数 <code>f ′<sub>−</sub>(x<sub>0</sub>) ≥ 0</code>。\n第二步，再看右半边。取 <code>0 &lt; Δx &lt; δ</code>，此时分子 <code>≤ 0</code> 而分母 <code>&gt; 0</code>，差商 <code>≤ 0</code>，令 <code>Δx → 0<sup>+</sup></code> 得右导数 <code>f ′<sub>+</sub>(x<sub>0</sub>) ≤ 0</code>。\n第三步，合并。已知 <code>f</code> 在 <code>x<sub>0</sub></code> 处可导，故左右导数存在且相等：<code>f ′(x<sub>0</sub>) = f ′<sub>−</sub>(x<sub>0</sub>) = f ′<sub>+</sub>(x<sub>0</sub>)</code>。一个数同时 <code>≥ 0</code> 又 <code>≤ 0</code>，只能是 <code>f ′(x<sub>0</sub>) = 0</code>。\n极小值点的情况把不等号全部反向即可，推理完全一样。',
          example: '<code>f(x) = x<sup>2</sup> − 2x + 5</code> 的极小值点在 <code>x = 1</code> 处，而 <code>f ′(x) = 2x − 2</code>，确实 <code>f ′(1) = 0</code>。\n再验证一下反例方向：<code>f(x) = x<sup>3</sup></code> 在 <code>x = 0</code> 处 <code>f ′(0) = 0</code>，但 <code>x &lt; 0</code> 时 <code>f(x) &lt; 0</code>、<code>x &gt; 0</code> 时 <code>f(x) &gt; 0</code>，两侧函数值一正一负，<code>x = 0</code> 既不是极大值点也不是极小值点。这说明费马引理<b>只是必要条件</b>。',
          pitfalls: [
            '把费马引理反过来用：由 <code>f ′(x<sub>0</sub>) = 0</code> 断言 <code>x<sub>0</sub></code> 是极值点，这是典型的方向性错误。',
            '忽略可导条件，对 <code>f(x) = |x|</code>、<code>f(x) = x<sup>2/3</sup></code> 这类尖点直接写 <code>f ′(0) = 0</code>。'
          ],
          tags: ['微分中值定理', '费马引理', '极值'],
          related: ['def-extremum-local-global', 'thm-extreme-value-ch3', 'thm-rolle']
        },
        {
          id: 'thm-rolle',
          kind: 'theorem',
          name: '罗尔定理',
          aka: ['Rolle 定理', '罗尔中值定理'],
          statement: '若函数 <code>f(x)</code> 满足：\n① 在闭区间 <code>[a, b]</code> 上连续；\n② 在开区间 <code>(a, b)</code> 内可导；\n③ <code>f(a) = f(b)</code>，\n则至少存在一点 <code>ξ ∈ (a, b)</code>，使得\n<code>f ′(ξ) = 0</code>。',
          plain: '你早上从家出发，晚上又回到了家。不管路上你是跑是走、是绕远还是抄近道，<b>路上总有那么一刻，你的瞬时速度恰好为零</b>——要么是停下来喘了口气，要么是转身的那一刹那，速度从"往外"变成了"往回"。\n三个条件翻译过来就是：路是连续不断的（不能瞬移，所以连续）、不能突然折返到没方向（可导）、起点终点在同一高度（<code>f(a) = f(b)</code>）。',
          why: '罗尔定理的证明思路只有一句话：<b>把费马引理用到最值点上</b>。因为 <code>f(a) = f(b)</code>，这条曲线要么是水平的（那处处导数都是零），要么在中间某处拱起来或凹下去，那个拱顶/凹底就是极值点，费马引理立刻给导数为零。\n<b>三个条件为何缺一不可？</b>下面三个反例各破一条：\n① 破连续：<code>f(x) = x</code> 当 <code>0 ≤ x &lt; 1</code>，<code>f(1) = 0</code>，在 <code>[0, 1]</code> 上 <code>f(0) = f(1) = 0</code>，但函数在 <code>x = 1</code> 处断开，导数处处为 <code>1</code>，找不到零点。\n② 破可导：<code>f(x) = |x|</code> 在 <code>[−1, 1]</code> 上，<code>f(−1) = f(1) = 1</code>，但最小点在 <code>x = 0</code> 那个尖点上，那里不可导，<code>f ′</code> 在 <code>(−1, 1)</code> 内取值只有 <code>±1</code>，永远不为零。\n③ 破等值：<code>f(x) = x</code> 在 <code>[0, 1]</code> 上，<code>f(0) = 0 ≠ 1 = f(1)</code>，而 <code>f ′(x) ≡ 1</code>，也没有零点。',
          proof: '第一步，先确定最值一定存在。<code>f</code> 在 <code>[a, b]</code> 上连续，由最值定理，<code>f</code> 在 <code>[a, b]</code> 上必取到最大值 <code>M</code> 与最小值 <code>m</code>。\n第二步，分两种情形讨论。\n情形一：<code>M = m</code>。此时 <code>f</code> 在 <code>[a, b]</code> 上恒等于常数 <code>M</code>，所以 <code>f ′(x) ≡ 0</code>，<code>(a, b)</code> 内任何一点都可以取作 <code>ξ</code>，结论成立。\n情形二：<code>M &gt; m</code>。因为 <code>f(a) = f(b)</code>，这个公共值不可能同时等于 <code>M</code> 又等于 <code>m</code>，所以 <code>M</code> 与 <code>m</code> 之中至少有一个不等于 <code>f(a)</code>。\n不妨设 <code>M ≠ f(a)</code>，即最大值 <code>M</code> 不是在端点上取得的。于是存在 <code>ξ ∈ (a, b)</code> 使 <code>f(ξ) = M</code>，即 <code>ξ</code> 是 <code>f</code> 的极大值点。\n第三步，收割。由条件 ②，<code>f</code> 在 <code>ξ</code> 处可导；又 <code>ξ</code> 是极大值点，对它使用费马引理，得 <code>f ′(ξ) = 0</code>。\n若 <code>M = f(a)</code>，则必有 <code>m ≠ f(a)</code>，改取 <code>ξ</code> 为最小值点，同样用费马引理得 <code>f ′(ξ) = 0</code>。定理证毕。',
          example: '对 <code>f(x) = x<sup>2</sup> − 2x − 3</code> 在 <code>[−1, 3]</code> 上验证罗尔定理并求 <code>ξ</code>。\n① 检查条件：多项式处处连续可导；<code>f(−1) = 1 + 2 − 3 = 0</code>，<code>f(3) = 9 − 6 − 3 = 0</code>，端点等值。三个条件齐了。\n② 求导：<code>f ′(x) = 2x − 2</code>。\n③ 解方程：令 <code>2ξ − 2 = 0</code> 得 <code>ξ = 1</code>。\n④ 检验：<code>ξ = 1 ∈ (−1, 3)</code>，合格。顺带看一眼，<code>f(1) = −4</code> 正是这条抛物线的最低点，恰好也是极小值点，这与证明思路完全对上。',
          pitfalls: [
            '不验证三个条件就直接解 <code>f ′(ξ) = 0</code>。尤其是 <code>f(a) = f(b)</code>，题目常把区间给成 <code>[0, 1]</code> 而 <code>f(0) ≠ f(1)</code>，这时罗尔定理根本不能用。',
            '解出 <code>ξ</code> 后忘记检查它是否落在<b>开区间</b> <code>(a, b)</code> 内。若算出 <code>ξ = a</code> 或 <code>ξ = b</code>，必须舍弃。',
            '在含 <code>|x|</code>、<code>x<sup>2/3</sup></code>、分段函数的题目里忘记讨论不可导点。'
          ],
          tags: ['微分中值定理', '罗尔定理', '罗尔'],
          related: ['thm-fermat', 'thm-extreme-value-ch3', 'thm-lagrange', 'thm-cauchy', 'thm-taylor']
        },
        {
          id: 'thm-lagrange',
          kind: 'theorem',
          name: '拉格朗日中值定理',
          aka: ['Lagrange 中值定理', '微分中值定理', '有限增量定理'],
          statement: '若函数 <code>f(x)</code> 满足：\n① 在闭区间 <code>[a, b]</code> 上连续；\n② 在开区间 <code>(a, b)</code> 内可导，\n则至少存在一点 <code>ξ ∈ (a, b)</code>，使得\n<code>f(b) − f(a) = f ′(ξ)(b − a)</code>。\n它还有等价的写法：<code>f ′(ξ) = [f(b) − f(a)] / (b − a)</code>，以及带参数的形式 <code>f(b) − f(a) = f ′(a + θ(b − a))(b − a)</code>，其中 <code>0 &lt; θ &lt; 1</code>。',
          plain: '你开车从北京到上海，全程 <code>1200</code> 公里，用了 <code>12</code> 小时。平均速度是 <code>100</code> 公里每小时。仪表盘上的速度不可能一直 <code>&gt; 100</code>，也不可能一直 <code>&lt; 100</code>——否则平均下来不可能是 <code>100</code>。所以<b>路上一定有那么一个瞬间，你的车速表正好指着 100</b>。哪怕你中途停了两小时吃面，这个瞬间也照样存在。\n罗尔定理是这个定理的特例：当起点终点等高（<code>f(a) = f(b)</code>）时，平均速度为零，于是某一瞬间速度恰好为零。',
          why: '<b>辅助函数是怎么想出来的？</b>这是全章最卡人的一步，思路其实只有一句：<b>把"不等高"改造成"等高"，好去套罗尔定理。</b>\n把式子 <code>f(b) − f(a) = f ′(ξ)(b − a)</code> 右边移过来，等价于要找一个函数 <code>φ</code> 满足 <code>φ ′(ξ) = 0</code>，而且 <code>φ ′(x) = f ′(x) − [f(b) − f(a)] / (b − a)</code>。\n反推它的原函数立刻就有了：<code>φ(x) = f(x) − [f(b) − f(a)] / (b − a) · x</code>。\n<b>几何上是干什么？</b>就是在曲线 <code>y = f(x)</code> 上减去那条"弦"（连接 <code>(a, f(a))</code> 与 <code>(b, f(b))</code> 的直线，斜率正是那个平均变化率）。减掉之后，两端点被压到同一水平线上，<code>φ(a) = φ(b) = f(a) − a·k</code>（记 <code>k</code> 为弦的斜率），罗尔定理的第三个条件就凑齐了，一用就出结果。\n<b>为什么条件缺一不可？</b>去掉连续性，函数可以在中间跳一下，从"低于平均水平"直接跳成"高于平均水平"，全程不给 <code>100</code>；去掉可导性，函数可以在中间用尖锐折线绕开。经典反例 <code>f(x) = |x|</code> 在 <code>[−1, 1]</code> 上：<code>[f(1) − f(−1)] / (1 − (−1)) = 0</code>，要在 <code>(−1, 1)</code> 内找导数为零的点，可 <code>f ′</code> 处处是 <code>±1</code>，找不到。',
          proof: '第一步，构造辅助函数。记弦的斜率 <code>k = [f(b) − f(a)] / (b − a)</code>，令\n<code>φ(x) = f(x) − f(a) − k(x − a)</code>。\n第二步，验证 <code>φ</code> 满足罗尔定理的三个条件。\n① 连续性：<code>f</code> 在 <code>[a, b]</code> 上连续，<code>f(a)</code> 是常数，<code>k(x − a)</code> 是一次函数也处处连续，所以 <code>φ</code> 在 <code>[a, b]</code> 上连续。\n② 可导性：<code>f</code> 在 <code>(a, b)</code> 内可导，一次函数处处可导，所以 <code>φ</code> 在 <code>(a, b)</code> 内可导。\n③ 端点等值：<code>φ(a) = f(a) − f(a) − 0 = 0</code>；<code>φ(b) = f(b) − f(a) − k(b − a) = f(b) − f(a) − [f(b) − f(a)] = 0</code>。于是 <code>φ(a) = φ(b) = 0</code>。\n第三步，对 <code>φ</code> 使用罗尔定理，得存在 <code>ξ ∈ (a, b)</code> 使 <code>φ ′(ξ) = 0</code>。\n第四步，把 <code>φ ′(ξ) = 0</code> 翻译回来。因 <code>φ ′(x) = f ′(x) − k</code>，故 <code>f ′(ξ) − k = 0</code>，即\n<code>f ′(ξ) = [f(b) − f(a)] / (b − a)</code>，\n两边乘 <code>(b − a)</code> 即得 <code>f(b) − f(a) = f ′(ξ)(b − a)</code>。定理证毕。\n由 <code>ξ ∈ (a, b)</code> 可知存在 <code>θ ∈ (0, 1)</code> 使 <code>ξ = a + θ(b − a)</code>，这就得到参数形式的写法。',
          example: '对 <code>f(x) = x<sup>2</sup></code> 在 <code>[0, 2]</code> 上求定理中的 <code>ξ</code>。\n① 条件：多项式连续可导，满足。\n② 平均变化率：<code>[f(2) − f(0)] / (2 − 0) = (4 − 0) / 2 = 2</code>。\n③ 令 <code>f ′(ξ) = 2ξ = 2</code>，解得 <code>ξ = 1 ∈ (0, 2)</code>。\n④ 验证：<code>y = x<sup>2</sup></code> 在 <code>x = 1</code> 处切线斜率为 <code>2</code>，恰好与弦 <code>y = 2x</code> 平行。\n再看一个不等式应用：证明当 <code>x &gt; 0</code> 时 <code>ln(1 + x) &lt; x</code>。取 <code>f(t) = ln(1 + t)</code> 在 <code>[0, x]</code> 上用拉格朗日中值定理，得 <code>ln(1 + x) − ln 1 = x / (1 + ξ)</code>，其中 <code>0 &lt; ξ &lt; x</code>。因为 <code>1 / (1 + ξ) &lt; 1</code> 且 <code>x &gt; 0</code>，所以 <code>ln(1 + x) &lt; x</code>。',
          pitfalls: [
            '把 <code>ξ</code> 当成固定值。中值定理只保证"存在"，不同函数、不同区间对应的 <code>ξ</code> 各不相同，做题时不能说"取 <code>ξ = 1</code>"除非真的解出来了。',
            '直接对 <code>f(x) = 1/x</code> 在 <code>[−1, 1]</code> 上使用定理。它在 <code>x = 0</code> 处不连续，条件不满足，硬套会得出 <code>f(1) − f(−1) = f ′(ξ) · 2</code>，即 <code>1 − (−1) = 2f ′(ξ)</code>，从而 <code>f ′(ξ) = 1</code>。可实际上 <code>f ′(x) = −1/x<sup>2</sup> &lt; 0</code> 恒为负，根本取不到正值 <code>1</code>，矛盾正是条件被破坏的信号。',
            '证明不等式时忘记说明 <code>ξ</code> 落在哪个范围，导致无法比较大小。'
          ],
          tags: ['微分中值定理', '拉格朗日中值定理', '不等式证明'],
          related: ['thm-rolle', 'thm-cauchy', 'thm-taylor', 'cor-constant-function', 'thm-monotonicity']
        },
        {
          id: 'cor-constant-function',
          kind: 'theorem',
          name: '导数为零的推论（函数恒为常数的判定）',
          aka: ['拉格朗日中值定理的推论', '常数判别法'],
          statement: '若函数 <code>f(x)</code> 在区间 <code>I</code> 上连续，在 <code>I</code> 内可导，且对一切 <code>x ∈ I</code> 有 <code>f ′(x) = 0</code>，则 <code>f(x)</code> 在 <code>I</code> 上恒为常数。\n进一步：若 <code>f ′(x) = g ′(x)</code> 在区间 <code>I</code> 上处处成立，则 <code>f(x) − g(x) ≡ C</code>（常数）。',
          plain: '"一路上速度表始终显示 0"，那这辆车根本没动过，从哪儿出发就一直停在哪儿。\n这条推论听起来像废话，但它是整个积分学的命根子：将来我们靠它才能说"原函数只差一个常数"、"不定积分后面要写 <code>+ C</code>"。如果没有它，<code>+ C</code> 就是一句没有根据的口头禅。',
          why: '它其实是拉格朗日中值定理的直接后果，证明只要一行：在区间上任取两点套定理，右边含 <code>f ′(ξ) = 0</code>，于是两点函数值必然相等。<b>注意"区间"这个词很关键</b>：如果定义域被挖断了（比如 <code>f(x)</code> 在 <code>(0, 1) ∪ (2, 3)</code> 上导数为零），那么两段上可以各是各的常数，比如\n<code>f(x) = 0</code>（<code>0 &lt; x &lt; 1</code>），<code>f(x) = 5</code>（<code>2 &lt; x &lt; 3</code>），\n导数处处为零却不是整体常数。所以证明时必须"在区间上任取两点"，靠区间的连通性把两点连起来。',
          proof: '第一步，任取 <code>x<sub>1</sub>, x<sub>2</sub> ∈ I</code>，不妨设 <code>x<sub>1</sub> &lt; x<sub>2</sub></code>。\n第二步，因为区间 <code>I</code> 是连通的，<code>[x<sub>1</sub>, x<sub>2</sub>] ⊆ I</code>，<code>f</code> 在 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上连续、在 <code>(x<sub>1</sub>, x<sub>2</sub>)</code> 内可导，满足拉格朗日中值定理的条件。\n第三步，套定理得 <code>f(x<sub>2</sub>) − f(x<sub>1</sub>) = f ′(ξ)(x<sub>2</sub> − x<sub>1</sub>)</code>。由题设 <code>f ′(ξ) = 0</code>，故 <code>f(x<sub>2</sub>) − f(x<sub>1</sub>) = 0</code>，即 <code>f(x<sub>2</sub>) = f(x<sub>1</sub>)</code>。\n第四步，由 <code>x<sub>1</sub>, x<sub>2</sub></code> 的任意性，<code>f</code> 在 <code>I</code> 上取值处处相同，即恒为常数。\n第二部分的结论把定理用在 <code>h(x) = f(x) − g(x)</code> 上即可，因为 <code>h ′(x) = 0</code>。',
          example: '已知 <code>f ′(x) = 2x</code>，求 <code>f(x)</code> 的形式。设 <code>g(x) = x<sup>2</sup></code>，则 <code>g ′(x) = 2x = f ′(x)</code>，由推论 <code>f(x) − x<sup>2</sup> ≡ C</code>，即 <code>f(x) = x<sup>2</sup> + C</code>。这就是不定积分里那个 <code>+ C</code> 的严格来源。\n再看一个反例说明"区间"二字的重量：定义在 <code>D = (−∞, 0) ∪ (0, +∞)</code> 上的 <code>f(x) = 1</code>（<code>x &lt; 0</code>）与 <code>f(x) = 2</code>（<code>x &gt; 0</code>），它在 <code>D</code> 上处处满足 <code>f ′(x) = 0</code>，但 <code>f</code> 不是常数，因为 <code>D</code> 不是一个区间。',
          pitfalls: [
            '把"区间"偷换成"定义域"。定义域可以是两段不相连的集合，这时结论不成立。',
            '忘记先验证连续性与可导性，直接由 <code>f ′ = 0</code> 下结论。'
          ],
          tags: ['微分中值定理', '推论', '原函数'],
          related: ['thm-lagrange']
        },
        {
          id: 'thm-cauchy',
          kind: 'theorem',
          name: '柯西中值定理',
          aka: ['Cauchy 中值定理', '广义中值定理'],
          statement: '若函数 <code>f(x)</code> 与 <code>g(x)</code> 满足：\n① 在闭区间 <code>[a, b]</code> 上连续；\n② 在开区间 <code>(a, b)</code> 内可导，且 <code>g ′(x) ≠ 0</code>，\n则至少存在一点 <code>ξ ∈ (a, b)</code>，使得\n<code>[f(b) − f(a)] / [g(b) − g(a)] = f ′(ξ) / g ′(ξ)</code>。',
          plain: '两个人同时出发、同时到达。甲平均每公里耗油 <code>0.08</code> 升，乙平均每公里耗油 <code>0.1</code> 升。那么<b>一定存在某一小段路，在那一段上两人的瞬时耗油比恰好等于全程的平均耗油比</b>。\n拉格朗日中值定理是"一个人自己跟自己比"（拿时间和路程比），柯西中值定理是"两个人互相参照着比"。所以它管的事更广：不只是"变化率"，而是"两个变化率的比值"。',
          why: '<b>辅助函数是怎么想出来的？</b>还是那招：制造等高，好套罗尔定理。<b>这次要减的不是一条直线，而是那条"参数曲线弦"对应的关系。</b>\n我们希望 <code>F ′(ξ) = 0</code>，而 <code>F ′(x) = f ′(x) − [f(b) − f(a)] / [g(b) − g(a)] · g ′(x)</code>。\n反推原函数：<code>F(x) = f(x) − [f(b) − f(a)] / [g(b) − g(a)] · g(x)</code>。代端点一算，<code>F(a) = F(b) = [f(a)g(b) − f(b)g(a)] / [g(b) − g(a)]</code>，果然等高。\n<b>为什么必须加上 <code>g ′(x) ≠ 0</code>？</b>两个原因。第一，<code>g ′(x) ≠ 0</code> 保证了分母 <code>g(b) − g(a) ≠ 0</code>（否则由罗尔定理 <code>g ′</code> 会在中间某点为零，矛盾），式子才有意义。第二，它也保证了分母 <code>g ′(ξ)</code> 不为零，可以把除法做到底。\n<b>能不能直接用两次拉格朗日定理相除骗过去？</b>不能。两次用的 <code>ξ</code> 一般不是同一个点，而柯西定理要求分子分母是<b>同一个 <code>ξ</code></b>——这正是柯西定理比拉格朗日定理强的地方。',
          proof: '第一步，先把分母"扶正"。由题设 <code>g ′(x) ≠ 0</code> 于 <code>(a, b)</code>，若 <code>g(b) = g(a)</code>，则 <code>g</code> 满足罗尔定理条件，会存在 <code>η ∈ (a, b)</code> 使 <code>g ′(η) = 0</code>，与题设矛盾。故必有 <code>g(b) ≠ g(a)</code>，下面的除法合法。\n第二步，构造辅助函数。令\n<code>F(x) = f(x) − f(a) − [f(b) − f(a)] / [g(b) − g(a)] · [g(x) − g(a)]</code>。\n第三步，验证罗尔定理的三个条件。\n① <code>f, g</code> 在 <code>[a, b]</code> 上连续，常数与常数倍不破坏连续性，故 <code>F</code> 在 <code>[a, b]</code> 上连续。\n② <code>f, g</code> 在 <code>(a, b)</code> 内可导，故 <code>F</code> 在 <code>(a, b)</code> 内可导。\n③ <code>F(a) = f(a) − f(a) − 0 = 0</code>；<code>F(b) = f(b) − f(a) − [f(b) − f(a)] = 0</code>，故 <code>F(a) = F(b)</code>。\n第四步，对 <code>F</code> 用罗尔定理，得存在 <code>ξ ∈ (a, b)</code> 使 <code>F ′(ξ) = 0</code>。\n第五步，把导数写出来并翻译。因为\n<code>F ′(x) = f ′(x) − [f(b) − f(a)] / [g(b) − g(a)] · g ′(x)</code>，\n代入 <code>x = ξ</code> 得\n<code>f ′(ξ) = [f(b) − f(a)] / [g(b) − g(a)] · g ′(ξ)</code>。\n由 <code>g ′(ξ) ≠ 0</code> 两边除以 <code>g ′(ξ)</code>，得\n<code>f ′(ξ) / g ′(ξ) = [f(b) − f(a)] / [g(b) − g(a)]</code>。定理证毕。',
          example: '设 <code>f(x) = x<sup>2</sup></code>，<code>g(x) = x<sup>3</sup></code>，在 <code>[1, 2]</code> 上求定理中的 <code>ξ</code>。\n① 条件：两个多项式连续可导，且 <code>g ′(x) = 3x<sup>2</sup> &gt; 0</code> 于 <code>(1, 2)</code>，满足。\n② 左边：<code>[f(2) − f(1)] / [g(2) − g(1)] = (4 − 1) / (8 − 1) = 3/7</code>。\n③ 右边：<code>f ′(ξ) / g ′(ξ) = 2ξ / (3ξ<sup>2</sup>) = 2 / (3ξ)</code>，其中用到了 <code>ξ ≠ 0</code>。\n④ 解方程：<code>2 / (3ξ) = 3 / 7</code>，即 <code>14 = 9ξ</code>，得 <code>ξ = 14/9 ≈ 1.556 ∈ (1, 2)</code>，合格。\n<b>对照一下"用两次拉格朗日"为什么不行：</b>对 <code>f</code> 得 <code>f ′(ξ<sub>1</sub>) = 3</code>，<code>ξ<sub>1</sub> = 1.5</code>；对 <code>g</code> 得 <code>g ′(ξ<sub>2</sub>) = 7</code>，<code>ξ<sub>2</sub> = √(7/3) ≈ 1.528</code>。两者不是同一点，比值 <code>3/7</code> 虽然碰巧数值凑对了，但这是巧合；一般情形下相除会得到错误的 <code>ξ</code>。',
          pitfalls: [
            '漏写条件 <code>g ′(x) ≠ 0</code>。少了它，分母可能是零，定理失效。',
            '以为"分别用两次拉格朗日中值定理再相除"就能证明柯西定理。两个 <code>ξ</code> 不是同一个点，这个证法是错的。',
            '记错公式方向，写成 <code>[f(b) − f(a)] / [g(b) − g(a)] = g ′(ξ) / f ′(ξ)</code>。记忆窍门：<b>分子配分子、分母配分母</b>，左边谁在上，右边谁就在上。'
          ],
          tags: ['微分中值定理', '柯西中值定理', '洛必达法则'],
          related: ['thm-lagrange', 'thm-rolle', 'thm-lhopital-00', 'thm-taylor']
        }
      ]
    },
    {
      id: 'ch3-2',
      no: '3.2',
      title: '洛必达法则',
      summary: '用柯西中值定理把"两个无穷小（或无穷大）之比"的极限转化为"导数之比"的极限，专治各种未定式。',
      items: [
        {
          id: 'thm-lhopital-00',
          kind: 'theorem',
          name: '洛必达法则（0/0 型）',
          aka: ['L\'Hôpital 法则', '洛必达法则一'],
          statement: '设\n① 当 <code>x → a</code>（或 <code>x → ∞</code>）时，<code>f(x) → 0</code> 且 <code>g(x) → 0</code>；\n② 在点 <code>a</code> 的某去心邻域内（或 <code>|x|</code> 充分大时），<code>f ′(x)</code> 与 <code>g ′(x)</code> 都存在且 <code>g ′(x) ≠ 0</code>；\n③ <code>lim f ′(x) / g ′(x) = A</code>（<code>A</code> 可以是有限数，也可以是 <code>∞</code>），\n则\n<code>lim f(x) / g(x) = lim f ′(x) / g ′(x) = A</code>。',
          plain: '两个人同时走向 <code>0</code>，一个走得快一个走得慢，那最后谁"更小"？这就像比较两个人的减肥速度——最后谁更瘦，取决于谁掉秤更快。洛必达法则说：<b>别盯着体重本身了，直接看掉秤速率之比</b>。\n它把"两个都趋于零的东西比大小"这件说不清的事，换成了"两个导数比大小"这件能算的事。',
          why: '<b>为什么可以换？</b>因为它本质上是柯西中值定理的一次应用。在 <code>a</code> 附近任取一点 <code>x</code>，在 <code>[a, x]</code>（或 <code>[x, a]</code>）上用柯西中值定理：\n<code>[f(x) − f(a)] / [g(x) − g(a)] = f ′(ξ) / g ′(ξ)</code>，<code>ξ</code> 夹在 <code>a</code> 与 <code>x</code> 之间。\n因为 <code>f(a) = g(a) = 0</code>，左边就是 <code>f(x) / g(x)</code>；而 <code>x → a</code> 时 <code>ξ → a</code>，右边趋于 <code>lim f ′/g ′</code>。两边一夹，结论就出来了。<b>这就是为什么洛必达法则必须有"导数存在 + <code>g ′ ≠ 0</code>"这两个前提，也是为什么它天然属于中值定理家族。</b>\n<b>为什么条件不能少？</b>看反例 <code>f(x) = x + sin x</code>，<code>g(x) = x</code>，当 <code>x → ∞</code> 时两者都趋于无穷（那是 <code>∞/∞</code> 型，道理一样）。此时 <code>f ′/g ′ = (1 + cos x) / 1</code>，这个极限振荡不存在，但原极限 <code>lim (x + sin x)/x = 1 + lim (sin x)/x = 1</code> 明明存在。可见"导数之比的极限不存在"并不能推出"原极限不存在"。',
          proof: '先证 <code>x → a</code> 的 <code>0/0</code> 型。\n第一步，补充定义拿掉奇点。因为只关心极限，我们可以在 <code>x = a</code> 处补充定义 <code>f(a) = g(a) = 0</code>，补上以后 <code>f, g</code> 在 <code>a</code> 处连续（前提 ① 保证了这一点），且在 <code>a</code> 的去心邻域内可导。\n第二步，对任一 <code>x ≠ a</code>（且 <code>x</code> 在该邻域内），不妨设 <code>x &gt; a</code>。函数 <code>f, g</code> 在 <code>[a, x]</code> 上连续、在 <code>(a, x)</code> 内可导，且 <code>g ′ ≠ 0</code>，于是柯西中值定理的条件全部满足，存在 <code>ξ ∈ (a, x)</code> 使得\n<code>[f(x) − f(a)] / [g(x) − g(a)] = f ′(ξ) / g ′(ξ)</code>。\n第三步，化简左边。由 <code>f(a) = g(a) = 0</code>，上式即 <code>f(x) / g(x) = f ′(ξ) / g ′(ξ)</code>。\n第四步，取极限。当 <code>x → a<sup>+</sup></code> 时，由 <code>a &lt; ξ &lt; x</code> 与夹逼思想得 <code>ξ → a<sup>+</sup></code>；又已知 <code>lim<sub>x→a</sub> f ′(x)/g ′(x) = A</code>，故 <code>f ′(ξ)/g ′(ξ) → A</code>。于是\n<code>lim<sub>x→a<sup>+</sup></sub> f(x)/g(x) = A</code>。\n第五步，<code>x → a<sup>−</sup></code> 完全对称（在 <code>[x, a]</code> 上用柯西中值定理），也得到 <code>A</code>。左右极限都存在且等于 <code>A</code>，故 <code>lim<sub>x→a</sub> f(x)/g(x) = A</code>。\n最后，<code>x → ∞</code> 的情形作变换 <code>t = 1/x</code>，问题化为 <code>t → 0<sup>+</sup></code> 的 <code>0/0</code> 型，再套用上面的结论即可。',
          example: '求 <code>lim<sub>x→0</sub> (x − sin x) / x<sup>3</sup></code>。\n① 判型：<code>x → 0</code> 时分子 <code>0 − 0 = 0</code>，分母 <code>0</code>，是 <code>0/0</code> 型。\n② 一次洛必达：<code>(1 − cos x) / (3x<sup>2</sup>)</code>，代入仍为 <code>0/0</code>。\n③ 二次洛必达：<code>sin x / (6x)</code>，仍是 <code>0/0</code>。\n④ 三次洛必达：<code>cos x / 6 → 1/6</code>。\n所以原极限等于 <code>1/6</code>。注意每次使用前都要重新判型，不能一口气连用三次不算账。',
          pitfalls: [
            '不判型就用。形如 <code>lim<sub>x→0</sub> (x + 1) / (x + 2) = 1/2</code>，根本不是未定式，用洛必达会算出 <code>1/1 = 1</code>，错得离谱。',
            '把"导数之比的极限不存在"当成"原极限不存在"。如 <code>(x + sin x)/x</code> 当 <code>x → ∞</code>，原极限是 <code>1</code>，而导数之比振荡无极限。',
            '忘记检查 <code>g ′(x) ≠ 0</code>，或者忘记分子分母必须<b>同时</b>趋于零（不能一个趋于零一个趋于常数）。',
            '把洛必达法则当成求导公式，写成 <code>(f/g) ′ = f ′/g ′</code>。它算的是<b>极限</b>，不是导数。'
          ],
          tags: ['洛必达法则', '未定式', '极限'],
          related: ['thm-cauchy', 'thm-lhopital-inf', 'def-indeterminate-forms']
        },
        {
          id: 'thm-lhopital-inf',
          kind: 'theorem',
          name: '洛必达法则（∞/∞ 型）',
          aka: ['洛必达法则二', '无穷大型洛必达法则'],
          statement: '设\n① 当 <code>x → a</code>（或 <code>x → ∞</code>）时，<code>f(x) → ∞</code> 且 <code>g(x) → ∞</code>；\n② 在点 <code>a</code> 的某去心邻域内（或 <code>|x|</code> 充分大时），<code>f ′(x)</code> 与 <code>g ′(x)</code> 都存在且 <code>g ′(x) ≠ 0</code>；\n③ <code>lim f ′(x) / g ′(x) = A</code>（<code>A</code> 可为有限数或 <code>∞</code>），\n则\n<code>lim f(x) / g(x) = lim f ′(x) / g ′(x) = A</code>。',
          plain: '两个人都越来越有钱，一个增长快一个增长慢。问到"最后谁财富占主导"，看的是<b>财富增长速度之比</b>，而不是当下谁的钱多。哪怕甲方现在有一万亿、乙方只有一块钱，只要乙方的增速比甲方快得多，时间一长乙方照样反超。\n所以 <code>∞/∞</code> 型和 <code>0/0</code> 型的处理手段一模一样：都换成导数之比。',
          why: '证明思路和 <code>0/0</code> 型相似（同样靠柯西中值定理），但技术上要小心一件事：<code>f(a)</code>、<code>g(a)</code> 不再是 <code>0</code> 而是无穷大，所以不能直接约掉。标准做法是先对柯西中值定理的式子做一次"误差控制"：对任取的 <code>x</code>，在 <code>[a, x]</code> 上得\n<code>[f(x) − f(a)] / [g(x) − g(a)] = f ′(ξ) / g ′(ξ)</code>，\n再把它整理成\n<code>f(x)/g(x) = [f ′(ξ)/g ′(ξ)] · [1 − g(a)/g(x)] / [1 − f(a)/f(x)]</code>。\n由于 <code>f(x) → ∞</code> 而 <code>f(a)</code> 是固定的数（对每个固定的 <code>x</code> 而言），比值 <code>f(a)/f(x) → 0</code>，同理 <code>g(a)/g(x) → 0</code>，后面那个因子趋于 <code>1</code>。于是 <code>f(x)/g(x)</code> 与 <code>f ′(ξ)/g ′(ξ)</code> 是"等价无穷小级别的近似"，同极限。\n<b>但要牢记：这一步说明"导数之比极限存在 ⇒ 原极限存在"，反过来不成立</b>，理由和 <code>0/0</code> 型一样。',
          proof: '仅给出 <code>x → a<sup>+</sup></code> 情形的证明框架，其余情形同理。\n第一步，固定一点 <code>x<sub>0</sub> &gt; a</code>（在定理适用的邻域内）。对任意 <code>x &gt; x<sub>0</sub></code>，<code>f, g</code> 在 <code>[x<sub>0</sub>, x]</code> 上满足柯西中值定理条件，故存在 <code>ξ ∈ (x<sub>0</sub>, x)</code> 使\n<code>[f(x) − f(x<sub>0</sub>)] / [g(x) − g(x<sub>0</sub>)] = f ′(ξ) / g ′(ξ)</code>。\n第二步，把它改写成能取极限的形状。两边取倒数并整理：\n<code>f(x)/g(x) = [f ′(ξ)/g ′(ξ)] · [1 − g(x<sub>0</sub>)/g(x)] / [1 − f(x<sub>0</sub>)/f(x)]</code>。\n第三步，处理后面的修正因子。因为 <code>x → a<sup>+</sup></code> 时 <code>f(x) → ∞</code>、<code>g(x) → ∞</code>，而 <code>f(x<sub>0</sub>)</code>、<code>g(x<sub>0</sub>)</code> 是固定常数，所以\n<code>f(x<sub>0</sub>)/f(x) → 0</code>，<code>g(x<sub>0</sub>)/g(x) → 0</code>，\n从而那个比值因子 <code>→ 1/1 = 1</code>。\n第四步，取极限。又因为 <code>x<sub>0</sub> &lt; ξ &lt; x</code>，令 <code>x → a<sup>+</sup></code> 则 <code>ξ → a<sup>+</sup></code>，故 <code>f ′(ξ)/g ′(ξ) → A</code>。两个因子相乘的极限等于极限相乘，得 <code>lim<sub>x→a<sup>+</sup></sub> f(x)/g(x) = A · 1 = A</code>。\n第五步，<code>x → a<sup>−</sup></code> 与 <code>x → ∞</code> 的情形分别用对称区间和倒数变换处理，结论相同。定理证毕。',
          example: '求 <code>lim<sub>x→+∞</sub> x<sup>n</sup> / e<sup>x</sup></code>（<code>n</code> 为正整数）。\n① 判型：<code>x → +∞</code> 时分子分母都趋于 <code>+∞</code>，是 <code>∞/∞</code> 型。\n② 反复洛必达：每用一次，分子次数降一次，分母 <code>e<sup>x</sup></code> 不变：<code>n x<sup>n−1</sup> / e<sup>x</sup></code>，<code>n(n−1) x<sup>n−2</sup> / e<sup>x</sup></code>，……\n③ 用满 <code>n</code> 次后分子变成常数 <code>n!</code>，得到 <code>lim n! / e<sup>x</sup> = 0</code>。\n所以 <code>x<sup>n</sup>/e<sup>x</sup> → 0</code>，即指数函数增长得比任何多项式都快。同样方法可得 <code>lim<sub>x→+∞</sub> ln x / x<sup>α</sup> = 0</code>（<code>α &gt; 0</code>）、<code>lim<sub>x→+∞</sub> x<sup>α</sup> / a<sup>x</sup> = 0</code>（<code>a &gt; 1</code>），这三条是极限论里的经典结论。',
          pitfalls: [
            '把一个趋于 <code>∞</code> 一个趋于 <code>0</code>（或常数）的式子当成 <code>∞/∞</code> 型。例如 <code>lim<sub>x→∞</sub> (x + 1)/x<sup>2</sup></code> 不是未定式，直接是 <code>0</code>。',
            '在 <code>∞/∞</code> 型里忘记"求导是分别对分子分母求"，误用商的求导法则。',
            '不清楚 <code>0/0</code> 与 <code>∞/∞</code> 之外还有别的未定式，见到 <code>0 · ∞</code> 就直接洛必达。'
          ],
          tags: ['洛必达法则', '未定式', '无穷大'],
          related: ['thm-lhopital-00', 'thm-cauchy', 'def-indeterminate-forms']
        },
        {
          id: 'def-indeterminate-forms',
          kind: 'definition',
          name: '未定式及其转化（0·∞、∞−∞、1<sup>∞</sup>、0<sup>0</sup>、∞<sup>0</sup>）',
          aka: ['五类未定式', '其它未定式'],
          statement: '若求极限时遇到\n<code>0/0</code>、<code>∞/∞</code>、<code>0 · ∞</code>、<code>∞ − ∞</code>、<code>1<sup>∞</sup></code>、<code>0<sup>0</sup></code>、<code>∞<sup>0</sup></code>\n这七种形状（<b>前两种合称基本未定式，后五种合称其它未定式</b>），结果都不能直接判定，必须先<b>转化</b>：\n① <code>0 · ∞</code> 型：把其中一个因子写成倒数，化成 <code>0/0</code> 或 <code>∞/∞</code>，即 <code>f · g = f / (1/g)</code> 或 <code>= g / (1/f)</code>；\n② <code>∞ − ∞</code> 型：通分、有理化或提取公因子，化成 <code>0/0</code> 或 <code>∞/∞</code>；\n③ <code>1<sup>∞</sup></code>、<code>0<sup>0</sup></code>、<code>∞<sup>0</sup></code> 型：设 <code>y = f(x)<sup>g(x)</sup></code>，先算 <code>lim g(x) · ln f(x)</code>（这是 <code>0 · ∞</code> 型），得数 <code>L</code> 后，原极限为 <code>e<sup>L</sup></code>。',
          plain: '这五种形状就像"几张不太好算的账单"。<code>0 · ∞</code> 是"几乎不要钱但数量无穷多"，到底花多少钱说不准；<code>∞ − ∞</code> 是"两笔巨款互相抵消"，剩多少也说不准。\n处理它们的唯一心法是：<b>通通想办法改造成 <code>0/0</code> 或 <code>∞/∞</code></b>，因为只有这两种有洛必达法则可用。\n至于 <code>1<sup>∞</sup></code>，务必记牢：<b>它不等于 <code>1</code></b>！<code>1</code> 这个底数是"趋于 <code>1</code>"不是"恒等于 <code>1</code>"，那股一点点偏离在无穷次方的作用下会被放大成 <code>e</code> 的某次幂。',
          why: '<b>为什么不能直接判？</b>因为"趋于零的速度"和"趋于无穷的速度"都是相对的。比如 <code>x · (1/x) → 1</code>，<code>x · (1/x<sup>2</sup>) → 0</code>，<code>x<sup>2</sup> · (1/x) → ∞</code>：三个式子的形状都是 <code>∞ · 0</code>，答案却分别是 <code>1</code>、<code>0</code>、<code>∞</code>。这说明<b>光看形状提供不了任何信息</b>，必须看具体的速度，也就是必须继续算。\n取对数那招为什么行得通？因为 <code>ln</code> 是连续函数，<code>lim ln y = ln lim y</code>，所以我们可以先在对数世界里把"幂"降级成"乘"，把 <code>1<sup>∞</sup></code> 降级成 <code>0 · ∞</code>，算完再指数还原。<b>降级是核心思想。</b>',
          example: '① <code>0 · ∞</code>：求 <code>lim<sub>x→0<sup>+</sup></sub> x ln x</code>。改写为 <code>ln x / (1/x)</code>，这是 <code>∞/∞</code> 型；洛必达得 <code>(1/x) / (−1/x<sup>2</sup>) = −x → 0</code>。\n② <code>∞ − ∞</code>：求 <code>lim<sub>x→+∞</sub> (x − ln x)</code>。写成 <code>ln(e<sup>x</sup>/x)</code>，先求 <code>lim e<sup>x</sup>/x</code>（<code>∞/∞</code> 型，洛必达得 <code>e<sup>x</sup> → +∞</code>），故原式 <code>→ +∞</code>。\n③ <code>1<sup>∞</sup></code>：求 <code>lim<sub>x→+∞</sub> (1 + 1/x)<sup>x</sup></code>。设 <code>y = (1 + 1/x)<sup>x</sup></code>，则 <code>ln y = x ln(1 + 1/x) = ln(1 + 1/x) / (1/x)</code>。令 <code>t = 1/x → 0<sup>+</sup></code>，得 <code>lim ln y = lim<sub>t→0<sup>+</sup></sub> ln(1 + t)/t</code>，这是 <code>0/0</code> 型，洛必达得 <code>[1/(1+t)]/1 → 1</code>。所以 <code>lim y = e<sup>1</sup> = e</code>。\n④ <code>0<sup>0</sup></code>：求 <code>lim<sub>x→0<sup>+</sup></sub> x<sup>x</sup></code>。同样取对数得 <code>ln y = x ln x → 0</code>（由 ①），故 <code>lim y = e<sup>0</sup> = 1</code>。',
          pitfalls: [
            '把 <code>1<sup>∞</sup></code> 直接写成 <code>1</code>。这是最高频的错误，例如 <code>(1 + 1/x)<sup>x</sup></code> 的极限是 <code>e</code> 而不是 <code>1</code>。',
            '取对数后忘记最后要"还原"：只算出 <code>lim ln y = L</code> 就写答案 <code>L</code>，应该写 <code>e<sup>L</sup></code>。',
            '<code>0 · ∞</code> 型里选错了变形方向（把该放分母的那个因子放反了），导致导数越算越复杂。经验：<b>把求导后会变简单的因子放进分母</b>，比如 <code>ln x</code> 求导变 <code>1/x</code>，适合当分子。',
            '把 <code>∞ + ∞</code>、<code>0 + 0</code>、<code>∞ · ∞</code>、<code>0<sup>∞</sup></code> 也当成未定式。它们的结果是确定的：分别是 <code>∞</code>、<code>0</code>、<code>∞</code>、<code>0</code>。'
          ],
          tags: ['洛必达法则', '未定式', '极限', '取对数'],
          related: ['thm-lhopital-00', 'thm-lhopital-inf']
        }
      ]
    },
    {
      id: 'ch3-3',
      no: '3.3',
      title: '泰勒公式',
      summary: '用多项式去逼近一个函数：把"在某点附近"的信息（各阶导数）打包成一个多项式，余项告诉你这样近似误差有多大。',
      items: [
        {
          id: 'thm-taylor',
          kind: 'theorem',
          name: '泰勒中值定理（泰勒公式）',
          aka: ['Taylor 公式', '泰勒定理', '带拉格朗日余项的泰勒公式'],
          statement: '设函数 <code>f(x)</code> 在含有 <code>x<sub>0</sub></code> 的某个开区间 <code>(a, b)</code> 内具有直到 <code>n + 1</code> 阶的导数，则对任一 <code>x ∈ (a, b)</code>，有\n<code>f(x) = f(x<sub>0</sub>) + f ′(x<sub>0</sub>)(x − x<sub>0</sub>) + f ′′(x<sub>0</sub>)/2! · (x − x<sub>0</sub>)<sup>2</sup> + … + f <sup>(n)</sup>(x<sub>0</sub>)/n! · (x − x<sub>0</sub>)<sup>n</sup> + R<sub>n</sub>(x)</code>，\n其中余项\n<code>R<sub>n</sub>(x) = f <sup>(n+1)</sup>(ξ)/(n + 1)! · (x − x<sub>0</sub>)<sup>n+1</sup></code>，<code>ξ</code> 介于 <code>x<sub>0</sub></code> 与 <code>x</code> 之间。\n这个余项称为<b>拉格朗日余项</b>。当 <code>x<sub>0</sub> = 0</code> 时，公式退化为含 <code>ξ ∈ (0, x)</code> 的<b>麦克劳林公式</b>。',
          plain: '你想模仿一个人的走路姿势。<b>第一层模仿</b>：知道他现在站在哪，你至少能跟着站同一个位置（这对应 <code>f(x<sub>0</sub>)</code>）。<b>第二层</b>：知道他的速度和方向，你就能沿切线方向跟一段（加上 <code>f ′(x<sub>0</sub>)(x − x<sub>0</sub>)</code>）。<b>第三层</b>：知道他的加速度，你连"他会不会拐弯"都跟上了（加上带 <code>2!</code> 的那一项）……\n知道得越多，跟得越像。<b>阶数 <code>n</code> 就是"你掌握了他多少层的运动信息"，余项 <code>R<sub>n</sub></code> 就是"到了别处你跟丢了多少"。</b>',
          why: '<b>辅助函数是怎么想出来的？</b>目标是把余项 <code>R<sub>n</sub>(x) = f(x) − P<sub>n</sub>(x)</code> 的具体形状逼出来。我们希望用一个"含 <code>(x − x<sub>0</sub>)<sup>n+1</sup></code> 的式子"来代表它。\n于是设 <code>R<sub>n</sub>(x) = K · (x − x<sub>0</sub>)<sup>n+1</sup></code>，剩下的工作就是求出这个神秘常数 <code>K</code>。<b>怎么求一个常数？——把它变成某个函数的导数为零的那个点，再用罗尔定理。</b>\n为此构造\n<code>F(t) = f(x) − P<sub>n</sub>(t) − K(t − x<sub>0</sub>)<sup>n+1</sup></code>（把 <code>t</code> 当自变量，<code>x</code> 当常数）。\n这个构造的妙处在于：<code>F(x<sub>0</sub>) = F(x) = 0</code>（<code>x<sub>0</sub></code> 处是因为 <code>P<sub>n</sub></code> 的定义，<code>x</code> 处是因为 <code>K</code> 就是这么选的）。于是可以连续用 <code>n + 1</code> 次罗尔定理，每用一次就"降一阶"，最后落到 <code>f <sup>(n+1)</sup>(ξ) − (n + 1)! K = 0</code>，<code>K</code> 就被逼出来了。\n<b>为什么要把 <code>(t − x<sub>0</sub>)<sup>n+1</sup></code> 设计成 <code>n + 1</code> 次幂？</b>因为只有它求导 <code>n + 1</code> 次后还能剩下常数，而 <code>P<sub>n</sub></code> 求导 <code>n + 1</code> 次后恰好变成零——两边刚好配对。这个"次数匹配"就是整个构造的心脏。',
          proof: '第一步，定义多项式与余项。记\n<code>P<sub>n</sub>(t) = f(x<sub>0</sub>) + f ′(x<sub>0</sub>)(t − x<sub>0</sub>) + … + f <sup>(n)</sup>(x<sub>0</sub>)/n! · (t − x<sub>0</sub>)<sup>n</sup></code>。\n若 <code>x = x<sub>0</sub></code>，则 <code>P<sub>n</sub>(x<sub>0</sub>) = f(x<sub>0</sub>)</code>，余项为零，公式平凡成立，故以下设 <code>x ≠ x<sub>0</sub></code>。\n第二步，用"待定常数"的办法把余项写成标准形状。我们希望余项正比于 <code>(x − x<sub>0</sub>)<sup>n+1</sup></code>，于是令 <code>K</code> 为满足下式的数：\n<code>f(x) − P<sub>n</sub>(x) = K(x − x<sub>0</sub>)<sup>n+1</sup></code>，\n即 <code>K = [f(x) − P<sub>n</sub>(x)] / (x − x<sub>0</sub>)<sup>n+1</sup></code>。\n因为 <code>x ≠ x<sub>0</sub></code>，这样的 <code>K</code> 唯一存在。剩下的全部工作就是把这个 <code>K</code> 求出来。\n第三步，构造辅助函数。对 <code>t ∈ (a, b)</code> 令\n<code>F(t) = f(x) − P<sub>n</sub>(t) − K(t − x<sub>0</sub>)<sup>n+1</sup></code>，\n这里 <code>x</code> 是被暂时固定住的常数，<code>t</code> 才是自变量。\n第四步，检查两个端点的值，这一步是构造成功的关键。由 <code>P<sub>n</sub>(x<sub>0</sub>) = f(x<sub>0</sub>)</code> 得\n<code>F(x<sub>0</sub>) = f(x) − P<sub>n</sub>(x<sub>0</sub>) − K · 0 = f(x) − f(x<sub>0</sub>)</code>；\n又由 <code>f(x) − P<sub>n</sub>(x) = K(x − x<sub>0</sub>)<sup>n+1</sup></code>（即 <code>K</code> 的定义式）直接得\n<code>F(x) = f(x) − P<sub>n</sub>(x) − K(x − x<sub>0</sub>)<sup>n+1</sup> = 0</code>。\n还差 <code>F(x<sub>0</sub>) = 0</code>，也就是要说明 <code>f(x) − f(x<sub>0</sub>) = K(x − x<sub>0</sub>)<sup>n+1</sup></code>。把 <code>P<sub>n</sub>(x)</code> 与 <code>P<sub>n</sub>(x<sub>0</sub>)</code> 相减，注意 <code>P<sub>n</sub>(t) − P<sub>n</sub>(x<sub>0</sub>)</code> 的每一项都含因子 <code>(t − x<sub>0</sub>)</code>，故可设 <code>P<sub>n</sub>(x) − P<sub>n</sub>(x<sub>0</sub>) = (x − x<sub>0</sub>)Q(x)</code>，其中 <code>Q</code> 是 <code>n − 1</code> 次多项式。于是\n<code>f(x) − f(x<sub>0</sub>) = [f(x) − P<sub>n</sub>(x)] + [P<sub>n</sub>(x) − P<sub>n</sub>(x<sub>0</sub>)] = (x − x<sub>0</sub>)<sup>n+1</sup>[K + Q(x)/(x − x<sub>0</sub>)<sup>n</sup>]</code>。\n这提示我们：为了让 <code>F(x<sub>0</sub>) = 0</code> 与 <code>F(x) = 0</code> 同时成立，最省事的办法是把常数 <code>K</code> 重新定义成\n<code>K = [f(x) − P<sub>n</sub>(x)] / (x − x<sub>0</sub>)<sup>n+1</sup></code>（这正是第二步的取法），\n此时 <code>F(x) = 0</code> 已经成立；而对 <code>F(x<sub>0</sub>)</code>，我们要用的是另一个更常用的写法：把 <code>K</code> 待定，直接<b>用 <code>F(x<sub>0</sub>) = F(x) = 0</code> 这个要求反过来定 <code>K</code></b>。也就是：先写下含未知常数 <code>K</code> 的 <code>F</code>，<b>规定 <code>K</code> 使得 <code>F(x<sub>0</sub>) = F(x) = 0</code></b>，这样的 <code>K</code> 由 <code>f(x) − P<sub>n</sub>(x) = K(x − x<sub>0</sub>)<sup>n+1</sup></code> 唯一确定。两者其实是同一个 <code>K</code>，只是叙述顺序不同。以下按这个顺序进行。\n第六步，反复用罗尔定理并归纳。我们断言：对每个 <code>k = 0, 1, 2, …, n</code>，存在介于 <code>x<sub>0</sub></code> 与 <code>x</code> 之间的点 <code>ξ<sub>k</sub></code>，使得 <code>F <sup>(k+1)</sup>(ξ<sub>k</sub>) = 0</code>，且 <code>F <sup>(k)</sup>(x<sub>0</sub>) = 0</code>。\n先看 <code>k = 0</code>：由 <code>F(x<sub>0</sub>) = F(x) = 0</code> 与罗尔定理，存在 <code>ξ<sub>0</sub></code> 介于 <code>x<sub>0</sub></code> 与 <code>x</code> 之间使 <code>F ′(ξ<sub>0</sub>) = 0</code>，成立。\n归纳步：设已对某个 <code>k &lt; n</code> 得到 <code>F <sup>(k+1)</sup>(ξ<sub>k</sub>) = 0</code>。注意 <code>P<sub>n</sub></code> 是 <code>n</code> 次多项式，所以对一切 <code>k ≤ n</code> 有\n<code>P<sub>n</sub><sup>(k)</sup>(x<sub>0</sub>) = f <sup>(k)</sup>(x<sub>0</sub>)</code>（这正是泰勒系数的定义），\n而 <code>(t − x<sub>0</sub>)<sup>n+1</sup></code> 及其直到 <code>n</code> 阶的导数在 <code>t = x<sub>0</sub></code> 处都为零（因为每一项都还带着 <code>(t − x<sub>0</sub>)</code> 的正次幂），于是由 <code>F</code> 的表达式得\n<code>F <sup>(k)</sup>(x<sub>0</sub>) = f <sup>(k)</sup>(x<sub>0</sub>) − f <sup>(k)</sup>(x<sub>0</sub>) − 0 = 0</code>。\n于是在以 <code>x<sub>0</sub></code> 与 <code>ξ<sub>k</sub></code> 为端点的区间上，函数 <code>F <sup>(k)</sup></code> 两端点处的值都是 <code>0</code>，对它用罗尔定理，存在 <code>ξ<sub>k+1</sub></code> 介于 <code>x<sub>0</sub></code> 与 <code>ξ<sub>k</sub></code> 之间，使 <code>F <sup>(k+1+1)</sup>(ξ<sub>k+1</sub>) = 0</code>。归纳完成。\n第七步，取出 <code>K</code>。取 <code>k = n</code>，得存在 <code>ξ</code> 介于 <code>x<sub>0</sub></code> 与 <code>x</code> 之间，使 <code>F <sup>(n+1)</sup>(ξ) = 0</code>。\n现在算出 <code>F <sup>(n+1)</sup>(t)</code>：因为 <code>P<sub>n</sub></code> 是 <code>n</code> 次多项式，故 <code>P<sub>n</sub><sup>(n+1)</sup>(t) ≡ 0</code>；又 <code>[(t − x<sub>0</sub>)<sup>n+1</sup>]<sup>(n+1)</sup> = (n + 1)!</code> 是常数；而 <code>f(x)</code> 对自变量 <code>t</code> 求导为零。所以\n<code>F <sup>(n+1)</sup>(t) = f <sup>(n+1)</sup>(t) − K · (n + 1)!</code>。\n代入 <code>t = ξ</code> 并令其为零：\n<code>f <sup>(n+1)</sup>(ξ) − K(n + 1)! = 0</code>，即 <code>K = f <sup>(n+1)</sup>(ξ)/(n + 1)!</code>。\n第八步，合并结论。把 <code>K</code> 代回第二步的关系式 <code>f(x) − P<sub>n</sub>(x) = K(x − x<sub>0</sub>)<sup>n+1</sup></code>，即得\n<code>R<sub>n</sub>(x) = f <sup>(n+1)</sup>(ξ)/(n + 1)! · (x − x<sub>0</sub>)<sup>n+1</sup></code>。定理证毕。',
          example: '把 <code>f(x) = e<sup>x</sup></code> 在 <code>x<sub>0</sub> = 0</code> 处展开到 <code>n = 4</code>。因为 <code>f <sup>(k)</sup>(x) = e<sup>x</sup></code>，所以 <code>f <sup>(k)</sup>(0) = 1</code> 对一切 <code>k</code> 成立，于是\n<code>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + x<sup>4</sup>/4! + e<sup>ξ</sup>/5! · x<sup>5</sup></code>，<code>ξ</code> 介于 <code>0</code> 与 <code>x</code> 之间。\n用它估计 <code>e ≈ e<sup>1</sup></code>：取 <code>x = 1</code>，前四项给 <code>1 + 1 + 0.5 + 0.1667 + 0.0417 = 2.7083</code>，而真实值 <code>e ≈ 2.71828</code>。误差项 <code>e<sup>ξ</sup>/5! </code>，<code>0 &lt; ξ &lt; 1</code>，所以误差小于 <code>e/120 ≈ 0.0227</code>，与实测差 <code>0.0100</code> 吻合。\n顺带一个漂亮的副产品：对任意 <code>x</code>，只要 <code>|x|</code> 有界，那个含 <code>e<sup>ξ</sup></code> 的余项趋于零，所以 <code>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + … </code> 是无穷级数展开式。',
          pitfalls: [
            '把 <code>R<sub>n</sub></code> 的下标搞混：<code>n</code> 次泰勒多项式的余项里出现的是 <code>f <sup>(n+1)</sup></code> 和 <code>(n + 1)!</code>，不是 <code>f <sup>(n)</sup></code> 和 <code>n!</code>。',
            '忘记写 <code>ξ</code> 的取值范围。<code>ξ</code> 必须在 <code>x<sub>0</sub></code> 与 <code>x</code> 之间（不是随便一个点），否则余项估计无法进行。',
            '误以为泰勒公式是"等号右边前几项加起来就精确等于 <code>f(x)</code>"。掉的那个余项恰恰是全部误差所在。',
            '展开点选得不好。一般在 <code>x<sub>0</sub> = 0</code> 或题目指定的点上展开，随意换点会让计算量暴增。'
          ],
          tags: ['泰勒公式', '中值定理', '余项', '逼近'],
          related: ['mclaurin-formula', 'def-peano-remainder', 'thm-cauchy', 'thm-rolle', 'thm-lagrange']
        },
        {
          id: 'def-peano-remainder',
          kind: 'formula',
          name: '带佩亚诺余项的泰勒公式',
          aka: ['Peano 余项', '局部泰勒公式', '皮亚诺余项'],
          statement: '设函数 <code>f(x)</code> 在点 <code>x<sub>0</sub></code> 处具有直到 <code>n</code> 阶的导数，则当 <code>x → x<sub>0</sub></code> 时有\n<code>f(x) = f(x<sub>0</sub>) + f ′(x<sub>0</sub>)(x − x<sub>0</sub>) + … + f <sup>(n)</sup>(x<sub>0</sub>)/n! · (x − x<sub>0</sub>)<sup>n</sup> + o((x − x<sub>0</sub>)<sup>n</sup>)</code>，\n其中 <code>o((x − x<sub>0</sub>)<sup>n</sup>)</code> 称为<b>佩亚诺余项</b>，它的含义是：当 <code>x → x<sub>0</sub></code> 时，它是比 <code>(x − x<sub>0</sub>)<sup>n</sup></code> 高阶的无穷小，即\n<code>lim<sub>x→x<sub>0</sub></sub> o((x − x<sub>0</sub>)<sup>n</sup>) / (x − x<sub>0</sub>)<sup>n</sup> = 0</code>。',
          plain: '拉格朗日余项像一份"精确账单"：它明确告诉你差多少（<code>f <sup>(n+1)</sup>(ξ)/(n+1)! · (x−x<sub>0</sub>)<sup>n+1</sup></code>），但代价是要知道 <code>n + 1</code> 阶导数存在，而且 <code>ξ</code> 在哪不知道。\n佩亚诺余项像一句"大概差不多"：它不告诉你具体差多少，只保证<b>越靠近 <code>x<sub>0</sub></code> 差得越微不足道，而且比 <code>(x − x<sub>0</sub>)<sup>n</sup></code> 还小一个档次</b>。\n所以求极限、判断局部形状时用佩亚诺（够用且条件低），要估计误差数值时用拉格朗日。',
          why: '<b>为什么会有这种"只保证量级"的余项？</b>因为它的门槛低得多：只要 <code>n</code> 阶导数在一点 <code>x<sub>0</sub></code> 存在就够了，不需要在区间上 <code>n + 1</code> 阶可导，也不需要 <code>f</code> 在别处有多光滑。\n证明办法是<b>反复用洛必达法则</b>：把 <code>R<sub>n</sub>(x) / (x − x<sub>0</sub>)<sup>n</sup></code> 看成 <code>0/0</code> 型，连续洛必达 <code>n − 1</code> 次，转化为 <code>[f <sup>(n−1)</sup>(x) − f <sup>(n−1)</sup>(x<sub>0</sub>)] / [n!(x − x<sub>0</sub>)]</code>，而这个式子恰好就是 <code>f <sup>(n)</sup>(x<sub>0</sub>) / n!</code> 的差商形式，由 <code>n</code> 阶导数存在即可知它趋于 <code>f <sup>(n)</sup>(x<sub>0</sub>)/n!</code>，于是原来的比值趋于零，正是 <code>o((x − x<sub>0</sub>)<sup>n</sup>)</code> 的定义。\n<b>换句话说：佩亚诺余项是"用导数存在的定义"逼出来的，而不是用中值定理。</b>',
          proof: '记 <code>P<sub>n</sub>(x)</code> 为 <code>f</code> 在 <code>x<sub>0</sub></code> 处的 <code>n</code> 次泰勒多项式，<code>R<sub>n</sub>(x) = f(x) − P<sub>n</sub>(x)</code>。我们只需证明 <code>R<sub>n</sub>(x) = o((x − x<sub>0</sub>)<sup>n</sup>)</code>。\n第一步，先算 <code>R<sub>n</sub></code> 及其各阶导数在 <code>x<sub>0</sub></code> 处的值。由 <code>P<sub>n</sub><sup>(k)</sup>(x<sub>0</sub>) = f <sup>(k)</sup>(x<sub>0</sub>)</code>（<code>k = 0, 1, …, n</code>）得\n<code>R<sub>n</sub>(x<sub>0</sub>) = R<sub>n</sub>′(x<sub>0</sub>) = … = R<sub>n</sub><sup>(n)</sup>(x<sub>0</sub>) = 0</code>。\n第二步，考虑比式 <code>R<sub>n</sub>(x) / (x − x<sub>0</sub>)<sup>n</sup></code>。当 <code>x → x<sub>0</sub></code> 时分子分母都趋于 <code>0</code>，是 <code>0/0</code> 型。由第一步，<code>R<sub>n</sub></code> 与 <code>(x − x<sub>0</sub>)<sup>n</sup></code> 都满足洛必达法则的前提（在 <code>x<sub>0</sub></code> 附近可导），连续使用洛必达法则 <code>n − 1</code> 次：\n<code>lim R<sub>n</sub>(x) / (x − x<sub>0</sub>)<sup>n</sup> = lim R<sub>n</sub>′(x) / [n(x − x<sub>0</sub>)<sup>n−1</sup>] = … = lim R<sub>n</sub><sup>(n−1)</sup>(x) / [n!(x − x<sub>0</sub>)]</code>。\n第三步，处理最后这个比式。把它拆开：\n<code>R<sub>n</sub><sup>(n−1)</sup>(x) / (x − x<sub>0</sub>) = [R<sub>n</sub><sup>(n−1)</sup>(x) − R<sub>n</sub><sup>(n−1)</sup>(x<sub>0</sub>)] / (x − x<sub>0</sub>)</code>，\n这里用了第一步的结论 <code>R<sub>n</sub><sup>(n−1)</sup>(x<sub>0</sub>) = 0</code>。\n第四步，认出这是差商。由导数的定义，上式极限就是 <code>[R<sub>n</sub><sup>(n−1)</sup>] ′(x<sub>0</sub>) = R<sub>n</sub><sup>(n)</sup>(x<sub>0</sub>)</code>，而它等于 <code>0</code>。故\n<code>lim R<sub>n</sub><sup>(n−1)</sup>(x) / [n!(x − x<sub>0</sub>)] = R<sub>n</sub><sup>(n)</sup>(x<sub>0</sub>) / n! = 0</code>。\n第五步，合并。于是 <code>lim R<sub>n</sub>(x)/(x − x<sub>0</sub>)<sup>n</sup> = 0</code>，这正是 <code>R<sub>n</sub>(x) = o((x − x<sub>0</sub>)<sup>n</sup>)</code> 的定义。定理证毕。',
          example: '求 <code>lim<sub>x→0</sub> (e<sup>x</sup> − 1 − x) / x<sup>2</sup></code>。\n① 展开：<code>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2 + o(x<sup>2</sup>)</code>。\n② 代入：分子 <code>= e<sup>x</sup> − 1 − x = x<sup>2</sup>/2 + o(x<sup>2</sup>)</code>。\n③ 相除：<code>[x<sup>2</sup>/2 + o(x<sup>2</sup>)] / x<sup>2</sup> = 1/2 + o(1) → 1/2</code>。\n<b>对比洛必达的做法</b>：连用两次洛必达得 <code>e<sup>x</sup>/2 → 1/2</code>，也能做出来；但如果分子分母的阶数不匹配，洛必达会越算越乱，而泰勒展开只要记熟几条常用公式就能一步到位。再比如 <code>lim<sub>x→0</sub> (x − sin x)/x<sup>3</sup></code>，用 <code>sin x = x − x<sup>3</sup>/3! + o(x<sup>3</sup>)</code> 立刻得 <code>1/6</code>。',
          pitfalls: [
            '展开的阶数不够。如果分母是 <code>x<sup>3</sup></code>，分子就必须展到 <code>x<sup>3</sup></code> 项，只展到 <code>x<sup>2</sup></code> 会算不出结果。口诀：<b>展到与分母同阶为止</b>。',
            '写出 <code>o(x<sup>2</sup>) + o(x<sup>2</sup>) = o(x<sup>2</sup>)</code> 时搞混阶数，或把 <code>o(x<sup>3</sup>)</code> 与 <code>o(x<sup>2</sup>)</code> 混为一谈。注意 <code>o(x<sup>3</sup>)</code> 也是 <code>o(x<sup>2</sup>)</code>，反之不然。',
            '在有加减运算时随便省略高阶项，导致丢掉关键的主部。',
            '把佩亚诺余项当成"可以忽略不计的量"直接扔掉。它不能扔，它必须出现在式子里参与运算，只是最后取极限时才消失。'
          ],
          tags: ['泰勒公式', '佩亚诺余项', '无穷小', '极限'],
          related: ['thm-taylor', 'mclaurin-formula', 'thm-lhopital-00']
        },
        {
          id: 'mclaurin-formula',
          kind: 'formula',
          name: '常用麦克劳林公式（五个基本展开式）',
          aka: ['麦克劳林展开', 'Maclaurin 公式', '常用泰勒展开'],
          statement: '取 <code>x<sub>0</sub> = 0</code>，泰勒公式成为<b>麦克劳林公式</b>。以下五个展开式最常用（佩亚诺余项形式）：\n① <code>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + … + x<sup>n</sup>/n! + o(x<sup>n</sup>)</code>；\n② <code>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − … + (−1)<sup>m</sup> x<sup>2m+1</sup>/(2m+1)! + o(x<sup>2m+1</sup>)</code>；\n③ <code>cos x = 1 − x<sup>2</sup>/2! + x<sup>4</sup>/4! − … + (−1)<sup>m</sup> x<sup>2m</sup>/(2m)! + o(x<sup>2m</sup>)</code>；\n④ <code>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − … + (−1)<sup>n−1</sup> x<sup>n</sup>/n + o(x<sup>n</sup>)</code>；\n⑤ <code>(1 + x)<sup>α</sup> = 1 + αx + α(α−1)/2! · x<sup>2</sup> + … + α(α−1)…(α−n+1)/n! · x<sup>n</sup> + o(x<sup>n</sup>)</code>（<code>α</code> 为任意实数）。\n把 ⑤ 中的 <code>α</code> 取特殊值，立即得到\n<code>1/(1 − x) = 1 + x + x<sup>2</sup> + … + x<sup>n</sup> + o(x<sup>n</sup>)</code>，<code>1/(1 + x) = 1 − x + x<sup>2</sup> − … + (−1)<sup>n</sup>x<sup>n</sup> + o(x<sup>n</sup>)</code>，\n以及 <code>√(1 + x) = 1 + x/2 − x<sup>2</sup>/8 + o(x<sup>2</sup>)</code>。',
          plain: '这五条公式就是"函数界的乘法口诀表"。将来算极限、做近似、估误差，全靠它们。\n它们的共同长相是：<b>一堆 <code>x</code> 的幂次相加，越往后越不重要</b>。所以真正干活的往往只有最前面两三项，后面的 <code>o(x<sup>n</sup>)</code> 是"剩下的碎屑"。\n背法有诀窍：<code>e<sup>x</sup></code> 全正、分母阶乘；<code>sin</code> 只有奇次幂且正负交替；<code>cos</code> 只有偶次幂也交替；<code>ln(1 + x)</code> 幂次连号、正负交替；<code>(1 + x)<sup>α</sup></code> 的系数是"下降 <code>α</code> 的连乘除以阶乘"。',
          why: '<b>这些系数是怎么定出来的？</b>系数不是猜的，是"用 <code>x<sub>0</sub> = 0</code> 处的各阶导数值硬算出来"的。泰勒公式告诉我们 <code>x<sup>n</sup></code> 的系数必须是 <code>f <sup>(n)</sup>(0)/n!</code>，所以只要能把 <code>f <sup>(n)</sup>(0)</code> 算出来，公式就自动成立。\n以 <code>sin x</code> 为例：<code>sin 0 = 0</code>，<code>cos 0 = 1</code>，<code>−sin 0 = 0</code>，<code>−cos 0 = −1</code>，然后四阶导数循环回 <code>sin x</code>。所以 <code>x<sup>2</sup></code>、<code>x<sup>4</sup></code> 的系数都是 <code>0</code>，只剩下奇次幂，而 <code>x</code>、<code>x<sup>3</sup></code>、<code>x<sup>5</sup></code> 的系数依次是 <code>1/1!</code>、<code>−1/3!</code>、<code>1/5!</code>。\n再看 <code>ln(1 + x)</code>：<code>f <sup>(n)</sup>(x) = (−1)<sup>n−1</sup>(n − 1)!/(1 + x)<sup>n</sup></code>，代入 <code>x = 0</code> 得 <code>f <sup>(n)</sup>(0) = (−1)<sup>n−1</sup>(n − 1)!</code>，除以 <code>n!</code> 得 <code>(−1)<sup>n−1</sup>/n</code>，正是公式里的系数。<b>没有一项是凭记忆的，全部有推导来源。</b>',
          example: '① 求 <code>lim<sub>x→0</sub> (1 − cos x) / x<sup>2</sup></code>：由 <code>cos x = 1 − x<sup>2</sup>/2 + o(x<sup>2</sup>)</code>，分子 <code>= x<sup>2</sup>/2 + o(x<sup>2</sup>)</code>，故极限为 <code>1/2</code>。\n② 求 <code>lim<sub>x→0</sub> (√(1 + x) − 1 − x/2) / x<sup>2</sup></code>：由 <code>√(1 + x) = 1 + x/2 − x<sup>2</sup>/8 + o(x<sup>2</sup>)</code>，分子 <code>= −x<sup>2</sup>/8 + o(x<sup>2</sup>)</code>，故极限为 <code>−1/8</code>。\n③ 近似计算：<code>sin 0.1 ≈ 0.1 − 0.001/6 = 0.0998333…</code>，与真值 <code>0.0998334…</code> 在小数点后第 <code>7</code> 位才分家。\n④ 反用：把 <code>1/(1 − x)</code> 的展开式里 <code>x</code> 换成 <code>−x<sup>2</sup></code>，得 <code>1/(1 + x<sup>2</sup>) = 1 − x<sup>2</sup> + x<sup>4</sup> − …</code>，这类"代换法"能省下大量求导工作。',
          pitfalls: [
            '把 <code>sin x</code> 和 <code>cos x</code> 的展开式记混（例如漏掉正负交替，或者给 <code>cos x</code> 写成奇次幂）。',
            '忘记 <code>ln(1 + x)</code> 的展开要求 <code>|x| &lt; 1</code> 才收敛（在做高阶近似时，<code>x</code> 太大展开就没意义）。',
            '展开阶数不统一：加减两个函数时要展到<b>相同阶数</b>，否则低阶项会把高阶项吃掉。',
            '对 <code>(1 + x)<sup>α</sup></code> 里的 <code>α</code> 是否为正整数不加区分：若 <code>α</code> 是正整数，展开会在第 <code>α + 1</code> 项自然终止；否则是无穷多项。'
          ],
          tags: ['泰勒公式', '麦克劳林公式', '常用展开', '极限'],
          related: ['thm-taylor', 'def-peano-remainder']
        }
      ]
    },
    {
      id: 'ch3-4',
      no: '3.4',
      title: '函数的单调性与曲线的凹凸性',
      summary: '用一阶导数的符号判断函数是升是降，用二阶导数的符号判断曲线是"碗口朝上"还是"碗口朝下"。',
      items: [
        {
          id: 'thm-monotonicity',
          kind: 'theorem',
          name: '函数单调性的判定定理',
          aka: ['单调性判别法', '导数与单调性'],
          statement: '设函数 <code>f(x)</code> 在闭区间 <code>[a, b]</code> 上连续，在开区间 <code>(a, b)</code> 内可导。\n① 若在 <code>(a, b)</code> 内 <code>f ′(x) &gt; 0</code>，则 <code>f(x)</code> 在 <code>[a, b]</code> 上<b>单调增加</b>；\n② 若在 <code>(a, b)</code> 内 <code>f ′(x) &lt; 0</code>，则 <code>f(x)</code> 在 <code>[a, b]</code> 上<b>单调减少</b>。\n特别地，若在 <code>(a, b)</code> 内 <code>f ′(x) ≥ 0</code> 且只在有限个点上 <code>f ′(x) = 0</code>，则 <code>f(x)</code> 在 <code>[a, b]</code> 上仍严格单调增加（<code>≤ 0</code> 的情形同理）。',
          plain: '上坡的时候，你的高度是在涨的；下坡的时候，高度在跌。导数就是"坡度"，所以<b>看导数正负就知道函数在涨还是在跌</b>。\n至于最后那句"只在有限个点上坡度为 <code>0</code>"：想象一条路上有几段极短的平地，你走上去并没有真的停下来，只是短暂不升不降，整体还是往上走。例如 <code>f(x) = x<sup>3</sup></code>，<code>f ′(0) = 0</code>，但 <code>x<sup>3</sup></code> 在整个实数轴上严格递增。',
          why: '<b>为什么能用导数判断单调？</b>因为证明只需要拉格朗日中值定理。在区间里任取两点 <code>x<sub>1</sub> &lt; x<sub>2</sub></code>，我们要证明 <code>f(x<sub>2</sub>) − f(x<sub>1</sub>) &gt; 0</code>。由拉格朗日中值定理，这个差等于 <code>f ′(ξ)(x<sub>2</sub> − x<sub>1</sub>)</code>，其中 <code>x<sub>2</sub> − x<sub>1</sub> &gt; 0</code> 是死的，所以整个差的符号完全由 <code>f ′(ξ)</code> 的符号决定。<b>定理的全部内容就是：把"函数值之差"两两转化为"某点导数值"，从而把全局的单调性问题局部化。</b>\n<b>为什么条件不能少？</b>如果 <code>f</code> 在区间上不连续，比如 <code>f(x) = 1/x</code> 在 <code>(0, 2)</code> 上，虽然处处 <code>f ′ &lt; 0</code>，但它在 <code>x = 0</code> 处断开，跨过分断点就没有"单调"可谈了。<b>另外要特别注意：单调性必须分别在每个连续区间上讨论，绝不能把两个分开的区间用"∪"并起来写。</b>',
          proof: '只证 ①（增的情形），②把不等号全部反向即可。\n第一步，在 <code>[a, b]</code> 上任取两点 <code>x<sub>1</sub> &lt; x<sub>2</sub></code>。\n第二步，检查可用条件。由题设 <code>f</code> 在 <code>[a, b]</code> 上连续、在 <code>(a, b)</code> 内可导，故 <code>f</code> 在子区间 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上同样连续、在 <code>(x<sub>1</sub>, x<sub>2</sub>)</code> 内可导，满足拉格朗日中值定理的条件。\n第三步，套定理得存在 <code>ξ ∈ (x<sub>1</sub>, x<sub>2</sub>)</code> 使\n<code>f(x<sub>2</sub>) − f(x<sub>1</sub>) = f ′(ξ)(x<sub>2</sub> − x<sub>1</sub>)</code>。\n第四步，判断符号。因为 <code>x<sub>2</sub> &gt; x<sub>1</sub></code>，故 <code>x<sub>2</sub> − x<sub>1</sub> &gt; 0</code>；又 <code>ξ ∈ (a, b)</code>，由题设 <code>f ′(ξ) &gt; 0</code>。两个正数相乘为正，所以 <code>f(x<sub>2</sub>) − f(x<sub>1</sub>) &gt; 0</code>，即 <code>f(x<sub>2</sub>) &gt; f(x<sub>1</sub>)</code>。\n第五步，由 <code>x<sub>1</sub> &lt; x<sub>2</sub></code> 的任意性，<code>f</code> 在 <code>[a, b]</code> 上单调增加。\n最后补一句 <code>f ′ ≥ 0</code> 且零点有限的版本：把区间按那些零点切成有限段，在每一段上用上面的结论得严格增，再把这些段首尾相接，就得到整个区间上的严格增。',
          example: '讨论 <code>f(x) = x<sup>3</sup> − 3x</code> 的单调区间。\n① 求导：<code>f ′(x) = 3x<sup>2</sup> − 3 = 3(x − 1)(x + 1)</code>。\n② 求零点：<code>x = −1</code> 与 <code>x = 1</code>，它们把数轴切成三段。\n③ 列表判号：<code>x &lt; −1</code> 时 <code>f ′ &gt; 0</code>；<code>−1 &lt; x &lt; 1</code> 时 <code>f ′ &lt; 0</code>；<code>x &gt; 1</code> 时 <code>f ′ &gt; 0</code>。\n④ 结论：单调增区间为 <code>(−∞, −1]</code> 与 <code>[1, +∞)</code>，单调减区间为 <code>[−1, 1]</code>。<b>注意两个增区间之间被减区间隔开，不能写成 <code>(−∞, −1] ∪ [1, +∞)</code> 上是增函数。</b>\n再举个例子说明"平点不碍事"：<code>f(x) = x − sin x</code>，<code>f ′(x) = 1 − cos x ≥ 0</code>，且只在 <code>x = 2kπ</code> 处为零，所以它在 <code>ℝ</code> 上严格单调增加。',
          pitfalls: [
            '把单调区间用并集符号连起来写。正确做法是分开写成"在 <code>(−∞, −1]</code> 上单调增加，在 <code>[1, +∞)</code> 上单调增加"，而不是"在 <code>(−∞, −1] ∪ [1, +∞)</code> 上单调增加"。',
            '看到 <code>f ′(x<sub>0</sub>) = 0</code> 就断定 <code>x<sub>0</sub></code> 是分界点。像 <code>x<sup>3</sup></code> 那样，<code>f ′</code> 在零点两侧同号，单调性并不改变。',
            '忘记先求定义域。例如 <code>f(x) = ln x − x</code> 必须先声明 <code>x &gt; 0</code>。',
            '只看 <code>f ′</code> 的零点而不看它无意义的点。比如 <code>f ′</code> 的间断点两侧符号可能变号，也是分界点候选。'
          ],
          tags: ['单调性', '导数应用', '拉格朗日中值定理'],
          related: ['thm-lagrange', 'thm-extremum-first', 'def-concavity', 'thm-concavity-test']
        },
        {
          id: 'def-concavity',
          kind: 'definition',
          name: '曲线凹凸性的定义',
          aka: ['凹', '凸', '凹弧', '凸弧'],
          statement: '设 <code>f(x)</code> 在区间 <code>I</code> 上连续。若对 <code>I</code> 上任意两点 <code>x<sub>1</sub>, x<sub>2</sub></code> 与任意 <code>λ ∈ (0, 1)</code>，都有\n<code>f(λx<sub>1</sub> + (1 − λ)x<sub>2</sub>) &lt; λf(x<sub>1</sub>) + (1 − λ)f(x<sub>2</sub>)</code>，\n则称 <code>f(x)</code> 在 <code>I</code> 上的图形是<b>凹的</b>（凹弧）；把不等号反向（<code>&gt;</code>）则称图形是<b>凸的</b>（凸弧）。\n同济教材的约定：<b>凹</b>指曲线位于其任意两点连线（弦）的<b>下方</b>，形如开口向上的碗；<b>凸</b>指曲线位于弦的<b>上方</b>，形如开口向下的伞。',
          plain: '把曲线当成一根有弹性的钢丝。<b>凹</b>就是"能盛水"——像一个正放的碗，你往里倒水，水不会漏，弧段在弦（两点之间的直线）下面。<b>凸</b>就是"会漏水"——像倒扣的碗，水全流走，弧段在弦的上面。\n千万别死记"凹""凸"这两个汉字的笔画，因为它们在不同教材里含义可能相反。抓住那幅"碗"的图像最保险：<b>碗口朝上 = 凹，碗口朝下 = 凸</b>。',
          why: '为什么要费劲用 <code>λ</code> 这种抽象写法，而不直接说"碗口朝上"？因为"像碗"是画图得来的直觉，图上看到的是什么形状依赖于你怎么画、怎么转纸，不能拿来做严格推理。<code>λx<sub>1</sub> + (1 − λ)x<sub>2</sub></code> 这个式子恰好把所有可能的"弦上点"一网打尽：当 <code>λ</code> 从 <code>1</code> 变到 <code>0</code>，这个点从 <code>x<sub>1</sub></code> 匀速滑到 <code>x<sub>2</sub></code>，而 <code>λf(x<sub>1</sub>) + (1 − λ)f(x<sub>2</sub>)</code> 正是同一条弦在同一横坐标处的高度。\n于是"曲线在弦下方"这句话，就被翻译成了一个对任意 <code>λ</code> 都成立的不等式——<b>可以证明，可以计算，可以推出后续的判别法。</b>\n另外，这种"中间点的函数值小于两端函数值的加权平均"的写法，在不等式证明里非常好用（例如证明 <code>(a + b)/2 ≥ √(ab)</code> 型的结论），因为它天然地描述了"中点的位置"。',
          example: '① <code>f(x) = x<sup>2</sup></code> 在 <code>ℝ</code> 上是凹的：取 <code>x<sub>1</sub> = 0</code>、<code>x<sub>2</sub> = 2</code>、<code>λ = 1/2</code>，左边 <code>f(1) = 1</code>，右边 <code>(0 + 4)/2 = 2</code>，确实 <code>1 &lt; 2</code>。\n② <code>f(x) = −x<sup>2</sup></code> 是凸的：同样取值，左边 <code>−1</code>，右边 <code>−2</code>，有 <code>−1 &gt; −2</code>。\n③ <code>f(x) = x<sup>3</sup></code> 在 <code>ℝ</code> 上既不是凹的也不是凸的：在 <code>x &lt; 0</code> 部分它是凸的，在 <code>x &gt; 0</code> 部分它是凹的，性质在 <code>x = 0</code> 处发生了切换——这正是下一节要讲的拐点。',
          pitfalls: [
            '与某些教材的"凹""凸"称谓相反就慌了。判断时永远回到"曲线在弦的上方还是下方"这个几何事实上。',
            '把"凹"误解成"有凹陷"。凹弧是碗口朝上，是往外鼓的，跟"瘪下去"没关系。',
            '以为"凹"就是"单调增加"。完全无关：<code>f(x) = x<sup>2</sup></code> 在 <code>ℝ</code> 上处处是凹的，但它在 <code>x &lt; 0</code> 上单调减少、在 <code>x &gt; 0</code> 上单调增加。'
          ],
          tags: ['凹凸性', '曲线', '定义'],
          related: ['thm-concavity-test', 'def-inflection', 'thm-monotonicity']
        },
        {
          id: 'thm-concavity-test',
          kind: 'theorem',
          name: '曲线凹凸性的判定定理',
          aka: ['凹凸性判别法', '二阶导数判别凹凸'],
          statement: '设 <code>f(x)</code> 在 <code>[a, b]</code> 上连续，在 <code>(a, b)</code> 内具有一阶和二阶导数。\n① 若在 <code>(a, b)</code> 内 <code>f ′′(x) &gt; 0</code>，则 <code>f(x)</code> 在 <code>[a, b]</code> 上的图形是<b>凹的</b>；\n② 若在 <code>(a, b)</code> 内 <code>f ′′(x) &lt; 0</code>，则 <code>f(x)</code> 在 <code>[a, b]</code> 上的图形是<b>凸的</b>。',
          plain: '一阶导数管"涨还是跌"，二阶导数管"涨跌的势头是在加快还是在放慢"。\n<b>二阶导数为正</b>表示斜率一直在变大——曲线是"越走越陡"地往上翘，像碗口朝上的碗，这就是凹。<b>二阶导数为负</b>表示斜率一直在变小——曲线"越走越平"地往下弯，像伞面，这就是凸。\n生活里的例子：驾驶时速度在增加，你的后背会被座椅推着——这就是"凹"；速度在减少，你会往前倾——这就是"凸"。',
          why: '<b>怎么证明？</b>思路是把凹凸的定义式拆成"两点之差"，再用两次拉格朗日中值定理。<b>关键技巧是引入中点 <code>x<sub>0</sub> = λx<sub>1</sub> + (1 − λ)x<sub>2</sub></code>，然后把要证的不等式改写成两个差商的大小比较</b>，再各用一次拉格朗日中值定理，把差商换成某个中间点的导数值，最后靠 <code>f ′′</code> 的符号完成比较。\n<b>为什么是二阶导数而不是一阶？</b>因为凹凸描述的是"弯曲的方向"，而方向的变化正是"斜率的变化"，斜率的变化率就是二阶导数。<b>为什么需要二阶导数在区间上存在？</b>因为证明过程中要对 <code>f ′</code> 再用一次中值定理，没有 <code>f ′′</code> 就断档了。',
          proof: '用等价的"中点形式"来证，思路更清楚。命题：若在 <code>(a, b)</code> 内 <code>f ′′(x) &gt; 0</code>，则对任意 <code>x<sub>1</sub> &lt; x<sub>2</sub></code>，<code>f</code> 在 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上为凹。\n第一步，取中点 <code>x<sub>0</sub> = (x<sub>1</sub> + x<sub>2</sub>)/2</code>。要证的不等式（<code>λ = 1/2</code> 的情形）等价于\n<code>f(x<sub>0</sub>) &lt; [f(x<sub>1</sub>) + f(x<sub>2</sub>)]/2</code>，\n移项并整理，它等价于\n<code>[f(x<sub>0</sub>) − f(x<sub>1</sub>)] / (x<sub>0</sub> − x<sub>1</sub>) &lt; [f(x<sub>2</sub>) − f(x<sub>0</sub>)] / (x<sub>2</sub> − x<sub>0</sub>)</code>。\n注意 <code>x<sub>0</sub> − x<sub>1</sub> = x<sub>2</sub> − x<sub>0</sub> &gt; 0</code>，所以两侧分母相同，这个不等式就是"左半段的平均斜率小于右半段的平均斜率"，几何上正是"曲线开口朝上"。\n第二步，对左半段用拉格朗日中值定理：存在 <code>ξ<sub>1</sub> ∈ (x<sub>1</sub>, x<sub>0</sub>)</code> 使\n<code>[f(x<sub>0</sub>) − f(x<sub>1</sub>)] / (x<sub>0</sub> − x<sub>1</sub>) = f ′(ξ<sub>1</sub>)</code>。\n第三步，对右半段用拉格朗日中值定理：存在 <code>ξ<sub>2</sub> ∈ (x<sub>0</sub>, x<sub>2</sub>)</code> 使\n<code>[f(x<sub>2</sub>) − f(x<sub>0</sub>)] / (x<sub>2</sub> − x<sub>0</sub>) = f ′(ξ<sub>2</sub>)</code>。\n第四步，比较两个导数值。显然 <code>ξ<sub>1</sub> &lt; x<sub>0</sub> &lt; ξ<sub>2</sub></code>。对函数 <code>f ′</code> 在区间 <code>[ξ<sub>1</sub>, ξ<sub>2</sub>]</code> 上用拉格朗日中值定理（它满足条件，因为 <code>f ′′</code> 在 <code>(a, b)</code> 内存在），存在 <code>η ∈ (ξ<sub>1</sub>, ξ<sub>2</sub>)</code> 使\n<code>f ′(ξ<sub>2</sub>) − f ′(ξ<sub>1</sub>) = f ′′(η)(ξ<sub>2</sub> − ξ<sub>1</sub>)</code>。\n第五步，判断符号。因为 <code>ξ<sub>2</sub> − ξ<sub>1</sub> &gt; 0</code> 且 <code>f ′′(η) &gt; 0</code>，所以 <code>f ′(ξ<sub>2</sub>) − f ′(ξ<sub>1</sub>) &gt; 0</code>，即 <code>f ′(ξ<sub>1</sub>) &lt; f ′(ξ<sub>2</sub>)</code>。\n第六步，串起来。把二、三、五步合起来得到第一步中的不等式，于是中点形式的不等式成立。\n第七步，从 <code>λ = 1/2</code> 推广到一般 <code>λ ∈ (0, 1)</code>：对任意 <code>λ</code>，把区间 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 反复二等分（二分法逼近），或直接对 <code>x<sub>1</sub></code> 与 <code>λx<sub>1</sub> + (1 − λ)x<sub>2</sub></code> 这一对点套用上面的论证即可；由于 <code>f</code> 连续，取极限后不等式对一切 <code>λ</code> 成立。故 <code>f</code> 在 <code>[x<sub>1</sub>, x<sub>2</sub>]</code> 上为凹。\n② 的不等式反向，把"大于零"改成"小于零"，推理逐字相同。定理证毕。',
          example: '① 判断 <code>f(x) = x<sup>3</sup></code> 的凹凸性。<code>f ′′(x) = 6x</code>，所以 <code>x &lt; 0</code> 时 <code>f ′′ &lt; 0</code>，曲线是凸的；<code>x &gt; 0</code> 时 <code>f ′′ &gt; 0</code>，曲线是凹的；<code>x = 0</code> 处 <code>f ′′ = 0</code>，凹凸性切换，这是一个拐点。\n② 判断 <code>f(x) = x e<sup>−x</sup></code> 的凹凸区间。<code>f ′(x) = e<sup>−x</sup>(1 − x)</code>，<code>f ′′(x) = e<sup>−x</sup>(x − 2)</code>。因为 <code>e<sup>−x</sup> &gt; 0</code> 恒成立，所以 <code>x &lt; 2</code> 时 <code>f ′′ &lt; 0</code>（凸），<code>x &gt; 2</code> 时 <code>f ′′ &gt; 0</code>（凹），拐点在 <code>(2, 2e<sup>−2</sup>)</code>。\n③ 注意 <code>f ′′(x<sub>0</sub>) = 0</code> 不一定产生拐点：<code>f(x) = x<sup>4</sup></code>，<code>f ′′(0) = 0</code>，但 <code>f ′′(x) = 12x<sup>2</sup> ≥ 0</code> 恒非负，曲线在 <code>ℝ</code> 上始终是凹的，<code>x = 0</code> 处没有凹凸性切换。',
          pitfalls: [
            '把凹凸判据的方向记反。可用 <code>f(x) = x<sup>2</sup></code> 当"标准答案"随时校对：它 <code>f ′′ = 2 &gt; 0</code>，是碗口朝上的凹弧。',
            '由 <code>f ′′(x<sub>0</sub>) = 0</code> 直接断言 <code>x<sub>0</sub></code> 是拐点。必须看 <code>f ′′</code> 在该点两侧是否变号，<code>x<sup>4</sup></code> 就是反例。',
            '求凹凸区间时忘记先求定义域，或者漏掉 <code>f ′′</code> 不存在的点。像 <code>f(x) = x<sup>4/3</sup></code> 这类函数，<code>f ′′</code> 在某些点可能不存在，也要作为候选分界点。',
            '把凹凸性与单调性混在一起列出，导致区间划分混乱。建议先列 <code>f ′</code> 的符号表，再单独列 <code>f ′′</code> 的符号表。'
          ],
          tags: ['凹凸性', '二阶导数', '拐点'],
          related: ['def-concavity', 'def-inflection', 'thm-monotonicity', 'thm-lagrange']
        },
        {
          id: 'def-inflection',
          kind: 'definition',
          name: '拐点及其判定',
          aka: ['拐点', 'inflection point', '凹凸分界点'],
          statement: '连续曲线 <code>y = f(x)</code> 上的点 <code>(x<sub>0</sub>, f(x<sub>0</sub>))</code>，若其两侧曲线的凹凸性不同（一侧为凹弧、另一侧为凸弧），则称该点为曲线的<b>拐点</b>。\n拐点的必要条件：若 <code>f(x)</code> 在 <code>x<sub>0</sub></code> 处二阶可导且 <code>(x<sub>0</sub>, f(x<sub>0</sub>))</code> 是拐点，则 <code>f ′′(x<sub>0</sub>) = 0</code>。\n判断方法：设 <code>f ′′</code> 在 <code>x<sub>0</sub></code> 的某去心邻域内存在且 <code>f ′′(x<sub>0</sub>) = 0</code>（或 <code>f ′′</code> 在 <code>x<sub>0</sub></code> 处不存在），若 <code>f ′′</code> 在 <code>x<sub>0</sub></code> 两侧<b>变号</b>，则 <code>(x<sub>0</sub>, f(x<sub>0</sub>))</code> 是拐点；若不变号，则不是拐点。',
          plain: '拐点就是"曲线翻脸的地方"。你沿着曲线走，本来一直是"碗口朝上"的走势，走到某一点忽然改成"碗口朝下"，那一点就是拐点。\n山路上的比喻：一边是上坡越走越陡，翻过某个点后变成上坡越走越缓，虽然你没停下来也没有往下走，但"用力的感觉"变了——这一处就是拐点。<b>注意拐点必须写成"点"<code>(x<sub>0</sub>, f(x<sub>0</sub>))</code>，不能只写横坐标 <code>x<sub>0</sub></code>。</b>',
          why: '拐点的判定逻辑是"先找嫌疑人，再逐个审讯"。\n<b>找嫌疑人</b>：凹凸性要变，二阶导数一般得先经过零（或不存在）。理由和费马引理一个套路：若 <code>f ′′</code> 在某点两侧符号不同且该点处 <code>f ′′</code> 连续，那么在这点上 <code>f ′′</code> 只能等于零——不然它会保持符号，就没法变号。<b>但请注意这只是必要条件，不是充分条件。</b>\n<b>逐个审讯</b>：算出所有 <code>f ′′ = 0</code> 和 <code>f ′′</code> 不存在的点，把定义域切开，然后逐个看 <code>f ′′</code> 在两侧的符号。<b>只有真切变号了，才是拐点。</b>\n经典反例是 <code>f(x) = x<sup>4</sup></code>：<code>f ′′(0) = 0</code> 但它两侧 <code>f ′′ &gt; 0</code>，符号没变，所以原点是"凹弧中的一段最平处"，不是拐点。',
          example: '求 <code>f(x) = x<sup>3</sup> − 3x<sup>2</sup> + 1</code> 的拐点。\n① 求二阶导：<code>f ′(x) = 3x<sup>2</sup> − 6x</code>，<code>f ′′(x) = 6x − 6</code>。\n② 求零点：令 <code>6x − 6 = 0</code> 得 <code>x = 1</code>。\n③ 判号：<code>x &lt; 1</code> 时 <code>f ′′ &lt; 0</code>（凸），<code>x &gt; 1</code> 时 <code>f ′′ &gt; 0</code>（凹），两侧变号。\n④ 结论：<code>(1, f(1)) = (1, −1)</code> 是拐点。\n<b>对比反例</b>：<code>f(x) = x<sup>4</sup></code>，<code>f ′′(x) = 12x<sup>2</sup></code>，<code>f ′′(0) = 0</code>，但两侧 <code>f ′′ &gt; 0</code> 不变号，所以 <code>(0, 0)</code> 不是拐点，整条曲线在 <code>ℝ</code> 上都是凹的。\n<b>再看一个二阶导数不存在的例子</b>：<code>f(x) = x<sup>1/3</sup></code>（即 <code>∛x</code>）。可以算出 <code>x ≠ 0</code> 时 <code>f ′′(x) = −2/(9 x<sup>5/3</sup>)</code>，<code>x &lt; 0</code> 时 <code>f ′′ &gt; 0</code>（凹），<code>x &gt; 0</code> 时 <code>f ′′ &lt; 0</code>（凸），而 <code>f ′′</code> 在 <code>x = 0</code> 处不存在。但两侧符号变了，所以 <code>(0, 0)</code> 确实是拐点。这说明<b>"候选点"里必须包含二阶导数不存在的点</b>。',
          pitfalls: [
            '把拐点写成横坐标 <code>x = 1</code> 而不是点 <code>(1, −1)</code>。拐点是曲线上的一个点，要写纵坐标。',
            '只找 <code>f ′′(x) = 0</code> 的点，漏掉 <code>f ′′</code> 不存在的点（如 <code>x<sup>1/3</sup></code> 的 <code>x = 0</code>）。',
            '不检验变号，直接由 <code>f ′′(x<sub>0</sub>) = 0</code> 宣布拐点，忽略 <code>x<sup>4</sup></code> 这类反例。',
            '把"极值点"和"拐点"混为一谈。它们之间没有必然联系，四个组合都有例子：<code>y = x<sup>3</sup></code> 在原点有拐点但无极值（<code>f ′</code> 不变号）；<code>y = x<sup>4</sup></code> 在原点有极小值但没有拐点（<code>f ′′</code> 不变号）；<code>y = x<sup>3</sup> − 3x</code> 在 <code>x = ±1</code> 有极值，而它的拐点在 <code>x = 0</code> 处，两者互不重合；<code>y = |x|</code> 在原点有极值却连导数都没有，更谈不上二阶导数变号。'
          ],
          tags: ['拐点', '凹凸性', '二阶导数'],
          related: ['thm-concavity-test', 'def-concavity', 'thm-extremum-second']
        }
      ]
    },
    {
      id: 'ch3-5',
      no: '3.5',
      title: '函数的极值与最大值最小值',
      summary: '两个充分条件帮你从"导数为零的候选点"里挑出真正的极值点，整套流程的终点是求实际问题的最大最小值。',
      items: [
        {
          id: 'thm-extremum-first',
          kind: 'theorem',
          name: '极值的第一充分条件',
          aka: ['一阶导数判别法', '极值第一判别法'],
          statement: '设函数 <code>f(x)</code> 在点 <code>x<sub>0</sub></code> 处连续，且在 <code>x<sub>0</sub></code> 的某去心邻域 <code>U°(x<sub>0</sub>, δ)</code> 内可导。\n① 若 <code>x ∈ (x<sub>0</sub> − δ, x<sub>0</sub>)</code> 时 <code>f ′(x) &gt; 0</code>，而 <code>x ∈ (x<sub>0</sub>, x<sub>0</sub> + δ)</code> 时 <code>f ′(x) &lt; 0</code>，则 <code>f(x<sub>0</sub>)</code> 是<b>极大值</b>；\n② 若左侧 <code>f ′(x) &lt; 0</code> 而右侧 <code>f ′(x) &gt; 0</code>，则 <code>f(x<sub>0</sub>)</code> 是<b>极小值</b>；\n③ 若 <code>f ′</code> 在 <code>x<sub>0</sub></code> 两侧符号相同，则 <code>f(x<sub>0</sub>)</code> 不是极值。',
          plain: '想象你爬山。<b>先上坡后下坡</b>，那中间那个转折点就是山顶，是极大值；<b>先下坡后上坡</b>，那转折点就是谷底，是极小值；如果<b>一路都是上坡</b>（只是中间有个瞬间变平），那你根本没到顶，那里什么都不是。\n这个判据的优点是"什么都能判"——<b>即使 <code>x<sub>0</sub></code> 处不可导（尖点、折角）也能用</b>，只要有符号变化就行。',
          why: '<b>为什么符号一变就是极值？</b>因为符号变化直接给出了"局部最值"的证据：左侧 <code>f ′ &gt; 0</code> 说明 <code>f</code> 在 <code>x<sub>0</sub></code> 左边一路递增，所以左边的值都小于 <code>f(x<sub>0</sub>)</code>；右侧 <code>f ′ &lt; 0</code> 说明右边一路递减，右边的值也都小于 <code>f(x<sub>0</sub>)</code>。左右都低，中间自然最高。\n<b>注意这里只要求"连续 + 去心邻域内可导"，不要求 <code>x<sub>0</sub></code> 处可导</b>，这正是它比第二充分条件更强大的地方：<code>f(x) = |x|</code> 在 <code>x = 0</code> 处不可导，但左侧 <code>f ′ = −1 &lt; 0</code>、右侧 <code>f ′ = 1 &gt; 0</code>，第一充分条件照样判定它是极小值点。<b>而第二充分条件对这种情况完全无能为力</b>，因为那里 <code>f ′(x<sub>0</sub>)</code> 都不存在。',
          proof: '先证 ①（先增后减，<code>x<sub>0</sub></code> 为极大值点）。\n第一步，任取 <code>x<sub>1</sub> ∈ (x<sub>0</sub> − δ, x<sub>0</sub>)</code>。因为 <code>f</code> 在 <code>[x<sub>1</sub>, x<sub>0</sub>]</code> 上连续、在 <code>(x<sub>1</sub>, x<sub>0</sub>)</code> 内可导，且其中 <code>f ′ &gt; 0</code>，由单调性判定定理，<code>f</code> 在 <code>[x<sub>1</sub>, x<sub>0</sub>]</code> 上单调增加，于是\n<code>f(x<sub>1</sub>) &lt; f(x<sub>0</sub>)</code>。\n第二步，任取 <code>x<sub>2</sub> ∈ (x<sub>0</sub>, x<sub>0</sub> + δ)</code>。同理，<code>f</code> 在 <code>[x<sub>0</sub>, x<sub>2</sub>]</code> 上连续、在 <code>(x<sub>0</sub>, x<sub>2</sub>)</code> 内 <code>f ′ &lt; 0</code>，故 <code>f</code> 在 <code>[x<sub>0</sub>, x<sub>2</sub>]</code> 上单调减少，于是\n<code>f(x<sub>2</sub>) &lt; f(x<sub>0</sub>)</code>。\n第三步，合并。把两步合起来，对一切 <code>x ∈ U°(x<sub>0</sub>, δ)</code> 都有 <code>f(x) &lt; f(x<sub>0</sub>)</code>（<code>x ≠ x<sub>0</sub></code> 时严格小于）。这正是"<code>f(x<sub>0</sub>)</code> 是极大值"的定义。\n② 的证明把两个不等号方向全部反过来，得 <code>f(x) &gt; f(x<sub>0</sub>)</code>，即极小值。\n③ 若两侧同号（不妨都为正），则 <code>f</code> 在 <code>U°(x<sub>0</sub>, δ)</code> 内单调增加。于是 <code>x &lt; x<sub>0</sub></code> 时 <code>f(x) &lt; f(x<sub>0</sub>)</code>，<code>x &gt; x<sub>0</sub></code> 时 <code>f(x) &gt; f(x<sub>0</sub>)</code>：左右两侧一个高一个低，<code>x<sub>0</sub></code> 附近既有比 <code>f(x<sub>0</sub>)</code> 大的值也有比它小的值，故不是极值。定理证毕。',
          example: '求 <code>f(x) = x<sup>3</sup> − 3x</code> 的极值。\n① 求导并找驻点：<code>f ′(x) = 3(x<sup>2</sup> − 1) = 3(x − 1)(x + 1)</code>，驻点为 <code>x = ±1</code>。\n② 判号列表：<code>(−∞, −1)</code> 上 <code>f ′ &gt; 0</code>；<code>(−1, 1)</code> 上 <code>f ′ &lt; 0</code>；<code>(1, +∞)</code> 上 <code>f ′ &gt; 0</code>。\n③ 结论：<code>x = −1</code> 处先增后减，取极大值 <code>f(−1) = −1 + 3 = 2</code>；<code>x = 1</code> 处先减后增，取极小值 <code>f(1) = 1 − 3 = −2</code>。\n<b>再看它处理不可导点的威力</b>：<code>f(x) = x<sup>2/3</sup></code> 在 <code>ℝ</code> 上连续。当 <code>x ≠ 0</code> 时 <code>f ′(x) = 2/(3 x<sup>1/3</sup>)</code>，所以 <code>x &lt; 0</code> 时 <code>f ′ &lt; 0</code>、<code>x &gt; 0</code> 时 <code>f ′ &gt; 0</code>，符号变号，故 <code>x = 0</code> 是极小值点，极小值 <code>f(0) = 0</code>。注意 <code>x = 0</code> 处导数不存在，第二充分条件用不上，但第一充分条件照样管用。',
          pitfalls: [
            '只对"驻点"（<code>f ′ = 0</code> 的点）用第一充分条件，漏掉"连续但不可导"的点。<b>求极值的候选点有两类：驻点和不可导点。</b>',
            '符号表列错方向，比如把 <code>(x − 1)</code> 的符号搞反，导致把极大值判成极小值。建议逐个因子判断符号再相乘。',
            '忘记验证 <code>f</code> 在 <code>x<sub>0</sub></code> 处连续。若函数在 <code>x<sub>0</sub></code> 处有间断，符号变化也说明不了什么。',
            '答极值时只写"<code>x = 1</code> 是极小值点"却不写极小值是多少。题目通常两样都要。'
          ],
          tags: ['极值', '第一充分条件', '导数应用'],
          related: ['thm-monotonicity', 'thm-fermat', 'thm-extremum-second', 'def-extremum-local-global']
        },
        {
          id: 'thm-extremum-second',
          kind: 'theorem',
          name: '极值的第二充分条件',
          aka: ['二阶导数判别法', '极值第二判别法'],
          statement: '设函数 <code>f(x)</code> 在点 <code>x<sub>0</sub></code> 处具有二阶导数，且\n<code>f ′(x<sub>0</sub>) = 0</code>，<code>f ′′(x<sub>0</sub>) ≠ 0</code>，\n则\n① 当 <code>f ′′(x<sub>0</sub>) &lt; 0</code> 时，<code>f(x<sub>0</sub>)</code> 是<b>极大值</b>；\n② 当 <code>f ′′(x<sub>0</sub>) &gt; 0</code> 时，<code>f(x<sub>0</sub>)</code> 是<b>极小值</b>。\n（若 <code>f ′′(x<sub>0</sub>) = 0</code>，本条件失效，需改用第一充分条件。）',
          plain: '驻点就像"车速表归零的瞬间"。这时你想知道自己是到了山顶还是谷底，就看<b>加速度的方向</b>：<code>f ′′ &lt; 0</code> 表示你正在"刹车"（速度从正的往负的走），说明刚才是在往上冲，现在已经冲过头了——那是<b>山顶</b>；<code>f ′′ &gt; 0</code> 表示你正在"踩油门"（速度从负的往正的走），说明刚才是在往下滑，现在开始回升——那是<b>谷底</b>。\n如果加速度也是 <code>0</code>，那就说不准了，得回去看一阶导数的符号。',
          why: '<b>为什么看二阶导的符号就够了？</b>因为 <code>f ′′(x<sub>0</sub>) ≠ 0</code> 保证了 <code>f ′</code> 在 <code>x<sub>0</sub></code> 附近<b>严格单调</b>，而 <code>f ′(x<sub>0</sub>) = 0</code>，所以 <code>f ′</code> 在 <code>x<sub>0</sub></code> 两侧必然一正一负——这正好凑齐了第一充分条件的要求。<b>换句话说，第二充分条件是第一充分条件的"加速版"：用一次求导代替了画符号表。</b>\n<b>为什么必须 <code>f ′′(x<sub>0</sub>) ≠ 0</code>？</b>因为一旦等于零，上面那句"<code>f ′</code> 严格单调"就断了。反例有两个方向：<code>f(x) = x<sup>3</sup></code> 在 <code>x = 0</code> 处 <code>f ′ = f ′′ = 0</code>，没有极值；<code>f(x) = x<sup>4</sup></code> 在 <code>x = 0</code> 处同样 <code>f ′ = f ′′ = 0</code>，却有极小值。<b>同样都是二阶导为零，一个有一个没有，所以这个条件确实"失效"而不是"否定"。</b>',
          proof: '只证 ②（<code>f ′′(x<sub>0</sub>) &gt; 0</code>，极小值），①完全对称。\n第一步，把二阶导数写成极限。<code>f ′(x<sub>0</sub>) = 0</code>，所以\n<code>f ′′(x<sub>0</sub>) = lim<sub>x→x<sub>0</sub></sub> [f ′(x) − f ′(x<sub>0</sub>)] / (x − x<sub>0</sub>) = lim<sub>x→x<sub>0</sub></sub> f ′(x) / (x − x<sub>0</sub>)</code>。\n第二步，用保号性。已知这个极限等于一个正数 <code>f ′′(x<sub>0</sub>) &gt; 0</code>，由极限的保号性，存在 <code>δ &gt; 0</code>，使当 <code>0 &lt; |x − x<sub>0</sub>| &lt; δ</code> 时\n<code>f ′(x) / (x − x<sub>0</sub>) &gt; 0</code>。\n第三步，分两侧读符号。分母 <code>x − x<sub>0</sub></code> 的符号决定商的符号：\n当 <code>x<sub>0</sub> − δ &lt; x &lt; x<sub>0</sub></code> 时 <code>x − x<sub>0</sub> &lt; 0</code>，商为正意味着分子 <code>f ′(x) &lt; 0</code>；\n当 <code>x<sub>0</sub> &lt; x &lt; x<sub>0</sub> + δ</code> 时 <code>x − x<sub>0</sub> &gt; 0</code>，商为正意味着分子 <code>f ′(x) &gt; 0</code>。\n第四步，套用第一充分条件。<code>f ′</code> 在 <code>x<sub>0</sub></code> 左侧为负、右侧为正，即先减后增，由极值第一充分条件，<code>f(x<sub>0</sub>)</code> 是极小值。\n① 的证明只需把第二步的"正"改成"负"，第三步的符号随之全部反向，得到先增后减，即极大值。定理证毕。',
          example: '求 <code>f(x) = x<sup>3</sup> − 3x</code> 的极值（与第一充分条件对照）。\n① <code>f ′(x) = 3x<sup>2</sup> − 3</code>，驻点 <code>x = ±1</code>。\n② <code>f ′′(x) = 6x</code>。<code>f ′′(−1) = −6 &lt; 0</code>，故 <code>x = −1</code> 是极大值点，极大值 <code>f(−1) = 2</code>；<code>f ′′(1) = 6 &gt; 0</code>，故 <code>x = 1</code> 是极小值点，极小值 <code>f(1) = −2</code>。\n结论与第一充分条件完全一致，但计算量小得多。\n<b>两个"失效"的例子必须记牢</b>：<code>f(x) = x<sup>3</sup></code>，<code>f ′(0) = 0</code>、<code>f ′′(0) = 0</code>，此时要看符号表（<code>f ′ = 3x<sup>2</sup> ≥ 0</code> 不变号），结论是<b>无极值</b>；<code>f(x) = x<sup>4</sup></code>，同样 <code>f ′(0) = f ′′(0) = 0</code>，看符号表（<code>f ′ = 4x<sup>3</sup></code> 左负右正）得<b>极小值 <code>f(0) = 0</code></b>。',
          pitfalls: [
            '在 <code>f ′′(x<sub>0</sub>) = 0</code> 时仍然下结论说"不是极值"。此时条件失效，必须回到第一充分条件去看符号，<code>x<sup>4</sup></code> 就是有极小值的例子。',
            '不先验证 <code>f ′(x<sub>0</sub>) = 0</code> 就用第二充分条件。这个条件的前提是 <code>x<sub>0</sub></code> 为驻点，否则 <code>f ′′</code> 的符号毫无意义。',
            '对不可导点硬用第二充分条件。例如 <code>f(x) = |x|</code> 或 <code>x<sup>2/3</sup></code> 在 <code>x = 0</code> 处，只能靠第一充分条件（或定义）判断。',
            '符号方向记反。口诀：<b>二阶导为负，曲线凸（伞形），取极大；二阶导为正，曲线凹（碗形），取极小</b>——碗底当然是极小值。'
          ],
          tags: ['极值', '第二充分条件', '二阶导数'],
          related: ['thm-extremum-first', 'thm-concavity-test', 'thm-fermat', 'def-inflection']
        },
        {
          id: 'proc-max-min',
          kind: 'note',
          name: '求最大值与最小值的完整流程',
          aka: ['最值求法', '闭区间最值步骤', '实际问题最值'],
          statement: '求连续函数 <code>f(x)</code> 在闭区间 <code>[a, b]</code> 上的最大值与最小值的步骤：\n① 求出 <code>f(x)</code> 在 <code>(a, b)</code> 内的全部<b>驻点</b>（<code>f ′(x) = 0</code> 的点）与<b>不可导点</b>，记为 <code>x<sub>1</sub>, x<sub>2</sub>, …, x<sub>k</sub></code>；\n② 计算这些点的函数值 <code>f(x<sub>1</sub>), …, f(x<sub>k</sub>)</code> 以及两个端点值 <code>f(a)</code>、<code>f(b)</code>；\n③ 把这 <code>k + 2</code> 个数放在一起比大小，最大者即为最大值，最小者即为最小值。\n<b>特殊情况</b>：若 <code>f(x)</code> 在 <code>[a, b]</code> 上单调，则最值直接在端点取到。\n<b>实际问题</b>：若目标函数在区间内<b>只有一个驻点</b>，且由问题实际意义可知最值一定在区间内部取得，则该驻点处的函数值就是所求的最值，无需再与端点比较。',
          plain: '这就像评"全班最高分"。你不能只看几个平时成绩好的同学（驻点），还得把两个"插班生"（端点）也算进来一起比，因为最高分完全可能出现在端点。<b>宁可多算几个数，也不要漏掉端点。</b>\n实际问题的简化版更实用：如果实在想不出哪里有坑，而且问题本身就保证"最优点一定在中间某处"，那唯一的驻点就是答案——这叫"实际意义帮你排除边界"。',
          why: '为什么要先找出"驻点 + 不可导点"？因为由费马引理，<b>内部的极值点只可能出现在这两类点上</b>（可导的极值点导数必为零，不可导的点单独考虑）。而最大值如果不在端点取到，它一定是某个内部极值，所以候选名单就是"这两类点 + 两个端点"，一个也不能少。\n<b>为什么实际问题不需要检验端点？</b>举一个例子：用一根长 <code>L</code> 的铁丝围一个矩形，问面积最大是多少。设一边为 <code>x</code>，则面积 <code>A(x) = x(L/2 − x)</code>，其中 <code>0 &lt; x &lt; L/2</code>。当 <code>x → 0<sup>+</sup></code> 或 <code>x → (L/2)<sup>−</sup></code> 时面积趋于 <code>0</code>，显然不是最大。<b>既然最大值一定存在（连续函数在有界闭区间上），又不可能在两端取到，那它只能在里面那个唯一的驻点取到。</b>这就是"实际问题免检端点"的逻辑。',
          example: '求 <code>f(x) = x<sup>3</sup> − 3x + 3</code> 在 <code>[−1, 2]</code> 上的最大值与最小值。\n① 求导数并找候选点：<code>f ′(x) = 3x<sup>2</sup> − 3 = 3(x − 1)(x + 1)</code>，在 <code>(−1, 2)</code> 内的驻点只有 <code>x = 1</code>（<code>x = −1</code> 是端点）。函数处处可导，没有不可导点。\n② 算函数值：<code>f(−1) = −1 + 3 + 3 = 5</code>；<code>f(1) = 1 − 3 + 3 = 1</code>；<code>f(2) = 8 − 6 + 3 = 5</code>。\n③ 比大小：最大值 <code>5</code>（在 <code>x = −1</code> 与 <code>x = 2</code> 处取到），最小值 <code>1</code>（在 <code>x = 1</code> 处取到）。\n<b>常见的实际问题——造盒子</b>：用边长 <code>12</code> 的正方形铁皮四角各剪去边长为 <code>x</code> 的小正方形，折成一个无盖盒子，求体积最大时的 <code>x</code>。<code>V(x) = x(12 − 2x)<sup>2</sup></code>，<code>0 &lt; x &lt; 6</code>。求导得 <code>V ′(x) = (12 − 2x)(12 − 6x)</code>，在区间内唯一驻点为 <code>x = 2</code>。由实际意义，最大体积必在内部取到，故 <code>x = 2</code> 即所求，此时 <code>V(2) = 2 × 8<sup>2</sup> = 128</code>。',
          pitfalls: [
            '漏掉端点。很多同学算完驻点就直接宣布"这就是最大值"，而真实最大值可能在端点。',
            '漏掉不可导点。理科题里常出现含 <code>|x − 1|</code> 或 <code>x<sup>2/3</sup></code> 的函数，必须把不可导点也列进去。',
            '在开区间上直接说"最大值在端点取到"。开区间上端点根本取不到，此时要退回去讨论单调性或极限。',
            '实际问题里忘记写出变量的取值范围（如 <code>0 &lt; x &lt; 6</code>），导致驻点选错，或者选了一个在实际中毫无意义的解。',
            '把"最大值"与"极大值"混淆：极大值可以有多个，也可以小于某个极小值；最大值是唯一的（虽然可能在多个点上取到）。'
          ],
          tags: ['最值', '极值', '应用问题'],
          related: ['def-extremum-local-global', 'thm-extremum-first', 'thm-extremum-second', 'thm-extreme-value-ch3']
        }
      ]
    },
    {
      id: 'ch3-6',
      no: '3.6',
      title: '函数图形的描绘',
      summary: '把前三节的工具串成一套画图流程：定义域、奇偶周期、截距、单调极值、凹凸拐点、渐近线，最后连成曲线。',
      items: [
        {
          id: 'def-asymptote',
          kind: 'definition',
          name: '渐近线（水平、铅直、斜渐近线）',
          aka: ['渐近线', '水平渐近线', '铅直渐近线', '斜渐近线'],
          statement: '① <b>水平渐近线</b>：若 <code>lim<sub>x→+∞</sub> f(x) = b</code> 或 <code>lim<sub>x→−∞</sub> f(x) = b</code>（<code>b</code> 为常数），则直线 <code>y = b</code> 是曲线 <code>y = f(x)</code> 的水平渐近线。\n② <b>铅直渐近线</b>：若 <code>lim<sub>x→x<sub>0</sub></sub> f(x) = ∞</code>（<code>x<sub>0</sub></code> 可为单侧极限），则直线 <code>x = x<sub>0</sub></code> 是曲线的铅直渐近线。\n③ <b>斜渐近线</b>：若\n<code>lim<sub>x→∞</sub> f(x)/x = k</code>（<code>k ≠ 0</code>），且 <code>lim<sub>x→∞</sub> [f(x) − kx] = b</code>，\n则直线 <code>y = kx + b</code> 是曲线的斜渐近线。求 <code>k</code> 与 <code>b</code> 必须按这个<b>先后顺序</b>进行。',
          plain: '渐近线是曲线的"远方参考资料"。\n<b>水平渐近线</b>：曲线越走越远，最后趴到一条水平线上不动了，像飞机降落前慢慢贴住跑道。\n<b>铅直渐近线</b>：曲线在某处"炸掉"冲向高空，那一列竖线就是它。想象 <code>y = 1/x</code> 在 <code>x = 0</code> 附近的样子——两边都冲向无穷，中间那条 <code>y</code> 轴就是它永远够不到的墙。\n<b>斜渐近线</b>：曲线既不趴平也不竖直，而是越走越像一条斜着放的直线。像高铁进站前的轨道，远远看它跟某条直线几乎重合。',
          why: '<b>为什么水平渐近线要算两次极限（<code>x → +∞</code> 和 <code>x → −∞</code>）？</b>因为曲线两头可以去往不同的高度。例如 <code>f(x) = arctan x</code>，左端趋于 <code>−π/2</code>、右端趋于 <code>π/2</code>，所以它有 <b>两条</b>水平渐近线。只算一半会漏。<b>另外，同一侧不可能同时有水平渐近线和斜渐近线</b>：若 <code>y = b</code> 是水平渐近线，则 <code>f(x)/x → 0</code>，斜渐近线的 <code>k</code> 必为 <code>0</code>，与 <code>k ≠ 0</code> 矛盾。<b>所以两者是互斥的，先算水平更省事。</b>\n<b>斜渐近线为什么要先 <code>k</code> 后 <code>b</code>？</b>因为斜率没定下来，截距无从谈起。<code>k = lim f(x)/x</code> 是在问"曲线大致朝哪个方向跑"，方向定了，<code>b = lim [f(x) − kx]</code> 才是在问"这条平行线该往哪平移"。顺序颠倒会算不出结果。\n<b>为什么 <code>k ≠ 0</code>？</b>因为 <code>k = 0</code> 时 <code>y = b</code> 就是水平渐近线了，那是另一种情况，不应混入斜渐近线的定义。',
          example: '① 求 <code>f(x) = (x<sup>2</sup> + 1)/x</code> 的全部渐近线。\n先看铅直：<code>lim<sub>x→0</sub> (x<sup>2</sup> + 1)/x = ∞</code>，所以 <code>x = 0</code> 是铅直渐近线。\n再看水平：<code>lim<sub>x→±∞</sub> (x<sup>2</sup> + 1)/x = ±∞</code>，没有水平渐近线。\n最后看斜：<code>k = lim (x<sup>2</sup> + 1)/x<sup>2</sup> = 1</code>；<code>b = lim [(x<sup>2</sup> + 1)/x − x] = lim 1/x = 0</code>。所以 <code>y = x</code> 是斜渐近线（左右两侧都是）。\n② <code>f(x) = arctan x</code>：<code>lim<sub>x→+∞</sub> = π/2</code>，<code>lim<sub>x→−∞</sub> = −π/2</code>，故有两条水平渐近线 <code>y = π/2</code> 与 <code>y = −π/2</code>。\n③ <code>f(x) = ln x</code>：<code>lim<sub>x→0<sup>+</sup></sub> ln x = −∞</code>，所以 <code>x = 0</code>（即 <code>y</code> 轴）是铅直渐近线；它没有水平渐近线，也没有斜渐近线（因为 <code>k = lim ln x / x = 0</code>，而 <code>k = 0</code> 不算斜渐近线）。',
          pitfalls: [
            '求铅直渐近线时漏掉"单侧趋于无穷"的情况。例如 <code>f(x) = e<sup>1/x</sup></code> 在 <code>x → 0<sup>+</sup></code> 时趋于 <code>+∞</code>、<code>x → 0<sup>−</sup></code> 时趋于 <code>0</code>，只有一侧炸掉，但 <code>x = 0</code> 仍是铅直渐近线。',
            '只算 <code>x → +∞</code> 一个方向就宣布结论。左右两端要分别讨论，尤其带 <code>arctan</code>、<code>√</code>、<code>e<sup>x</sup></code> 的函数。',
            '求斜渐近线时把 <code>k</code> 和 <code>b</code> 的顺序搞反，或者漏算 <code>k</code> 就直接用 <code>b = lim f(x)</code>。',
            '忘记检查 <code>k = 0</code> 的情形，把一个水平渐近线硬说成斜渐近线。',
            '<code>b</code> 存在但 <code>k</code> 不存在时（或 <code>k = ∞</code>）误认为有斜渐近线。两个极限必须都存在才算。'
          ],
          tags: ['渐近线', '函数图形', '极限'],
          related: ['proc-graph', 'thm-lhopital-inf']
        },
        {
          id: 'proc-graph',
          kind: 'note',
          name: '函数图形的描绘步骤',
          aka: ['画图流程', '函数作图', '图形描绘'],
          statement: '描绘函数 <code>y = f(x)</code> 的图形，一般按以下步骤进行：\n① 确定函数的定义域，讨论其奇偶性、周期性；\n② 求出 <code>f ′(x)</code> 与 <code>f ′′(x)</code>，并求出 <code>f ′(x) = 0</code>、<code>f ′′(x) = 0</code> 的点，以及 <code>f ′</code>、<code>f ′′</code> 不存在的点；\n③ 用这些点把定义域分成若干区间，列表讨论 <code>f ′</code>、<code>f ′′</code> 的符号，确定单调区间、极值、凹凸区间与拐点；\n④ 求曲线的渐近线（水平、铅直、斜渐近线）；\n⑤ 计算若干关键点的坐标（与坐标轴的交点、极值点、拐点等），必要时补充几个辅助点；\n⑥ 在坐标系中描出这些点，按各区间上的单调性与凹凸性连成光滑曲线。',
          plain: '画函数图像就像给一个人画速写，分了六个"关键信息"：<b>他能活动到哪些地方</b>（定义域）、<b>有没有对称的习惯</b>（奇偶性）、<b>哪里在上升哪里在下降</b>（单调性）、<b>上升的姿势是越翘越陡还是越走越平</b>（凹凸性）、<b>他跑远了会靠向哪条线</b>（渐近线）、<b>几个标志性的坐标点</b>（截距、极值点、拐点）。\n信息齐了，图像自然就出来了，不需要靠"多试几个点"去猜。',
          why: '为什么一定要列表？因为人的短期记忆装不下"<code>f ′</code> 在第三个区间是正是负"这类信息，而符号表把一维的推理变成了一张两行的小表格，<b>看表就能读出极值和拐点</b>，出错率大幅降低。\n为什么单调性与凹凸性要<b>一起</b>看？因为它们各自只描述曲线的一半特征：单调性说"往哪走"，凹凸性说"怎么弯"。比如同为单调增加的曲线，"越走越陡"（凹）和"越走越平"（凸）的画法完全不同。结合起来，一条曲线在每个小区间上就只有四种基本形态：\n<code>f ′ &gt; 0, f ′′ &gt; 0</code>：上升且越来越陡；\n<code>f ′ &gt; 0, f ′′ &lt; 0</code>：上升但越来越平；\n<code>f ′ &lt; 0, f ′′ &gt; 0</code>：下降且越来越平（趋于水平）；\n<code>f ′ &lt; 0, f ′′ &lt; 0</code>：下降且越来越陡。\n<b>把这四种"笔画"认熟，画图就变成了连线游戏。</b>至于渐近线，它决定了曲线"跑出画面之后长什么样"，是图像完整性的最后一块拼图。',
          example: '描绘 <code>f(x) = x + 1/x</code> 的图形（<code>x ≠ 0</code>）。\n① 定义域 <code>(−∞, 0) ∪ (0, +∞)</code>；它是奇函数（<code>f(−x) = −f(x)</code>），所以只需画 <code>x &gt; 0</code> 的一半再对称过去，没有周期性。\n② 求导：<code>f ′(x) = 1 − 1/x<sup>2</sup></code>，<code>f ′′(x) = 2/x<sup>3</sup></code>。令 <code>f ′ = 0</code> 得 <code>x = ±1</code>；<code>f ′′</code> 永不等于 <code>0</code>，但 <code>x = 0</code> 处两个导数都不存在。\n③ 列表（<code>x &gt; 0</code> 部分）：<code>(0, 1)</code> 上 <code>f ′ &lt; 0</code>（减）、<code>f ′′ &gt; 0</code>（凹）；<code>(1, +∞)</code> 上 <code>f ′ &gt; 0</code>（增）、<code>f ′′ &gt; 0</code>（凹，且越走越陡）。故 <code>x = 1</code> 是极小值点，极小值 <code>f(1) = 2</code>。由奇对称，<code>x = −1</code> 是极大值点，极大值 <code>−2</code>。\n④ 渐近线：<code>lim<sub>x→0<sup>+</sup></sub> (x + 1/x) = +∞</code>，所以 <code>x = 0</code> 是铅直渐近线；<code>k = lim (x + 1/x)/x = 1</code>，<code>b = lim [(x + 1/x) − x] = 0</code>，所以 <code>y = x</code> 是斜渐近线。\n⑤ 关键点：<code>(1, 2)</code>、<code>(−1, −2)</code>，无坐标轴交点。\n⑥ 连线：曲线在 <code>(0, 1)</code> 上从 <code>y</code> 轴旁的高处急速下降，到 <code>(1, 2)</code> 触底后转为上升，并逐渐贴近直线 <code>y = x</code>；另一半由中心对称得到。这是著名的"双钩函数"或"耐克函数"。',
          pitfalls: [
            '不先求定义域就动手。定义域决定了要分成几段讨论，漏掉一段就会画出错误的图。',
            '把 <code>f ′</code> 的符号表和 <code>f ′′</code> 的符号表混在一列里，导致极值与拐点的位置记串。建议列成两行。',
            '只描点连线而不看渐近线，结果图在远处"飞掉了"或者应该贴近某直线却画成了随意延伸。',
            '忘记利用奇偶性减少一半工作量。奇函数关于原点对称，偶函数关于 <code>y</code> 轴对称，都能省一半力气。',
            '把极值点和拐点画错位置，或者忘记在图上标出渐近线是虚线。'
          ],
          tags: ['函数图形', '作图', '单调性', '凹凸性', '渐近线'],
          related: ['def-asymptote', 'thm-monotonicity', 'thm-concavity-test', 'thm-extremum-second', 'def-inflection']
        }
      ]
    },
    {
      id: 'ch3-7',
      no: '3.7',
      title: '曲率',
      summary: '用"转角随弧长的变化率"来量化曲线弯得有多厉害，并由此得到曲率公式与曲率半径。',
      items: [
        {
          id: 'def-curvature',
          kind: 'definition',
          name: '弧微分与曲率',
          aka: ['曲率定义', '平均曲率', '弧微分'],
          statement: '① <b>弧微分</b>：设 <code>y = f(x)</code> 有连续导数，则曲线从定点 <code>M<sub>0</sub></code> 到动点 <code>M</code> 的弧长 <code>s</code> 满足\n<code>ds = √(1 + y ′<sup>2</sup>) dx</code>，即 <code>ds/dx = √(1 + y ′<sup>2</sup>)</code>。\n② <b>曲率</b>：设曲线是光滑的，其上任一点 <code>M</code> 处切线的倾角为 <code>α</code>（<code>α</code> 随弧长 <code>s</code> 变化）。定义\n<code>K = |dα/ds| = lim<sub>Δs→0</sub> |Δα/Δs|</code>，\n称为曲线在点 <code>M</code> 处的<b>曲率</b>。其中 <code>|Δα|</code> 是弧段 <code>Δs</code> 上切线转过的角度，<code>|Δα/Δs|</code> 称为该弧段上的<b>平均曲率</b>。',
          plain: '曲率就是"拐弯有多急"的量化指标。\n开高速时，直线路段方向盘不用动（<code>K = 0</code>）；缓缓的长弯道只需轻轻带一点方向（<code>K</code> 小）；而盘山公路的发卡弯要猛打方向盘（<code>K</code> 大）。\n<b>它的定义方式很讲究：用"方向转了多大角度"除以"你走了多远"。</b>光说转了 <code>30°</code> 是不够的——在十公里长的缓弯上转 <code>30°</code> 叫平缓，在十厘米内转 <code>30°</code> 就叫急转。所以必须除以走过的弧长，把它变成"每走一米的转角"。',
          why: '<b>为什么是"角度"而不是"坐标"？</b>因为弯曲是<b>方向</b>的改变，与坐标系怎么摆无关。用切线倾角 <code>α</code> 描述方向最自然：直线方向不变，<code>dα = 0</code>，曲率为零；圆上每走一段，切线方向就均匀地转一点，于是曲率是常数。<b>这个定义有一个漂亮的验证：对半径为 <code>R</code> 的圆，走完全程 <code>2πR</code> 时方向正好转过 <code>2π</code>，所以 <code>K = 2π/(2πR) = 1/R</code>。</b>半径越小，同样的前进距离要转更多角度，曲率越大——完全符合"小圆更弯"的直觉。\n<b>弧微分 <code>ds = √(1 + y ′<sup>2</sup>) dx</code> 是怎么来的？</b>靠勾股定理：在 <code>x</code> 处取一小段 <code>Δx</code>，对应的高度变化约是 <code>Δy ≈ y ′Δx</code>（这就是微分的线性近似），而斜边长约等于弧长，于是 <code>Δs ≈ √(Δx<sup>2</sup> + Δy<sup>2</sup>) = √(1 + y ′<sup>2</sup>) Δx</code>。取极限就得到 <code>ds</code> 的表达式。<b>"以直代曲"是全部微积分几何应用的总心法。</b>',
          example: '① 直线 <code>y = 2x + 1</code>：切线倾角 <code>α</code> 是常数 <code>arctan 2</code>，<code>dα = 0</code>，所以 <code>K = 0</code>。直线不会弯，符合预期。\n② 圆 <code>x<sup>2</sup> + y<sup>2</sup> = R<sup>2</sup></code>：由上面的分析 <code>K = 1/R</code>，处处相等。半径 <code>R = 2</code> 的圆曲率是 <code>1/2</code>，半径 <code>R = 0.5</code> 的圆曲率是 <code>2</code>，后者确实"弯得多"。\n③ 抛物线 <code>y = x<sup>2</sup></code> 在顶点 <code>x = 0</code> 处：<code>y ′ = 0</code>，由下一节的公式 <code>K = |y ′′|/(1 + y ′<sup>2</sup>)<sup>3/2</sup> = 2/(1 + 0)<sup>3/2</sup> = 2</code>。也就是说，这条抛物线在顶点处"弯得和一个半径 <code>1/2</code> 的圆一样急"。',
          pitfalls: [
            '把曲率理解成"曲线的倾斜程度"。倾斜程度是 <code>y ′</code>，而曲率是 <code>y ′</code> 的<b>变化率</b>。陡峭的直线 <code>y = 100x</code> 倾斜度极大，但曲率为 <code>0</code>。',
            '忘记取绝对值。曲率是"弯曲程度"，是个非负量，<code>dα/ds</code> 可能为负（曲线向右弯或向左弯），但 <code>K ≥ 0</code>。',
            '把平均曲率与曲率混为一谈。<code>|Δα/Δs|</code> 是整段弧的平均值，只有在 <code>Δs → 0</code> 的极限下才是该点的曲率。',
            '误以为"曲率越大曲线越陡"。曲率大只说明转弯急，跟坡度陡不陡没有必然关系。'
          ],
          tags: ['曲率', '弧微分', '几何应用'],
          related: ['thm-curvature-formula', 'def-curvature-circle']
        },
        {
          id: 'thm-curvature-formula',
          kind: 'formula',
          name: '曲率计算公式',
          aka: ['曲率公式', '直角坐标曲率公式', '参数方程曲率公式'],
          statement: '① 若曲线由 <code>y = f(x)</code> 给出，且 <code>f(x)</code> 具有二阶导数，则在点 <code>(x, f(x))</code> 处\n<code>K = |y ′′| / (1 + y ′<sup>2</sup>)<sup>3/2</sup></code>。\n② 若曲线由参数方程 <code>x = φ(t)</code>，<code>y = ψ(t)</code> 给出，且 <code>φ ′(t)</code>、<code>ψ ′(t)</code>、<code>φ ′′(t)</code>、<code>ψ ′′(t)</code> 都存在且 <code>φ ′(t) ≠ 0</code>，则\n<code>K = |φ ′(t)ψ ′′(t) − φ ′′(t)ψ ′(t)| / [φ ′(t)<sup>2</sup> + ψ ′(t)<sup>2</sup>]<sup>3/2</sup></code>。',
          plain: '这个公式看起来吓人，但它其实只是把"转角变化率除以弧长变化率"老老实实算了一遍的结果。\n读法可以分家：<b>分子 <code>|y ′′|</code></b> 是"斜率的改变速度"，代表弯曲的动力；<b>分母 <code>(1 + y ′<sup>2</sup>)<sup>3/2</sup></code></b> 是修正项，用来抵消"因为路走得斜，同样的水平距离实际走的弧长更长"这个偏差。\n当曲线比较平（<code>y ′</code> 接近 <code>0</code>）时，分母约等于 <code>1</code>，曲率约等于 <code>|y ′′|</code>，非常好记。',
          why: '<b>推导的关键一步是"换元"。</b>曲率的定义是 <code>K = |dα/ds|</code>，但我们手里只有 <code>x</code>，所以要用链式法则把它改成对 <code>x</code> 求导：\n<code>dα/ds = (dα/dx) / (ds/dx)</code>。\n<b>分子从哪来？</b>因为切线倾角 <code>α</code> 满足 <code>tan α = y ′</code>。两边对 <code>x</code> 求导（左边要用复合函数求导）得\n<code>sec<sup>2</sup>α · dα/dx = y ′′</code>，于是 <code>dα/dx = y ′′ / sec<sup>2</sup>α = y ′′ cos<sup>2</sup>α</code>。\n再用 <code>cos α = 1/√(1 + tan<sup>2</sup>α) = 1/√(1 + y ′<sup>2</sup>)</code> 代回，得 <code>dα/dx = y ′′ / (1 + y ′<sup>2</sup>)</code>。\n<b>分母从哪来？</b>就是上一节的弧微分 <code>ds/dx = √(1 + y ′<sup>2</sup>)</code>。\n两者一除：<code>dα/ds = [y ′′ / (1 + y ′<sup>2</sup>)] / √(1 + y ′<sup>2</sup>) = y ′′ / (1 + y ′<sup>2</sup>)<sup>3/2</sup></code>。取绝对值即为所求。\n<b>那个 <code>3/2</code> 次方就是这么来的：一个 <code>2</code> 次方来自 <code>sec<sup>2</sup>α</code> 的倒数，一个 <code>1/2</code> 次方来自弧微分。</b>换句话说，公式里每一块都有明确出处，绝不是死记硬背的结果。',
          proof: '第一步，建立 <code>α</code> 与 <code>y ′</code> 的联系。曲线在点 <code>M(x, y)</code> 处切线的倾角 <code>α</code> 满足\n<code>tan α = y ′</code>。\n第二步，两边对 <code>x</code> 求导。左端用复合函数求导法，注意 <code>α</code> 是 <code>x</code> 的函数：\n<code>d/dx (tan α) = sec<sup>2</sup>α · dα/dx</code>；\n右端为 <code>y ′′</code>。于是\n<code>sec<sup>2</sup>α · dα/dx = y ′′</code>，即 <code>dα/dx = y ′′ / sec<sup>2</sup>α = y ′′ cos<sup>2</sup>α</code>。\n第三步，把 <code>cos α</code> 用 <code>y ′</code> 表示。由 <code>1 + tan<sup>2</sup>α = sec<sup>2</sup>α</code> 得\n<code>cos<sup>2</sup>α = 1/(1 + tan<sup>2</sup>α) = 1/(1 + y ′<sup>2</sup>)</code>。\n代入第二步：\n<code>dα/dx = y ′′ · 1/(1 + y ′<sup>2</sup>) = y ′′ / (1 + y ′<sup>2</sup>)</code>。\n第四步，写出弧微分。由定义一节的结果，<code>ds/dx = √(1 + y ′<sup>2</sup>)</code>。\n第五步，用链式法则合并。因为 <code>dα/ds = (dα/dx) · (dx/ds) = (dα/dx) / (ds/dx)</code>，代入第三、四步的结果：\n<code>dα/ds = [y ′′ / (1 + y ′<sup>2</sup>)] / √(1 + y ′<sup>2</sup>) = y ′′ / (1 + y ′<sup>2</sup>)<sup>3/2</sup></code>。\n第六步，取绝对值并写出结论：<code>K = |dα/ds| = |y ′′| / (1 + y ′<sup>2</sup>)<sup>3/2</sup></code>。公式 ① 证毕。\n参数方程的情形（公式 ②）把 <code>y ′ = ψ ′/φ ′</code> 与 <code>y ′′ = (φ ′ψ ′′ − φ ′′ψ ′)/φ ′<sup>3</sup></code> 代入公式 ①，再通分化简即得，此处从略。',
          example: '① 直线 <code>y = kx + b</code>：<code>y ′ = k</code>、<code>y ′′ = 0</code>，故 <code>K = 0</code>，与直觉一致。\n② 抛物线 <code>y = x<sup>2</sup></code>：<code>y ′ = 2x</code>、<code>y ′′ = 2</code>，所以\n<code>K(x) = 2 / (1 + 4x<sup>2</sup>)<sup>3/2</sup></code>。\n在顶点 <code>x = 0</code>：<code>K = 2</code>（最弯）；在 <code>x = 0.5</code>：<code>K = 2/(2)<sup>3/2</sup> = 1/√2 ≈ 0.707</code>；在 <code>x = 1</code>：<code>K = 2/(5)<sup>3/2</sup> ≈ 0.179</code>，越往两边越平缓，趋于 <code>0</code>。这与抛物线"开口后越来越像直线"的印象完全吻合。\n③ 参数方程：圆 <code>x = R cos t</code>，<code>y = R sin t</code>。<code>φ ′ = −R sin t</code>，<code>ψ ′ = R cos t</code>，<code>φ ′′ = −R cos t</code>，<code>ψ ′′ = −R sin t</code>。分子 <code>|φ ′ψ ′′ − φ ′′ψ ′| = |R<sup>2</sup> sin<sup>2</sup>t + R<sup>2</sup> cos<sup>2</sup>t| = R<sup>2</sup></code>；分母 <code>(R<sup>2</sup> sin<sup>2</sup>t + R<sup>2</sup> cos<sup>2</sup>t)<sup>3/2</sup> = R<sup>3</sup></code>。故 <code>K = R<sup>2</sup>/R<sup>3</sup> = 1/R</code>，是常数，验证了圆的曲率结论。',
          pitfalls: [
            '忘记分母。把曲率写成 <code>K = |y ′′|</code>。这对靠近水平位置的曲线还算近似，但对陡峭部分错得离谱。',
            '分母的指数记成 <code>1/2</code> 或 <code>3</code>。正确是 <code>3/2</code>，记法：<b>一个 <code>(1 + y ′<sup>2</sup>)</code> 是完整的，另一个开根号，合起来就是 <code>3/2</code> 次方</b>。',
            '分子忘记加绝对值，导致算出负曲率。',
            '用参数方程公式时漏掉 <code>φ ′(t) ≠ 0</code> 的条件，或者在 <code>φ ′(t) = 0</code> 的点上硬行代入。',
            '把 <code>y ′′</code> 当成"曲率的一半"之类的简化理解，忽略了修正因子在小 <code>y ′</code> 时才近似成立。'
          ],
          tags: ['曲率', '公式', '导数应用'],
          related: ['def-curvature', 'def-curvature-circle']
        },
        {
          id: 'def-curvature-circle',
          kind: 'definition',
          name: '曲率半径与曲率圆',
          aka: ['曲率半径', '曲率圆', '密切圆'],
          statement: '设曲线 <code>y = f(x)</code> 在点 <code>M</code> 处的曲率为 <code>K</code>（<code>K ≠ 0</code>）。令\n<code>ρ = 1/K</code>，\n称 <code>ρ</code> 为曲线在该点处的<b>曲率半径</b>。\n在点 <code>M</code> 处作一个半径为 <code>ρ</code> 的圆，使它与曲线在 <code>M</code> 处有相同的切线、且与曲线在该点附近有相同的凹凸方向（圆心在曲线的凹侧），这个圆称为曲线在点 <code>M</code> 处的<b>曲率圆</b>（又称<b>密切圆</b>），圆心称为<b>曲率中心</b>。\n由公式 ① 可得\n<code>ρ = (1 + y ′<sup>2</sup>)<sup>3/2</sup> / |y ′′|</code>。\n若曲线在某点 <code>K = 0</code>（如直线或拐点处），则该点的曲率半径为无穷大。',
          plain: '曲率半径就是"这一小段曲线，最像多大的圆"。\n弯得很急的地方，最像一个小圆圈，半径小；弯得很缓的地方，最像一个大圆圈，半径大；直线上"最像半径无穷大的圆"——也就是怎么配都不像圆，索性说半径无穷大。\n曲率圆（密切圆）就是那个"贴得最紧的圆"。它比切线更懂这条曲线：<b>切线只跟曲线共用方向和位置（贴一次），而曲率圆连"弯曲程度"都跟曲线一致（贴两次）。</b>',
          why: '<b>为什么要引入曲率半径，而不直接用曲率？</b>因为在工程和物理里，"半径"这个长度量比"曲率"这个倒数角度量更好用。举几个真实场景：\n① <b>道路设计</b>：公路弯道的曲率半径规定了最低值，半径太小司机来不及反应。设计师说的是"这个弯的半径是 <code>200</code> 米"，而不是"曲率是 <code>0.005</code>"。\n② <b>铁路与过山车</b>：列车通过弯道时需要的向心力是 <code>mv<sup>2</sup>/ρ</code>，直接和曲率半径挂钩，<code>ρ</code> 越小乘客越难受。\n③ <b>透镜与光学</b>：透镜两个面的曲率半径直接决定焦距，磨镜片就是磨半径。\n所以在实际语言里，<b>曲率半径才是"人话版"的曲率</b>。而曲率圆的用处在于"局部替代"：在 <code>M</code> 附近，把曲线当成那个圆来处理（比如算局部的向心加速度、做近似），误差是高阶小量。\n<b>为什么要求 <code>K ≠ 0</code>？</b>因为 <code>ρ = 1/K</code> 要做除法。<code>K = 0</code> 的点（直线上的点、拐点处往往如此）没有有限的密切圆，规定 <code>ρ = ∞</code> 正好与"平坦得无法用圆来拟合"的直觉一致。',
          example: '① 求抛物线 <code>y = x<sup>2</sup></code> 在顶点 <code>(0, 0)</code> 处的曲率半径。上一例已算得 <code>K = 2</code>，所以 <code>ρ = 1/2</code>。也就是说，抛物线在顶点处的那一小段，最像一个半径 <code>0.5</code> 的小圆。它的曲率中心在凹侧（上方），坐标为 <code>(0, 1/2)</code>，曲率圆方程是 <code>x<sup>2</sup> + (y − 1/2)<sup>2</sup> = 1/4</code>。\n② 圆 <code>x<sup>2</sup> + y<sup>2</sup> = R<sup>2</sup></code>：处处 <code>K = 1/R</code>，故处处 <code>ρ = R</code>，它的密切圆就是它自己——圆是唯一"处处与自己密切圆重合"的曲线。\n③ 求 <code>y = ln x</code> 在点 <code>(1, 0)</code> 处的曲率半径。<code>y ′ = 1/x</code>，故 <code>y ′(1) = 1</code>；<code>y ′′ = −1/x<sup>2</sup></code>，故 <code>y ′′(1) = −1</code>。于是\n<code>K = |−1| / (1 + 1)<sup>3/2</sup> = 1/(2√2)</code>，<code>ρ = 2√2 ≈ 2.83</code>。\n负号说明曲线在这里是凸的（<code>y ′′ &lt; 0</code>），曲率中心在曲线下方。',
          pitfalls: [
            '把曲率半径当成"曲线到某条渐近线的距离"或"曲线的弧长"，两者毫不相干。',
            '在 <code>K = 0</code> 的点（比如直线上的点、<code>y = x<sup>3</sup></code> 的原点附近某些情形）硬套 <code>ρ = 1/K</code>，得到无意义的 <code>∞</code> 却当作普通数值处理。',
            '忘记曲率中心在曲线的<b>凹侧</b>（即曲线弯向的那一侧）。抛物线 <code>y = x<sup>2</sup></code> 开口向上，曲率中心就在上方而不是下方。',
            '把"密切圆"与"内切圆"混为一谈。密切圆只要求在该点处与曲线有二阶接触（位置、切线方向、凹凸都一致），并不要求在圆内或圆外。',
            '在应用向心力公式 <code>F = mv<sup>2</sup>/ρ</code> 时，误把 <code>ρ</code> 换成曲率 <code>K</code>，写成 <code>F = mv<sup>2</sup>K</code> 是对的方向（因为 <code>1/ρ = K</code>），但若写成 <code>mv<sup>2</sup>ρ</code> 就完全错了。'
          ],
          tags: ['曲率半径', '曲率圆', '几何应用'],
          related: ['def-curvature', 'thm-curvature-formula']
        }
      ]
    },
    {
      id: 'ch3-8',
      no: '3.8',
      title: '方程的近似解',
      summary: '当方程解不出来时，用二分法稳妥地"夹"出近似根，用切线法（牛顿法）快速地"迭代"出近似根。',
      items: [
        {
          id: 'meth-bisection',
          kind: 'theorem',
          name: '二分法求方程的近似解',
          aka: ['二分法', '区间半分法', '夹逼法求根'],
          statement: '设函数 <code>f(x)</code> 在闭区间 <code>[a, b]</code> 上连续，且\n<code>f(a) · f(b) &lt; 0</code>，\n则方程 <code>f(x) = 0</code> 在 <code>(a, b)</code> 内至少有一个实根。\n<b>二分法步骤</b>：\n① 取中点 <code>x<sub>1</sub> = (a + b)/2</code>，计算 <code>f(x<sub>1</sub>)</code>；\n② 若 <code>f(x<sub>1</sub>) = 0</code>，则 <code>x<sub>1</sub></code> 即为所求根；\n③ 若 <code>f(a) · f(x<sub>1</sub>) &lt; 0</code>，则根在 <code>(a, x<sub>1</sub>)</code> 内，令 <code>b ← x<sub>1</sub></code>；否则根在 <code>(x<sub>1</sub>, b)</code> 内，令 <code>a ← x<sub>1</sub></code>；\n④ 重复上述过程，直到区间长度 <code>b − a</code> 小于指定精度 <code>ε</code> 为止。此时可取中点 <code>(a + b)/2</code> 作为根的近似值，且误差不超过 <code>ε/2</code>。',
          plain: '二分法就是"猜数字游戏"里最稳的玩法：心里想一个 <code>1</code> 到 <code>100</code> 之间的数，我猜 <code>50</code>。你说"大了"，我就在 <code>1</code> 到 <code>50</code> 里继续猜 <code>25</code>；你说"小了"，我就在 <code>50</code> 到 <code>100</code> 里猜 <code>75</code>。<b>每猜一次，可能的范围就砍掉一半</b>，最多七次就能猜中。\n它靠的原理很朴素：一个连续函数如果在一端为正、另一端为负，那它从正走到负，中间必然要穿过零——<b>不可能"跳"过去，因为它是连续的。</b>',
          why: '<b>为什么一定存在根？</b>这是介值定理（零点定理）的直接结论：<code>f</code> 在 <code>[a, b]</code> 上连续且两端异号，则必有一点 <code>ξ ∈ (a, b)</code> 使 <code>f(ξ) = 0</code>。直觉上：你要从河的南岸走到北岸，又不许游泳，那必须过桥——那个"桥"就是根。\n<b>为什么二分法这么慢还有人用？</b>因为它有一个别的法子都没有的优点：<b>它只要连续，别的什么都不要求。</b>不需要可导，不需要导数不为零，甚至不需要能写出 <code>f</code> 的表达式（黑箱函数也行）。而且它的误差是<b>可以事前算出来</b>的：经过 <code>n</code> 次二分，区间长度变为 <code>(b − a)/2<sup>n</sup></code>，所以要保证误差小于 <code>ε</code>，只需\n<code>n &gt; log<sub>2</sub>[(b − a)/ε]</code>。\n这就意味着你可以<b>先算好要迭代多少次，再动手</b>——在需要严格保证精度的场合（比如航天器轨道计算、金融定价），这种"可预测性"极其宝贵，比"快但可能不收敛"的方法更受信任。',
          proof: '第一步，确认根的存在性。由 <code>f(a) · f(b) &lt; 0</code>，不妨设 <code>f(a) &lt; 0 &lt; f(b)</code>。因为 <code>f</code> 在 <code>[a, b]</code> 上连续，由介值定理，<code>f</code> 在 <code>[a, b]</code> 上必取到介于 <code>f(a)</code> 与 <code>f(b)</code> 之间的一切值，特别地取到 <code>0</code>，所以存在 <code>ξ ∈ (a, b)</code> 使 <code>f(ξ) = 0</code>。\n第二步，说明每次迭代后"异号"这个性质不变。取 <code>x<sub>1</sub> = (a + b)/2</code>。若 <code>f(x<sub>1</sub>) = 0</code> 则已找到根，结束。否则 <code>f(x<sub>1</sub>)</code> 与 <code>f(a)</code>、<code>f(b)</code> 中必有且仅有一个同号：若 <code>f(a) · f(x<sub>1</sub>) &lt; 0</code>，就取新区间 <code>[a, x<sub>1</sub>]</code>；否则取 <code>[x<sub>1</sub>, b]</code>。无论哪种，新区间的两个端点函数值仍然异号，且新区间仍包含原来的根 <code>ξ</code>（因为它始终在异号区间内）。\n第三步，估计误差。每次迭代区间长度减半。若进行了 <code>n</code> 次，区间 <code>[a<sub>n</sub>, b<sub>n</sub>]</code> 的长度为\n<code>b<sub>n</sub> − a<sub>n</sub> = (b − a)/2<sup>n</sup></code>。\n取近似值 <code>x<sub>n</sub> = (a<sub>n</sub> + b<sub>n</sub>)/2</code>，因为真根 <code>ξ</code> 与 <code>x<sub>n</sub></code> 都在这个区间内，所以\n<code>|x<sub>n</sub> − ξ| ≤ (b<sub>n</sub> − a<sub>n</sub>)/2 = (b − a)/2<sup>n+1</sup></code>。\n第四步，给出停机准则。要求 <code>|x<sub>n</sub> − ξ| &lt; ε</code>，只需 <code>(b − a)/2<sup>n+1</sup> &lt; ε</code>，即 <code>n + 1 &gt; log<sub>2</sub>[(b − a)/ε]</code>。按此确定迭代次数即可。\n<b>注意</b>：由 <code>f(x<sub>1</sub>)</code> 是否为零无法判断根的重数，也无法保证二分法快速逼近——它的收敛速度是固定的"线性收敛"，每步误差只减半，不因函数光滑而加快。',
          example: '求方程 <code>x<sup>3</sup> − x − 1 = 0</code> 在 <code>[1, 2]</code> 内的近似根（精确到 <code>0.01</code>）。\n① 验证异号：<code>f(1) = 1 − 1 − 1 = −1 &lt; 0</code>，<code>f(2) = 8 − 2 − 1 = 5 &gt; 0</code>，且 <code>f</code> 是多项式处处连续，故根存在。\n② 开始二分：\n<code>x<sub>1</sub> = 1.5</code>，<code>f(1.5) = 3.375 − 1.5 − 1 = 0.875 &gt; 0</code>，与 <code>f(1) &lt; 0</code> 异号 → 新区间 <code>[1, 1.5]</code>；\n<code>x<sub>2</sub> = 1.25</code>，<code>f(1.25) = 1.953 − 1.25 − 1 = −0.297 &lt; 0</code>，与 <code>f(1.5) &gt; 0</code> 异号 → 新区间 <code>[1.25, 1.5]</code>；\n<code>x<sub>3</sub> = 1.375</code>，<code>f(1.375) ≈ 2.600 − 1.375 − 1 = 0.225 &gt; 0</code> → 新区间 <code>[1.25, 1.375]</code>；\n<code>x<sub>4</sub> = 1.3125</code>，<code>f ≈ 2.261 − 1.3125 − 1 = −0.052 &lt; 0</code> → 新区间 <code>[1.3125, 1.375]</code>；\n<code>x<sub>5</sub> = 1.34375</code>，<code>f ≈ 2.427 − 1.34375 − 1 = 0.083 &gt; 0</code> → 新区间 <code>[1.3125, 1.34375]</code>；\n<code>x<sub>6</sub> = 1.328125</code>，<code>f ≈ 2.343 − 1.328125 − 1 = 0.015 &gt; 0</code> → 新区间 <code>[1.3125, 1.328125]</code>；\n<code>x<sub>7</sub> = 1.3203125</code>，<code>f ≈ 2.3017 − 1.32031 − 1 = −0.0186 &lt; 0</code> → 新区间 <code>[1.3203125, 1.328125]</code>。\n此时区间长度 <code>≈ 0.0078 &lt; 0.01</code>，取中点 <code>x ≈ 1.324</code>。这个根正是著名的<b>毕生纳数</b>（塑料常数）<code>ρ ≈ 1.3247179…</code>，可见二分法七步才精确到两位小数，确实"稳但不快"。',
          pitfalls: [
            '不先验证 <code>f(a) · f(b) &lt; 0</code> 就开算。如果两端同号，中间可能有偶数个根或者没有根，二分法会跑偏。',
            '在区间内有多个根时不慎"跳根"。二分法只保证收敛到<b>某一个</b>根，不保证是你想要的那个；两个相邻根可能因区间划分不当而被跳过。',
            '把停机条件写成 <code>|f(x<sub>n</sub>)| &lt; ε</code>。函数值小不等于离根近（曲线可能很平），正确的停机条件是<b>区间长度</b>足够小。',
            '误以为二分法需要 <code>f</code> 可导。它只需要连续，这是它最大的优点，别把优点丢掉。',
            '对不连续函数使用二分法。比如 <code>f(x) = 1/x</code> 在 <code>[−1, 1]</code> 上两端异号，但中间没有根（<code>x = 0</code> 处不连续），二分法会无限逼近 <code>0</code> 而永远找不到根。'
          ],
          tags: ['二分法', '近似解', '零点定理', '数值方法'],
          related: ['meth-newton', 'thm-extreme-value-ch3']
        },
        {
          id: 'meth-newton',
          kind: 'theorem',
          name: '切线法（牛顿法）求方程的近似解',
          aka: ['牛顿法', '牛顿迭代法', '切线法', 'Newton-Raphson 方法'],
          statement: '设函数 <code>f(x)</code> 在 <code>[a, b]</code> 上二阶可导，<code>f(a) · f(b) &lt; 0</code>，且 <code>f ′(x)</code> 与 <code>f ′′(x)</code> 在 <code>[a, b]</code> 上均不变号，则方程 <code>f(x) = 0</code> 在 <code>(a, b)</code> 内有唯一实根 <code>ξ</code>，且迭代序列\n<code>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>) / f ′(x<sub>n</sub>)</code>（<code>n = 0, 1, 2, …</code>）\n收敛于 <code>ξ</code>，只要初值 <code>x<sub>0</sub></code> 取在满足 <code>f(x<sub>0</sub>) · f ′′(x<sub>0</sub>) &gt; 0</code> 的那个端点 <code>a</code> 或 <code>b</code> 上。\n（<code>x<sub>0</sub></code> 的这个取法称为<b>切线法的收敛条件</b>：函数值与二阶导数同号的端点保留不动，称为"不变端点"。）',
          plain: '牛顿法只有一个动作：<b>把曲线换成一瞬间的直线，然后看这条直线在哪里碰到横轴。</b>\n具体说：你猜一个起点，在那里画一条切线（这条切线就是曲线此刻的"替身"），算出切线与 <code>x</code> 轴的交点。这个交点多半还不是真根，但它比刚才的点更接近了。于是拿它当下一个起点，重复上述动作。<b>每转一次，误差就按平方级别缩小</b>——这就是它比二分法快得多的原因。\n拿它开平方特别直观：想算 <code>√2</code>，从 <code>1</code> 开始，依次得到 <code>1.5</code>、<code>1.4167</code>、<code>1.414216</code>……三步就到小数点后五位。',
          why: '<b>迭代公式是怎么想出来的？</b>本质上就是"以直代曲"这四个字，加到极致而已。\n曲线难解，直线好解。在点 <code>(x<sub>n</sub>, f(x<sub>n</sub>))</code> 处，曲线 <code>y = f(x)</code> 的切线方程是什么？由点斜式（斜率是 <code>f ′(x<sub>n</sub>)</code>）：\n<code>y − f(x<sub>n</sub>) = f ′(x<sub>n</sub>)(x − x<sub>n</sub>)</code>。\n现在把"求曲线与 <code>x</code> 轴交点"换成"求这条切线与 <code>x</code> 轴交点"——这就是近似。令 <code>y = 0</code>，解出 <code>x</code>：\n<code>−f(x<sub>n</sub>) = f ′(x<sub>n</sub>)(x − x<sub>n</sub>)</code>，即 <code>x = x<sub>n</sub> − f(x<sub>n</sub>)/f ′(x<sub>n</sub>)</code>。\n把这个 <code>x</code> 记为 <code>x<sub>n+1</sub></code>，迭代公式就出来了。<b>没有任何神秘技巧，就是一次线性化。</b>\n<b>为什么要求 <code>f ′</code> 与 <code>f ′′</code> 都不变号？</b>因为要保证切线交点始终落在区间内、始终在根的同一侧，从而迭代序列单调有界地逼近根。具体说：<code>f ′</code> 不变号保证曲线单调，根唯一；<code>f ′′</code> 不变号保证曲线凹凸方向始终不变，切线永远在曲线的同一侧，"贴"着根走而不会甩出去。<b>初值条件 <code>f(x<sub>0</sub>) · f ′′(x<sub>0</sub>) &gt; 0</code> 的作用就是选对那一侧：函数值符号与凹凸方向一致时，切线交点一定落在根与 <code>x<sub>0</sub></code> 之间，不会跑到区间外。</b>\n<b>收敛有多快？</b>泰勒展开一次即可看出：若 <code>x<sub>n</sub></code> 与根的距离是 <code>d</code>，则新误差约为 <code>|f ′′(ξ)|/(2|f ′(ξ)|) · d<sup>2</sup></code>——<b>误差被平方了</b>。这意味着有效数字大约每步翻倍。这就是二次收敛，也是牛顿法在实际计算中如此受欢迎的原因。\n<b>那它有什么风险？</b>如果 <code>f ′(x<sub>n</sub>)</code> 接近 <code>0</code>，公式里的除法会爆炸，迭代可能跳到很远的地方甚至发散。所以牛顿法快但"野"，二分法慢但"乖"。',
          proof: '第一步，推导迭代公式（已在 why 中完成，此处简述）。在点 <code>(x<sub>n</sub>, f(x<sub>n</sub>))</code> 处曲线的切线为\n<code>y = f(x<sub>n</sub>) + f ′(x<sub>n</sub>)(x − x<sub>n</sub>)</code>。\n令 <code>y = 0</code> 解得的 <code>x</code> 记作 <code>x<sub>n+1</sub></code>，即得\n<code>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f ′(x<sub>n</sub>)</code>。\n第二步，说明根的存在唯一性。由 <code>f(a) · f(b) &lt; 0</code> 与 <code>f</code> 连续，介值定理保证根存在。又 <code>f ′</code> 在 <code>[a, b]</code> 上不变号，故 <code>f</code> 在 <code>[a, b]</code> 上严格单调，根唯一。\n第三步，固定符号约定。不妨设 <code>f ′(x) &gt; 0</code> 且 <code>f ′′(x) &gt; 0</code> 于 <code>[a, b]</code>（其余三种情形由对称性同理可得）。此时 <code>f</code> 单调增加、曲线为凹。取初值 <code>x<sub>0</sub> = b</code>（因为 <code>f(b) &gt; 0</code>、<code>f ′′(b) &gt; 0</code>，满足 <code>f(x<sub>0</sub>)f ′′(x<sub>0</sub>) &gt; 0</code>）。\n第四步，用泰勒公式证明 <code>x<sub>1</sub> &gt; ξ</code>。把 <code>f</code> 在 <code>x<sub>0</sub></code> 处按泰勒公式展开到一阶，存在 <code>η</code> 介于 <code>ξ</code> 与 <code>x<sub>0</sub></code> 之间，使\n<code>f(ξ) = f(x<sub>0</sub>) + f ′(x<sub>0</sub>)(ξ − x<sub>0</sub>) + (1/2)f ′′(η)(ξ − x<sub>0</sub>)<sup>2</sup></code>。\n因为 <code>f(ξ) = 0</code>，移项并除以 <code>f ′(x<sub>0</sub>) &gt; 0</code>：\n<code>ξ − x<sub>0</sub> = −f(x<sub>0</sub>)/f ′(x<sub>0</sub>) − (1/2)·f ′′(η)/f ′(x<sub>0</sub>)·(ξ − x<sub>0</sub>)<sup>2</sup></code>。\n再用 <code>x<sub>1</sub> = x<sub>0</sub> − f(x<sub>0</sub>)/f ′(x<sub>0</sub>)</code> 代入左端的 <code>−f(x<sub>0</sub>)/f ′(x<sub>0</sub>)</code>，整理得\n<code>ξ − x<sub>1</sub> = −(1/2)·f ′′(η)/f ′(x<sub>0</sub>)·(ξ − x<sub>0</sub>)<sup>2</sup> &lt; 0</code>，\n其中最后一步用了 <code>f ′′(η) &gt; 0</code>、<code>f ′(x<sub>0</sub>) &gt; 0</code>。于是 <code>ξ &lt; x<sub>1</sub></code>，即第一个近似值在根的右侧。\n第五步，归纳证明单调下降且有下界。重复第四步的论证（把 <code>x<sub>0</sub></code> 换成 <code>x<sub>n</sub></code>，并注意此时仍有 <code>f(x<sub>n</sub>) &gt; 0</code>、<code>f ′(x<sub>n</sub>) &gt; 0</code>），得 <code>ξ &lt; x<sub>n+1</sub> &lt; x<sub>n</sub></code> 对一切 <code>n</code> 成立。\n这说明 <code>{x<sub>n</sub>}</code> 单调减少且有下界 <code>ξ</code>，由单调有界准则，它收敛，设 <code>lim x<sub>n</sub> = L</code>。\n第六步，求极限值。在迭代式两边令 <code>n → ∞</code>。因为 <code>f</code> 与 <code>f ′</code> 连续，且 <code>f ′(L) ≠ 0</code>（<code>f ′</code> 不变号且 <code>f ′(ξ) &gt; 0</code>），得\n<code>L = L − f(L)/f ′(L)</code>，故 <code>f(L) = 0</code>。又根唯一，所以 <code>L = ξ</code>。迭代收敛性证毕。\n<b>误差估计</b>：由第四步的形式可得 <code>|x<sub>n+1</sub> − ξ| ≤ M/(2m) · |x<sub>n</sub> − ξ|<sup>2</sup></code>，其中 <code>m = min|f ′|</code>、<code>M = max|f ′′|</code>。误差被平方，这解释了牛顿法的快速收敛。',
          example: '① 用切线法求 <code>√2</code> 的近似值。取 <code>f(x) = x<sup>2</sup> − 2</code>，则求 <code>f(x) = 0</code> 的正根即求 <code>√2</code>。此时 <code>f ′(x) = 2x</code>，迭代式为\n<code>x<sub>n+1</sub> = x<sub>n</sub> − (x<sub>n</sub><sup>2</sup> − 2)/(2x<sub>n</sub>) = (x<sub>n</sub> + 2/x<sub>n</sub>)/2</code>。\n在 <code>[1, 2]</code> 上 <code>f(1) = −1 &lt; 0</code>、<code>f(2) = 2 &gt; 0</code>，<code>f ′ = 2x &gt; 0</code> 不变号，<code>f ′′ = 2 &gt; 0</code> 不变号，且 <code>f(2)f ′′(2) = 2 · 2 = 4 &gt; 0</code>，故取初值 <code>x<sub>0</sub> = 2</code>。\n<code>x<sub>1</sub> = (2 + 1)/2 = 1.5</code>；\n<code>x<sub>2</sub> = (1.5 + 2/1.5)/2 = (1.5 + 1.3333)/2 ≈ 1.41667</code>；\n<code>x<sub>3</sub> ≈ (1.41667 + 1.41176)/2 ≈ 1.414216</code>。\n真实值 <code>√2 ≈ 1.41421356</code>，<code>x<sub>3</sub></code> 已经有五位有效数字。<b>对比二分法：同样的精度二分法要十几次迭代。</b>这就是二次收敛的威力。\n② 用切线法求方程 <code>x<sup>3</sup> − x − 1 = 0</code> 的根（与二分法同一个方程，可以直接比速度）。<code>f ′(x) = 3x<sup>2</sup> − 1</code>，在 <code>[1, 2]</code> 上 <code>f ′ ≥ f ′(1) = 2 &gt; 0</code>、<code>f ′′ = 6x &gt; 0</code>，都不变号，故根唯一。初值取 <code>x<sub>0</sub> = 2</code>，因为 <code>f(2) = 5 &gt; 0</code> 与 <code>f ′′(2) = 12 &gt; 0</code> 同号，满足切线法的收敛条件。迭代式为\n<code>x<sub>n+1</sub> = x<sub>n</sub> − (x<sub>n</sub><sup>3</sup> − x<sub>n</sub> − 1)/(3x<sub>n</sub><sup>2</sup> − 1)</code>。\n逐次计算：\n<code>x<sub>1</sub> = 2 − 5/11 ≈ 1.545455</code>，此时 <code>f(x<sub>1</sub>) ≈ 1.1458</code>；\n<code>x<sub>2</sub> = 1.545455 − 1.1458/6.1653 ≈ 1.359615</code>，<code>f(x<sub>2</sub>) ≈ 0.1537</code>；\n<code>x<sub>3</sub> ≈ 1.325801</code>，<code>f(x<sub>3</sub>) ≈ 0.0046</code>；\n<code>x<sub>4</sub> ≈ 1.324719</code>，<code>f(x<sub>4</sub>) ≈ 0.0000047</code>；\n<code>x<sub>5</sub> ≈ 1.324718</code>，此时函数值已经在 <code>10<sup>−11</sup></code> 量级，可以停机。\n真根是 <code>ρ ≈ 1.324717957244746</code>（著名的<b>塑料常数</b>）。<b>对比一下：</b>二分法用了七步才把区间缩到 <code>0.0078</code>、精确到两位小数，而切线法五步就精确到小数点后十位以上。这就是"误差每步平方"与"误差每步减半"的差别。\n<b>但也要看到代价：</b>切线法每一步都要算一次导数 <code>f ′</code>，而且必须先确认 <code>f ′</code>、<code>f ′′</code> 不变号才能保证初值选对。<b>如果初值选在 <code>x<sub>0</sub> = 1</code>（<code>f(1) = −1 &lt; 0</code>，与 <code>f ′′(1) = 6 &gt; 0</code> 异号），迭代会先跳到 <code>1 − (−1)/2 = 1.5</code>，然后才回到正常轨道，多绕一步。</b>这说明收敛条件不是"装门面"的摆设。',
          pitfalls: [
            '初值选错。牛顿法只保证"初值足够接近根"时收敛，选不好会收敛到别的根、振荡或者发散。经典反例是 <code>f(x) = x<sup>3</sup> − 2x + 2</code>，从 <code>x<sub>0</sub> = 0</code> 出发会在 <code>0</code> 与 <code>1</code> 之间来回跳动永不收敛。',
            '在 <code>f ′(x<sub>n</sub>) ≈ 0</code> 的地方迭代。切线接近水平时，公式里的除法会给出巨大的 <code>x<sub>n+1</sub></code>，迭代直接飞走。',
            '把牛顿法用在导数不存在或不易计算的函数上。这时应该改用二分法，或者用割线法（用差商代替导数）。',
            '误以为牛顿法一定收敛得比二分法快。它确实在根附近快得多（二次收敛），但若初值差得远，它可能连收敛都做不到，而二分法永远收敛。',
            '迭代终止条件只写"<code>|x<sub>n+1</sub> − x<sub>n</sub>|</code> 很小"却不同时检查 <code>|f(x<sub>n</sub>)|</code>。当函数很平时，两个相邻迭代值可能都很小差异但仍远离真根。'
          ],
          tags: ['牛顿法', '切线法', '近似解', '迭代', '泰勒公式'],
          related: ['meth-bisection', 'thm-taylor', 'def-curvature-circle']
        }
      ]
    }
  ],
};
