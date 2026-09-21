// 同济《高等数学》上册（第八版）· 第2章 导数与微分
export default {
  id: 'ch2',
  no: 2,
  title: '导数与微分',
  intro: '第 1 章我们用极限研究“越来越接近什么”，这一章把极限当作一把尺子，去量“变化得有多快”。导数是瞬时变化率（速度表上那一瞬间的读数），微分是变化量的线性近似（用直尺量弯线，短短一段内误差小到可以忽略）。学会算导数之后，你就能解决求速度、求切线、求最大最小值、估计误差这一大类问题。',
  sections: [
    {
      id: 'ch2-1',
      no: '2.1',
      title: '导数概念',
      summary: '从瞬时速度与切线斜率两个引例抽象出导数定义，并说明导数的几何意义以及可导与连续的关系。',
      items: [
        {
          id: 'ex-instantaneous-velocity',
          kind: 'note',
          name: '引例一：变速直线运动的瞬时速度',
          aka: ['瞬时速度引例', '速度是位移的导数'],
          statement: '设物体做直线运动，位移 <code>s = s(t)</code> 是时间 <code>t</code> 的函数。从时刻 <code>t₀</code> 到 <code>t₀ + Δt</code> 这段时间内的平均速度为 <code>v̄ = Δs/Δt = [s(t₀ + Δt) − s(t₀)]/Δt</code>。当 <code>Δt → 0</code> 时，若这个平均速度的极限存在，就把它叫做物体在时刻 <code>t₀</code> 的<b>瞬时速度</b>：<code>v(t₀) = lim(Δt→0) [s(t₀ + Δt) − s(t₀)]/Δt</code>。',
          plain: '“平均速度”是整段路程的速度，像家长看成绩单只算总分除以天数；“瞬时速度”是某一瞬间的速度，就是你骑车时速度表上跳动的那个数。要拿到这一瞬间的读数，办法是：先量一段很短很短的时间，算出这一小段里的平均速度，再让这段时间无限缩短。缩短到极限，剩下的就是那一瞬间的读数。',
          why: '平均速度人人会算，瞬时速度却没法直接用“路程 ÷ 时间”，因为一瞬间的路程和时间都是 0，0 ÷ 0 没有意义。于是我们不去硬算这一点，而是用这一点旁边无限靠近的点来“逼近”它。这正是整章的思想：<b>要研究某一点，就去看它附近的点，再让附近的点无限靠近</b>。',
          example: '自由落体 <code>s = (1/2)gt<sup>2</sup></code>。先求平均速度：<code>Δs/Δt = (1/2)g(2t₀ + Δt)</code>；再令 <code>Δt → 0</code>，得 <code>v(t₀) = gt₀</code>。这就是中学公式 <code>v = gt</code>，但它在这里是被“算出来的”，而不是背下来的。',
          pitfalls: [
            '把 <code>Δt</code> 直接当成 0 代入，得到 0/0，然后说“算不出来”。正确做法是先约分化简，最后才取极限。',
            '分不清平均速度和瞬时速度：题目问“第 3 秒末的速度”求的是瞬时速度，问“前 3 秒内的速度”求的才是平均速度。'
          ],
          tags: ['导数', '引例', '物理意义'],
          related: ['def-derivative', 'def-differential']
        },
        {
          id: 'ex-tangent-slope',
          kind: 'note',
          name: '引例二：平面曲线的切线斜率',
          aka: ['切线斜率引例', '割线极限'],
          statement: '设曲线 <code>C</code> 是函数 <code>y = f(x)</code> 的图形，点 <code>M(x₀, y₀)</code> 在曲线上。在曲线上另取一点 <code>N(x₀ + Δx, y₀ + Δy)</code>，割线 <code>MN</code> 的斜率为 <code>k<sub>MN</sub> = Δy/Δx</code>。当 <code>N</code> 沿曲线趋近于 <code>M</code>（即 <code>Δx → 0</code>）时，若割线斜率的极限存在，则称曲线在点 <code>M</code> 处有<b>切线</b>，其斜率 <code>k = lim(Δx→0) Δy/Δx</code>。',
          plain: '圆上一点只有一条“贴着走”的直线，可曲线弯弯曲曲，怎么知道哪条算切线？办法是分两步：先用两个点连一条割线（谁都会连直线），然后让第二个点沿着曲线一点一点滑向第一个点。割线不断转动，最后停下来的那个方向，就是切线方向。',
          why: '和瞬时速度完全一样的套路：切线要“只碰一点”，可比一点的直线有无数条，没法确定。于是退一步，用“过两点的割线”来逼近，再让两点合并。这一步退得聪明：<b>割线好算，切线难定义</b>。两个引例最终都归到同一个极限 <code>Δy/Δx</code>，这就是导数的由来。',
          example: '<code>y = x<sup>2</sup></code> 在点 <code>M(1, 1)</code> 处：割线斜率 <code>k<sub>MN</sub> = [(1 + Δx)<sup>2</sup> − 1]/Δx = 2 + Δx</code>；令 <code>Δx → 0</code> 得 <code>k = 2</code>，故切线为 <code>y − 1 = 2(x − 1)</code>，即 <code>y = 2x − 1</code>。',
          pitfalls: [
            '以为“切线与曲线只有一个公共点”。反例：<code>y = x<sup>3</sup></code> 在原点的切线 <code>y = 0</code> 穿过曲线；而 <code>y = x<sup>2</sup></code> 的切线也可能再与曲线相交。',
            '忘记切线斜率是极限，直接把 <code>Δx = 0</code> 代入 <code>Δy/Δx</code>。'
          ],
          tags: ['导数', '引例', '几何意义'],
          related: ['def-derivative', 'thm-derivative-geometry', 'def-tangent-line']
        },
        {
          id: 'def-derivative',
          kind: 'definition',
          name: '函数在一点处的导数',
          aka: ['导数定义', '微商', '差商极限'],
          statement: '设函数 <code>y = f(x)</code> 在点 <code>x₀</code> 的某个邻域内有定义。给 <code>x₀</code> 一个增量 <code>Δx</code>，相应地函数有增量 <code>Δy = f(x₀ + Δx) − f(x₀)</code>。若极限\n<code>lim(Δx→0) Δy/Δx = lim(Δx→0) [f(x₀ + Δx) − f(x₀)]/Δx</code>\n存在，则称 <code>f(x)</code> 在点 <code>x₀</code> 处<b>可导</b>（或可微），该极限称为 <code>f(x)</code> 在点 <code>x₀</code> 处的<b>导数</b>，记作 <code>f′(x₀)</code>，也可记作 <code>y′|<sub>x=x₀</sub></code> 或 <code>dy/dx|<sub>x=x₀</sub></code>。等价的写法还有 <code>f′(x₀) = lim(h→0) [f(x₀ + h) − f(x₀)]/h</code> 以及 <code>f′(x₀) = lim(x→x₀) [f(x) − f(x₀)]/(x − x₀)</code>。若该极限不存在，就说 <code>f(x)</code> 在 <code>x₀</code> 处<b>不可导</b>。',
          plain: '导数就是“你动一点点，结果跟着动多少倍”。把自变量推一小步 <code>Δx</code>，看结果动了 <code>Δy</code>，算一算倍数 <code>Δy/Δx</code>；再把这一小步缩到几乎为零，这个倍数的极限就是导数。它回答的问题是：<b>在那一点上，输入每增加一点点，输出大约增加几倍</b>。速度是位移对时间的导数，说的就是这件事。',
          why: '为什么不直接写“某一点的变化量之比”？因为在一个点上，<code>Δx = 0</code> 也必有 <code>Δy = 0</code>，比值 0/0 毫无信息。所以定义里必须保留“先离开这一点，算出比值，再回来取极限”的结构。写成 <code>lim(x→x₀) [f(x) − f(x₀)]/(x − x₀)</code> 的形式，是为了强调：导数刻画的是函数在 <code>x₀</code> 附近的整体趋势，而不只是这一点的数值。',
          proof: '定义本身无需证明，但“由定义可直接得到”下面这个常用变形，考试中极常见。\n<b>变形（凑导数法）</b>：<code>lim(h→0) [f(x₀ + ah) − f(x₀ + bh)]/h = (a − b) f′(x₀)</code>。\n推导：把分子拆成两段，<b>加上并减去</b> <code>f(x₀)</code>：\n<code>[f(x₀ + ah) − f(x₀ + bh)]/h = [f(x₀ + ah) − f(x₀)]/h − [f(x₀ + bh) − f(x₀)]/h</code>。\n第一项把自己凑成导数定义的样子：<code>[f(x₀ + ah) − f(x₀)]/h = a · [f(x₀ + ah) − f(x₀)]/(ah) → a f′(x₀)</code>（因为 <code>ah → 0</code>）；第二项同理趋于 <code>b f′(x₀)</code>。两者相减即得结论。\n<b>另一种变形</b>：令 <code>h = x − x₀</code>，则 <code>h → 0</code> 等价于 <code>x → x₀</code>，故 <code>lim(x→x₀)[f(x) − f(x₀)]/(x − x₀) = lim(h→0)[f(x₀ + h) − f(x₀)]/h</code>，两种写法完全等价。',
          example: '<code>f(x) = x<sup>2</sup></code> 在 <code>x₀ = 3</code> 处：<code>[f(3 + Δx) − f(3)]/Δx = [(3 + Δx)<sup>2</sup> − 9]/Δx = 6 + Δx → 6</code>，所以 <code>f′(3) = 6</code>。意思是：在 <code>x = 3</code> 附近，<code>x</code> 每多 0.001，<code>x<sup>2</sup></code> 大约多 0.006。',
          pitfalls: [
            '把 <code>Δy/Δx</code> 当成两个可以随便约分的分数，直接“约掉 Δ”，这是错的：它是一个整体记号，只有在极限过程中才有意义。',
            '忘记检查 <code>x₀</code> 是否在定义域内（或是否只有单侧邻域），例如 <code>f(x) = √x</code> 在 <code>x = 0</code> 处只能谈右导数。',
            '把 <code>f′(x₀)</code> 与 <code>[f(x₀)]′</code> 混为一谈：后者是常数的导数，等于 0。'
          ],
          tags: ['导数', '定义', '差商'],
          related: ['def-one-sided-derivative', 'def-derivative-function', 'thm-differentiable-implies-continuous', 'thm-derivative-geometry', 'def-differential']
        },
        {
          id: 'def-one-sided-derivative',
          kind: 'definition',
          name: '左导数与右导数',
          aka: ['单侧导数'],
          statement: '若 <code>lim(Δx→0<sup>−</sup>) [f(x₀ + Δx) − f(x₀)]/Δx</code> 存在，称其为 <code>f(x)</code> 在 <code>x₀</code> 处的<b>左导数</b>，记作 <code>f′<sub>−</sub>(x₀)</code>；若 <code>lim(Δx→0<sup>+</sup>) [f(x₀ + Δx) − f(x₀)]/Δx</code> 存在，称其为<b>右导数</b>，记作 <code>f′<sub>+</sub>(x₀)</code>。<b>结论</b>：<code>f′(x₀)</code> 存在的充分必要条件是 <code>f′<sub>−</sub>(x₀)</code> 与 <code>f′<sub>+</sub>(x₀)</code> 都存在且相等。',
          plain: '有些函数在一点的左边和右边“脾气不一样”，比如分段函数、带绝对值的函数。就像一个岔路口，从左边走来的坡度和从右边走来的坡度可以不同。左导数就是从左边走近时看到的坡度，右导数就是从右边走近时看到的坡度。只有两边坡度<b>完全一样</b>，这个点才有一个统一的坡度，也就是才有导数。',
          why: '导数的定义本身用到了“双侧极限”，而双侧极限存在的判据就是左右极限存在且相等。把这条判据翻译成导数的语言，就得到单侧导数。它最大的用处是<b>检查分段函数在分界点是否可导</b>：分界点是唯一可能“左右坡度不一样”的地方。',
          proof: '<b>必要性</b>：设 <code>f′(x₀) = A</code>，即双侧极限为 <code>A</code>。由极限存在的性质，任何一侧的极限也存在且等于 <code>A</code>，故 <code>f′<sub>−</sub>(x₀) = f′<sub>+</sub>(x₀) = A</code>。\n<b>充分性</b>：设 <code>f′<sub>−</sub>(x₀) = f′<sub>+</sub>(x₀) = A</code>。双侧极限存在的判据是左右极限存在且相等，故 <code>lim(Δx→0) Δy/Δx = A</code>，即 <code>f′(x₀) = A</code>。证毕。',
          example: '<code>f(x) = |x|</code> 在 <code>x = 0</code> 处：<code>f′<sub>−</sub>(0) = lim(Δx→0<sup>−</sup>) (−Δx)/Δx = −1</code>，<code>f′<sub>+</sub>(0) = lim(Δx→0<sup>+</sup>) Δx/Δx = 1</code>。两者不等，所以 <code>|x|</code> 在 0 处不可导。几何上看，原点是一个尖角，左右坡度分别是 −1 和 1，没有一个“唯一的坡度”。',
          pitfalls: [
            '只算了一侧就下结论“可导”。',
            '在分界点求导时直接套用该点所在那一段的公式（例如对 <code>|x|</code> 直接写“<code>x &gt; 0</code> 时导数为 1，所以 <code>f′(0) = 1</code>”），这是把“右侧的表达式”误当成了“该点的导数”。',
            '忘记先确认分界点是否有定义：<code>f(x) = 1/x</code> 在 0 处连定义都没有，谈不上单侧导数。'
          ],
          tags: ['导数', '单侧导数', '分段函数'],
          related: ['def-derivative', 'thm-differentiable-implies-continuous']
        },
        {
          id: 'def-derivative-function',
          kind: 'definition',
          name: '导函数',
          aka: ['导数', '求导'],
          statement: '若函数 <code>y = f(x)</code> 在开区间 <code>I</code> 内每一点处都可导，则对每个 <code>x ∈ I</code> 都有唯一的导数 <code>f′(x)</code> 与之对应，于是得到一个定义在 <code>I</code> 上的新函数，称为 <code>f(x)</code> 的<b>导函数</b>，记作 <code>f′(x)</code>、<code>y′</code> 或 <code>dy/dx</code>。求导函数的运算称为<b>求导</b>。<code>f′(x₀)</code> 与 <code>f′(x)</code> 的关系是：<code>f′(x₀) = f′(x)|<sub>x=x₀</sub></code>。',
          plain: '“在某一点的导数”是一个数，像体重秤上一次称出的数字；“导函数”则是一整套换算规则，像把“每个年龄对应多少标准体重”列成一张表。先把表的规则算出来（导函数），以后想查任何一点，代入即可。所以求导的常规流程是：<b>先求导函数，再代点</b>，而不是每换一个点就从头算极限。',
          why: '逐点用定义求极限太苦。可导性有个重要性质：开区间内每一点都可导时，导数随点变化而形成函数，于是我们就能用“公式”去代替“每次求极限”。这也是为什么导数表、四则法则、链式法则值得花功夫——它们把无穷多次极限运算压缩成有限的代数操作。',
          example: '<code>f(x) = x<sup>2</sup></code>：<code>f′(x) = lim(Δx→0) [(x + Δx)<sup>2</sup> − x<sup>2</sup>]/Δx = lim(Δx→0)(2x + Δx) = 2x</code>。有了这个结果，<code>f′(3) = 2 × 3 = 6</code>、<code>f′(−1) = −2</code> 都是一次代入的事。',
          pitfalls: [
            '把 <code>dy/dx</code> 看成“dy 除以 dx”的两个独立字母，因而写出 <code>dy/dx = (dy/du) · (dx/du)</code> 之类的错误“约分”。它表示的是导数这个整体，只不过记号长得像分数。',
            '混淆“在区间内可导”与“在闭区间上可导”：在闭区间 <code>[a, b]</code> 上谈可导，通常只要求在开区间 <code>(a, b)</code> 内可导，并在端点处存在相应的单侧导数。'
          ],
          tags: ['导数', '导函数'],
          related: ['def-derivative', 'def-one-sided-derivative', 'thm-derivative-rules', 'thm-basic-derivative-formulas']
        },
        {
          id: 'thm-derivative-geometry',
          kind: 'theorem',
          name: '导数的几何意义',
          aka: ['切线斜率', '切线方程'],
          statement: '若函数 <code>y = f(x)</code> 在点 <code>x₀</code> 处可导，则曲线 <code>y = f(x)</code> 在点 <code>M(x₀, f(x₀))</code> 处存在切线，且切线的斜率等于 <code>f′(x₀)</code>，即 <code>k = tan α = f′(x₀)</code>，其中 <code>α</code> 是切线的倾角。相应地，曲线在 <code>M</code> 点的切线方程为 <code>y − f(x₀) = f′(x₀)(x − x₀)</code>；若 <code>f′(x₀) ≠ 0</code>，法线方程为 <code>y − f(x₀) = −[1/f′(x₀)](x − x₀)</code>。',
          plain: '导数在图上就是“那一点有多陡”。<code>f′(x₀) = 3</code> 表示在 <code>x₀</code> 处，往右走 1 步要往上走 3 步；<code>f′(x₀) = 0</code> 表示那一点是平的（像山顶或谷底）；导数为负表示往下坡走。所以看到导数，脑子里就该浮现出一条贴着曲线的斜直线。',
          why: '切线斜率的定义本来就是 <code>k = lim(Δx→0) Δy/Δx</code>（2.1 引例二），而导数定义也是同一个极限。同一个极限有两种读法：物理上读作瞬时速度，几何上读作切线斜率，这两种读法是<b>天然一致</b>的。所谓“定理”，是把引例里“若极限存在”升级成“可导时切线必存在”。',
          proof: '设 <code>f</code> 在 <code>x₀</code> 处可导，<code>f′(x₀) = k</code>。\n<b>第一步</b>：取曲线上的动点 <code>N(x₀ + Δx, f(x₀ + Δx))</code>，割线 <code>MN</code> 的斜率为\n<code>k<sub>MN</sub> = [f(x₀ + Δx) − f(x₀)]/Δx</code>。\n由可导的定义，当 <code>Δx → 0</code> 时 <code>k<sub>MN</sub> → k</code>。\n<b>第二步</b>：当 <code>Δx → 0</code> 时点 <code>N</code> 沿曲线趋于 <code>M</code>，割线 <code>MN</code> 随之转动并趋于一个确定的方向。按切线的定义，这个极限位置就是曲线在 <code>M</code> 点的切线，其斜率就是割线斜率的极限 <code>k = f′(x₀)</code>。\n<b>第三步</b>：由点斜式直线方程立刻得到切线方程 <code>y − f(x₀) = f′(x₀)(x − x₀)</code>。法线与切线垂直，故当 <code>f′(x₀) ≠ 0</code> 时其斜率为 <code>−1/f′(x₀)</code>；当 <code>f′(x₀) = 0</code> 时切线水平，法线竖直，方程为 <code>x = x₀</code>。证毕。',
          example: '<code>y = x<sup>2</sup></code> 在 <code>x₀ = 1</code> 处，<code>f′(1) = 2</code>，切线为 <code>y = 2x − 1</code>；在 <code>x₀ = 0</code> 处导数为 0，切线是水平线 <code>y = 0</code>。',
          pitfalls: [
            '把切线斜率与“函数值的变化量”搞混：切线斜率只看该点导数，与 <code>f(x₀)</code> 的大小无关。',
            '在 <code>f′(x₀) = 0</code> 时写“法线不存在”，其实此时法线是竖直线 <code>x = x₀</code>。',
            '过曲线外一点求切线时，直接把该点当切点代入公式。正确做法是设切点 <code>(t, f(t))</code>，用“切线过该点”列方程解出 <code>t</code>。'
          ],
          tags: ['导数', '几何意义', '切线'],
          related: ['def-derivative', 'ex-tangent-slope', 'def-tangent-line']
        },
        {
          id: 'def-tangent-line',
          kind: 'note',
          name: '切线方程与法线方程的写法',
          aka: ['切线方程', '法线方程'],
          statement: '设 <code>y = f(x)</code> 在 <code>x₀</code> 处可导，记 <code>y₀ = f(x₀)</code>、<code>k = f′(x₀)</code>。则\n<b>切线</b>：<code>y − y₀ = k(x − x₀)</code>；若曲线在该点有竖直切线，则写成 <code>x = x₀</code>。\n<b>法线</b>：若 <code>k ≠ 0</code>，<code>y − y₀ = −(1/k)(x − x₀)</code>；若 <code>k = 0</code>，法线为 <code>x = x₀</code>。\n若曲线由参数方程或隐函数给出，则先用 2.4 节的方法求出该点的 <code>k</code>，再套上面的公式。',
          plain: '切线就是“贴着曲线走的那条直线”，法线就是“垂直顶住切线的那条直线”，像地面和竖直的墙。求它们只需要两个信息：<b>点在哪儿</b>（<code>x₀, y₀</code>）和<b>多陡</b>（<code>k</code>）。所有切线题都是先凑齐这两样。',
          why: '把几何意义翻译成公式后，切线法线问题就完全变成代数问题。之所以要单独列出来，是因为考试里“求切线”常常和隐函数、参数方程、微分近似混着考，把这两行公式记牢可以省很多时间。',
          example: '求 <code>y = ln x</code> 在 <code>x = 1</code> 处的切线：<code>y₀ = 0</code>，<code>y′ = 1/x</code>，<code>k = 1</code>，故切线 <code>y = x − 1</code>，法线 <code>y = −(x − 1)</code>。',
          pitfalls: [
            '先求出导函数却不代点，直接把含 <code>x</code> 的式子当成斜率写进直线方程。',
            '忘记先算 <code>y₀ = f(x₀)</code>，导致直线不过切点。'
          ],
          tags: ['切线', '法线', '方程'],
          related: ['thm-derivative-geometry', 'met-implicit-differentiation', 'met-parametric-differentiation']
        },
        {
          id: 'thm-differentiable-implies-continuous',
          kind: 'theorem',
          name: '可导必连续',
          aka: ['可导与连续的关系'],
          statement: '若函数 <code>y = f(x)</code> 在点 <code>x₀</code> 处可导，则它在该点处必连续。反之不成立：连续不一定可导。',
          plain: '“连续”是说这条线一笔画得下去、不断开；“可导”是说每一点都有明确的坡度，没有尖角。定理说：<b>只要有明确坡度，线就不会断</b>。反过来就不行：线连着，但可以有尖角（像 <code>|x|</code> 在原点的尖角），尖角处左边右边坡度不同，就没有唯一的坡度，于是不可导。走路可以不断，但脚下可以突然拐弯。',
          why: '证明的关键技巧只有一个：把 <code>Δy</code> 写成 <code>(Δy/Δx) · Δx</code> 的形式。这样当 <code>Δx → 0</code> 时，<code>Δy/Δx</code> 趋于有限的 <code>f′(x₀)</code>，<code>Δx</code> 趋于 0，两个乘起来趋于 0，恰好就是连续的定义 <code>lim Δy = 0</code>。为什么会想到这一步？因为“连续”要证的是 <code>Δy → 0</code>，而“可导”给的只是 <code>Δy/Δx</code> 有极限，两者只差一个因子 <code>Δx</code>，补上即可。',
          proof: '设 <code>f</code> 在 <code>x₀</code> 处可导，即 <code>lim(Δx→0) Δy/Δx = f′(x₀)</code>。\n<b>第一步</b>：当 <code>Δx ≠ 0</code> 时，恒有\n<code>Δy = (Δy/Δx) · Δx</code>\n（这是普通的代数恒等式，因为 <code>Δx</code> 在分母上不是 0）。\n<b>第二步</b>：对两边取 <code>Δx → 0</code> 的极限。由极限的乘法法则，\n<code>lim(Δx→0) Δy = [lim(Δx→0) Δy/Δx] · [lim(Δx→0) Δx] = f′(x₀) · 0 = 0</code>。\n<b>第三步</b>：注意 <code>Δy = f(x₀ + Δx) − f(x₀)</code>，故上式正是\n<code>lim(Δx→0) [f(x₀ + Δx) − f(x₀)] = 0</code>，即 <code>lim(x→x₀) f(x) = f(x₀)</code>。\n按连续的定义，<code>f</code> 在 <code>x₀</code> 处连续。证毕。\n<b>逆命题不成立的反例</b>：<code>f(x) = |x|</code> 在 <code>x₀ = 0</code> 处连续（因为 <code>lim(x→0) |x| = 0 = f(0)</code>），但 <code>f′<sub>−</sub>(0) = −1 ≠ 1 = f′<sub>+</sub>(0)</code>，左右导数不等，故不可导。',
          example: '<code>f(x) = |x|</code>：连续但不可导，图形在原点有尖角。<code>f(x) = x sin(1/x)</code>（<code>x ≠ 0</code>），<code>f(0) = 0</code>：在 0 处连续但不可导（差商 <code>sin(1/Δx)</code> 在 <code>Δx → 0</code> 时无限振荡，没有极限）。',
          pitfalls: [
            '<b>把定理反过来用</b>：“连续所以可导”——这是最常见的错误，<code>|x|</code> 就是反例。',
            '以为“不连续也可能可导”：不连续必不可导（这是本定理的逆否命题，成立）。',
            '证明时把 <code>Δy = (Δy/Δx) · Δx</code> 写成“约掉 Δx 得 Δy”，丢掉“<code>Δx ≠ 0</code>”这个前提，逻辑上不严密。'
          ],
          tags: ['可导', '连续', '定理'],
          related: ['def-derivative', 'def-one-sided-derivative', 'def-continuity']
        },
        {
          id: 'note-nondifferentiable-cases',
          kind: 'note',
          name: '常见的不可导情形',
          aka: ['尖点', '不可导的例子'],
          statement: '函数在点 <code>x₀</code> 处不可导，常见于以下几种情形（前三种都在 <code>f</code> 于 <code>x₀</code> 连续的前提下发生）：\n<b>①</b> 左右导数都存在但不相等——图形出现<b>尖角</b>，如 <code>y = |x|</code> 在 <code>x = 0</code> 处；\n<b>②</b> 差商趋于无穷——图形出现<b>竖直切线</b>，如 <code>y = x<sup>1/3</sup></code> 在 <code>x = 0</code> 处（差商趋于 <code>+∞</code>）；\n<b>③</b> 差商无限振荡、没有极限，如 <code>f(x) = x sin(1/x)</code>（<code>x ≠ 0</code>），<code>f(0) = 0</code>；\n<b>④</b> 函数在该点不连续，此时必不可导。',
          plain: '把一条曲线想成一条山路，走起来大致有三种“没法说清坡度”的地方：<b>急拐弯</b>（一边上坡一边下坡，尖角）、<b>悬崖</b>（坡度无穷大，垂直墙面）、<b>坑坑洼洼抖个不停</b>（无限振荡，找不出一个稳定方向）。再加上“路断了”（不连续）这一类，就是全部不可导的情况。',
          why: '考试常让你“判断分段函数在分界点是否可导”，本质就是逐个排查这几种情形。记住这四类，比死记题目有用得多——因为微积分里构造出来的不可导反例，几乎都落在这四种里。',
          example: '<code>f(x) = x<sup>1/3</sup></code>：<code>[f(0 + Δx) − f(0)]/Δx = Δx<sup>−2/3</sup> → +∞</code>，差商无有限极限，故在 0 处不可导；但曲线在原点有竖直切线 <code>x = 0</code>，图形仍是连续的。',
          pitfalls: [
            '把“差商趋于无穷大”说成“导数是 ∞”：无穷大不是数，只能说导数不存在（或说差商的极限为无穷大）。',
            '看到分段函数就以为分界点一定不可导：例如 <code>f(x) = x<sup>2</sup>sin(1/x)</code>（<code>x ≠ 0</code>），<code>f(0) = 0</code> 在 0 处就是可导的，且 <code>f′(0) = 0</code>。'
          ],
          tags: ['不可导', '尖点', '反例'],
          related: ['thm-differentiable-implies-continuous', 'def-one-sided-derivative']
        },
        {
          id: 'def-continuity',
          kind: 'definition',
          name: '函数在一点连续（回顾）',
          statement: '设函数 <code>f(x)</code> 在点 <code>x₀</code> 的某邻域内有定义。若 <code>lim(x→x₀) f(x) = f(x₀)</code>，则称 <code>f(x)</code> 在点 <code>x₀</code> 处<b>连续</b>，<code>x₀</code> 称为 <code>f</code> 的<b>连续点</b>。等价说法：<code>lim(Δx→0) Δy = 0</code>，其中 <code>Δy = f(x₀ + Δx) − f(x₀)</code>。',
          plain: '连续就是“线没断、也没跳”。你可以用手指沿着曲线从左边滑到右边，经过这一点时不用抬手指，这一点就是连续的。若中间有个洞、或者突然跳上去一截，就不连续。',
          why: '这里回顾它，是因为它是本章的“对照物”：连续只管 <code>Δy → 0</code>（高度差趋于 0），可导还要管 <code>Δy/Δx</code> 趋于一个<b>有限的数</b>（不仅高度差趋 0，而且趋 0 的“快慢比例”稳定）。这一点区别，正是“连续不一定可导”的根源。',
          example: '<code>f(x) = |x|</code> 在 <code>x = 0</code> 处连续但不可导；<code>f(x) = x<sup>2</sup></code> 在 <code>x = 0</code> 处既连续又可导；<code>f(x) = 1/x</code> 在 <code>x = 0</code> 处不连续（无定义），自然也不可导。',
          pitfalls: [
            '只算 <code>lim(x→x₀) f(x)</code> 存在就宣布连续，忘记检查它是否等于 <code>f(x₀)</code>（可去间断点）。',
            '以为连续函数一定处处可导。'
          ],
          tags: ['连续', '回顾'],
          related: ['thm-differentiable-implies-continuous', 'def-derivative']
        }
      ]
    },
    {
      id: 'ch2-2',
      no: '2.2',
      title: '函数的求导法则',
      summary: '掌握导数的四则运算法则、反函数与复合函数求导法则，并熟记基本初等函数的导数公式表。',
      items: [
        {
          id: 'thm-derivative-rules',
          kind: 'theorem',
          name: '导数的四则运算法则',
          aka: ['和差积商求导法则', '乘积法则', '商的求导法则'],
          statement: '设 <code>u = u(x)</code>、<code>v = v(x)</code> 都在点 <code>x</code> 处可导，则：\n<b>① 和差</b>：<code>(u ± v)′ = u′ ± v′</code>；更一般地 <code>(∑ a<sub>k</sub>u<sub>k</sub>)′ = ∑ a<sub>k</sub>u<sub>k</sub>′</code>。\n<b>② 乘积</b>：<code>(uv)′ = u′v + uv′</code>；推广到三项：<code>(uvw)′ = u′vw + uv′w + uvw′</code>。\n<b>③ 常数倍</b>：<code>(Cu)′ = Cu′</code>（<code>C</code> 为常数）。\n<b>④ 商</b>：当 <code>v(x) ≠ 0</code> 时 <code>(u/v)′ = (u′v − uv′)/v<sup>2</sup></code>；特别地 <code>(1/v)′ = −v′/v<sup>2</sup></code>。',
          plain: '导数像一个“分配器”：加法最好办，各管各的——两样东西一起涨价，总涨价率就是各自涨价率之和。乘法要多一项，因为“你变我也变”会互相带动：<code>u</code> 变了要乘上原来的 <code>v</code>，<code>v</code> 变了要乘上原来的 <code>u</code>，两笔都要记账。除法可以看成乘法的逆运算，所以结果的分母要平方，分子是“先来后到”相减，顺序不能反。',
          why: '证明思路都来自同一个动作：<b>写出差商，再想办法把差值凑成能提出 Δx 的形式</b>。乘积法则的关键一步是“减一项又加一项”（加 <code>u(x + Δx)v(x)</code> 再减掉它），这等于是<b>强行搭桥</b>：把 <code>u(x + Δx)v(x + Δx) − u(x + Δx)v(x)</code> 和 <code>u(x + Δx)v(x) − u(x)v(x)</code> 两段分别提公因子，各自就露出了 <code>v′</code> 和 <code>u′</code>。商法则不单独硬算，而是先用乘积法则求出 <code>1/v</code> 的导数，再把 <code>u/v</code> 写成 <code>u · (1/v)</code> 用乘法法则一次搞定，省力且不易错。',
          proof: '<b>① 和差</b>：设 <code>y = u ± v</code>。则\n<code>Δy/Δx = {[u(x + Δx) ± v(x + Δx)] − [u(x) ± v(x)]}/Δx = Δu/Δx ± Δv/Δx</code>。\n令 <code>Δx → 0</code>，由极限的和差法则及 <code>u, v</code> 可导，得 <code>y′ = u′ ± v′</code>。\n<b>③ 常数倍</b>：在 <code>②</code> 中取 <code>v ≡ C</code>（此时 <code>C′ = 0</code>）即得 <code>(Cu)′ = Cu′</code>。\n<b>② 乘积</b>：设 <code>y = uv</code>。关键是以下恒等变形——在分子中<b>加上并减去同一项</b> <code>u(x + Δx)v(x)</code>：\n<code>Δy = u(x + Δx)v(x + Δx) − u(x + Δx)v(x) + u(x + Δx)v(x) − u(x)v(x)</code>\n<code> = u(x + Δx)[v(x + Δx) − v(x)] + v(x)[u(x + Δx) − u(x)]</code>。\n两边同除 <code>Δx</code>：\n<code>Δy/Δx = u(x + Δx) · (Δv/Δx) + v(x) · (Δu/Δx)</code>。\n令 <code>Δx → 0</code>。由 <code>v</code> 可导知 <code>v</code> 连续，故 <code>u(x + Δx) → u(x)</code>；又 <code>Δv/Δx → v′</code>、<code>Δu/Δx → u′</code>。由极限的乘法与加法法则得 <code>y′ = u v′ + v u′</code>，即 <code>(uv)′ = u′v + uv′</code>。\n三项情形重复使用两次乘积法则即可：<code>(uvw)′ = [(uv)w]′ = (uv)′w + (uv)w′ = (u′v + uv′)w + uvw′</code>，整理即得。\n<b>④ 商</b>：先求 <code>(1/v)′</code>（<code>v ≠ 0</code>）：\n<code>[1/v(x + Δx) − 1/v(x)]/Δx = [v(x) − v(x + Δx)]/[Δx · v(x)v(x + Δx)] = −(Δv/Δx) · 1/[v(x)v(x + Δx)]</code>。\n由 <code>v</code> 可导知 <code>v</code> 连续，故 <code>v(x + Δx) → v(x)</code>，于是 <code>(1/v)′ = −v′/v<sup>2</sup></code>。\n再把 <code>u/v</code> 写成 <code>u · (1/v)</code>，用乘积法则：\n<code>(u/v)′ = u′ · (1/v) + u · (−v′/v<sup>2</sup>) = u′/v − uv′/v<sup>2</sup> = (u′v − uv′)/v<sup>2</sup></code>。证毕。',
          example: '<b>积</b>：<code>y = x<sup>2</sup>sin x</code>，则 <code>y′ = 2x sin x + x<sup>2</sup>cos x</code>。\n<b>商</b>：<code>y = tan x = sin x / cos x</code>，则 <code>y′ = (cos x · cos x − sin x · (−sin x))/cos<sup>2</sup>x = (cos<sup>2</sup>x + sin<sup>2</sup>x)/cos<sup>2</sup>x = 1/cos<sup>2</sup>x = sec<sup>2</sup>x</code>。',
          pitfalls: [
            '把 <code>(uv)′</code> 写成 <code>u′v′</code>（漏掉一项）。用 <code>u = v = x</code> 检验立刻发现错：<code>(x · x)′ = 2x</code>，而 <code>1 · 1 = 1</code>。',
            '商的法则里分子写成 <code>uv′ − u′v</code>（顺序反了，差一个负号），或忘记给分母平方。',
            '对 <code>(u/v)′</code> 用“分子导数除以分母导数”，即 <code>u′/v′</code>，这是完全错误的。',
            '在分式里先求导再约分，结果对不上就慌了：正确顺序是<b>先化简能省就省，化简之后再求导</b>，但约分必须合法。'
          ],
          tags: ['求导法则', '四则运算', '定理'],
          related: ['def-derivative', 'def-derivative-function', 'thm-chain-rule', 'thm-basic-derivative-formulas']
        },
        {
          id: 'thm-inverse-function-derivative',
          kind: 'theorem',
          name: '反函数的求导法则',
          aka: ['反函数导数', '反函数求导'],
          statement: '设函数 <code>x = f(y)</code> 在区间 <code>I<sub>y</sub></code> 内单调、可导，且 <code>f′(y) ≠ 0</code>。则它的反函数 <code>y = f<sup>−1</sup>(x)</code> 在对应区间 <code>I<sub>x</sub></code>（<code>I<sub>x</sub> = {x | x = f(y), y ∈ I<sub>y</sub>}</code>）内也可导，且\n<code>[f<sup>−1</sup>(x)]′ = 1/f′(y)</code>，即 <code>dy/dx = 1/(dx/dy)</code>。',
          plain: '反函数就是把“输入”和“输出”对调的机器：原来给定体重求身高，反函数就是给定身高求体重。法则说：两边的“变化率”互为<b>倒数</b>。这很直观——若体重每增加 1 公斤身高增加 2 厘米（变化率 2），那么身高每增加 1 厘米，体重就只增加 1/2 公斤（变化率 1/2）。掉个方向，倍数自然翻转。',
          why: '为什么必须是倒数？因为“函数”和“反函数”描述的是同一对量之间的同一条关系曲线，只不过一个横着读、一个竖着读。斜率是“纵比横”，把坐标轴的角色对调，斜率自然就取倒数。证明的手法是把差商上下颠倒：本来是 <code>Δy/Δx</code>，先算它的反函数差商 <code>Δx/Δy</code>，再对整体取倒数。<b>唯一的坑是 Δy 可能为 0</b>，所以需要先说明：由于 <code>f</code> 单调，<code>Δy ≠ 0</code> 时必有 <code>Δx ≠ 0</code>。',
          proof: '<b>第一步（反函数的存在与连续）</b>：由 <code>f</code> 在 <code>I<sub>y</sub></code> 内单调，<code>f<sup>−1</sup></code> 在 <code>I<sub>x</sub></code> 上存在且单调。又 <code>f</code> 可导必连续，而单调连续函数的反函数也连续（第 1 章结论），故 <code>f<sup>−1</sup></code> 连续。\n<b>第二步（差商取倒数）</b>：任取 <code>x₀ ∈ I<sub>x</sub></code>，记 <code>y₀ = f<sup>−1</sup>(x₀)</code>，则 <code>f(y₀) = x₀</code>。给 <code>x₀</code> 增量 <code>Δx ≠ 0</code>，记 <code>Δy = f<sup>−1</sup>(x₀ + Δx) − y₀</code>。由于 <code>f<sup>−1</sup></code> 严格单调，<code>Δx ≠ 0</code> 保证 <code>Δy ≠ 0</code>，于是可以作商：\n<code>Δy/Δx = 1/(Δx/Δy)</code>，其中 <code>Δx = f(y₀ + Δy) − f(y₀)</code>。\n<b>第三步（令 Δx → 0）</b>：由 <code>f<sup>−1</sup></code> 在 <code>x₀</code> 连续，<code>Δx → 0</code> 时 <code>Δy → 0</code>。于是\n<code>Δx/Δy = [f(y₀ + Δy) − f(y₀)]/Δy → f′(y₀)</code>（因为 <code>f</code> 在 <code>y₀</code> 可导）。\n又 <code>f′(y₀) ≠ 0</code>，由极限的商法则，\n<code>lim(Δx→0) Δy/Δx = 1/f′(y₀)</code>，\n即 <code>[f<sup>−1</sup>]′(x₀) = 1/f′(y₀)</code>。由 <code>x₀</code> 任意，结论在 <code>I<sub>x</sub></code> 上成立。证毕。',
          example: '<b>反正弦</b>：<code>y = arcsin x</code>（<code>|x| &lt; 1</code>）是 <code>x = sin y</code>（<code>y ∈ (−π/2, π/2)</code>）的反函数。此时 <code>dx/dy = cos y &gt; 0</code>，所以 <code>dy/dx = 1/cos y</code>。又 <code>cos y = √(1 − sin<sup>2</sup>y) = √(1 − x<sup>2</sup>)</code>（因 <code>cos y &gt; 0</code> 取正根），故 <code>(arcsin x)′ = 1/√(1 − x<sup>2</sup>)</code>。\n<b>对数</b>：<code>y = ln x</code> 是 <code>x = e<sup>y</sup></code> 的反函数，<code>dx/dy = e<sup>y</sup> = x</code>，故 <code>(ln x)′ = 1/x</code>。',
          pitfalls: [
            '忘记把结果换回自变量 <code>x</code>：答案里留下 <code>y</code> 就不算完成（除非题目本身用参数式表示）。',
            '忽略条件 <code>f′(y) ≠ 0</code>：当 <code>f′(y₀) = 0</code> 时反函数在该点不可导（例如 <code>y = x<sup>3</sup></code> 在 <code>x = 0</code> 处导数为 0，其反函数 <code>y = x<sup>1/3</sup></code> 在 0 处不可导）。',
            '把公式写成 <code>dy/dx = dx/dy</code>（漏掉倒数），或写成 <code>1/f′(x)</code>（导数是对 <code>y</code> 求的，不能换成 <code>x</code>）。',
            '开根号时忘记讨论符号，例如把 <code>√(1 − x<sup>2</sup>)</code> 写成 <code>±√(1 − x<sup>2</sup>)</code>，会导致 <code>(arccos x)′</code> 的符号错误。'
          ],
          tags: ['反函数', '求导法则', '定理'],
          related: ['thm-basic-derivative-formulas', 'thm-chain-rule', 'def-derivative']
        },
        {
          id: 'thm-chain-rule',
          kind: 'theorem',
          name: '复合函数的求导法则（链式法则）',
          aka: ['链式法则', '复合函数求导'],
          statement: '设 <code>y = f(u)</code> 在点 <code>u₀</code> 处可导，<code>u = g(x)</code> 在点 <code>x₀</code> 处可导，且 <code>u₀ = g(x₀)</code>，则复合函数 <code>y = f[g(x)]</code> 在点 <code>x₀</code> 处可导，且\n<code>{f[g(x₀)]}′ = f′(u₀) · g′(x₀)</code>，即 <code>dy/dx = (dy/du) · (du/dx)</code>。\n推广到多层复合：<code>dy/dx = (dy/du) · (du/dv) · (dv/dx)</code>。',
          plain: '复合就是“流水线”：原料先经过第一道工序 <code>g</code>，再经过第二道工序 <code>f</code>。问“原料多给一点，最终产品多出多少”？要连乘两级的放大倍数——第一道工序把原料放大了 <code>g′(x₀)</code> 倍，第二道工序再把这个中间结果放大了 <code>f′(u₀)</code> 倍，总放大倍数是两者相乘。就像齿轮组：一个齿轮转 1 圈带动第二个转 3 圈，第二个再带动第三个转 5 圈，那么第一个转 1 圈，第三个就转 15 圈。',
          why: '为什么必须连乘？因为变化是<b>一环扣一环传下去</b>的。你很想直接写 <code>Δy/Δx = (Δy/Δu) · (Δu/Δx)</code>，这看着像分数约分，但数学上不严谨，因为 <code>Δu</code> 可能等于 0，那时 <code>Δy/Δu</code> 没有意义。补救办法很漂亮：<b>把“可导”改写成“差 = 线性主部 + 高阶无穷小”</b>，即引入一个当 <code>Δu → 0</code> 时趋于 0 的量 <code>α</code>，使 <code>Δy = f′(u₀)Δu + α(Δu)·Δu</code> 对一切 <code>Δu</code> 都成立。再除以 <code>Δx</code> 并令其趋于 0，就得到结论。这个“引入 α 的补丁”是本章最值得学的技巧，它在 2.5 节讲微分时还会再用一次。',
          proof: '<b>第一步（把可导翻译成“线性主部 + 高阶无穷小”）</b>：因 <code>f</code> 在 <code>u₀</code> 可导，<code>lim(Δu→0) Δy/Δu = f′(u₀)</code>。定义\n<code>α(Δu) = Δy/Δu − f′(u₀)</code>（<code>Δu ≠ 0</code>），并约定 <code>α(0) = 0</code>。\n则 <code>lim(Δu→0) α(Δu) = 0</code>，且对<b>一切</b> <code>Δu</code>（包括 <code>Δu = 0</code>）都有恒等式\n<code>Δy = f′(u₀)Δu + α(Δu) · Δu</code>\n（<code>Δu ≠ 0</code> 时由 <code>α</code> 的定义直接得到；<code>Δu = 0</code> 时两边同为 0，也成立）。\n<b>第二步（代入 Δu = g(x₀ + Δx) − g(x₀)）</b>：给 <code>x₀</code> 增量 <code>Δx</code>，则 <code>Δu</code> 随之确定。把上式两边同除 <code>Δx</code>（<code>Δx ≠ 0</code>）：\n<code>Δy/Δx = f′(u₀) · (Δu/Δx) + α(Δu) · (Δu/Δx)</code>。\n<b>第三步（取极限）</b>：由 <code>g</code> 在 <code>x₀</code> 可导，<code>Δu/Δx → g′(x₀)</code>；由 <code>g</code> 可导必连续，<code>Δx → 0</code> 时 <code>Δu → 0</code>，从而 <code>α(Δu) → 0</code>。于是由极限的加法与乘法法则，\n<code>lim(Δx→0) Δy/Δx = f′(u₀) · g′(x₀) + 0 · g′(x₀) = f′(u₀) g′(x₀)</code>。\n即复合函数可导，且 <code>dy/dx = f′(u₀) g′(x₀)</code>。证毕。\n<b>多层情形</b>：把 <code>f[g(x)]</code> 看成 <code>(f∘g)(x)</code>。对 <code>h = g∘v</code> 用一次链式法则，再对 <code>g∘v</code> 用一次，即得三项连乘；一般情形逐层归纳即可。',
          example: '<b>例 1</b>：<code>y = sin(x<sup>2</sup>)</code>。看作 <code>y = sin u</code>，<code>u = x<sup>2</sup></code>。则 <code>dy/du = cos u</code>，<code>du/dx = 2x</code>，故 <code>y′ = cos(x<sup>2</sup>) · 2x = 2x cos(x<sup>2</sup>)</code>。\n<b>例 2</b>：<code>y = e<sup>sin 3x</sup></code>。三层：<code>y = e<sup>u</sup></code>，<code>u = sin v</code>，<code>v = 3x</code>。故 <code>y′ = e<sup>u</sup> · cos v · 3 = 3 cos 3x · e<sup>sin 3x</sup></code>。\n<b>例 3</b>：<code>y = ln[cos(x<sup>2</sup>)]</code>，则 <code>y′ = [1/cos(x<sup>2</sup>)] · (−sin(x<sup>2</sup>)) · 2x = −2x tan(x<sup>2</sup>)</code>。',
          pitfalls: [
            '<b>漏乘内层导数</b>：把 <code>(sin 2x)′</code> 写成 <code>cos 2x</code>，正确是 <code>2cos 2x</code>。这是最高频的失分点。',
            '分解层次不彻底就动笔，导致层数数错。稳妥做法是先写出 <code>y = f(u), u = g(v), v = h(x)</code> 这样的链条，再逐层代入。',
            '把 <code>f′(u₀)g′(x₀)</code> 中的 <code>f′(u₀)</code> 写成 <code>f′(x₀)</code>：外层的导数要在<b>内层的值</b> <code>u₀ = g(x₀)</code> 处取值，不能换成 <code>x₀</code>。',
            '用“分数约分”论证 <code>dy/dx = (dy/du)(du/dx)</code>。这个写法在链式法则成立<b>之后</b>作为记忆口诀是可以的，但不能当作证明，因为 <code>Δu</code> 可能为 0。'
          ],
          tags: ['链式法则', '复合函数', '求导法则', '定理'],
          related: ['thm-derivative-rules', 'thm-inverse-function-derivative', 'met-logarithmic-differentiation', 'thm-differential-form-invariance']
        },
        {
          id: 'thm-basic-derivative-formulas',
          kind: 'formula',
          name: '基本初等函数的导数公式表',
          aka: ['导数公式表', '求导公式'],
          statement: '<b>① 常数与幂函数</b>\n<code>(C)′ = 0</code>；<code>(x<sup>μ</sup>)′ = μx<sup>μ−1</sup></code>（<code>μ</code> 为任意实数，<code>x</code> 在使 <code>x<sup>μ</sup></code> 有意义的范围内）；特例 <code>(√x)′ = 1/(2√x)</code>，<code>(1/x)′ = −1/x<sup>2</sup></code>。\n<b>② 指数与对数</b>\n<code>(a<sup>x</sup>)′ = a<sup>x</sup> ln a</code>（<code>a &gt; 0, a ≠ 1</code>）；<code>(e<sup>x</sup>)′ = e<sup>x</sup></code>；<code>(log<sub>a</sub>x)′ = 1/(x ln a)</code>；<code>(ln x)′ = 1/x</code>。\n<b>③ 三角函数</b>\n<code>(sin x)′ = cos x</code>；<code>(cos x)′ = −sin x</code>；<code>(tan x)′ = sec<sup>2</sup>x = 1/cos<sup>2</sup>x</code>；<code>(cot x)′ = −csc<sup>2</sup>x = −1/sin<sup>2</sup>x</code>；<code>(sec x)′ = sec x tan x</code>；<code>(csc x)′ = −csc x cot x</code>。\n<b>④ 反三角函数</b>\n<code>(arcsin x)′ = 1/√(1 − x<sup>2</sup>)</code>；<code>(arccos x)′ = −1/√(1 − x<sup>2</sup>)</code>（<code>|x| &lt; 1</code>）；<code>(arctan x)′ = 1/(1 + x<sup>2</sup>)</code>；<code>(arccot x)′ = −1/(1 + x<sup>2</sup>)</code>。\n<b>⑤ 双曲函数</b>\n<code>(sh x)′ = ch x</code>；<code>(ch x)′ = sh x</code>；<code>(th x)′ = 1/ch<sup>2</sup>x</code>；<code>(arsh x)′ = 1/√(x<sup>2</sup> + 1)</code>；<code>(arch x)′ = 1/√(x<sup>2</sup> − 1)</code>（<code>x &gt; 1</code>）；<code>(arth x)′ = 1/(1 − x<sup>2</sup>)</code>（<code>|x| &lt; 1</code>）。\n<b>组合使用</b>：由 ①~⑤ 加上四则法则、链式法则、反函数法则，可求出一切初等函数的导数。',
          plain: '这张表相当于乘法口诀表：先把最基础的十几种“零件”的导数背熟，以后遇到复杂的函数，就用四则法则和链式法则把它拆成零件，套表即可，不需要每次都回到极限定义去硬算。建议按“幂、指、对、三角、反三角”五类分组记，尤其要记住几个特殊值：<code>e<sup>x</sup></code> 的导数是它自己（这是它最特别的地方），<code>ln x</code> 的导数是 <code>1/x</code>。',
          why: '为什么先算这张表？因为一切初等函数都是由这些基本初等函数通过加、减、乘、除、复合拼出来的，而求导法则恰好是“拼装规则”。有了规则加上零件表，就组成了一个能处理所有初等函数的自动机器。这也解释了 2.2 节的编排顺序：<b>先给零件（公式表），再给拼装规则（四则、反函数、复合）</b>。',
          proof: '给出其中几条的推导，其余可仿此完成或由反函数法则得到。\n<b>(C)′ = 0</b>：<code>Δy = C − C = 0</code>，故 <code>Δy/Δx = 0 → 0</code>。\n<b>(x<sup>n</sup>)′ = nx<sup>n−1</sup></b>（<code>n</code> 为正整数）：用二项式展开，\n<code>[(x + Δx)<sup>n</sup> − x<sup>n</sup>]/Δx = nx<sup>n−1</sup> + [n(n−1)/2]x<sup>n−2</sup>Δx + … + (Δx)<sup>n−1</sup></code>，\n除第一项外每项都含 <code>Δx</code> 的因子，令 <code>Δx → 0</code> 后全为 0，得 <code>nx<sup>n−1</sup></code>。\n<b>(sin x)′ = cos x</b>：用和差化积与重要极限 <code>lim(t→0) sin t / t = 1</code>：\n<code>[sin(x + Δx) − sin x]/Δx = [2 cos(x + Δx/2) sin(Δx/2)]/Δx = cos(x + Δx/2) · [sin(Δx/2)/(Δx/2)]</code>。\n令 <code>Δx → 0</code>，第一因子趋于 <code>cos x</code>，第二因子趋于 1，故导数为 <code>cos x</code>。\n<b>(cos x)′ = −sin x</b>：同法得 <code>−2 sin(x + Δx/2) sin(Δx/2)/Δx → −sin x</code>。\n<b>(e<sup>x</sup>)′ = e<sup>x</sup></b>：<code>(e<sup>x+Δx</sup> − e<sup>x</sup>)/Δx = e<sup>x</sup> · (e<sup>Δx</sup> − 1)/Δx</code>，而 <code>lim(t→0)(e<sup>t</sup> − 1)/t = 1</code>（第 1 章结论），故导数为 <code>e<sup>x</sup></code>。\n<b>(ln x)′ = 1/x</b>：<code>[ln(x + Δx) − ln x]/Δx = (1/Δx) ln(1 + Δx/x) = (1/x) · ln[(1 + Δx/x)<sup>x/Δx</sup>] → (1/x) ln e = 1/x</code>。\n<b>反三角与双曲函数</b>：用反函数求导法则逐个导出。例如 <code>(arctan x)′ = 1/(1 + x<sup>2</sup>)</code> 来自 <code>x = tan y</code>，<code>dx/dy = sec<sup>2</sup>y = 1 + tan<sup>2</sup>y = 1 + x<sup>2</sup></code>，取倒数即得。',
          example: '<code>y = x<sup>3</sup> + e<sup>x</sup> − ln x + arctan x</code>，逐项套表：<code>y′ = 3x<sup>2</sup> + e<sup>x</sup> − 1/x + 1/(1 + x<sup>2</sup>)</code>。\n<code>y = √x · sin x</code>：用乘积法则得 <code>y′ = sin x/(2√x) + √x cos x</code>。',
          pitfalls: [
            '把 <code>(x<sup>μ</sup>)′ = μx<sup>μ−1</sup></code> 与指数函数混淆，写成 <code>(x<sup>μ</sup>)′ = x<sup>μ</sup> ln x</code>；反之把 <code>(a<sup>x</sup>)′</code> 写成 <code>xa<sup>x−1</sup></code>。<b>底在变用幂函数公式，指数在变用指数函数公式，两者都在变就要用对数求导法。</b>',
            '<code>(ln x)′ = 1/x</code> 只对自然对数成立，<code>(log<sub>a</sub>x)′ = 1/(x ln a)</code> 分母上多一个 <code>ln a</code>。',
            '<code>(arcsin x)′</code> 与 <code>(arccos x)′</code> 只差一个负号，后者容易漏掉负号。',
            '对含绝对值的式子直接套公式要小心：<code>(ln|x|)′ = 1/x</code>（<code>x ≠ 0</code>）是对的，但 <code>(√(x<sup>2</sup>))′ = x/|x|</code>，且 <code>x = 0</code> 处不可导，需要单独说明。'
          ],
          tags: ['公式表', '基本初等函数', '求导'],
          related: ['thm-derivative-rules', 'thm-chain-rule', 'thm-inverse-function-derivative']
        },
        {
          id: 'ex-derivative-of-tan',
          kind: 'note',
          name: '例题：用商法则导出 tan x 与 cot x 的导数',
          aka: ['tan 的导数', '例题'],
          statement: '由 <code>tan x = sin x / cos x</code> 及商的求导法则，在 <code>cos x ≠ 0</code> 处\n<code>(tan x)′ = (cos x · cos x − sin x · (−sin x))/cos<sup>2</sup>x = 1/cos<sup>2</sup>x = sec<sup>2</sup>x</code>。\n同理，由 <code>cot x = cos x / sin x</code>，在 <code>sin x ≠ 0</code> 处\n<code>(cot x)′ = (−sin x · sin x − cos x · cos x)/sin<sup>2</sup>x = −1/sin<sup>2</sup>x = −csc<sup>2</sup>x</code>。',
          plain: '正切的导数不用死记，它就是从“正弦除以余弦”用除法规则算出来的。算的时候要注意：余弦的导数是<b>负</b>正弦，这个负号与商法则里的减号相遇，负负得正，所以分子上两项其实是相加的，最后正好凑出 <code>sin<sup>2</sup>x + cos<sup>2</sup>x = 1</code>，得到漂亮的 <code>1/cos<sup>2</sup>x</code>。',
          why: '这类推导值得亲手做一遍，因为它最能说明“公式表不是天上掉下来的”，也顺便训练商法则的符号处理。以后遇到 <code>sec x</code>、<code>csc x</code> 的导数，同样用 <code>sec x = 1/cos x</code>、<code>csc x = 1/sin x</code> 配合 <code>(1/v)′ = −v′/v<sup>2</sup></code> 得到。',
          example: '求 <code>y = tan(3x)</code> 的导数：看作 <code>y = tan u</code>、<code>u = 3x</code>，则 <code>y′ = sec<sup>2</sup>u · 3 = 3sec<sup>2</sup>(3x) = 3/cos<sup>2</sup>(3x)</code>。',
          pitfalls: [
            '在分子里把 <code>−sin x · (−sin x)</code> 写成 <code>−sin<sup>2</sup>x</code>，漏掉负负得正。',
            '把 <code>sec<sup>2</sup>x</code> 写成 <code>sec x<sup>2</sup></code>，那就变成了另一种函数，务必写清平方号的位置。'
          ],
          tags: ['例题', '商法则', '三角函数'],
          related: ['thm-derivative-rules', 'thm-basic-derivative-formulas']
        },
        {
          id: 'ex-derivative-of-arcsin',
          kind: 'note',
          name: '例题：用反函数法则导出 arcsin x 的导数',
          aka: ['arcsin 的导数', '例题'],
          statement: '设 <code>y = arcsin x</code>（<code>|x| &lt; 1</code>），则 <code>x = sin y</code> 且 <code>y ∈ (−π/2, π/2)</code>。此时 <code>dx/dy = cos y &gt; 0</code>，由反函数求导法则\n<code>dy/dx = 1/(dx/dy) = 1/cos y</code>。\n由 <code>sin<sup>2</sup>y + cos<sup>2</sup>y = 1</code> 得 <code>cos y = ±√(1 − x<sup>2</sup>)</code>；又因 <code>y ∈ (−π/2, π/2)</code> 时 <code>cos y &gt; 0</code>，取正根，故\n<code>(arcsin x)′ = 1/√(1 − x<sup>2</sup>)</code>（<code>|x| &lt; 1</code>）。',
          plain: '要算反正弦的导数，但反正弦本身不好直接求差商，于是掉个头算正弦的导数（很熟），再取倒数。剩下的问题只是“把 <code>cos y</code> 换回 <code>x</code>”：因为 <code>x = sin y</code>，由等式 <code>sin<sup>2</sup> + cos<sup>2</sup> = 1</code> 可以反推出 <code>cos y = √(1 − x<sup>2</sup>)</code>。最后的正负号由 <code>y</code> 的取值范围决定——反正弦的值总在 <code>−π/2</code> 到 <code>π/2</code> 之间，那里的余弦是正的，所以取正号。',
          why: '这个例题把三条线索串在一起：<b>反函数法则（掉头取倒数）加上三角恒等式（换回自变量）再加取值范围讨论（定符号）</b>。第三步最容易被忽视，但恰恰是它决定了 <code>(arcsin x)′</code> 取正、<code>(arccos x)′</code> 取负。学会这个套路后，<code>arctan x</code> 的导数也能一并推出来：用 <code>sec<sup>2</sup>y = 1 + tan<sup>2</sup>y = 1 + x<sup>2</sup></code>，正负号自动正确，不需要额外讨论。',
          example: '求 <code>y = arcsin(2x)</code>：外层导数 <code>1/√(1 − u<sup>2</sup>)</code>，内层 <code>u = 2x</code> 导数为 2，故 <code>y′ = 2/√(1 − 4x<sup>2</sup>)</code>（<code>|x| &lt; 1/2</code>）。',
          pitfalls: [
            '把 <code>1/cos y</code> 里的 <code>cos y</code> 直接写成 <code>cos x</code>，混淆了自变量。',
            '取 <code>±√(1 − x<sup>2</sup>)</code> 却不讨论范围，导致 <code>(arcsin x)′</code> 出现错误负号（正确是正号）。',
            '忘记写定义域限制 <code>|x| &lt; 1</code>，在 <code>x = ±1</code> 处导数不存在（差商趋于无穷大）。'
          ],
          tags: ['例题', '反函数法则', '反三角函数'],
          related: ['thm-inverse-function-derivative', 'thm-basic-derivative-formulas', 'ex-derivative-of-tan']
        },
        {
          id: 'met-logarithmic-differentiation',
          kind: 'note',
          name: '对数求导法',
          aka: ['取对数求导', '幂指函数求导'],
          statement: '<b>适用对象</b>：① 多个因子连乘、连除或带方根的函数，如 <code>y = x<sup>2</sup>√(x + 1)/(x − 1)<sup>3</sup></code>；② <b>幂指函数</b> <code>y = u(x)<sup>v(x)</sup></code>（底和指数都含 <code>x</code>），如 <code>y = x<sup>x</sup></code>、<code>y = (sin x)<sup>x</sup></code>。\n<b>步骤</b>：\n① 在 <code>y &gt; 0</code> 处对等式两边取自然对数：<code>ln y = v(x) ln u(x)</code>（若 <code>y</code> 可能为负，则先取绝对值再取对数，得 <code>ln|y|</code>）；\n② 两边对 <code>x</code> 求导，左边得 <code>y′/y</code>（这是链式法则：<code>(ln y)′ = (1/y) · y′</code>）；\n③ 解出 <code>y′ = y · [右边求导的结果]</code>，最后把 <code>y</code> 换回原来的表达式。',
          plain: '这一招的威力在于：<b>对数能把乘除变成加减，把指数搬到前面来</b>。多个式子相乘除，用乘积法则要一层层展开，又长又容易错；先取对数，就把“乘除”变成了“加减”，求导变得很轻松。对于 <code>x<sup>x</sup></code> 这种“底也在变、指数也在变”的函数，已有的公式一个都用不上（幂函数公式要求指数是常数，指数函数公式要求底是常数），取对数后变成 <code>x ln x</code>，就回到会做的题了。',
          why: '为什么取对数能简化？因为对数把很难处理的“幂”降级为“乘法”，把“乘法”降级为“加法”，而这三种运算的求导难度恰好是递增的。换句话说，它是<b>用恒等变形换求导难度</b>。至于左边为什么是 <code>y′/y</code>：因为 <code>y</code> 是 <code>x</code> 的函数，<code>ln y</code> 是复合函数，用链式法则外层导数 <code>1/y</code> 乘上内层导数 <code>y′</code>。',
          proof: '以幂指函数 <code>y = u(x)<sup>v(x)</sup></code>（<code>u(x) &gt; 0</code>，<code>u, v</code> 可导）为例严格写出推导。\n<b>第一步</b>：两边取对数，<code>ln y = v(x) ln u(x)</code>（这里 <code>y &gt; 0</code>，对数有意义）。\n<b>第二步</b>：两边对 <code>x</code> 求导。左边是 <code>ln y</code> 对 <code>x</code> 求导，由链式法则得 <code>y′/y</code>；右边用乘积法则得 <code>v′(x) ln u(x) + v(x) · u′(x)/u(x)</code>。故\n<code>y′/y = v′ ln u + v u′/u</code>。\n<b>第三步</b>：两边乘 <code>y = u<sup>v</sup></code>：\n<code>y′ = u<sup>v</sup> [v′ ln u + v u′/u] = u<sup>v</sup> v′ ln u + v u<sup>v−1</sup> u′</code>。\n注意结果恰好是两项之和：<b>第一项</b> <code>u<sup>v</sup> v′ ln u</code> 正是“把底 <code>u</code> 当常数、只对指数 <code>v</code> 求导”的结果（指数函数公式）；<b>第二项</b> <code>v u<sup>v−1</sup> u′</code> 正是“把指数 <code>v</code> 当常数、只对底 <code>u</code> 求导”的结果（幂函数公式）。这正好解释了下面易错点里说的“两者都在变，要把两种公式的结果相加”。证毕。',
          example: '<b>幂指函数</b>：<code>y = x<sup>x</sup></code>（<code>x &gt; 0</code>）。取对数得 <code>ln y = x ln x</code>，求导得 <code>y′/y = ln x + 1</code>，故 <code>y′ = x<sup>x</sup>(ln x + 1)</code>。\n<b>多因子</b>：<code>y = x<sup>2</sup>√(x + 1)/(x − 1)<sup>3</sup></code>（<code>x &gt; 1</code>）。取对数得 <code>ln y = 2ln x + (1/2)ln(x + 1) − 3ln(x − 1)</code>，求导得 <code>y′/y = 2/x + 1/[2(x + 1)] − 3/(x − 1)</code>，乘回 <code>y</code> 即得 <code>y′</code>。',
          pitfalls: [
            '把 <code>(ln y)′</code> 写成 <code>1/y</code>，漏掉 <code>y′</code>。这是最常见的错误，必须牢记 <code>y</code> 是 <code>x</code> 的函数，要用链式法则。',
            '忘记在最后一步乘回 <code>y</code>，答案里留着 <code>y′/y</code> 这样的中间形式。',
            '对 <code>y = x<sup>x</sup></code> 直接套幂函数公式得 <code>x · x<sup>x−1</sup> = x<sup>x</sup></code>，或套指数函数公式得 <code>x<sup>x</sup> ln x</code>，两个都错（正确答案是两者的和）。',
            '取对数时忽略定义域：<code>x</code> 必须使 <code>y &gt; 0</code>（或改用 <code>ln|y|</code>），否则取对数这一步不合法。'
          ],
          tags: ['对数求导法', '幂指函数', '技巧'],
          related: ['thm-chain-rule', 'thm-derivative-rules', 'thm-basic-derivative-formulas']
        }
      ]
    },
    {
      id: 'ch2-3',
      no: '2.3',
      title: '高阶导数',
      summary: '掌握二阶及更高阶导数的定义与记法，熟记几个常用函数的高阶导数公式，并会用莱布尼茨公式求乘积的高阶导数。',
      items: [
        {
          id: 'def-higher-order-derivative',
          kind: 'definition',
          name: '高阶导数',
          aka: ['二阶导数', 'n 阶导数'],
          statement: '若函数 <code>y = f(x)</code> 的导函数 <code>f′(x)</code> 仍可导，则称 <code>f′(x)</code> 的导数为 <code>f(x)</code> 的<b>二阶导数</b>，记作 <code>y″</code>、<code>f″(x)</code> 或 <code>d<sup>2</sup>y/dx<sup>2</sup></code>，即\n<code>f″(x) = lim(Δx→0) [f′(x + Δx) − f′(x)]/Δx</code>。\n一般地，<code>f(x)</code> 的 <code>n−1</code> 阶导数的导数称为 <code>f(x)</code> 的 <b>n 阶导数</b>，记作 <code>y<sup>(n)</sup></code>、<code>f<sup>(n)</sup>(x)</code> 或 <code>d<sup>n</sup>y/dx<sup>n</sup></code>（<code>n ≥ 2</code>）。二阶及二阶以上的导数统称<b>高阶导数</b>。',
          plain: '一阶导数是“变化得有多快”，二阶导数就是“这个快慢本身变化得有多快”。开车时：位置的一阶导数是速度，速度的一阶导数（也就是位置的二阶导数）就是加速度——油门踩得猛不猛，就是推背感。同理，三阶导数就是“加速度变化得快不快”。',
          why: '为什么要造出高阶导数？因为一阶导数只告诉你“在涨还是跌”，不告诉你“涨得快还是慢地在涨”。判断曲线是“向上弯”还是“向下弯”、判断一个点是极大还是极小（第 3 章的内容），都必须看二阶导数。物理上速度不够用时自然要引入加速度。于是“求导”这个动作可以反复做，形成一串导数：<code>f, f′, f″, f‴, f<sup>(4)</sup>, …</code>。',
          example: '<code>y = x<sup>4</sup></code>：<code>y′ = 4x<sup>3</sup></code>，<code>y″ = 12x<sup>2</sup></code>，<code>y‴ = 24x</code>，<code>y<sup>(4)</sup> = 24</code>，<code>y<sup>(5)</sup> = 0</code>。\n自由落体 <code>s = (1/2)gt<sup>2</sup></code>：<code>s′ = gt</code>（速度），<code>s″ = g</code>（重力加速度，是常数，符合“自由落体是匀加速运动”）。',
          pitfalls: [
            '把 <code>y″</code> 理解为 <code>(y′)<sup>2</sup></code> 或 <code>y · y</code>：它是对 <code>y′</code> 再求一次导，不是平方。',
            '记法混淆：<code>f<sup>(n)</sup>(x)</code> 的括号是必要的，<code>f<sup>n</sup>(x)</code> 通常表示 <code>f</code> 的 <code>n</code> 次幂。',
            '误以为“可导函数的高阶导数总存在”：<code>f(x) = x|x|</code> 一阶可导，但二阶在 0 处不存在。'
          ],
          tags: ['高阶导数', '二阶导数', '定义'],
          related: ['def-derivative', 'thm-higher-order-formulas', 'thm-leibniz-formula']
        },
        {
          id: 'thm-higher-order-formulas',
          kind: 'formula',
          name: '常用函数的高阶导数公式',
          aka: ['n 阶导数公式表'],
          statement: '<b>①</b> <code>(e<sup>x</sup>)<sup>(n)</sup> = e<sup>x</sup></code>；<code>(a<sup>x</sup>)<sup>(n)</sup> = a<sup>x</sup>(ln a)<sup>n</sup></code>。\n<b>②</b> <code>(sin x)<sup>(n)</sup> = sin(x + nπ/2)</code>；<code>(cos x)<sup>(n)</sup> = cos(x + nπ/2)</code>。\n<b>③</b> <code>(ln x)<sup>(n)</sup> = (−1)<sup>n−1</sup>(n−1)!/x<sup>n</sup></code>（<code>x &gt; 0</code>）；一般地 <code>(x<sup>μ</sup>)<sup>(n)</sup> = μ(μ−1)…(μ−n+1)x<sup>μ−n</sup></code>。\n<b>④</b> <code>(1/(x + a))<sup>(n)</sup> = (−1)<sup>n</sup>n!/(x + a)<sup>n+1</sup></code>。\n<b>⑤</b> 若 <code>y = sin(ax + b)</code>，则 <code>y<sup>(n)</sup> = a<sup>n</sup>sin(ax + b + nπ/2)</code>（每求一次导都由内层带出一个因子 <code>a</code>）。',
          plain: '这些公式都是“求几次导之后出现规律”的总结。最省事的记忆办法是：<b>指数函数求导永远不变</b>；<b>正弦余弦求导四次一循环</b>，所以可以记成“每次求导相当于把相位往前推 90 度（<code>π/2</code>）”；<b>对数求导每多求一次就多一个负号、分母次数加一</b>。',
          why: '高阶导数如果每次都硬算，很快就会失控（比如求 <code>sin x</code> 的 100 阶导数）。但求几阶之后你会看到明显的重复模式，把模式写成含 <code>n</code> 的公式就一劳永逸。这种“观察规律、猜出公式、再用归纳法证实”的做法，是数学里处理“任意阶”问题的标准思路。',
          proof: '用数学归纳法。<b>以 <code>(sin x)<sup>(n)</sup> = sin(x + nπ/2)</code> 为例</b>：\n<b>奠基</b>：<code>n = 1</code> 时右边为 <code>sin(x + π/2) = cos x</code>，等于 <code>(sin x)′</code>，成立。\n<b>归纳假设</b>：设 <code>n = k</code> 时成立，即 <code>(sin x)<sup>(k)</sup> = sin(x + kπ/2)</code>。\n<b>归纳步</b>：再求一次导（用链式法则，内层导数 <code>(x + kπ/2)′ = 1</code>），\n<code>(sin x)<sup>(k+1)</sup> = [sin(x + kπ/2)]′ = cos(x + kπ/2) = sin(x + kπ/2 + π/2) = sin(x + (k+1)π/2)</code>。\n故 <code>n = k + 1</code> 时也成立。由归纳原理，对一切正整数 <code>n</code> 成立。\n<b>再证 <code>(ln x)<sup>(n)</sup> = (−1)<sup>n−1</sup>(n−1)!/x<sup>n</sup></code></b>：\n<b>奠基</b>：<code>n = 1</code> 时右边为 <code>(−1)<sup>0</sup> · 0!/x<sup>1</sup> = 1/x</code>，成立。\n<b>归纳步</b>：设 <code>n = k</code> 成立，则再求一次导：\n<code>[ (−1)<sup>k−1</sup>(k−1)! x<sup>−k</sup> ]′ = (−1)<sup>k−1</sup>(k−1)! · (−k) x<sup>−k−1</sup> = (−1)<sup>k</sup> k! / x<sup>k+1</sup></code>，\n恰为 <code>n = k + 1</code> 的形式。证毕。',
          example: '<code>y = sin 2x</code> 的 10 阶导数：<code>y<sup>(10)</sup> = 2<sup>10</sup>sin(2x + 5π) = −1024 sin 2x</code>（因为 <code>10 · π/2 = 5π</code>，而 <code>sin(θ + 5π) = −sin θ</code>）。\n<code>y = xe<sup>x</sup></code> 的二阶导数：<code>y′ = e<sup>x</sup> + xe<sup>x</sup></code>，<code>y″ = e<sup>x</sup> + e<sup>x</sup> + xe<sup>x</sup> = (x + 2)e<sup>x</sup></code>。',
          pitfalls: [
            '把 <code>(sin x)<sup>(n)</sup></code> 里的 <code>nπ/2</code> 写成 <code>π/2</code>，忘记乘 <code>n</code>。',
            '对 <code>y = sin(ax + b)</code> 漏掉 <code>a<sup>n</sup></code> 这个因子：每求一次导都会从内层带出一个 <code>a</code>。',
            '<code>(ln x)<sup>(n)</sup></code> 的符号规律是从 <code>n = 1</code> 起就是正号（因为 <code>(ln x)′ = 1/x &gt; 0</code>），写成 <code>(−1)<sup>n</sup></code> 会全盘错号。',
            '对 <code>ln|x|</code> 这类分段定义的函数直接套 <code>n</code> 阶公式，忘记讨论 <code>x</code> 的符号。'
          ],
          tags: ['高阶导数', '公式', '归纳法'],
          related: ['def-higher-order-derivative', 'thm-leibniz-formula', 'thm-basic-derivative-formulas']
        },
        {
          id: 'thm-leibniz-formula',
          kind: 'theorem',
          name: '莱布尼茨公式',
          aka: ['乘积的高阶导数公式'],
          statement: '设 <code>u = u(x)</code> 与 <code>v = v(x)</code> 都具有 <code>n</code> 阶导数，则\n<code>(uv)<sup>(n)</sup> = ∑<sub>k=0</sub><sup>n</sup> C(n, k) u<sup>(n−k)</sup> v<sup>(k)</sup></code>，\n即\n<code>(uv)<sup>(n)</sup> = u<sup>(n)</sup>v + n u<sup>(n−1)</sup>v′ + [n(n−1)/2!] u<sup>(n−2)</sup>v″ + … + u v<sup>(n)</sup></code>，\n其中 <code>C(n, k) = n!/[k!(n−k)!]</code> 是二项式系数，并约定 <code>u<sup>(0)</sup> = u</code>、<code>v<sup>(0)</sup> = v</code>。',
          plain: '一阶的乘积法则是 <code>(uv)′ = u′v + uv′</code>，两项；再求一次导得到三项；求 <code>n</code> 次就得到 <code>n + 1</code> 项。各项的系数正好是杨辉三角（二项式系数），长得跟 <code>(a + b)<sup>n</sup></code> 的展开式一模一样，只是把幂换成了导数阶数。所以这个公式就是“乘积法则的二项式版本”。',
          why: '为什么会和二项式展开长得一样？因为求导的乘积法则在代数结构上恰好和“分配律”同型：<code>(uv)′ = u′v + uv′</code> 就像 <code>(a + b)</code> 展开时两项各取一个因子。反复应用时，每一阶都相当于在“对 <code>u</code> 求导”和“对 <code>v</code> 求导”之间做选择，选 <code>k</code> 次 <code>v</code>、<code>n−k</code> 次 <code>u</code>，方案数就是 <code>C(n, k)</code>。用归纳法可以把这个直觉变成严格证明。',
          proof: '<b>对 <code>n</code> 用数学归纳法。</b>\n<b>奠基</b>：<code>n = 1</code> 时右边为 <code>C(1,0)u′v + C(1,1)uv′ = u′v + uv′</code>，恰是一阶乘积法则，成立。\n<b>归纳假设</b>：设对 <code>n</code> 成立，即 <code>(uv)<sup>(n)</sup> = ∑<sub>k=0</sub><sup>n</sup> C(n,k) u<sup>(n−k)</sup> v<sup>(k)</sup></code>。\n<b>归纳步</b>：两边再求一次导。对每一项用乘积法则（对 <code>u<sup>(n−k)</sup></code> 求导得 <code>u<sup>(n−k+1)</sup></code>，对 <code>v<sup>(k)</sup></code> 求导得 <code>v<sup>(k+1)</sup></code>）：\n<code>(uv)<sup>(n+1)</sup> = ∑<sub>k=0</sub><sup>n</sup> C(n,k) [ u<sup>(n−k+1)</sup> v<sup>(k)</sup> + u<sup>(n−k)</sup> v<sup>(k+1)</sup> ]</code>。\n现在把两个和式按 <code>v</code> 的导数阶数归并。第一个和式中 <code>v<sup>(k)</sup></code> 的系数是 <code>C(n,k)</code>；第二个和式里含 <code>v<sup>(k)</sup></code> 的项来自 <code>k−1</code>（即 <code>j = k−1</code>），系数是 <code>C(n,k−1)</code>。合并同类项得\n<code>(uv)<sup>(n+1)</sup> = u<sup>(n+1)</sup>v + ∑<sub>k=1</sub><sup>n</sup> [C(n,k) + C(n,k−1)] u<sup>(n+1−k)</sup> v<sup>(k)</sup> + u v<sup>(n+1)</sup></code>。\n由组合恒等式 <code>C(n,k) + C(n,k−1) = C(n+1,k)</code>（杨辉三角的加法规则），上式正是\n<code>∑<sub>k=0</sub><sup>n+1</sup> C(n+1,k) u<sup>(n+1−k)</sup> v<sup>(k)</sup></code>，\n即 <code>n + 1</code> 阶的形式。由归纳原理，公式对一切正整数 <code>n</code> 成立。证毕。',
          example: '求 <code>y = x<sup>2</sup>e<sup>2x</sup></code> 的 20 阶导数。取 <code>u = e<sup>2x</sup></code>（导数永远是 <code>2<sup>n</sup>e<sup>2x</sup></code>），<code>v = x<sup>2</sup></code>（三阶起全为 0）。于是只有 <code>k = 0, 1, 2</code> 三项存活：\n<code>y<sup>(20)</sup> = C(20,0)·2<sup>20</sup>e<sup>2x</sup>·x<sup>2</sup> + C(20,1)·2<sup>19</sup>e<sup>2x</sup>·(2x) + C(20,2)·2<sup>18</sup>e<sup>2x</sup>·2</code>\n<code> = 2<sup>18</sup>e<sup>2x</sup>(4x<sup>2</sup> + 80x + 380)</code>（注意 <code>C(20,1) = 20</code>：<code>20 · 2<sup>19</sup> · 2x = 2<sup>18</sup> · 80x</code>；而 <code>C(20,2) = 190</code>：<code>190 · 2<sup>18</sup> · 2 = 2<sup>18</sup> · 380</code>）。\n这就是该公式最实用之处：<b>只要有一边是多项式，高阶导数很快就会断掉，只剩有限项</b>。',
          pitfalls: [
            '看不到“多项式的三阶以上导数全为 0”这一点，把和式从 <code>k = 0</code> 一直加到 <code>n</code> 硬算。',
            '把 <code>u</code> 与 <code>v</code> 的求导阶数弄反（<code>u</code> 是 <code>n−k</code> 阶、<code>v</code> 是 <code>k</code> 阶），或者系数写错。',
            '在 <code>n = 2</code> 时忘记中间项系数是 <code>C(2,1) = 2</code>，把 <code>(uv)″</code> 写成 <code>u″v + uv″</code>，漏掉了 <code>2u′v′</code>。'
          ],
          tags: ['莱布尼茨公式', '高阶导数', '定理', '归纳法'],
          related: ['def-higher-order-derivative', 'thm-higher-order-formulas', 'thm-derivative-rules']
        }
      ]
    },
    {
      id: 'ch2-4',
      no: '2.4',
      title: '隐函数及由参数方程所确定的函数的导数、相关变化率',
      summary: '掌握隐函数求导法、参数方程求导法（含二阶导数）以及相关变化率问题的解法。',
      items: [
        {
          id: 'met-implicit-differentiation',
          kind: 'note',
          name: '隐函数的求导法',
          aka: ['隐函数求导', '隐函数微分法'],
          statement: '设方程 <code>F(x, y) = 0</code> 确定了可导函数 <code>y = y(x)</code>。求 <code>dy/dx</code> 的方法：把方程中的 <code>y</code> 看作 <code>x</code> 的函数，两边同时对 <code>x</code> 求导，凡是遇到含 <code>y</code> 的项都要按<b>复合函数</b>处理（例如 <code>(y<sup>2</sup>)′ = 2y · y′</code>，<code>(sin y)′ = cos y · y′</code>），得到一个关于 <code>y′</code> 的方程，再解出 <code>y′</code>。\n<b>典型例子</b>：圆 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 两边求导得 <code>2x + 2y y′ = 0</code>，故 <code>y′ = −x/y</code>（<code>y ≠ 0</code>）。',
          plain: '有些关系式没法把 <code>y</code> 单独解出来写在等号左边（比如 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 里 <code>y</code> 带根号，还有 <code>e<sup>y</sup> + xy = 1</code> 这种根本解不出来）。但没关系：我们不需要知道 <code>y</code> 的显式表达式，只需要知道它<b>跟着 x 变</b>。于是把 <code>y</code> 当成一个“隐形的函数”，对整个等式求导，求导时凡是 <code>y</code> 都额外乘一个 <code>y′</code>（因为它里面藏着 <code>x</code>），就像拆快递盒，每打开一层都要记一笔。最后把 <code>y′</code> 当未知数解出来即可。',
          why: '关键的一步是<b>承认 y 是 x 的函数</b>。很多同学在这里卡住，是因为看到 <code>y</code> 就以为它是字母常数。一旦接受“<code>y</code> 的背后是 <code>x</code>”，那么 <code>y<sup>2</sup></code> 就是复合函数，链式法则要求乘 <code>2y</code> 再乘 <code>y′</code>。求导后得到的式子通常既含 <code>x</code> 又含 <code>y</code>，这是正常的：隐函数的导数往往用 <code>x</code> 和 <code>y</code> 共同表示，不必非要化成只含 <code>x</code>。',
          proof: '<b>为什么这样做是对的？</b>严格地说，设 <code>y = y(x)</code> 是使 <code>F(x, y(x)) ≡ 0</code> 在某个区间上恒成立的可导函数。\n<b>第一步</b>：把恒等式左边看作 <code>x</code> 的复合函数 <code>G(x) = F(x, y(x))</code>。因为 <code>G</code> 恒等于 0，所以它的导数也恒等于 0，即 <code>G′(x) = 0</code>。\n<b>第二步</b>：用链式法则计算 <code>G′(x)</code>。<code>G</code> 通过两条路径依赖 <code>x</code>：一是第一个变量 <code>x</code> 直接出现，二是第二个变量 <code>y</code> 又依赖 <code>x</code>。故\n<code>0 = G′(x) = F<sub>x</sub>′(x, y) + F<sub>y</sub>′(x, y) · y′(x)</code>，\n其中 <code>F<sub>x</sub>′</code> 表示把 <code>y</code> 当常数对 <code>x</code> 求导，<code>F<sub>y</sub>′</code> 表示把 <code>x</code> 当常数对 <code>y</code> 求导。\n<b>第三步</b>：当 <code>F<sub>y</sub>′ ≠ 0</code> 时解出\n<code>y′ = −F<sub>x</sub>′/F<sub>y</sub>′</code>。\n以 <code>F = x<sup>2</sup> + y<sup>2</sup> − 1</code> 验证：<code>F<sub>x</sub>′ = 2x</code>，<code>F<sub>y</sub>′ = 2y</code>，故 <code>y′ = −2x/2y = −x/y</code>，与直接计算完全一致。证毕。',
          example: '<b>例 1</b>：<code>e<sup>y</sup> + xy = 1</code>。两边对 <code>x</code> 求导：<code>e<sup>y</sup> y′ + y + x y′ = 0</code>，故 <code>y′ = −y/(e<sup>y</sup> + x)</code>。\n<b>例 2</b>：求圆 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 在点 <code>(√2/2, √2/2)</code> 处的切线。由 <code>y′ = −x/y = −1</code>，切线为 <code>y − √2/2 = −(x − √2/2)</code>，即 <code>x + y = √2</code>。\n<b>例 3（二阶导）</b>：由 <code>2x + 2y y′ = 0</code> 再对 <code>x</code> 求导：<code>2 + 2(y′)<sup>2</sup> + 2y y″ = 0</code>，得 <code>y″ = −[1 + (y′)<sup>2</sup>]/y</code>；代入 <code>y′ = −x/y</code> 得 <code>y″ = −(1 + x<sup>2</sup>/y<sup>2</sup>)/y = −1/y<sup>3</sup></code>。',
          pitfalls: [
            '忘了给含 <code>y</code> 的项乘 <code>y′</code>：把 <code>(y<sup>2</sup>)′</code> 写成 <code>2y</code> 而不是 <code>2y · y′</code>。',
            '求二阶导数时，把上一步得到的 <code>y′</code> 当成常数（对 <code>x</code> 求导归零）。<code>y′</code> 仍是 <code>x</code> 的函数，必须继续用链式法则。',
            '解出 <code>y′</code> 后忘了把 <code>y</code> 保留（隐函数的导数里出现 <code>y</code> 是完全允许的，不必强行消去）；也不能中途停手只写出关于 <code>y′</code> 的方程。',
            '对含 <code>y</code> 的式子取对数或开方时，忽略 <code>y &gt; 0</code> 这类条件。'
          ],
          tags: ['隐函数', '求导法', '链式法则'],
          related: ['thm-chain-rule', 'met-parametric-differentiation', 'def-tangent-line']
        },
        {
          id: 'met-parametric-differentiation',
          kind: 'note',
          name: '由参数方程所确定的函数的导数',
          aka: ['参数方程求导', '参数式求导'],
          statement: '设参数方程 <code>x = φ(t)</code>，<code>y = ψ(t)</code> 确定了 <code>y</code> 与 <code>x</code> 的函数关系，<code>φ(t)</code>、<code>ψ(t)</code> 都可导且 <code>φ′(t) ≠ 0</code>，则\n<code>dy/dx = (dy/dt)/(dx/dt) = ψ′(t)/φ′(t)</code>。\n<b>二阶导数</b>：<code>d<sup>2</sup>y/dx<sup>2</sup> = [d/dt(ψ′(t)/φ′(t))] / φ′(t)</code>，即“先把 <code>dy/dx</code> 对 <code>t</code> 求导，再除以 <code>φ′(t)</code>”，而<b>不是</b>简单地 <code>ψ″(t)/φ″(t)</code>。展开后为\n<code>d<sup>2</sup>y/dx<sup>2</sup> = [ψ″(t)φ′(t) − ψ′(t)φ″(t)]/[φ′(t)]<sup>3</sup></code>。',
          plain: '参数方程像“机器人画画”：<code>t</code> 是时间，<code>x</code> 和 <code>y</code> 分别是机器人横坐标和纵坐标随时间的变化。要知道画出的曲线有多陡，本该算 <code>dy/dx</code>，可 <code>y</code> 和 <code>x</code> 都没有直接写成彼此的函数。于是用时间 <code>t</code> 当中转：先算 <code>y</code> 每秒变化多少（<code>dy/dt</code>）、<code>x</code> 每秒变化多少（<code>dx/dt</code>），两者相除就是“<code>x</code> 每前进一点，<code>y</code> 上升多少”。这就像告诉你“每秒向右走 2 米、向上走 6 米”，那么坡度当然是 6 ÷ 2 = 3。',
          why: '公式的来源就是链式法则：把 <code>y</code> 看成 <code>t</code> 的函数、<code>t</code> 看成 <code>x</code> 的函数（由 <code>x = φ(t)</code> 反解），于是 <code>dy/dx = (dy/dt) · (dt/dx)</code>，而由反函数法则 <code>dt/dx = 1/(dx/dt)</code>，两项一合就是 <code>ψ′(t)/φ′(t)</code>。为什么二阶导数不能写成 <code>ψ″/φ″</code>？因为 <code>dy/dx</code> 仍然是 <code>t</code> 的函数，要对它再求一次关于 <code>x</code> 的导数，必须再走一遍“先对 <code>t</code> 求导、再乘 <code>dt/dx</code>”的过程，<b>分母只多一次 φ′(t)，不是把 φ″ 拿来除</b>——这是初学者最常踩的坑。',
          proof: '<b>一阶公式</b>：设 <code>x = φ(t)</code> 严格单调可导且 <code>φ′(t) ≠ 0</code>。由反函数求导法则，其反函数 <code>t = φ<sup>−1</sup>(x)</code> 可导，且 <code>dt/dx = 1/φ′(t)</code>。于是 <code>y = ψ(t) = ψ(φ<sup>−1</sup>(x))</code> 是 <code>x</code> 的复合函数。用链式法则：\n<code>dy/dx = (dy/dt) · (dt/dx) = ψ′(t) · 1/φ′(t) = ψ′(t)/φ′(t)</code>。\n<b>二阶公式</b>：记 <code>u(t) = ψ′(t)/φ′(t)</code>，则 <code>dy/dx = u(t)</code> 仍是 <code>t</code> 的函数。对它再次使用同一公式（这次被求导的函数是 <code>u</code>）：\n<code>d<sup>2</sup>y/dx<sup>2</sup> = d/dx[u(t)] = (du/dt) · (dt/dx) = [d/dt(ψ′(t)/φ′(t))] · 1/φ′(t)</code>。\n把 <code>du/dt</code> 用商的求导法则展开：\n<code>du/dt = [ψ″(t)φ′(t) − ψ′(t)φ″(t)]/[φ′(t)]<sup>2</sup></code>，\n再乘上 <code>1/φ′(t)</code>，得\n<code>d<sup>2</sup>y/dx<sup>2</sup> = [ψ″(t)φ′(t) − ψ′(t)φ″(t)]/[φ′(t)]<sup>3</sup></code>。\n可见分母是 <code>φ′(t)</code> 的三次方：一次来自 <code>du/dt</code> 展开时分母的平方，再一次来自 <code>dt/dx</code>。这也说明为什么 <code>ψ″/φ″</code> 是错的。证毕。',
          example: '<b>例 1</b>：摆线 <code>x = a(t − sin t)</code>，<code>y = a(1 − cos t)</code>。则 <code>dx/dt = a(1 − cos t)</code>，<code>dy/dt = a sin t</code>，故 <code>dy/dx = sin t/(1 − cos t)</code>。\n<b>例 2（二阶导）</b>：椭圆 <code>x = a cos t</code>，<code>y = b sin t</code>。<code>dy/dx = (b cos t)/(−a sin t) = −(b/a)cot t</code>。再求一次：\n<code>d<sup>2</sup>y/dx<sup>2</sup> = [d/dt(−(b/a)cot t)]/(−a sin t) = [(b/a)csc<sup>2</sup>t]/(−a sin t) = −b/(a<sup>2</sup>sin<sup>3</sup>t)</code>。',
          pitfalls: [
            '<b>把二阶导数写成 <code>ψ″(t)/φ″(t)</code></b>，这是最经典的错误；正确做法是对 <code>dy/dx</code> 这个仍含 <code>t</code> 的式子再走一遍“对 <code>t</code> 求导、除以 <code>φ′(t)</code>”。',
            '算完一阶导数发现结果里还有 <code>t</code>，以为算错了。参数式求导的结果通常就用参数 <code>t</code> 表示；若题目要求某点的切线斜率，再把该点的 <code>t</code> 代入。',
            '忽略条件 <code>φ′(t) ≠ 0</code>：当 <code>φ′(t₀) = 0</code> 且 <code>ψ′(t₀) ≠ 0</code> 时，曲线在该点有竖直切线。',
            '求切线时把参数 <code>t₀</code> 与坐标 <code>x₀, y₀</code> 混用：应先用 <code>x₀ = φ(t₀)</code>、<code>y₀ = ψ(t₀)</code> 求出切点坐标。'
          ],
          tags: ['参数方程', '求导法', '二阶导数'],
          related: ['met-implicit-differentiation', 'thm-chain-rule', 'thm-inverse-function-derivative', 'def-tangent-line']
        },
        {
          id: 'thm-related-rates',
          kind: 'theorem',
          name: '相关变化率',
          aka: ['相关变化率问题'],
          statement: '设 <code>x = x(t)</code> 与 <code>y = y(t)</code> 都是由参数 <code>t</code>（通常为时间）确定的<b>可导</b>函数，且二者之间满足某个方程 <code>F(x, y) = 0</code>（在某区间上恒成立）。则它们对 <code>t</code> 的变化率 <code>dx/dt</code> 与 <code>dy/dt</code> 之间满足把该方程两边对 <code>t</code> 求导后的关系（<code>x, y</code> 都是 <code>t</code> 的函数，用链式法则），于是可由其中一个变化率求出另一个。\n<b>常用结论</b>：若 <code>x<sup>2</sup> + y<sup>2</sup> = s<sup>2</sup></code>（<code>s</code> 为常数），则 <code>2x(dx/dt) + 2y(dy/dt) = 0</code>，即 <code>dy/dt = −(x/y)(dx/dt)</code>。',
          plain: '相关变化率就是“两件互相牵连的事，一件变多快，另一件必然跟着变多快”。比如气球在吹大：体积变大时半径也在变大，两者速度密切相关；再如梯子靠墙，梯子底端往外滑多快，顶端就往下落多快，而且落的速度还会越来越快。这类题不需要背公式，只要<b>先写出两者之间的几何或物理关系式，再对时间求一次导</b>，关系就出来了。',
          why: '为什么“对 <code>t</code> 求导”就能得到变化率的关系？因为关系式 <code>F(x(t), y(t)) = 0</code> 是恒等式，对时间求导后左边是 <code>F<sub>x</sub>′ · dx/dt + F<sub>y</sub>′ · dy/dt</code>，右边是 0，这就把两个变化率线性地联系在一起了。注意<b>千万不要先代具体数值再求导</b>：<code>x = 3</code> 是一个瞬时状态，代进去后 <code>x</code> 就成了常数，导数变 0，关系式立刻失效。必须在<b>含变量的关系式</b>上求导，最后才把瞬时数值代入。',
          proof: '设 <code>x = x(t)</code>、<code>y = y(t)</code> 可导，且在某个 <code>t</code> 区间上恒有 <code>F(x(t), y(t)) ≡ 0</code>。\n<b>第一步</b>：恒为 0 的函数导数也为 0，故 <code>d/dt F(x(t), y(t)) = 0</code>。\n<b>第二步</b>：由链式法则（<code>F</code> 经两条路径依赖 <code>t</code>）：\n<code>F<sub>x</sub>′(x, y) · (dx/dt) + F<sub>y</sub>′(x, y) · (dy/dt) = 0</code>。\n<b>第三步</b>：当 <code>F<sub>y</sub>′ ≠ 0</code> 时解得\n<code>dy/dt = −[F<sub>x</sub>′(x, y)/F<sub>y</sub>′(x, y)] · (dx/dt)</code>。\n这说明两个变化率成<b>固定比例</b>（比例系数随位置变化），从而已知一个即可求出另一个。\n<b>特别地</b>，取 <code>F = x<sup>2</sup> + y<sup>2</sup> − s<sup>2</sup></code>，得 <code>2x(dx/dt) + 2y(dy/dt) = 0</code>，即 <code>dy/dt = −(x/y)(dx/dt)</code>。证毕。',
          example: '<b>梯子问题</b>：长 5 米的梯子斜靠墙上，底端离墙 <code>x</code> 米，顶端高 <code>y</code> 米，恒有 <code>x<sup>2</sup> + y<sup>2</sup> = 25</code>。两边对 <code>t</code> 求导：<code>2x(dx/dt) + 2y(dy/dt) = 0</code>。当 <code>x = 3</code>（故 <code>y = 4</code>）、底端以 <code>dx/dt = 2</code> 米/秒外滑时，<code>dy/dt = −(3/4) × 2 = −1.5</code> 米/秒，即顶端以 1.5 米/秒下落。\n<b>气球问题</b>：球半径 <code>r</code>、体积 <code>V = (4/3)πr<sup>3</sup></code>，对 <code>t</code> 求导得 <code>dV/dt = 4πr<sup>2</sup>(dr/dt)</code>。若已知充气速率 <code>dV/dt</code>，即可求半径的增长速度。',
          pitfalls: [
            '<b>先代入瞬时数值再求导</b>：把 <code>x = 3</code> 代进 <code>x<sup>2</sup> + y<sup>2</sup> = 25</code> 得到 <code>9 + y<sup>2</sup> = 25</code>，两边对 <code>t</code> 求导得 <code>0 = 0</code>，什么也算不出。必须先在含 <code>x, y</code> 的式子上求导，最后再代入。',
            '漏乘链式法则的内层因子：把 <code>d/dt(x<sup>2</sup>)</code> 写成 <code>2x</code>，正确是 <code>2x · dx/dt</code>。',
            '正负号弄错：下降的速率应带负号。要分清“变化率 <code>dy/dt</code>”与“速率 <code>|dy/dt|</code>”这两个不同的说法。',
            '单位不统一（米、厘米、秒、分钟混用），导致最终结果差若干倍。'
          ],
          tags: ['相关变化率', '链式法则', '应用题', '定理'],
          related: ['met-implicit-differentiation', 'thm-chain-rule', 'thm-differential-form-invariance']
        }
      ]
    },
    {
      id: 'ch2-5',
      no: '2.5',
      title: '函数的微分',
      summary: '理解微分的定义与几何意义、微分形式不变性，掌握微分公式与运算法则，并会用它做近似计算。',
      items: [
        {
          id: 'def-differential',
          kind: 'definition',
          name: '微分的定义',
          statement: '设函数 <code>y = f(x)</code> 在某区间内有定义，<code>x₀</code> 及 <code>x₀ + Δx</code> 都在该区间内。若函数的增量\n<code>Δy = f(x₀ + Δx) − f(x₀)</code>\n可以表示为\n<code>Δy = A · Δx + o(Δx)</code>（当 <code>Δx → 0</code>），\n其中 <code>A</code> 是<b>不依赖于 Δx</b> 的常数，<code>o(Δx)</code> 是比 <code>Δx</code> 高阶的无穷小（即 <code>lim(Δx→0) o(Δx)/Δx = 0</code>），则称 <code>f(x)</code> 在点 <code>x₀</code> 处<b>可微</b>，并称 <code>A · Δx</code> 为 <code>f(x)</code> 在点 <code>x₀</code> 处的<b>微分</b>，记作 <code>dy</code>，即 <code>dy = A · Δx</code>。\n<b>重要结论</b>：<code>f</code> 在 <code>x₀</code> 处可微 <code>⇔</code> <code>f</code> 在 <code>x₀</code> 处可导，且此时必有 <code>A = f′(x₀)</code>。于是 <code>dy = f′(x₀)Δx</code>。再约定自变量的微分就是它的增量 <code>dx = Δx</code>，就得到常用的写法 <code>dy = f′(x)dx</code>，从而 <code>dy/dx = f′(x)</code>。',
          plain: '函数的增量 <code>Δy</code>（真实变化量）通常很复杂，因为它带着曲线的弯曲。微分做的事是：<b>用一个最简单的量——正比例量 <code>A · Δx</code>——去代替 Δy，并且保证误差小到可以忽略</b>。生活里最像的例子是：用直尺去量一条弯弯曲曲的路，短短一段内你完全可以把它当直线来量，误差小到看不出来。<code>Δy</code> 是曲线的真实长度，<code>dy</code> 是直尺量出的长度。离开这一小段，误差就大了，所以微分只在“很小的范围”内是好的近似。',
          why: '为什么敢用最简单的正比例量去替代复杂量？因为 <code>Δy</code> 本身当 <code>Δx → 0</code> 时也趋于 0，问题只是<b>它趋于 0 的“速度”</b>。我们关心的恰恰是“主部”：可以把 <code>Δy</code> 拆成“主导项 + 微小剩余”，而主导项天然是 <code>Δx</code> 的一次项。至于为什么是直线（一次）而不是曲线（二次），因为二次及以上项在 <code>Δx → 0</code> 时<b>比一次项更快地消失</b>，因此相对误差趋于 0——这就是 <code>o(Δx)</code> 的含义。关键条件是“<code>A</code> 与 <code>Δx</code> 无关”：它保证主导项只随 <code>Δx</code> 线性地放大缩小，不掺入别的东西。',
          proof: '<b>证明“可微 ⇔ 可导”，且 A = f′(x₀)。</b>\n<b>（⇒）设 <code>f</code> 在 <code>x₀</code> 可微</b>：存在与 <code>Δx</code> 无关的常数 <code>A</code>，使 <code>Δy = AΔx + o(Δx)</code>。两边除以 <code>Δx</code>（<code>Δx ≠ 0</code>）：\n<code>Δy/Δx = A + o(Δx)/Δx</code>。\n令 <code>Δx → 0</code>，第二项趋于 0（这正是高阶无穷小的定义），故 <code>lim Δy/Δx = A</code> 存在，即 <code>f</code> 在 <code>x₀</code> 可导且 <code>f′(x₀) = A</code>。\n<b>（⇐）设 <code>f</code> 在 <code>x₀</code> 可导</b>：<code>lim(Δx→0) Δy/Δx = f′(x₀)</code>。令\n<code>α = Δy/Δx − f′(x₀)</code>（<code>Δx ≠ 0</code>），\n则 <code>lim(Δx→0) α = 0</code>，即 <code>α</code> 是无穷小，于是\n<code>Δy = f′(x₀)Δx + α · Δx</code>，而 <code>αΔx = o(Δx)</code>（因为 <code>αΔx/Δx = α → 0</code>）。\n取 <code>A = f′(x₀)</code>（显然与 <code>Δx</code> 无关），即得 <code>Δy = AΔx + o(Δx)</code>，故 <code>f</code> 在 <code>x₀</code> 可微，且 <code>dy = f′(x₀)Δx</code>。\n<b>关于 <code>dy = f′(x)dx</code></b>：对恒等函数 <code>y = x</code>，<code>dy = (x)′Δx = Δx</code>，而它的微分按定义就是自变量的微分 <code>dx</code>，故 <code>dx = Δx</code>。代入上式得 <code>dy = f′(x)dx</code>，两边除以 <code>dx</code> 得 <code>dy/dx = f′(x)</code>。这正说明记号 <code>dy/dx</code> 为什么长得像分数：它是<b>两个微分之商</b>，所以导数也叫“微商”。证毕。',
          example: '<b>例 1</b>：<code>y = x<sup>2</sup></code>，<code>dy = 2x dx</code>。在 <code>x₀ = 1</code>、<code>Δx = 0.01</code> 处：<code>Δy = 1.01<sup>2</sup> − 1 = 0.0201</code>，而 <code>dy = 2 × 1 × 0.01 = 0.02</code>。两者相差 <code>0.0001</code>，相对误差只有约 0.5%。\n<b>例 2</b>：<code>y = sin x</code>，<code>dy = cos x dx</code>；在 <code>x = 0</code>、<code>dx = 0.02</code> 处 <code>dy = 0.02</code>，而真实 <code>Δy = sin 0.02 ≈ 0.0199987</code>。',
          pitfalls: [
            '把 <code>dy</code> 与 <code>Δy</code> 完全等同：<code>dy</code> 只是<b>近似值</b>，一般 <code>Δy ≠ dy</code>（在 <code>y = x<sup>2</sup></code> 的例子中两者相差 <code>(Δx)<sup>2</sup></code>）。',
            '混淆 <code>dy</code> 与 <code>dx</code>：<code>dx = Δx</code> 是自变量增量本身（可以任意给定），<code>dy</code> 是因变量增量的线性主部（由 <code>dx</code> 决定）。',
            '以为“可微”是比“可导”更强的条件：对一元函数而言两者<b>完全等价</b>；这里多花笔墨只是换了一套更看重“近似”的视角。',
            '把定义里的 <code>A</code> 当成随 <code>Δx</code> 变化的量，那样就失去了“线性主部”的意义。'
          ],
          tags: ['微分', '定义', '可微', '线性主部'],
          related: ['def-derivative', 'thm-differential-geometry', 'thm-derivative-differential-relation', 'thm-differential-form-invariance', 'thm-approx-computation']
        },
        {
          id: 'thm-derivative-differential-relation',
          kind: 'theorem',
          name: '导数与微分的关系（微商）',
          statement: '函数 <code>f</code> 在点 <code>x</code> 处可导与可微等价，且此时\n<code>dy = f′(x)dx</code>，<code>dy/dx = f′(x)</code>。\n即：<b>导数等于函数的微分与自变量的微分之商</b>，故导数也称为<b>微商</b>。等价地，<code>f′(x) = lim(Δx→0) dy/Δx</code>。',
          plain: '同一个东西有两副面孔：一副是“变化快慢”（导数），一副是“变化量的近似值”（微分）。它们的联系就是 <code>dy = f′(x)dx</code>：把导数当作“每单位输入带来的输出变化”，乘上你输入的这一点点 <code>dx</code>，就得到输出大约变化了多少。这也是为什么导数记作 <code>dy/dx</code>——它真的可以看成“两个微小量的商”。\n[[tip:有了 <code>dy = f′(x)dx</code>，很多实际问题可以这样理解：已知“每多生产一件产品，成本增加 30 元”（导数），那么容易算出“多生产 50 件，成本约增加 1500 元”（微分）。]]',
          why: '这条定理是把 2.1 节和 2.5 节缝在一起的那根线。它解释了为什么微分学里同一个符号 <code>dy/dx</code> 既能表示导数、又能参与“约分”式的运算（如链式法则、参数方程求导）——因为它本来就是一个商。理解这一点后，链式法则、反函数法则、微分形式不变性都会变得自然。',
          proof: '由微分的定义（见 <code>def-differential</code>）：<code>f</code> 在 <code>x</code> 处可微当且仅当可导，且可微时 <code>A = f′(x)</code>，于是\n<code>dy = f′(x)Δx</code>。\n又对自变量 <code>x</code> 本身，取 <code>f(x) = x</code> 得 <code>dx = (x)′Δx = Δx</code>，即自变量的微分等于自变量的增量。代入前式即得\n<code>dy = f′(x)dx</code>。\n两边同除 <code>dx</code>（<code>dx = Δx ≠ 0</code>）：<code>dy/dx = f′(x)</code>。证毕。',
          example: '<code>y = x<sup>3</sup></code>，<code>dy = 3x<sup>2</sup>dx</code>。在 <code>x = 2</code> 处，输入从 2 增加到 2.001（<code>dx = 0.001</code>），则 <code>dy = 3 × 4 × 0.001 = 0.012</code>，而真实增量 <code>Δy = 2.001<sup>3</sup> − 8 ≈ 0.012006</code>，两者非常接近。',
          pitfalls: [
            '把 <code>dy/dx</code> 当成两个数的商来“约分”是危险的：只有在明确 <code>dx</code> 是自变量微分、<code>dy</code> 是对应的函数微分时，这个记号才可以按分数处理。',
            '在求微分时把 <code>dx</code> 漏掉（写成 <code>dy = 3x<sup>2</sup></code>）：微分必须带上 <code>dx</code>，否则它就不是一个可以比较的“变化量”了。',
            '把 <code>f′(x) = dy/Δx</code> 与 <code>f′(x) = dy/dx</code> 混用：前者只有在 <code>dx = Δx</code> 的约定下才成立，且 <code>dy ≠ Δy</code>。'
          ],
          tags: ['微分', '导数', '微商'],
          related: ['def-differential', 'def-derivative', 'thm-differential-form-invariance']
        },
        {
          id: 'thm-differential-geometry',
          kind: 'theorem',
          name: '微分的几何意义',
          statement: '设曲线 <code>y = f(x)</code> 在点 <code>M(x₀, y₀)</code> 处可导，过 <code>M</code> 作切线。给 <code>x₀</code> 增量 <code>Δx</code>，则在图上：\n<b>①</b> <code>Δy = f(x₀ + Δx) − f(x₀)</code> 是曲线在 <code>x₀ + Δx</code> 处与 <code>M</code> 的<b>纵坐标之差</b>（曲线的真实上升量）；\n<b>②</b> <code>dy = f′(x₀)Δx</code> 是<b>切线</b>在 <code>x₀ + Δx</code> 处与 <code>M</code> 的纵坐标之差（沿切线的上升量）；\n<b>③</b> 两者之差 <code>Δy − dy = o(Δx)</code>，当 <code>Δx → 0</code> 时它比 <code>Δx</code> 更快地趋于 0。',
          plain: '把曲线想成一条弯曲的山路，切线就是在这点铺上的一块直木板。<code>Δy</code> 是你沿着弯曲山路实际爬升的高度，<code>dy</code> 是沿着木板爬升的高度。路很短时，木板和山路几乎贴在一起，两个高度差得极少，用木板算就够了；路一长，木板就脱离山路，误差变大。所以微分 = <b>用切线（直线）代替曲线，在很短的范围内估算高度变化</b>。',
          why: '这个几何图像是整章最值得记住的一张图：<b>导数给出切线的斜率，微分给出切线上的纵向增量</b>。它同时解释了为什么微分可以用于近似计算（直线好算，曲线难算），也解释了为什么 <code>Δy − dy</code> 是 <code>Δx</code> 的高阶无穷小（木板与山路在小范围内的偏差是“二阶”的，也就是 <code>(Δx)<sup>2</sup></code> 量级）。',
          proof: '<b>第一步（把两个量在图上落实）</b>：设 <code>M(x₀, y₀)</code>。切线方程为 <code>y = y₀ + f′(x₀)(x − x₀)</code>。取 <code>x = x₀ + Δx</code>，曲线上对应点为 <code>N(x₀ + Δx, f(x₀ + Δx))</code>，切线上对应点为 <code>T(x₀ + Δx, y₀ + f′(x₀)Δx)</code>。于是\n<code>Δy = f(x₀ + Δx) − f(x₀)</code>（<code>N</code> 与 <code>M</code> 的纵坐标差），\n<code>dy = f′(x₀)Δx</code>（<code>T</code> 与 <code>M</code> 的纵坐标差）。\n<b>第二步（作差）</b>：<code>Δy − dy = [f(x₀ + Δx) − f(x₀)] − f′(x₀)Δx</code>。\n<b>第三步（证明它是高阶无穷小）</b>：由 <code>f</code> 在 <code>x₀</code> 可导，<code>lim(Δx→0) [f(x₀ + Δx) − f(x₀)]/Δx = f′(x₀)</code>，故\n<code>lim(Δx→0) (Δy − dy)/Δx = lim(Δx→0) {[f(x₀ + Δx) − f(x₀)]/Δx − f′(x₀)} = 0</code>。\n按定义，<code>Δy − dy = o(Δx)</code>。证毕。',
          example: '<code>y = x<sup>2</sup></code>，<code>x₀ = 1</code>，<code>Δx = 0.1</code>：<code>Δy = 1.1<sup>2</sup> − 1 = 0.21</code>，<code>dy = 2 × 0.1 = 0.2</code>，误差 <code>0.01 = (Δx)<sup>2</sup></code>。若取 <code>Δx = 0.01</code>，则 <code>Δy = 0.0201</code>、<code>dy = 0.02</code>，误差只有 <code>0.0001</code>——<b><code>Δx</code> 缩小 10 倍，误差缩小 100 倍</b>，这正是“高阶无穷小”的具体体现。',
          pitfalls: [
            '在图上把 <code>dy</code> 画成曲线的纵向增量（那是 <code>Δy</code>）。<code>dy</code> 一定在<b>切线</b>上量。',
            '以为误差 <code>Δy − dy</code> 可以忽略就一定是零：它是高阶无穷小，但只是“相对 <code>Δx</code> 而言”很小，绝对值仍可能不小（<code>Δx</code> 大时尤其如此）。',
            '在 <code>f′(x₀) = 0</code> 时以为微分没有意义：此时 <code>dy = 0</code>，切线水平，说明该点附近函数值几乎不变。'
          ],
          tags: ['微分', '几何意义', '切线', '近似'],
          related: ['def-differential', 'thm-derivative-geometry', 'thm-approx-computation']
        },
        {
          id: 'thm-differential-form-invariance',
          kind: 'theorem',
          name: '微分形式不变性（一阶微分形式不变性）',
          aka: ['一阶微分形式不变性'],
          statement: '设函数 <code>y = f(u)</code> 可微：\n<b>①</b> 当 <code>u</code> 是<b>自变量</b>时，<code>dy = f′(u)du</code>；\n<b>②</b> 当 <code>u</code> 是<b>中间变量</b>，即 <code>u = g(x)</code> 是 <code>x</code> 的可微函数时，复合函数 <code>y = f[g(x)]</code> 的微分仍然是\n<code>dy = f′(u)du = f′(u)g′(x)dx</code>。\n也就是说：<b>无论 <code>u</code> 是自变量还是中间变量，微分都写成 <code>dy = f′(u)du</code> 这同一个形式</b>，这叫一阶微分形式不变性。',
          plain: '这条性质说的是：微分公式“<code>dy = f′(u)du</code>”长得很结实，不管 <code>u</code> 是“最终的自变量”还是“中间的中转站”，写法都不变。这件事听起来玄，其实很实在：它让你在求微分时<b>不用操心 u 到底是什么身份</b>，只管按公式一层层写下去就行，就像叠积木一样自然。',
          why: '为什么会有不变性？因为 <code>du</code> 的含义在两种情形下不同：<code>u</code> 是自变量时 <code>du = Δu</code>（真正的增量）；<code>u</code> 是中间变量时 <code>du = g′(x)dx</code>（只是 <code>Δu</code> 的线性主部，一般 <code>du ≠ Δu</code>）。按定义，导数的公式必须写成 <code>dy = f′(u)Δu</code> 才行；可因为链式法则凑巧给出 <code>f′(u)g′(x) = [f(g(x))]′</code>，把 <code>du = g′(x)dx</code> 一替换，形式就自动对上了。<b>这不是巧合，而是链式法则的另一种说法</b>；这也正是它值得单独作为定理的原因——它把链式法则“包装”成了一条极好用的运算规则。',
          proof: '<b>情形 ①（u 为自变量）</b>：由微分定义，<code>dy = f′(u)du</code>，其中 <code>du = Δu</code>。\n<b>情形 ②（u = g(x) 为中间变量）</b>：设 <code>y = f[g(x)]</code>。\n<b>第一步</b>：由链式法则，复合函数 <code>y = f[g(x)]</code> 对 <code>x</code> 可导，且\n<code>[f(g(x))]′ = f′(u) · g′(x)</code>，其中 <code>u = g(x)</code>。\n<b>第二步</b>：由微分的定义（<code>def-differential</code>），复合函数的微分为\n<code>dy = [f(g(x))]′ dx = f′(u)g′(x)dx</code>。\n<b>第三步</b>：注意到 <code>g</code> 可微，故 <code>du = g′(x)dx</code>。把它代回第二步的结果：\n<code>dy = f′(u) · du</code>。\n这与情形 ① 的 <code>dy = f′(u)du</code> 形式完全相同。\n<b>结论</b>：无论 <code>u</code> 是自变量还是中间变量，微分表达式都是 <code>dy = f′(u)du</code>，即一阶微分形式不变。证毕。\n<b>补充（不变性只到一阶为止）</b>：二阶微分 <code>d<sup>2</sup>y = f″(u)du<sup>2</sup></code> 只在 <code>u</code> 为自变量时成立；若 <code>u = g(x)</code>，则 <code>d<sup>2</sup>y = f″(u)du<sup>2</sup> + f′(u)d<sup>2</sup>u</code>，多出一项。所以这条性质叫“<b>一阶</b>微分形式不变性”。',
          example: '<b>例 1</b>：<code>y = e<sup>u</sup></code>，<code>u = sin x</code>。按不变性，<code>dy = e<sup>u</sup>du</code>；再把 <code>du = cos x dx</code> 代入，得 <code>dy = e<sup>sin x</sup>cos x dx</code>。\n<b>例 2</b>：<code>y = ln(1 + x<sup>2</sup>)</code>，把 <code>1 + x<sup>2</sup></code> 整体当作 <code>u</code>：<code>dy = d(1 + x<sup>2</sup>)/(1 + x<sup>2</sup>) = 2x dx/(1 + x<sup>2</sup>)</code>。这样写完全不用先声明 <code>u</code> 是什么。',
          pitfalls: [
            '以为二阶微分也有形式不变性，写出 <code>d<sup>2</sup>y = f″(u)du<sup>2</sup></code> 却不检查 <code>u</code> 是否为自变量（这会漏掉 <code>f′(u)d<sup>2</sup>u</code> 这一项）。',
            '把不变性误解成“<code>du</code> 与 <code>Δu</code> 总是相等”。<b>只有当 u 是自变量时才有 du = Δu</b>；<code>u</code> 是中间变量时 <code>du</code> 只是 <code>Δu</code> 的线性主部，一般 <code>du ≠ Δu</code>。',
            '在求微分时忘了最后把 <code>du</code> 展开成关于 <code>dx</code> 的表达式（若题目要求的是对 <code>x</code> 的微分 <code>dy = ? dx</code>）。'
          ],
          tags: ['微分', '形式不变性', '链式法则', '定理'],
          related: ['def-differential', 'thm-chain-rule', 'thm-derivative-differential-relation', 'thm-differential-rules']
        },
        {
          id: 'thm-differential-rules',
          kind: 'formula',
          name: '微分的运算法则与常用微分公式',
          aka: ['微分公式表', '微分法则'],
          statement: '<b>① 运算法则</b>（设 <code>u, v</code> 可微）：\n<code>d(C) = 0</code>；<code>d(u ± v) = du ± dv</code>；<code>d(uv) = v du + u dv</code>；<code>d(u/v) = (v du − u dv)/v<sup>2</sup></code>（<code>v ≠ 0</code>）。\n<b>② 基本微分公式</b>（对照导数表，把 <code>f′(x)dx</code> 写成 <code>df(x)</code> 即可）：\n<code>d(x<sup>μ</sup>) = μx<sup>μ−1</sup>dx</code>；<code>d(e<sup>x</sup>) = e<sup>x</sup>dx</code>；<code>d(a<sup>x</sup>) = a<sup>x</sup> ln a dx</code>；<code>d(ln x) = dx/x</code>；\n<code>d(sin x) = cos x dx</code>；<code>d(cos x) = −sin x dx</code>；<code>d(tan x) = sec<sup>2</sup>x dx</code>；\n<code>d(arcsin x) = dx/√(1 − x<sup>2</sup>)</code>；<code>d(arctan x) = dx/(1 + x<sup>2</sup>)</code>。\n<b>③ 复合函数的微分</b>（形式不变性）：若 <code>y = f(u)</code>，则 <code>dy = f′(u)du</code>，其中 <code>u</code> 可以是自变量也可以是中间变量。',
          plain: '微分的公式表和导数的公式表是“同一张表穿了两件衣服”。要写微分，就在导数后面乘一个 <code>dx</code>：<code>(sin x)′ = cos x</code> 对应 <code>d(sin x) = cos x dx</code>。所以只要导数表背熟了，微分表根本不用另背。四则法则也一样，把每个 <code>′</code> 换成 <code>d</code> 就能用。',
          why: '为什么可以这样“照搬”？因为 <code>dy = f′(x)dx</code> 说明“求微分”和“求导”只差一个因子 <code>dx</code>，而 <code>dx</code> 在等式两边是共同的。<b>把每个函数的微分写成其导数乘 dx，是同一件事的两种写法。</b>这种“一条性质换来一张免背的表”的设计，正是数学记号的价值所在。',
          proof: '由 <code>dy = f′(x)dx</code>，只需对导数公式两边同乘 <code>dx</code> 即得对应微分公式。<b>以乘积法则为例</b>：\n由 <code>d(uv) = (uv)′dx</code>，而 <code>(uv)′ = u′v + uv′</code>，故\n<code>d(uv) = (u′v + uv′)dx = v(u′dx) + u(v′dx) = v du + u dv</code>。\n（这里用到 <code>u′dx = du</code>、<code>v′dx = dv</code>，即微分的定义式。）\n<b>商的法则同理</b>：<code>d(u/v) = (u/v)′dx = [(u′v − uv′)/v<sup>2</sup>]dx = (v u′dx − u v′dx)/v<sup>2</sup> = (v du − u dv)/v<sup>2</sup></code>。\n<b>和差法则</b>：<code>d(u ± v) = (u ± v)′dx = (u′ ± v′)dx = u′dx ± v′dx = du ± dv</code>。\n<b>基本公式</b>：例如 <code>d(sin x) = (sin x)′dx = cos x dx</code>，其余逐条同样得到。证毕。',
          example: '<b>例 1</b>：求 <code>y = x<sup>2</sup>sin x</code> 的微分。<code>dy = d(x<sup>2</sup>sin x) = sin x d(x<sup>2</sup>) + x<sup>2</sup>d(sin x) = 2x sin x dx + x<sup>2</sup>cos x dx = (2x sin x + x<sup>2</sup>cos x)dx</code>。\n<b>例 2</b>：求 <code>y = e<sup>−x<sup>2</sup></sup></code> 的微分。<code>dy = e<sup>−x<sup>2</sup></sup> d(−x<sup>2</sup>) = e<sup>−x<sup>2</sup></sup>(−2x)dx = −2x e<sup>−x<sup>2</sup></sup>dx</code>（用了形式不变性）。',
          pitfalls: [
            '求微分时忘记乘 <code>dx</code>（写 <code>d(sin x) = cos x</code>）。',
            '商的微分法则写成 <code>(u dv − v du)/v<sup>2</sup></code>，与正确顺序正好反了号。',
            '在复合函数求微分时，最后一步忘记把中间变量的微分继续展开到 <code>dx</code>（若题目要求对 <code>x</code> 的微分）。'
          ],
          tags: ['微分', '公式表', '运算法则'],
          related: ['thm-basic-derivative-formulas', 'thm-derivative-differential-relation', 'thm-differential-form-invariance']
        },
        {
          id: 'thm-approx-computation',
          kind: 'theorem',
          name: '微分在近似计算中的应用',
          statement: '<b>① 函数增量的近似公式</b>：设 <code>f</code> 在 <code>x₀</code> 处可导，当 <code>|Δx|</code> 很小时，\n<code>Δy = f(x₀ + Δx) − f(x₀) ≈ f′(x₀)Δx</code>，即 <code>Δy ≈ dy</code>。\n<b>② 函数值的近似公式</b>：\n<code>f(x₀ + Δx) ≈ f(x₀) + f′(x₀)Δx</code>。\n<b>③ 在 <code>x₀ = 0</code> 处</b>（<code>|x|</code> 很小时）：\n<code>f(x) ≈ f(0) + f′(0)x</code>。\n由此得常用近似式（<code>|x|</code> 很小）：<code>(1 + x)<sup>α</sup> ≈ 1 + αx</code>；<code>sin x ≈ x</code>；<code>tan x ≈ x</code>；<code>e<sup>x</sup> ≈ 1 + x</code>；<code>ln(1 + x) ≈ x</code>；<code>√(1 + x) ≈ 1 + x/2</code>。\n<b>④ 误差估计</b>：若量 <code>x</code> 的测量误差为 <code>|Δx|</code>，则按 <code>y = f(x)</code> 计算的 <code>y</code> 的绝对误差约为 <code>|dy| = |f′(x)||Δx|</code>，相对误差约为 <code>|dy/y| = |f′(x)/f(x)| · |Δx|</code>。',
          plain: '微分的最大用处就是“估算”。因为曲线的很短一段几乎就是直线，所以想知道“多加一点点会变成多少”，用切线上的值来代替真实值，又快又准。比如算 <code>√1.02</code>：我们知道 <code>√1 = 1</code>，导数在 1 处是 <code>1/2</code>，所以 <code>√1.02 ≈ 1 + 0.5 × 0.02 = 1.01</code>，而真实值约 1.00995，误差极小。<b>把难算的点挪到好算的点旁边，用切线补上那一小段</b>，这就是全部思想。',
          why: '为什么近似公式好用？因为它把“算函数值”这个可能很麻烦的操作，换成了四则运算。<code>f(x₀)</code> 是精心挑选的、容易算的值（如 <code>√1</code>、<code>sin 0</code>、<code>e<sup>0</sup></code>），<code>f′(x₀)Δx</code> 只是一个乘法。误差就是 <code>o(Δx)</code>，只要 <code>Δx</code> 足够小就能满足精度要求。这也是工程和物理里“线性化”思想的来源：<b>非线性问题在小范围内可以用线性问题近似</b>。',
          proof: '<b>①</b>：由微分的定义，<code>Δy = f′(x₀)Δx + o(Δx)</code>。当 <code>|Δx|</code> 很小时，<code>o(Δx)</code> 相对于 <code>f′(x₀)Δx</code> 可忽略，故 <code>Δy ≈ f′(x₀)Δx = dy</code>。\n<b>②</b>：在 ① 两边加上 <code>f(x₀)</code>：<code>f(x₀ + Δx) = f(x₀) + Δy ≈ f(x₀) + f′(x₀)Δx</code>。\n<b>③</b>：在 ② 中取 <code>x₀ = 0</code>、并把 <code>Δx</code> 记作 <code>x</code>，得 <code>f(x) ≈ f(0) + f′(0)x</code>。逐一代入基本初等函数即得常用近似式：\n取 <code>f(x) = (1 + x)<sup>α</sup></code>，则 <code>f(0) = 1</code>、<code>f′(x) = α(1 + x)<sup>α−1</sup></code>、<code>f′(0) = α</code>，故 <code>(1 + x)<sup>α</sup> ≈ 1 + αx</code>；\n取 <code>f(x) = sin x</code>，则 <code>f(0) = 0</code>、<code>f′(0) = cos 0 = 1</code>，故 <code>sin x ≈ x</code>；\n取 <code>f(x) = ln(1 + x)</code>，则 <code>f(0) = 0</code>、<code>f′(0) = 1</code>，故 <code>ln(1 + x) ≈ x</code>；\n取 <code>f(x) = √(1 + x)</code>（即 <code>α = 1/2</code>），得 <code>√(1 + x) ≈ 1 + x/2</code>。\n<b>④</b>：误差部分由 <code>Δy ≈ dy</code> 直接得到，取绝对值即得绝对误差与相对误差的估计式。证毕。',
          example: '<b>例 1</b>：估算 <code>√1.02</code>。取 <code>f(x) = √x</code>，<code>x₀ = 1</code>，<code>Δx = 0.02</code>。则 <code>f(1) = 1</code>，<code>f′(1) = 1/2</code>，故\n<code>√1.02 ≈ 1 + (1/2)(0.02) = 1.01</code>（真实值 1.00995…）。\n<b>例 2</b>：估算 <code>sin 1°</code>。先化弧度 <code>1° = π/180 ≈ 0.01745</code>，由 <code>sin x ≈ x</code> 得 <code>sin 1° ≈ 0.01745</code>（真实值 0.017452…），误差不到十万分之一。\n<b>例 3（误差）</b>：测得正方体棱长 <code>a = 10</code> 厘米，测量误差 <code>|Δa| ≤ 0.05</code> 厘米。体积 <code>V = a<sup>3</sup></code>，<code>dV = 3a<sup>2</sup>da</code>，故 <code>|ΔV| ≈ 3 × 100 × 0.05 = 15</code> 立方厘米，相对误差约 <code>15/1000 = 1.5%</code>（即棱长的相对误差 0.5% 的三倍）。',
          pitfalls: [
            '用近似公式时不检查 <code>Δx</code> 是否足够小：<code>Δx</code> 大时误差会迅速变大（如 <code>sin x ≈ x</code> 在 <code>x = 1</code> 弧度时误差已超过 15%）。',
            '在角度制下直接套 <code>sin x ≈ x</code>：公式中的 <code>x</code> 必须是<b>弧度</b>。',
            '把 <code>f(x₀ + Δx) ≈ f(x₀) + f′(x₀)Δx</code> 中的 <code>Δx</code> 与 <code>dx</code> 混淆（虽在自变量情形下两者相等，但式中用 <code>Δx</code> 表示真实的输入改变量更清楚）。',
            '误差估计时忘记取绝对值，得出“体积变化 −15 立方厘米”这样的说法而漏掉“可能有正负两个方向”。',
            '选错了 <code>x₀</code>：应选<b>靠近目标点且函数值与导数都容易算</b>的点（如估算 <code>√4.02</code> 应取 <code>x₀ = 4</code> 而不是 <code>x₀ = 1</code>）。'
          ],
          tags: ['微分', '近似计算', '误差估计'],
          related: ['def-differential', 'thm-differential-geometry', 'thm-derivative-differential-relation']
        }
      ]
    }
  ]
};
