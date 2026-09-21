// 同济《高等数学》上册（第八版）· 第7章 微分方程
// 纯数据模块：不依赖任何构建工具、后端或第三方库。
// 全部解释文字、证明文字、例题均为本项目原创撰写。

export default {
  id: 'ch7',
  no: 7,
  title: '微分方程',
  intro: '前面的章节里，我们总是先拿到一个函数，再去研究它。这一章反过来：题目不告诉你答案是什么，只告诉你答案每时每刻"怎么变"——变化率和函数值之间的规矩。这种"带未知函数导数的方程"就是微分方程。它的解法核心只有一句话：把导数关系一步步"还原"成函数关系，也就是反着做积分；而每一步积分都会留下一个任意常数，所以几阶方程的解里就有几个待定的常数，需要用额外的条件把它们定下来。',
  sections: [
    // ================= 7.1 =================
    {
      id: 'ch7-1',
      no: '7.1',
      title: '微分方程的基本概念',
      summary: '先约定几个名字：什么是微分方程、它的阶、什么叫解、通解与特解，以及初始条件怎样把一族曲线挑成一条。',
      items: [
        {
          id: 'def-differential-equation',
          kind: 'definition',
          name: '微分方程与微分方程的阶',
          aka: ['微分方程的定义', '方程的阶'],
          statement: '含有未知函数及其导数（或微分）的方程，叫做<b>微分方程</b>。\n微分方程中出现的未知函数的<b>最高阶导数</b>的阶数，叫做这个微分方程的<b>阶</b>。\n例如 <code>y′ = 2xy</code> 是一阶微分方程；<code>y″ - 3y′ + 2y = 0</code> 是二阶微分方程；<code>y⁗ + y = x</code> 是四阶微分方程。代进去的未知函数可以是一元函数（得到常微分方程），也可以是多元函数（得到偏微分方程）；本章只讨论常微分方程。',
          plain: '平时做的方程是"答案藏在一个数里"，比如 <code>3x = 6</code>，解出 x = 2 就完事。微分方程是"答案藏在一个函数里"，而且题目告诉你的不是函数本身，而是这个函数的变化规矩。比如"某细菌的增长速度恰好等于它当前数量的 2 倍"，写成数学就是 <code>y′ = 2y</code>——这句话没说你有多少细菌，只说"你越大长得越快"。\n阶数就像"要还原几层"。只出现一阶导数，说明只丢了一层信息；出现二阶导数，说明丢了"位置"和"速度"两层信息，于是要还原两次。',
          why: '为什么要把"最高阶导数的阶数"叫做方程的阶，而不是看方程里出现了几个导数？因为决定一个问题需要多少条额外条件、解里会出现几个任意常数，全看最高的那一阶。方程里同时出现 <code>y′</code> 和 <code>y″</code>，只要 <code>y″</code> 在，还原过程就必须先对付二阶导数，再对付一阶导数，一共两步。低阶导数只是"顺带出现"的，不会额外增加还原的层数。',
          proof: '由定义可直接得到：阶就是一个"数最高阶"的操作，没有需要证明的结论。判断阶数时只需把方程中所有导数按阶数排序，取最大的那个阶数。',
          example: '判断 <code>y′ + y = eˣ</code> 的阶：式子里只出现一阶导数 <code>y′</code>，所以是一阶方程。\n判断 <code>y″ + 2y′ + 5y = 0</code> 的阶：出现二阶导数 <code>y″</code>，所以是二阶方程。\n判断 <code>(y′)² + y = x</code> 的阶：虽然 <code>y′</code> 被平方了，出现的最高阶导数仍然只是 <code>y′</code>，所以是一阶方程（是非线性的，但阶数仍为 1）。\n[[warn:阶数看的是"导数的阶"，不是"导数的次数"。<code>(y′)²</code> 里的平方不提高方程阶数。]]',
          pitfalls: [
            '把 <code>(y′)³</code> 当成三阶方程——阶数只由导数的阶决定，与幂次无关。',
            '看到方程里同时有 <code>y′</code> 和 <code>y″</code> 就数成两个，写成"二阶的两个导数"，表述混乱。',
            '把含有未知函数但不含导数的普通方程（如 <code>x² - 1 = 0</code>）也算成微分方程。'
          ],
          tags: ['微分方程', '阶', '基本概念'],
          related: ['def-solution-of-ode', 'def-general-particular-solution']
        },
        {
          id: 'def-solution-of-ode',
          kind: 'definition',
          name: '微分方程的解',
          statement: '设函数 <code>y = φ(x)</code> 在区间 <code>I</code> 上有直到方程所需阶数的各阶导数。如果把 <code>y = φ(x)</code> 及其各阶导数代入微分方程后，能使方程在区间 <code>I</code> 上成为<b>恒等式</b>，就称 <code>y = φ(x)</code> 是该微分方程在区间 <code>I</code> 上的<b>解</b>。\n注意"恒等"二字：不是对某个 <code>x</code> 成立，而是对区间 <code>I</code> 内一切 <code>x</code> 都成立。',
          plain: '检验答案对不对，办法和小学一样：代进去试试。区别在于小学是"把一个数代进去看看等号两边相等吗"，这里是"把一个函数代进去，看看化简之后等号两边是不是同一回事"。\n如果把函数代进去得到 <code>2x = 2x</code> 这种无论 x 取多少都对的样子，它就是解；如果得到 <code>2x = 3x</code> 或者只在 <code>x = 0</code> 处碰巧相等，它就不是解。',
          why: '为什么定义里要强调"恒等式"而不只是"等式"？因为微分方程要求的是"这个函数在任何时刻都遵守那条变化规矩"。如果只在个别点成立，那这个函数在别的时刻就把规矩破坏了，自然不能叫解。数学上把"一整段区间上处处成立"写成恒等式，正是为了表达"每一时刻都守规矩"。',
          proof: '由定义可直接得到：验证解的方法就是代入化简，看是否得到恒等式。',
          example: '验证 <code>y = Ce^{x²}</code>（C 为任意常数）是 <code>y′ = 2xy</code> 的解。\n先求导：<code>y′ = C · e^{x²} · (x²)′ = C · e^{x²} · 2x = 2xCe^{x²}</code>。\n再算右端：<code>2xy = 2x · Ce^{x²} = 2xCe^{x²}</code>。\n左端右端恒等，所以 <code>y = Ce^{x²}</code> 是解。\n再试 <code>y = x²</code>：<code>y′ = 2x</code>，而 <code>2xy = 2x³</code>，只有在 <code>x = 0</code> 或 <code>x = 1</code> 处相等，不是恒等式，所以 <code>y = x²</code> 不是解。',
          pitfalls: [
            '只在某一两个点上验算相等就宣布是解。',
            '忘记先写出区间 <code>I</code>（例如 <code>y = 1/x</code> 只能在不含 0 的区间上讨论）。',
            '求导算错：<code>e^{x²}</code> 的导数是 <code>2x e^{x²}</code>，不是 <code>e^{x²}</code>。'
          ],
          tags: ['解', '验证', '基本概念'],
          related: ['def-differential-equation', 'def-general-particular-solution']
        },
        {
          id: 'def-general-particular-solution',
          kind: 'definition',
          name: '通解与特解',
          statement: '如果微分方程的解中含有<b>相互独立的任意常数</b>，且任意常数的个数<b>恰好等于方程的阶数</b>，这样的解叫做微分方程的<b>通解</b>。\n通解中任意常数取定一组具体数值后得到的解，叫做微分方程的<b>特解</b>。\n例如 <code>y′ = 2xy</code> 的通解是 <code>y = Ce^{x²}</code>（1 阶 → 1 个常数）；<code>y″ - 3y′ + 2y = 0</code> 的通解是 <code>y = C₁eˣ + C₂e^{2x}</code>（2 阶 → 2 个常数）；取 <code>C₁ = 0, C₂ = 1</code> 得特解 <code>y = e^{2x}</code>。',
          plain: '通解不是"一个答案"，而是"一批答案"的集体写法。<code>y = Ce^{x²}</code> 中 C 可以取任何数：C = 1 是一条陡的曲线，C = -2 是另一条，C = 0 干脆是 x 轴。把 C 当成一个旋钮，每拧一下得到一条曲线，所有曲线合起来就是通解说的"全家福"。\n特解就是从全家福里挑出的某一张照片。后面学的初始条件，就是用来"挑人"的规则。',
          why: '为什么通解里必须带任意常数，而且个数必须等于阶数？因为求解微分方程的过程说到底是在做积分，而每做一次不定积分就会冒出一个任意常数。一阶方程要积一次分，所以有一个常数；二阶方程要积两次分，所以有两个常数。\n反过来，如果常数比阶数少，说明你还没把所有可能的解找全（漏掉了一批曲线）；如果常数比阶数多，说明其中有常数其实能被别的常数吸收，它们并不独立，写在一起是重复记账。所以"个数等于阶数"是"不多不少正好找全"的标准。',
          proof: '由定义可直接得到。需要说明的一点是"相互独立"的含义：几个常数不能合并成一个。例如 <code>y = (C₁ + C₂)eˣ</code> 表面上有两个常数，但令 <code>C = C₁ + C₂</code> 后本质只有一个，因此它不是二阶方程的通解。',
          example: '对同一族 <code>y = Ce^{x²}</code>：\n取 C = 0，得特解 <code>y = 0</code>（零函数），代入 <code>y′ = 2xy</code> 得 <code>0 = 0</code>，确实是解。\n取 C = 1，得特解 <code>y = e^{x²}</code>，且 <code>y(0) = 1</code>。\n取 C = 3，得特解 <code>y = 3e^{x²}</code>，且 <code>y(0) = 3</code>。\n可以看到：不同的 C 让曲线在 <code>x = 0</code> 处穿过不同的高度，"曲线在 0 点的高度"正好可以反过来唯一确定 C。',
          pitfalls: [
            '把特解写成"常数取某个数"却仍在答案里留着字母 C。',
            '<code>y = (C₁ + C₂)x</code> 这类写法其实只有一个独立常数，不能当二阶方程的通解。',
            '认为通解一定包含方程的所有解——个别方程还有"奇解"（例如分离变量时被除掉的常数解），不能漏掉。'
          ],
          tags: ['通解', '特解', '任意常数'],
          related: ['def-initial-condition', 'thm-first-order-linear-formula', 'why-constants-equal-order']
        },
        {
          id: 'why-constants-equal-order',
          kind: 'note',
          name: '为什么通解里任意常数的个数一定等于方程的阶数',
          aka: ['常数的个数', '自由度'],
          statement: '对 n 阶微分方程，它的通解中含有 <b>n 个相互独立的任意常数</b>。这既是通解的定义要求，也是"积分 n 次就产生 n 个常数"的必然结果。\n例如 <code>y⁗ = 0</code> 的通解是 <code>y = C₁ + C₂x + C₃x² + C₄x³</code>，四个常数对应四阶。',
          plain: '可以把阶数想成"丢失了几层信息"。一只小虫沿直线爬，如果你只记下它每一刻的瞬时速度（一阶信息），它到底从哪儿出发你并不知道——丢了一个信息，就要用一个常数补回来。如果你连加速度规矩都只知道（二阶信息），那它的出发位置和出发速度你都不知道——丢了两层，就要两个常数补回来。\n所以"常数的个数"其实是在数"有多少件事我还没问清楚"；而初始条件就是用来把这些事一件件问清楚的。',
          why: '想弄清"为什么一定是这个个数"，只要盯住求解的动作：解一阶方程本质上要做一次不定积分 <code>∫f(x)dx</code>，而不定积分天然带一个 <code>+C</code>。解 n 阶方程需要把求导的动作反做 n 次，于是就有 n 个 <code>+C</code> 层层叠起来。\n另一种看法是"自由度"：满足 n 阶方程的全体函数构成一个 n 维空间，维数就是可以自由选择的常数个数。两种看法结论一致。',
          proof: '以 <code>y⁽ⁿ⁾ = f(x)</code> 为例说明。逐次积分：\n第一步 <code>y⁽ⁿ⁻¹⁾ = ∫f(x)dx + C₁</code>；\n第二步 <code>y⁽ⁿ⁻²⁾ = ∫(∫f(x)dx + C₁)dx + C₂ = ∫∫f(x)dx dx + C₁x + C₂</code>；\n依此继续，每积一次就多出一个独立的常数，且新增的常数总和前面出现的常数无法合并（它们分别乘在 <code>1, x, x²/2, …, x^{n-1}/(n-1)!</code> 上，是 x 的不同幂次，彼此独立）。\n积到第 n 次得 <code>y = (n 重积分) + C₁x^{n-1}/(n-1)! + … + C_{n-1}x + Cₙ</code>，恰好 n 个独立常数。对一般 n 阶方程，结论相同。',
          example: '解 <code>y″ = 6x</code>。\n第一次积分：<code>y′ = 3x² + C₁</code>。\n第二次积分：<code>y = x³ + C₁x + C₂</code>。\n检验：<code>y″ = (x³ + C₁x + C₂)″ = 6x</code>，成立。两个常数确实"等于二阶"。\n[[tip:数常数的时候顺手数一下阶数，两边不等就一定做错了。]]',
          pitfalls: [
            '把两次积分写成同一个常数，例如 <code>y″ = 6x</code> 只积出 <code>y = x³ + C</code>，丢了一整个自由方向。',
            '把 <code>C₁ + C₂</code> 当成两个常数，实际只有一个独立常数。'
          ],
          tags: ['通解', '任意常数', '阶数'],
          related: ['def-general-particular-solution', 'def-initial-condition']
        },
        {
          id: 'def-initial-condition',
          kind: 'definition',
          name: '初始条件与初值问题',
          statement: '用来确定通解中任意常数的附加条件，叫做<b>初始条件</b>（也叫定解条件）。对 n 阶方程，通常需要给出函数在某点 <code>x₀</code> 处的 n 个值\n<code>y(x₀) = y₀, y′(x₀) = y₁, …, y⁽ⁿ⁻¹⁾(x₀) = y_{n-1}</code>。\n带初始条件的微分方程问题叫做<b>初值问题</b>（柯西问题）。\n几何上：通解 <code>y = φ(x, C₁, …, Cₙ)</code> 表示平面上一族曲线，称为方程的<b>积分曲线族</b>，其中每一条曲线叫做一条<b>积分曲线</b>；初始条件就是指定曲线过某点（以及在该点的斜率等），从而从族中挑出唯一一条。',
          plain: '初始条件就是"把话问清楚"。通解说"曲线可以是这样一大家族"，初始条件说"我要那一条经过点 (0, 1) 的"。一个条件回答一个问题，n 个条件正好回答 n 个问题，于是家族里只剩一条曲线。\n生活里也一样：抛体运动知道"地面上以某个速度斜着扔出"，虽然轨迹有无数种可能（因为初速度方向、大小没定），但一旦说清楚"从原点、速度水平向右 5 m/s"，轨迹就唯一了。',
          why: '为什么一阶方程给一个初始条件、二阶给两个？因为常数有几个，就需要几个独立条件才能把它们全部解出来。一阶通解 <code>y = Ce^{x²}</code> 只有一个 C，代一个点 <code>(x₀, y₀)</code> 就得到 <code>C = y₀e^{-x₀²}</code>，问题解决。\n二阶通解有两个常数，只代一个点只能得到一个关于 C₁、C₂ 的关系式，还有无穷多种可能，必须再给一个条件（通常是在同一点处的导数，也就是"从这儿出发的斜率"）才能配上第二把锁。',
          proof: '由定义可直接得到。存在唯一性由教材中的解的存在唯一性定理保证：若方程右端函数及其关于 y 的偏导数在点 <code>(x₀, y₀)</code> 的某邻域内连续，则初值问题在 <code>x₀</code> 的某邻域内有唯一解。本章的解法都在这一定理允许的范围内进行。',
          example: '求 <code>y′ = 2xy</code> 满足 <code>y(0) = 3</code> 的特解。\n通解为 <code>y = Ce^{x²}</code>，代入 <code>x = 0, y = 3</code>：<code>3 = Ce⁰ = C</code>，所以 <code>C = 3</code>，特解为 <code>y = 3e^{x²}</code>。\n再如 <code>y″ = 6x</code> 的通解 <code>y = x³ + C₁x + C₂</code>，若给 <code>y(0) = 1, y′(0) = 2</code>：由 <code>y(0) = C₂ = 1</code>；由 <code>y′ = 3x² + C₁</code> 得 <code>y′(0) = C₁ = 2</code>，所以特解为 <code>y = x³ + 2x + 1</code>。检验：<code>y(0) = 1</code>，<code>y′(0) = 2</code>，<code>y″ = 6x</code>，全部满足。',
          pitfalls: [
            '先把初始条件代入（定出常数）再积分，导致后续积分又冒出新的常数，最后答案里还留着字母。正确顺序是：先求通解，再代初始条件。',
            'n 阶方程只给了一个初始条件却强行算出唯一解，等于凭空补条件。',
            '初始条件代错位置：<code>y′(0) = 2</code> 要代进 <code>y′</code> 的表达式，不能代进 <code>y</code> 的表达式。'
          ],
          tags: ['初始条件', '初值问题', '积分曲线'],
          related: ['def-general-particular-solution', 'why-constants-equal-order']
        }
      ]
    },

    // ================= 7.2 =================
    {
      id: 'ch7-2',
      no: '7.2',
      title: '可分离变量的微分方程',
      summary: '如果方程能整理成"只含 x 的一坨"乘 <code>dx</code> 等于"只含 y 的一坨"乘 <code>dy</code>，那就可以两边各积各的。',
      items: [
        {
          id: 'def-separable-equation',
          kind: 'definition',
          name: '可分离变量的微分方程',
          statement: '形如\n<code>dy/dx = f(x)g(y)</code>\n的一阶微分方程，称为<b>可分离变量</b>的微分方程，其中右端是"只含 x 的函数"与"只含 y 的函数"的乘积。\n它也可以写成对称形式\n<code>M₁(x)M₂(y)dx + N₁(x)N₂(y)dy = 0</code>。\n当 <code>g(y) ≠ 0</code> 时，把 <code>g(y)</code> 除到左边、<code>dx</code> 乘过去，得到\n<code>dy/g(y) = f(x)dx</code>，\n两边分别对 <code>y</code> 和 <code>x</code> 积分，即得\n<code>∫dy/g(y) = ∫f(x)dx + C</code>。',
          plain: '这类方程的好处是"两种东西不搅在一起"：x 的只和 x 玩，y 的只和 y 玩。于是可以把它们粗暴地分到等号两边：一边全是 y，一边全是 x，然后两边各积各的，像分拣快递一样把两堆分开处理。\n比如 <code>dy/dx = 2xy</code>，把 y 挪到左边、dx 挪到右边，变成 <code>dy/y = 2x dx</code>。左边只有 y，右边只有 x，两边都能直接积出来。',
          why: '为什么敢把 <code>dy/dx</code> 当成两个微分 <code>dy</code> 和 <code>dx</code> 拆开搬来搬去？严格的理由是链式法则（或换元积分）的逆用：设 <code>y = y(x)</code> 是解，方程 <code>y′ = f(x)g(y)</code> 两边除以 <code>g(y)</code> 得 <code>y′/g(y) = f(x)</code>，两边对 x 积分：\n<code>∫ y′/g(y) dx = ∫ f(x)dx</code>。\n左端令 <code>y = y(x)</code> 作换元，<code>dy = y′dx</code>，于是左端变成 <code>∫dy/g(y)</code>。所以"分离变量"这个动作在严格数学上就是一次换元积分，"把 dy、dx 搬来搬去"是最省事的记法，不是新发明的运算。',
          proof: '（解法即证明，按步骤操作即可）\n第一步：把方程写成 <code>dy/dx = f(x)g(y)</code>。\n第二步：设 <code>g(y) ≠ 0</code>，两边除以 <code>g(y)</code>，得 <code>(1/g(y))·dy/dx = f(x)</code>。\n第三步：两边对 x 积分，并对左端作换元 <code>u = y(x)</code>，得 <code>∫dy/g(y) = ∫f(x)dx + C</code>。\n第四步：算出两个不定积分。设 <code>G(y)</code> 是 <code>1/g(y)</code> 的原函数，<code>F(x)</code> 是 <code>f(x)</code> 的原函数，则通解为隐式形式 <code>G(y) = F(x) + C</code>；能解出 y 就再解出显式形式。\n第五步：单独检查 <code>g(y) = 0</code> 的常数根 <code>y ≡ y₀</code> 是不是解，是的话说明它可能已被通解包含，也可能是丢失的奇解，要看情况补上。',
          example: '解 <code>dy/dx = 2xy</code>。\n分离变量（这里 <code>g(y) = y</code>，先设 <code>y ≠ 0</code>）：<code>dy/y = 2x dx</code>。\n两边积分：<code>∫dy/y = ∫2x dx</code>，得 <code>ln|y| = x² + C₁</code>。\n解出 y：<code>|y| = e^{x² + C₁} = e^{C₁}e^{x²}</code>，故 <code>y = ±e^{C₁}e^{x²}</code>。令 <code>C = ±e^{C₁}</code>（C 为非零常数），得 <code>y = Ce^{x²}</code>。\n再检查被除掉的 <code>y = 0</code>：代入原方程得 <code>0 = 0</code>，它是解，且正好是 <code>C = 0</code> 的情形，可以并进通解。\n最后通解为 <code>y = Ce^{x²}</code>（C 为任意常数）。\n验证：<code>y′ = 2xCe^{x²} = 2xy</code>，成立。',
          pitfalls: [
            '分离时只把 x 挪过去，忘了把 <code>g(y)</code> 除到左边，含 y 的项漏在右边。',
            '积分后 <code>ln|y|</code> 直接写成 <code>ln y</code> 而不加绝对值（在 y 可能取负值时应保留绝对值，最后再用 ± 处理）。',
            '把 <code>∫dy/y</code> 写成 <code>ln y + C</code> 后就停手，忘记两边都要积、右侧也要出现常数。',
            '忘记检验被除掉的常数解 <code>g(y) = 0</code>，可能丢掉奇解。'
          ],
          tags: ['可分离变量', '一阶方程', '分离变量法'],
          related: ['def-differential-equation', 'thm-homogeneous-substitution']
        }
      ]
    },

    // ================= 7.3 =================
    {
      id: 'ch7-3',
      no: '7.3',
      title: '齐次方程',
      summary: '右端只依赖 <code>y/x</code> 的方程，用 <code>u = y/x</code> 一代换就变成可分离变量的方程。',
      items: [
        {
          id: 'def-homogeneous-equation',
          kind: 'definition',
          name: '齐次方程',
          statement: '如果一阶微分方程可以化成\n<code>dy/dx = φ(y/x)</code>\n的形式，即右端只与比值 <code>y/x</code> 有关，就称它为<b>齐次方程</b>。\n更一般地，若 <code>f(x, y)</code> 满足 <code>f(tx, ty) = f(x, y)</code> 对一切 <code>t ≠ 0</code> 成立（称为零次齐次函数），则 <code>dy/dx = f(x, y)</code> 就是齐次方程。\n[[warn:这里的"齐次"指"零次齐次"，与第 7.4 节"一阶线性齐次方程"里的"齐次"（指不含自由项）不是同一个意思，只是巧合同名。]]',
          plain: '"齐次"在这里的意思是"整体同比例缩放后方程不变"。把 x 和 y 同时放大两倍，<code>y/x</code> 还是原来那个数，所以方程认不出变化。比如 <code>dy/dx = (x + y)/x</code>，把 x、y 都乘 t，右端变成 <code>(tx + ty)/(tx) = (x + y)/x</code>，一模一样。\n这类方程的"性格"只由 x 与 y 的比例决定，跟绝对大小无关。正因为如此，把比例 <code>y/x</code> 当作一个新变量来处理最自然。',
          why: '为什么要把它单独列成一类？因为右端只依赖 <code>y/x</code>，就意味着"如果 u = y/x 知道了，斜率就完全确定了"。这提示我们：与其盯着 y 和 x 两个量，不如盯着它们的比值一个量。降一个变量，问题就从"两个未知"变成"一个未知"，也就变成了能分离变量的类型。',
          proof: '由定义可直接得到。判别方法：把方程整理成 <code>dy/dx = f(x, y)</code>，再把 <code>x</code> 换成 <code>tx</code>、<code>y</code> 换成 <code>ty</code>，若结果与原式相同，就是齐次方程。',
          example: '判断 <code>dy/dx = (x² + y²)/(xy)</code> 是否齐次。\n把 x、y 换成 tx、ty：右端 = <code>(t²x² + t²y²)/(t²xy) = (x² + y²)/(xy)</code>，与原式相同，是齐次方程。\n写成比值形式：<code>(x² + y²)/(xy) = x/y + y/x = 1/(y/x) + y/x</code>，即 <code>φ(u) = u + 1/u</code>，其中 <code>u = y/x</code>。\n反例：<code>dy/dx = x + y</code>，换元后变成 <code>tx + ty = t(x + y) ≠ x + y</code>，不是齐次方程。',
          pitfalls: [
            '把 7.3 的"齐次方程"和 7.4 的"一阶线性齐次方程"混为一谈，看到"齐次"就套错公式。',
            '换元时只把 y 换成 ux，却忘了同时处理 <code>dy/dx</code>（它不再是 u 的导数）。',
            '把 <code>φ(y/x)</code> 误读成"y 除以 x 的结果当作自变量"，其实 u 仍是 x 的函数。'
          ],
          tags: ['齐次方程', '一阶方程', '零次齐次'],
          related: ['thm-homogeneous-substitution', 'def-separable-equation']
        },
        {
          id: 'thm-homogeneous-substitution',
          kind: 'theorem',
          name: '齐次方程的换元解法',
          statement: '设齐次方程 <code>dy/dx = φ(y/x)</code>，令 <code>u = y/x</code>，即 <code>y = ux</code>。则\n<code>dy/dx = u + x·du/dx</code>，\n原方程化为\n<code>x·du/dx = φ(u) - u</code>，\n即\n<code>du/(φ(u) - u) = dx/x</code>（当 <code>φ(u) - u ≠ 0</code>）。\n这是一个关于 u 与 x 的可分离变量方程。求出通解后把 <code>u = y/x</code> 代回，即得原方程的通解。',
          plain: '这步换元的精髓是"换个角度看问题"。原来我们盯着 y 随着 x 怎么变；现在改盯"y 是 x 的几倍"这个倍率 u 随着 x 怎么变。倍率的变化往往比 y 本身的变化简单得多。\n例如某方程说"斜率等于 1 加当前倍率"，换成 u 的语言就是 <code>x·du/dx = 1</code>，一眼看出 u 就是 ln x 加常数，几乎不用动脑。',
          why: '为什么令 <code>u = y/x</code> 而不是 <code>u = x/y</code> 或别的？因为方程右端出现的是 <code>y/x</code> 这个组合，令 u 等于它，右端立刻变成纯粹的 <code>φ(u)</code>，不再同时含 x 和 y。左边的 <code>dy/dx</code> 通过乘积求导法则必然产生 <code>u</code> 和 <code>x·du/dx</code> 两部分。两边一整理，方程里就只剩下 u 和 x，且能分离——这正是我们想要的结果。',
          proof: '设 <code>y = u(x)·x</code>，其中 <code>u = u(x)</code> 是待求函数。\n第一步（求导）：由乘积求导法则\n<code>dy/dx = u + x·du/dx</code>。\n第二步（代入）：把它和 <code>y/x = u</code> 一起代入原方程 <code>dy/dx = φ(y/x)</code>，得\n<code>u + x·du/dx = φ(u)</code>。\n第三步（移项）：两边减去 u，得\n<code>x·du/dx = φ(u) - u</code>。\n第四步（分离变量）：当 <code>φ(u) - u ≠ 0</code> 时，两边除以 <code>φ(u) - u</code>、再除以 x（设 x ≠ 0），得\n<code>du/(φ(u) - u) = dx/x</code>。\n这时左端只含 u，右端只含 x，已化为可分离变量方程。\n第五步（积分）：两边积分得 <code>∫du/(φ(u) - u) = ln|x| + C</code>，解出 u 关于 x 的表达式，再用 <code>u = y/x</code> 代回，即得通解。\n第六步（补漏）：单独考察 <code>φ(u) - u = 0</code> 的常数根 <code>u = u₀</code>，对应直线解 <code>y = u₀x</code>，看是否需要补进通解。',
          example: '解 <code>dy/dx = (x + y)/x</code>。\n右端 <code>= 1 + y/x</code>，所以 <code>φ(u) = 1 + u</code>，是齐次方程。\n令 <code>y = ux</code>，则 <code>dy/dx = u + x·du/dx</code>，代入得 <code>u + x·du/dx = 1 + u</code>。\n两边减去 u：<code>x·du/dx = 1</code>，即 <code>du = dx/x</code>。\n两边积分：<code>u = ln|x| + C</code>。\n代回 <code>u = y/x</code>：<code>y/x = ln|x| + C</code>，故通解为 <code>y = x(ln|x| + C)</code>。\n验证：<code>y′ = (ln|x| + C) + x·(1/x) = ln|x| + C + 1</code>；而 <code>(x + y)/x = 1 + y/x = 1 + (ln|x| + C)</code>，两者相等，成立。',
          pitfalls: [
            '换元后忘记把 <code>dy/dx</code> 换成 <code>u + x·du/dx</code>，直接写 <code>du/dx = φ(u)</code>，丢掉那一项 u。',
            '算出 u 的通解后就当作最终答案，忘记把 <code>u</code> 换回 <code>y/x</code> 并解出 y。',
            '分离时漏掉 <code>φ(u) - u = 0</code> 对应的直线解。',
            '对 <code>φ(u) - u</code> 做除法时未说明它不为零，也没回头检查这种情形。'
          ],
          tags: ['齐次方程', '换元', '分离变量'],
          related: ['def-homogeneous-equation', 'def-separable-equation', 'def-first-order-linear']
        }
      ]
    },

    // ================= 7.4 =================
    {
      id: 'ch7-4',
      no: '7.4',
      title: '一阶线性微分方程',
      summary: '未知函数和它的导数都只出现一次方的方程，用"积分因子"或"常数变易法"可以一步写出通解公式。',
      items: [
        {
          id: 'def-first-order-linear',
          kind: 'definition',
          name: '一阶线性微分方程',
          statement: '形如\n<code>dy/dx + P(x)y = Q(x)</code>\n的方程叫做<b>一阶线性微分方程</b>，其中 <code>P(x)</code>、<code>Q(x)</code> 是已知的连续函数。\n当 <code>Q(x) ≡ 0</code> 时，方程变为\n<code>dy/dx + P(x)y = 0</code>，\n称为<b>一阶线性齐次方程</b>；当 <code>Q(x) ≢ 0</code> 时，称为<b>一阶线性非齐次方程</b>，<code>Q(x)</code> 称为<b>自由项</b>。\n"线性"指未知函数 y 与它的导数 <code>y′</code> 都只以一次方出现，且不互相乘、不套在别的函数里面（如 <code>y²</code>、<code>y·y′</code>、<code>sin y</code>、<code>e^y</code> 都不允许）。',
          plain: '"线性"就是"老老实实、不带花招"：y 只出现一次方，不出现 y 乘 y′、y 的平方、sin y 之类。这类方程之所以被单独拿出来，是因为它有一个万能公式，代进去就能出答案。\n把方程读成一句话：<code>y′ + P(x)y = Q(x)</code>，意思是"y 的变化率，加上一个随位置变化的系数乘 y，等于外面给的一个推动力 Q(x)"。Q 就是那个一直推着你走的力。',
          why: '为什么一定要要求"线性"？因为只有线性的时候，才能找到那个神奇的积分因子 <code>e^{∫P dx}</code>，把左端凑成一个整体求导的形式。如果出现了 <code>y²</code> 或者 <code>y·y′</code>，无论乘什么函数都凑不成 <code>(某东西)′</code>，公式就失效了。\n另一个角度：线性方程的解具有"可叠加"的性质——两个解加起来、或者乘个常数，仍然是齐次方程的解。这种好性质正是线性带来的。',
          proof: '由定义可直接得到。判别要点：把方程整理成 <code>y′ + P(x)y = Q(x)</code> 的形状，检查 y 与 y′ 是否都只出现一次方且系数只依赖 x。',
          example: '判断下列方程是否为一阶线性方程：\n<code>y′ + y/x = x</code>：可写成 <code>y′ + (1/x)y = x</code>，y 与 y′ 都是一次方，<code>P = 1/x</code>，<code>Q = x</code>，是。<code>y′ = y²</code>：右端含 <code>y²</code>，不是线性方程（是可分离变量方程）。\n<code>y′ + xy = sin x</code>：是，<code>P = x</code>，<code>Q = sin x</code>。\n<code>y·y′ + y = x</code>：含 <code>y·y′</code>，不是线性方程。',
          pitfalls: [
            '看到 y 出现在分母（如 <code>y′ + y/x² = 1</code> 中 x 在分母没关系；但若出现 <code>1/y</code>）就误当线性。',
            '忘记先把方程整理成 <code>y′ + P(x)y = Q(x)</code> 的标准形，例如把 <code>xy′ + y = x²</code> 中 <code>P</code> 认成 1；正确做法是先除以 x，得 <code>y′ + y/x = x</code>。',
            '把 7.3 的"齐次方程"（零次齐次）与这里的"线性齐次方程"混淆。'
          ],
          tags: ['一阶线性', '齐次', '非齐次'],
          related: ['thm-first-order-linear-formula', 'thm-constant-variation', 'def-homogeneous-equation']
        },
        {
          id: 'thm-first-order-linear-formula',
          kind: 'theorem',
          name: '一阶线性非齐次方程的通解公式（积分因子法）',
          statement: '设 <code>P(x)</code>、<code>Q(x)</code> 连续。则一阶线性非齐次方程\n<code>dy/dx + P(x)y = Q(x)</code>\n的通解为\n<code>y = e^{-∫P(x)dx} · ( ∫Q(x)e^{∫P(x)dx} dx + C )</code>，\n其中 <code>∫P(x)dx</code> 表示 <code>P</code> 的任意一个原函数，C 为任意常数。\n对应的齐次方程 <code>y′ + P(x)y = 0</code> 的通解为\n<code>y = Ce^{-∫P(x)dx}</code>。',
          plain: '这个公式看着吓人，其实结构极简单：<b>前半截是齐次方程的解</b> <code>e^{-∫P dx}</code>，<b>括号里是从外面加进来的推动力积累</b>。<code>∫P dx</code> 就像"阻碍的累计量"：阻碍越大，<code>e^{-∫P dx}</code> 衰减得越快，符合直觉。\n括号里的 C 是初始状态留下的印记，<code>∫Q e^{∫P dx}dx</code> 是外力 Q 一路被放大后累积的效果。两者相加，再一起乘上衰减因子，就得到任意时刻的 y。',
          why: '这个公式是怎么被"发现"的？想法是：<b>想办法把左边凑成一个整体求导</b>。我们希望出现 <code>(μy)′ = μy′ + μ′y</code> 的样子。现在左边是 <code>y′ + Py</code>，如果给它乘上 <code>μ(x)</code>，得 <code>μy′ + μPy</code>，只要 <code>μ′ = μP</code>，它就正好等于 <code>(μy)′</code>。而 <code>μ′ = μP</code> 是最简单的可分离变量方程，解出 <code>μ = e^{∫P dx}</code>——这就是<b>积分因子</b>的来历。\n所以整个方法不是碰巧，而是"倒着想"：先问"乘什么能让左边凑成整体导数"，答案立刻算出来。',
          proof: '设 <code>μ(x) = e^{∫P(x)dx}</code>（取一个原函数即可）。这里 <code>∫P dx</code> 是 P 的任一原函数。\n第一步：验证 μ 满足 <code>μ′ = μP</code>。由复合函数求导，<code>μ′ = e^{∫P dx} · (∫P dx)′ = e^{∫P dx} · P = μP</code>。\n第二步：把原方程 <code>y′ + Py = Q</code> 两边同乘 μ，得\n<code>μy′ + μPy = μQ</code>。\n第三步：由 <code>μP = μ′</code>，左端就是 <code>μy′ + μ′y = (μy)′</code>，于是方程变成\n<code>(μy)′ = μQ</code>。\n这一步是关键：左端已经"打包"成单独一个函数的导数，方程从"含 y 和 y′ 的方程"降级为"直接问谁求导等于 μQ"。\n第四步：两边对 x 积分，得\n<code>μy = ∫μQ dx + C</code>。\n第五步：两边除以 <code>μ</code>（μ > 0 恒成立，可除），并把 <code>μ = e^{∫P dx}</code> 代入，得\n<code>y = e^{-∫P dx} ( ∫Q e^{∫P dx} dx + C )</code>。\n第六步：常数个数检查。式中只含一个任意常数 C，与方程是一阶相符，故这就是通解。\n特例：当 <code>Q ≡ 0</code> 时，<code>∫Q e^{∫P dx}dx = 0</code>，公式退化为 <code>y = Ce^{-∫P dx}</code>，正是齐次方程的通解。',
          example: '解 <code>y′ + y = eˣ</code>。\n这里 <code>P = 1</code>，<code>Q = eˣ</code>，<code>∫P dx = x</code>，故 <code>e^{∫P dx} = eˣ</code>，<code>e^{-∫P dx} = e^{-x}</code>。\n代入公式：<code>y = e^{-x}( ∫eˣ·eˣ dx + C ) = e^{-x}( ∫e^{2x}dx + C )</code>。\n而 <code>∫e^{2x}dx = e^{2x}/2</code>，所以 <code>y = e^{-x}( e^{2x}/2 + C ) = eˣ/2 + Ce^{-x}</code>。\n验证：<code>y′ = eˣ/2 - Ce^{-x}</code>，于是 <code>y′ + y = (eˣ/2 - Ce^{-x}) + (eˣ/2 + Ce^{-x}) = eˣ</code>，成立。\n（附带看出结构：<code>eˣ/2</code> 是特解，<code>Ce^{-x}</code> 是齐次通解。）\n再看 <code>y′ + y/x = x</code>（x > 0）：<code>P = 1/x</code>，<code>Q = x</code>，<code>∫P dx = ln x</code>，<code>e^{∫P dx} = x</code>，<code>e^{-∫P dx} = 1/x</code>。\n<code>y = (1/x)( ∫x·x dx + C ) = (1/x)( x³/3 + C ) = x²/3 + C/x</code>。\n验证：<code>y′ = 2x/3 - C/x²</code>，<code>y′ + y/x = 2x/3 - C/x² + x/3 + C/x² = x</code>，成立。',
          pitfalls: [
            '算 <code>e^{∫P dx}</code> 时写成 <code>e^{P}</code>，漏掉积分号。',
            '括号里忘了乘 <code>e^{∫P dx}</code>，直接写成 <code>∫Q dx</code>。',
            '忘记最后乘上外面的 <code>e^{-∫P dx}</code>，只留下括号里的结果。',
            '把 <code>P</code> 直接取成方程里 y 前面的数而不先化标准形（如 <code>xy′ + y = x²</code> 应先变成 <code>y′ + y/x = x</code>，<code>P = 1/x</code>）。',
            '积分常数放错地方：常数只在最后那个不定积分处出现一次，写两遍会多出无意义的常数。'
          ],
          tags: ['一阶线性', '通解公式', '积分因子'],
          related: ['def-first-order-linear', 'thm-constant-variation', 'why-constants-equal-order', 'def-general-particular-solution']
        },
        {
          id: 'thm-constant-variation',
          kind: 'theorem',
          name: '常数变易法',
          aka: ['常数变易法求一阶线性非齐次通解'],
          statement: '先求对应齐次方程 <code>y′ + P(x)y = 0</code> 的通解 <code>y = Ce^{-∫P(x)dx}</code>。再把其中的常数 C 换成待定<b>函数</b> <code>C(x)</code>，设非齐次方程的解形如\n<code>y = C(x)e^{-∫P(x)dx}</code>。\n代入非齐次方程，可解出\n<code>C(x) = ∫Q(x)e^{∫P(x)dx} dx + C</code>，\n从而得到与通解公式完全一致的结果。',
          plain: '"常数变易"字面意思就是"把常数改成会变的东西"。齐次方程的解是一个带旋钮 C 的家族；现在右边多了一个推动力 Q，我们猜：也许答案还是同一批曲线的形状，只是那个"旋钮"不再固定，而是随着 x 一路被拧来拧去。于是把 C 升级成函数 <code>C(x)</code>，让它自己承担外力的影响。\n这个思路非常"省力"：不用凭空猜答案的形状，而是站在已知的齐次解肩膀上，只补一个未知函数就行。',
          why: '为什么把常数换成函数就 work？因为未知量一下子从"y 本身"变成"C(x)"，而代入后会发现关于 <code>C′(x)</code> 的方程里根本不含 <code>C(x)</code>——它退化成了"直接积分就能求出 C(x)"的最简形式。\n之所以能这样，是因为 <code>e^{-∫P dx}</code> 本身满足齐次方程，代入时把含 <code>C(x)</code> 的那些项自动抵消掉了，只剩下 <code>C′(x)</code> 一项。这正是"用已知解作骨架、只求解一个增量"的巧妙之处。',
          proof: '设非齐次方程的解写成 <code>y = C(x)·y₁(x)</code>，其中 <code>y₁ = e^{-∫P dx}</code> 是齐次方程的一个非零解（<code>y₁′ + Py₁ = 0</code>）。\n第一步（求导）：<code>y′ = C′y₁ + Cy₁′</code>。\n第二步（代入）：把 y 与 y′ 代入 <code>y′ + Py = Q</code>，得\n<code>C′y₁ + Cy₁′ + PCy₁ = Q</code>。\n第三步（抵消）：后两项合起来是 <code>C(y₁′ + Py₁) = C·0 = 0</code>，因为 <code>y₁</code> 是齐次解。于是方程化简为\n<code>C′y₁ = Q</code>。\n这就是关键的一步：关于 C 的方程里只剩 <code>C′</code>，没有 C 本身。\n第四步（解出 C）：<code>C′ = Q/y₁ = Q e^{∫P dx}</code>，两边积分得\n<code>C(x) = ∫Q e^{∫P dx} dx + C</code>（这里的 C 是积分常数）。\n第五步（回代）：<code>y = C(x)y₁ = e^{-∫P dx}( ∫Q e^{∫P dx}dx + C )</code>，与积分因子法所得公式一致。\n第六步：常数个数为 1，符合一阶方程的要求，故为通解。',
          example: '用常数变易法解 <code>y′ + y = eˣ</code>。\n先解齐次 <code>y′ + y = 0</code>：分离变量 <code>dy/y = -dx</code>，积分得 <code>ln|y| = -x + C₁</code>，即 <code>y = Ce^{-x}</code>。\n把 C 换成 <code>C(x)</code>：设 <code>y = C(x)e^{-x}</code>，则 <code>y′ = C′e^{-x} - Ce^{-x}</code>。\n代入 <code>y′ + y = eˣ</code>：<code>C′e^{-x} - Ce^{-x} + Ce^{-x} = eˣ</code>，含 C 的项相消，得 <code>C′e^{-x} = eˣ</code>，即 <code>C′ = e^{2x}</code>。\n积分：<code>C(x) = e^{2x}/2 + C</code>。\n回代：<code>y = (e^{2x}/2 + C)e^{-x} = eˣ/2 + Ce^{-x}</code>。与积分因子法结果一致，验证同前。',
          pitfalls: [
            '设 <code>y = C(x)e^{-∫P dx}</code> 后忘了 <code>y′</code> 要用乘积求导法则，写成 <code>y′ = C′(x)e^{-∫P dx}</code>，丢掉一项。',
            '不先求齐次通解就直接乱设 <code>C(x)</code>，导致代入后消不掉含 C 的项。',
            '解出 <code>C(x)</code> 后忘记乘回 <code>y₁(x)</code>。'
          ],
          tags: ['常数变易法', '一阶线性', '积分因子'],
          related: ['thm-first-order-linear-formula', 'def-first-order-linear']
        },
        {
          id: 'formula-bernoulli',
          kind: 'formula',
          name: '伯努利方程及其解法',
          statement: '形如\n<code>dy/dx + P(x)y = Q(x)yⁿ</code>（<code>n ≠ 0, 1</code>）\n的方程叫做<b>伯努利方程</b>。令\n<code>z = y^{1-n}</code>，\n则方程化为关于 z 的一阶线性方程\n<code>dz/dx + (1-n)P(x)z = (1-n)Q(x)</code>，\n可用通解公式求解，最后把 <code>z = y^{1-n}</code> 代回。\n当 <code>n = 0</code> 时它就是一阶线性非齐次方程，当 <code>n = 1</code> 时是可分离变量方程，所以这两种情形另行处理。',
          plain: '伯努利方程是"线性方程外面又乘了一个 y 的幂"。它长得比线性方程凶，但有一个漂亮的化妆术：做一个换元，把 <code>y^{1-n}</code> 整包成一个新变量 z，那个碍事的 <code>yⁿ</code> 就被"约掉"了，剩下的恰好是能套公式的线性方程。\n就像解方程时把 <code>√x</code> 设为 t，麻烦的根号一下子消失。',
          why: '为什么偏偏取 <code>z = y^{1-n}</code> 这个指数？因为方程右边是 <code>yⁿ</code>，我们想把它变成不含 y 的形式。两边除以 <code>yⁿ</code> 后，左边会出现 <code>y′/yⁿ</code> 和 <code>y^{1-n}</code> 这两个东西；而 <code>z = y^{1-n}</code> 的导数正好是 <code>(1-n)y^{-n}y′</code>，与 <code>y′/yⁿ</code> 只差一个常数因子。整包换元之后，两项就分别变成了 <code>z′</code> 和 <code>z</code>，方程立刻变线性。指数取 <code>1-n</code> 不是猜的，是为了让求导后 y 的幂次刚好对上。',
          proof: '设 y > 0，令 <code>z = y^{1-n}</code>。\n第一步（求导）：<code>z′ = (1-n)y^{-n}·y′</code>，即 <code>y^{-n}y′ = z′/(1-n)</code>。\n第二步（化方程）：把原方程 <code>y′ + Py = Qyⁿ</code> 两边乘以 <code>(1-n)y^{-n}</code>，得\n<code>(1-n)y^{-n}y′ + (1-n)Py^{1-n} = (1-n)Q</code>。\n第三步（换元）：把 <code>y^{-n}y′ = z′/(1-n)</code> 与 <code>y^{1-n} = z</code> 代入，得\n<code>z′ + (1-n)Pz = (1-n)Q</code>，这是关于 z 的一阶线性方程。\n第四步：套用通解公式求出 <code>z = z(x, C)</code>，再用 <code>z = y^{1-n}</code> 代回（即 <code>y = z^{1/(1-n)}</code>）得到原方程的通解。\n第五步：单独检查 <code>y = 0</code> 是否为解（当 <code>1-n > 0</code> 时它通常是解），必要时补入。',
          example: '解 <code>y′ + y = xy²</code>（这里 <code>n = 2</code>）。\n取 <code>z = y^{1-2} = y^{-1} = 1/y</code>。此时 <code>1-n = -1</code>，线性方程为\n<code>z′ + (-1)·1·z = (-1)·x</code>，即 <code>z′ - z = -x</code>。\n用通解公式：<code>P = -1</code>，<code>Q = -x</code>，<code>∫P dx = -x</code>，<code>e^{∫P dx} = e^{-x}</code>，<code>e^{-∫P dx} = eˣ</code>。\n<code>z = eˣ( ∫(-x)e^{-x}dx + C )</code>。而 <code>∫(-x)e^{-x}dx = (x+1)e^{-x}</code>，故\n<code>z = eˣ((x+1)e^{-x} + C) = x + 1 + Ceˣ</code>。\n代回 <code>z = 1/y</code>：<code>y = 1/(x + 1 + Ceˣ)</code>。\n验证：取 <code>C = 0</code> 得特解 <code>y = 1/(x+1)</code>，则 <code>y′ = -1/(x+1)²</code>，<code>y² = 1/(x+1)²</code>。\n左端 <code>y′ + y = -1/(x+1)² + 1/(x+1) = [-(1) + (x+1)]/(x+1)² = x/(x+1)²</code>；\n右端 <code>xy² = x/(x+1)²</code>，相等，成立。',
          pitfalls: [
            '把 <code>z = y^{1-n}</code> 记成 <code>z = y^{n-1}</code>，指数符号搞反，导致线性方程系数全错。',
            '换元后忘记把方程两边都乘 <code>(1-n)</code>，只换了左端的导数组。',
            '求出 z 之后忘记代回 y，答案里留着 z。',
            '忘记单独讨论 <code>n = 0</code>、<code>n = 1</code> 这两种退化情形。'
          ],
          tags: ['伯努利方程', '换元', '一阶线性'],
          related: ['def-first-order-linear', 'thm-first-order-linear-formula']
        }
      ]
    },

    // ================= 7.5 =================
    {
      id: 'ch7-5',
      no: '7.5',
      title: '可降阶的高阶微分方程',
      summary: '三种特殊的高阶方程，都能通过积分或换元把阶数降下来，直到变成会解的一阶问题。',
      items: [
        {
          id: 'thm-reducible-type-n',
          kind: 'theorem',
          name: '可降阶类型一：<code>y⁽ⁿ⁾ = f(x)</code>',
          statement: '方程\n<code>y⁽ⁿ⁾ = f(x)</code>\n的右端只含自变量 x。此时只需<b>逐次积分</b> n 次即可得通解：\n<code>y = ∫…∫f(x)dx…dx + C₁x^{n-1}/(n-1)! + C₂x^{n-2}/(n-2)! + … + Cₙ</code>，\n其中通解含 n 个任意常数。',
          plain: '这是最容易的一类：题目直接告诉你"第 n 阶导数等于某个已知函数"。那就一路往回积：积一次降一阶，降到最后就是答案。\n就像知道"加速度是常数"，先积一次得速度，再积一次得位置，每一步都会留一个"我还不知道的起点"（常数）。',
          why: '为什么每积一次都要加常数？因为不定积分本身就是"求所有导数等于它的函数"，而这些函数之间只差一个常数。漏掉常数就等于宣称"只有一条曲线导数等于这个函数"，这是错的：把整条曲线上下平移一点，导数完全不变。\n所以逐次积分得到的常数个数正好是 n 个，与 n 阶方程的通解要求完全吻合——这不是巧合，而是"反求导 n 次必然留 n 个未定信息"的直接体现。',
          proof: '对 n 用逐次积分。\n第一次：把 <code>y⁽ⁿ⁾ = f(x)</code> 两边对 x 积分，得 <code>y⁽ⁿ⁻¹⁾ = ∫f(x)dx + C₁</code>。\n第二次：对 <code>y⁽ⁿ⁻¹⁾</code> 的表达式再积分，得 <code>y⁽ⁿ⁻²⁾ = ∫(∫f(x)dx + C₁)dx + C₂ = ∫∫f dx dx + C₁x + C₂</code>。\n第三次：继续积分，得 <code>y⁽ⁿ⁻³⁾ = (三重积分) + C₁x²/2 + C₂x + C₃</code>。\n可以看到规律：每积一次，已有常数的后面就多乘一个 x 并除以相应的阶乘，同时新增一个常数。\n第 n 次积分完成后，<code>y = (n 重积分) + C₁x^{n-1}/(n-1)! + C₂x^{n-2}/(n-2)! + … + C_{n-1}x + Cₙ</code>。\n验证：这个表达式求 n 阶导数后，含常数的那些项全部消失（因为它们的次数都低于 n），只剩下 <code>(n 重积分)</code> 求 n 阶导，即 <code>f(x)</code>，故确实是解；且含 n 个独立常数，是通解。',
          example: '解 <code>y″ = 6x</code>。\n第一次积分：<code>y′ = ∫6x dx = 3x² + C₁</code>。\n第二次积分：<code>y = ∫(3x² + C₁)dx = x³ + C₁x + C₂</code>。\n验证：<code>y′ = 3x² + C₁</code>，<code>y″ = 6x</code>，成立。\n若再加初始条件 <code>y(0) = 1, y′(0) = 2</code>：<code>C₂ = 1</code>，<code>C₁ = 2</code>，特解 <code>y = x³ + 2x + 1</code>。\n再如解 <code>y‴ = eˣ</code>：<code>y″ = eˣ + C₁</code>，<code>y′ = eˣ + C₁x + C₂</code>，<code>y = eˣ + C₁x²/2 + C₂x + C₃</code>。三个常数对应三阶。',
          pitfalls: [
            '两次积分共用同一个常数，导致常数个数少于阶数。',
            '常数项写成 <code>C₁ + C₂</code> 却不分开，形式上像两个其实只有一个。',
            '积分时忘记把上一轮得到的常数一起积进去（例如 <code>∫C₁dx = C₁x</code>，不能只写 <code>∫0 dx</code>）。'
          ],
          tags: ['可降阶', '逐次积分', '高阶方程'],
          related: ['why-constants-equal-order', 'thm-reducible-type-xp']
        },
        {
          id: 'thm-reducible-type-xp',
          kind: 'theorem',
          name: '可降阶类型二：<code>y″ = f(x, y′)</code>',
          statement: '方程\n<code>y″ = f(x, y′)</code>\n的右端不含未知函数 y 本身，只含 x 与 <code>y′</code>。令 <code>p = y′</code>，则 <code>y″ = dp/dx</code>，方程化为关于 p 的一阶方程\n<code>dp/dx = f(x, p)</code>。\n解出 <code>p = p(x, C₁)</code> 后，再由 <code>dy/dx = p(x, C₁)</code> 积分一次得\n<code>y = ∫p(x, C₁)dx + C₂</code>。',
          plain: '这个方程的特点是"看不见 y，只看得到 y 的变化率"。既然 y 从来不露脸，那干脆把 <code>y′</code> 当成主角，给它起个名字 p。于是一个二阶问题就变成了一阶问题：先解出 p，再积一次得到 y。\n就像解一道关于"速度"的题：如果题目给的规矩只涉及速度和位置 x，不涉及"你在哪儿"（y），那就先专心把速度求出来。',
          why: '为什么可以这样降阶？因为方程里完全没有 y，也就是说"y 的具体数值不影响斜率的变化规律"。那么 y 和它的导数 p 之间的关系就断开了：p 的演化只由 x 和 p 自己决定，我们可以先独立地把 p 求出来，完全不需要知道 y。\n等 p 求出来之后，再回到 <code>y′ = p</code> 这个最简单的方程，积一次分就得到 y。整个过程中，常数一共出现两个（先解 p 时一个，再积 y 时一个），与二阶方程相符。',
          proof: '令 <code>p = y′</code>，则 <code>y″ = p′ = dp/dx</code>。\n第一步（换元）：代入原方程 <code>y″ = f(x, y′)</code> 得 <code>dp/dx = f(x, p)</code>。这是一个关于 p 与 x 的一阶方程（通常是可分离变量或一阶线性的），解之得 <code>p = p(x, C₁)</code>。\n第二步（再积一次）：由 <code>dy/dx = p(x, C₁)</code> 得 <code>y = ∫p(x, C₁)dx + C₂</code>。\n第三步（数常数）：结果含 <code>C₁</code>、<code>C₂</code> 两个独立常数，与二阶方程通解的要求一致，故所求为通解。\n验证：把 y 的表达式求两次导，第一次得 <code>y′ = p(x, C₁)</code>，第二次得 <code>y″ = p′(x, C₁)</code>；由第一步知 <code>p′ = f(x, p) = f(x, y′)</code>，故满足原方程。',
          example: '解 <code>y″ = y′ + x</code>（即 <code>y″ = x + y′</code>，右端不含 y）。\n令 <code>p = y′</code>，得 <code>p′ = p + x</code>，即 <code>p′ - p = x</code>，这是关于 p 的一阶线性方程。\n套公式：<code>P = -1</code>，<code>Q = x</code>，<code>e^{∫P dx} = e^{-x}</code>，<code>e^{-∫P dx} = eˣ</code>。\n<code>p = eˣ( ∫x e^{-x}dx + C₁ )</code>。而 <code>∫x e^{-x}dx = -(x+1)e^{-x}</code>，所以\n<code>p = eˣ( -(x+1)e^{-x} + C₁ ) = -(x+1) + C₁eˣ</code>。\n再积分：<code>y = ∫(-(x+1) + C₁eˣ)dx + C₂ = -x²/2 - x + C₁eˣ + C₂</code>。\n验证：<code>y′ = -x - 1 + C₁eˣ = p</code>，<code>y″ = -1 + C₁eˣ</code>；\n而 <code>y′ + x = (-x - 1 + C₁eˣ) + x = -1 + C₁eˣ = y″</code>，成立。',
          pitfalls: [
            '令 <code>p = y′</code> 后把 <code>y″</code> 误写成 <code>p·dp/dx</code>（那是类型三的公式，这里自变量还是 x）。',
            '解出 <code>p</code> 后直接把它当 y 的答案，忘记再积一次。',
            '两个常数混成一个，或者把 <code>C₁</code> 在两次积分里重复使用同一符号而不区分。'
          ],
          tags: ['可降阶', '换元', '二阶方程'],
          related: ['thm-reducible-type-yp', 'thm-first-order-linear-formula']
        },
        {
          id: 'thm-reducible-type-yp',
          kind: 'theorem',
          name: '可降阶类型三：<code>y″ = f(y, y′)</code>',
          statement: '方程\n<code>y″ = f(y, y′)</code>\n的右端不含自变量 x，只含 y 与 <code>y′</code>。令 <code>p = y′</code>，并把 p 看作 y 的函数 <code>p = p(y)</code>，则\n<code>y″ = dp/dx = (dp/dy)·(dy/dx) = p·dp/dy</code>，\n方程化为关于 p 与 y 的一阶方程\n<code>p·dp/dy = f(y, p)</code>。\n解出 <code>p = p(y, C₁)</code> 后，再由 <code>dy/dx = p(y, C₁)</code> 分离变量积分，得通解\n<code>∫dy/p(y, C₁) = x + C₂</code>。',
          plain: '这个方程"看不见 x"，只看得见 y 和它自己怎么变。处理技巧是：不要问"p 随 x 怎么变"，改问"p 随 y 怎么变"。因为方程压根不提 x，那么把 p 当成 y 的函数就绕开了 x。\n换元后要用的公式是 <code>y″ = p·dp/dy</code>，这是全部的关键一步。最后再解 <code>dy/dx = p(y)</code>，这是个可分离变量方程，两边积分即可。',
          why: '为什么这里 <code>y″</code> 变成了 <code>p·dp/dy</code>，而不是类型二里的 <code>dp/dx</code>？因为现在 p 被看成 y 的函数，而 y 又是 x 的函数，所以 p 通过中间变量 y 依赖 x。用链式法则：<code>dp/dx = (dp/dy)·(dy/dx)</code>，其中 <code>dy/dx = p</code>，于是 <code>y″ = p·dp/dy</code>。\n这一招的动机是"让方程里只出现 y 和 p 两个字母"。既然方程不含 x，就不该让 x 出现在我们对 p 的提问方式里；改成"p 随 y 变化"之后，x 自动退场，方程变成关于 y 和 p 的一阶问题，可以分离变量。',
          proof: '令 <code>p = y′</code>，并把 p 视作 y 的函数 <code>p = p(y)</code>，而 y 仍是 x 的函数。\n第一步（转换 y″）：由复合函数求导法则\n<code>y″ = d/dx p(y(x)) = p′(y)·y′(x) = p·dp/dy</code>。\n第二步（代入）：原方程 <code>y″ = f(y, y′)</code> 变为\n<code>p·dp/dy = f(y, p)</code>。\n这是一个以 y 为自变量、以 p 为未知函数的一阶方程，按可分离变量（或其它一阶方法）解出 <code>p = p(y, C₁)</code>。\n第三步（回到 y 与 x）：由 <code>dy/dx = p(y, C₁)</code>，分离变量得 <code>dy/p(y, C₁) = dx</code>，两边积分得\n<code>∫dy/p(y, C₁) = x + C₂</code>，这就是通解的隐式形式（能解出 y 就再解出）。\n第四步（数常数）：结果含两个独立常数 <code>C₁, C₂</code>，符合二阶方程的要求。',
          example: '解 <code>y″ = 2y·y′/y′ = 2y</code>？为避免混淆，看经典例子 <code>y″ = 2y</code> 不属于本类型（它含 y 但不含 y′，仍需特征方程法）。这里取真正体现方法的方程 <code>y″ = 2y·y′</code>。\n令 <code>p = y′</code>，<code>y″ = p·dp/dy</code>，代入得 <code>p·dp/dy = 2y·p</code>。\n设 <code>p ≠ 0</code>，两边除以 p：<code>dp/dy = 2y</code>，积分得 <code>p = y² + C₁</code>。\n再解 <code>dy/dx = y² + C₁</code>，分离变量：<code>dy/(y² + C₁) = dx</code>，积分得\n<code>(1/√C₁)·arctan(y/√C₁) = x + C₂</code>（当 <code>C₁ > 0</code>），即 <code>y = √C₁·tan(√C₁(x + C₂))</code>。\n验证（取 <code>C₁ = 1, C₂ = 0</code>）：<code>y = tan x</code>，<code>y′ = sec²x</code>，<code>y″ = 2sec²x·tan x = 2y·y′</code>，成立。\n另一简单例子：解 <code>y″ + y′² = 0</code>？令 <code>p = y′</code> 得 <code>p·dp/dy + p² = 0</code>，设 p ≠ 0 得 <code>dp/dy = -p</code>，故 <code>p = C₁e^{-y}</code>，再解 <code>dy/dx = C₁e^{-y}</code> 得 <code>e^y = C₁x + C₂</code>。\n验证（<code>C₁ = 1, C₂ = 0</code>）：<code>e^y = x</code> 即 <code>y = ln x</code>，<code>y′ = 1/x</code>，<code>y″ = -1/x²</code>，而 <code>-y′² = -1/x²</code>，<code>y″ + y′² = 0</code>，成立。',
          pitfalls: [
            '把 <code>y″</code> 写成 <code>dp/dx</code> 而不是 <code>p·dp/dy</code>，结果方程里同时出现 x 和 y，无从下手。',
            '除以 p 时未讨论 <code>p = 0</code>（即 <code>y = 常数</code>）是否也是解。',
            '解出 <code>p = p(y)</code> 后以为完事，忘记再用 <code>dy/dx = p(y)</code> 积出 y 与 x 的关系。',
            '最后积分时把 <code>∫dy/p(y)</code> 与 <code>x</code> 的位置写反，得到 <code>x = ∫p dy</code> 这类错误式子。'
          ],
          tags: ['可降阶', '链式法则', '二阶方程'],
          related: ['thm-reducible-type-xp', 'def-separable-equation']
        }
      ]
    },

    // ================= 7.6 =================
    {
      id: 'ch7-6',
      no: '7.6',
      title: '高阶线性微分方程',
      summary: '不管系数多复杂，线性方程的解都有"叠加"的好性质；只要凑齐几个线性无关的解，通解就是它们的线性组合。',
      items: [
        {
          id: 'thm-linear-homogeneous-structure',
          kind: 'theorem',
          name: 'n 阶线性齐次方程解的结构（叠加原理）',
          statement: '考虑 n 阶线性齐次方程\n<code>y⁽ⁿ⁾ + a₁(x)y⁽ⁿ⁻¹⁾ + … + a_{n-1}(x)y′ + aₙ(x)y = 0</code>。\n设 <code>y₁, y₂, …, y_k</code> 都是它的解，则对任意常数 <code>C₁, …, C_k</code>，线性组合\n<code>C₁y₁ + C₂y₂ + … + C_k y_k</code>\n仍是该方程的解。（这就是线性齐次方程的<b>叠加原理</b>。）\n特别地，全体解构成一个 n 维线性空间；如果能找到 n 个线性无关的解 <code>y₁, …, yₙ</code>，则通解就是\n<code>y = C₁y₁ + C₂y₂ + … + Cₙyₙ</code>。',
          plain: '线性齐次方程有一个特别可爱的脾气：<b>解可以任意相加、任意放大缩小，得到的还是解</b>。就像在弹簧上挂砝码，两个砝码各自产生的拉伸量可以简单相加。\n正因为有这条性质，我们找解的策略就变成了：先费劲找到几个"基本款"解，然后用常数把它们配比起来，一次性得到全部解。',
          why: '为什么会有这条性质？根源在于"线性"两个字：方程左端可以看作一个作用于函数 y 的<b>线性运算</b> L，即 <code>L[y] = y⁽ⁿ⁾ + a₁y⁽ⁿ⁻¹⁾ + … + aₙy</code>。所谓线性，就是它满足\n<code>L[C₁y₁ + C₂y₂] = C₁L[y₁] + C₂L[y₂]</code>。\n因此如果 <code>L[y₁] = 0</code> 且 <code>L[y₂] = 0</code>，那么 <code>L[C₁y₁ + C₂y₂] = C₁·0 + C₂·0 = 0</code>，组合仍是解。\n"解集是 n 维空间"则来自解的存在唯一性定理：n 阶齐次方程的解由它在一点处的 n 个初值 <code>y(x₀), y′(x₀), …, y⁽ⁿ⁻¹⁾(x₀)</code> 唯一决定，而这 n 个初值构成 n 维空间，所以解空间维数恰为 n。',
          proof: '只对 n = 2 的情形写出，一般情形完全一样。\n设 <code>y₁, y₂</code> 是 <code>y″ + p(x)y′ + q(x)y = 0</code> 的解。对任意常数 <code>C₁, C₂</code>，记 <code>y = C₁y₁ + C₂y₂</code>。\n第一步（求导）：由和的求导法则，<code>y′ = C₁y₁′ + C₂y₂′</code>，<code>y″ = C₁y₁″ + C₂y₂″</code>。\n第二步（代入左端）：\n<code>y″ + py′ + qy = (C₁y₁″ + C₂y₂″) + p(C₁y₁′ + C₂y₂′) + q(C₁y₁ + C₂y₂)</code>。\n第三步（重新分组）：把含 <code>C₁</code> 的项和含 <code>C₂</code> 的项分开，得\n<code>= C₁(y₁″ + py₁′ + qy₁) + C₂(y₂″ + py₂′ + qy₂)</code>。\n第四步（用已知）：因为 <code>y₁, y₂</code> 是解，两个括号都等于 0，于是整个式子 <code>= C₁·0 + C₂·0 = 0</code>。\n故 <code>C₁y₁ + C₂y₂</code> 也是解。<b>叠加原理得证。</b>',
          example: '已知 <code>y″ - y = 0</code> 有两个解 <code>y₁ = eˣ</code>、<code>y₂ = e^{-x}</code>。\n由叠加原理，<code>y = C₁eˣ + C₂e^{-x}</code> 也是解。验证：<code>y′ = C₁eˣ - C₂e^{-x}</code>，<code>y″ = C₁eˣ + C₂e^{-x}</code>，故 <code>y″ - y = (C₁eˣ + C₂e^{-x}) - (C₁eˣ + C₂e^{-x}) = 0</code>，成立。\n这两个解线性无关，因此含两个独立常数的 <code>y = C₁eˣ + C₂e^{-x}</code> 就是通解。\n[[tip:注意"含常数"本身还不够，必须保证这些解彼此线性无关，否则常数的个数是虚的。]]',
          pitfalls: [
            '把叠加原理用在非齐次方程上（非齐次方程的两个解相加不再是解）。',
            '找到两个解就直接相加当通解，却忘记检查它们线性相关（如 <code>y₁ = eˣ</code> 与 <code>y₂ = 2eˣ</code> 相加得不到新东西）。',
            '以为任意 n 个解都能拼出通解——必须线性无关，个数还必须是 n。'
          ],
          tags: ['线性方程', '叠加原理', '解的结构'],
          related: ['def-linear-dependence', 'thm-homogeneous-general-solution', 'thm-nonhomogeneous-structure']
        },
        {
          id: 'def-linear-dependence',
          kind: 'definition',
          name: '函数组的线性相关与线性无关、朗斯基行列式',
          statement: '设 <code>y₁(x), y₂(x), …, yₙ(x)</code> 是区间 <code>I</code> 上的 n 个函数。如果存在<b>不全为零</b>的常数 <code>k₁, …, kₙ</code>，使得\n<code>k₁y₁ + k₂y₂ + … + kₙyₙ ≡ 0</code>（在 I 上恒成立），\n就称这组函数在 <code>I</code> 上<b>线性相关</b>；如果这样的常数组不存在（即上式恒成立只能推出 <code>k₁ = k₂ = … = kₙ = 0</code>），就称它们<b>线性无关</b>。\n对两个函数 <code>y₁, y₂</code>：线性相关等价于其中之一是另一个的常数倍，即 <code>y₁/y₂ ≡ 常数</code>。\n若 <code>y₁, …, yₙ</code> 都有 <code>n-1</code> 阶导数，称行列式\n<code>W(x) = |y₁ y₂ … yₙ; y₁′ y₂′ … yₙ′; … ; y₁⁽ⁿ⁻¹⁾ y₂⁽ⁿ⁻¹⁾ … yₙ⁽ⁿ⁻¹⁾|</code>\n为这组函数的<b>朗斯基行列式</b>。若这组函数在 <code>I</code> 上线性相关，则 <code>W(x) ≡ 0</code>；反之，若它们是某个 n 阶线性齐次方程的解，则 <code>W(x) ≠ 0</code> 与线性无关等价。',
          plain: '"线性相关"说白了就是"有人是多余的"。比如 <code>y₁ = eˣ, y₂ = 2eˣ</code>，第二个只是第一个放大两倍，告诉你第一个就等于告诉你第二个，这组信息是重复的。\n"线性无关"就是"每个人都带来了新消息"，谁也代替不了谁。只有这样的解组才有资格拼出通解。\n朗斯基行列式是一个探测器：把它算出来，如果恒等于零，就说明这组函数有冗余；如果不为零，就说明它们各自独立。',
          why: '为什么用行列式来判别？因为"是否存在不全为零的 <code>k₁, …, kₙ</code> 使组合恒为零"是一个关于未知数 <code>k</code> 的线性方程组问题：把恒等式在 <code>n</code> 个点（或逐次求导后在一点）取值，就得到 n 个关于 <code>k</code> 的齐次线性方程。\n而齐次线性方程组有非零解的充要条件正是"系数行列式等于零"。这个系数行列式恰好就是各阶导数排成的朗斯基行列式。于是"线性相关"就翻译成了"W ≡ 0"，判别线性相关性变成了算一个行列式。',
          proof: '以下说明 n = 2 的情形。设 <code>y₁, y₂</code> 在 I 上有导数，<code>W(x) = y₁y₂′ - y₁′y₂</code>。\n（1）若 <code>y₁, y₂</code> 线性相关，则存在不全为零的 <code>k₁, k₂</code> 使 <code>k₁y₁ + k₂y₂ ≡ 0</code>。不妨设 <code>k₂ ≠ 0</code>，则 <code>y₂ = -(k₁/k₂)y₁ = Cy₁</code>。求导得 <code>y₂′ = Cy₁′</code>。代入 W：\n<code>W = y₁·Cy₁′ - y₁′·Cy₁ = 0</code>，故 <code>W ≡ 0</code>。\n（2）反之设 <code>W(x₀) ≠ 0</code> 对某个 <code>x₀ ∈ I</code> 成立。若 <code>y₁, y₂</code> 线性相关，由（1）得 <code>W ≡ 0</code>，与 <code>W(x₀) ≠ 0</code> 矛盾，故线性无关。\n（3）特别地，当 <code>y₁, y₂</code> 是二阶线性齐次方程 <code>y″ + py′ + qy = 0</code> 的解时，可以证明 <code>W</code> 满足一阶方程 <code>W′ + pW = 0</code>（这一步可由把两个解的方程分别乘以 <code>-y₂</code> 与 <code>y₁</code> 后相加得到）。该方程的解为 <code>W(x) = W(x₀)e^{-∫_{x₀}^{x} p(t)dt}</code>，因为指数因子恒不为零，所以 <code>W</code> 要么处处为零、要么处处不为零。于是对线性齐次方程的解而言，"W ≠ 0"与"W 不恒为零"是一回事，判别更省事了。',
          example: '判别 <code>y₁ = eˣ, y₂ = e^{2x}</code> 的线性相关性。\n<code>W = y₁y₂′ - y₁′y₂ = eˣ·2e^{2x} - eˣ·e^{2x} = 2e^{3x} - e^{3x} = e^{3x} ≠ 0</code>，故线性无关。\n判别 <code>y₁ = eˣ, y₂ = 3eˣ</code>：<code>W = eˣ·3eˣ - eˣ·3eˣ = 0</code>，线性相关（显然 <code>y₂ = 3y₁</code>）。\n判别 <code>y₁ = cos x, y₂ = sin x</code>：<code>W = cos x·cos x - (-sin x)·sin x = cos²x + sin²x = 1 ≠ 0</code>，线性无关。这正是 <code>y″ + y = 0</code> 通解 <code>y = C₁cos x + C₂sin x</code> 能成立的原因。\n判别 <code>y₁ = x, y₂ = 2x</code>：<code>W = x·2 - 1·2x = 0</code>，线性相关。',
          pitfalls: [
            '只看两个函数是否"长得不一样"就断定线性无关，如 <code>eˣ</code> 与 <code>e^{x+1}</code> 看似不同，实际只差常数倍 <code>e</code>，是线性相关的。',
            '把 <code>W ≠ 0</code> 的结论无条件用于任意函数组（需要它们是同一线性齐次方程的解时"W 不恒为零 ⟺ 线性无关"才最好用）。',
            '行列式展开时符号弄错，二阶情形 <code>W = y₁y₂′ - y₁′y₂</code>，不是 <code>y₁y₂′ + y₁′y₂</code>。'
          ],
          tags: ['线性相关', '线性无关', '朗斯基行列式'],
          related: ['thm-homogeneous-general-solution', 'thm-linear-homogeneous-structure']
        },
        {
          id: 'thm-homogeneous-general-solution',
          kind: 'theorem',
          name: 'n 阶线性齐次方程通解的结构定理',
          statement: '设 <code>y₁, y₂, …, yₙ</code> 是 n 阶线性齐次方程\n<code>y⁽ⁿ⁾ + a₁(x)y⁽ⁿ⁻¹⁾ + … + aₙ(x)y = 0</code>\n的 n 个<b>线性无关</b>的解（称为一个<b>基本解组</b>），则该方程的通解为\n<code>y = C₁y₁ + C₂y₂ + … + Cₙyₙ</code>，\n其中 <code>C₁, …, Cₙ</code> 为任意常数。',
          plain: '这条定理说的是：解线性齐次方程就像搭积木。先找到 n 块互不相同的"基础积木"（线性无关的解），任意解都能用它们按不同比例拼出来。\n比例系数就是那些任意常数。所以求解的任务被明确拆成两件事：一是找齐 n 个互不重复的解，二是让常数负责所有变化。',
          why: '为什么"n 个线性无关的解"就够用、且必须恰好 n 个？\n先说"够用"：任取一个解 Y，用它在某点 <code>x₀</code> 的 n 个初值 <code>Y(x₀), Y′(x₀), …, Y⁽ⁿ⁻¹⁾(x₀)</code> 当作已知数据，去解关于 <code>C₁, …, Cₙ</code> 的线性方程组\n<code>C₁y₁⁽ᵏ⁾(x₀) + … + Cₙyₙ⁽ᵏ⁾(x₀) = Y⁽ᵏ⁾(x₀)</code>（k = 0, 1, …, n-1）。\n这个方程组的系数行列式正是朗斯基行列式 <code>W(x₀)</code>。因为 <code>y₁, …, yₙ</code> 线性无关，<code>W(x₀) ≠ 0</code>，方程组有唯一解 <code>C₁, …, Cₙ</code>。于是 <code>C₁y₁ + … + Cₙyₙ</code> 与 Y 在 <code>x₀</code> 处有相同的 n 个初值；由解的唯一性，它们处处相等，即 Y 能被拼出来。\n再说"必须 n 个"：如果只找到 <code>k < n</code> 个线性无关的解，那么这个线性组合里只有 k 个自由参数，无法匹配任意给定的 n 个初值，达不到"通解"的要求；而 n 阶方程的解空间恰好 n 维，也容不下更多独立方向。',
          proof: '（第一步：组合确实是解。）由叠加原理，<code>y = C₁y₁ + … + Cₙyₙ</code> 是解，且含 n 个常数。\n（第二步：这 n 个常数相互独立。）若有不全为零的常数使该组合恒为零，则 <code>y₁, …, yₙ</code> 线性相关，与假设矛盾，故各常数相互独立。\n（第三步：任意解都能被表示。）设 <code>Y(x)</code> 是方程的任一解。取定 <code>x₀ ∈ I</code>，考虑关于 <code>C₁, …, Cₙ</code> 的方程组\n<code>C₁y₁(x₀) + … + Cₙyₙ(x₀) = Y(x₀)</code>\n<code>C₁y₁′(x₀) + … + Cₙyₙ′(x₀) = Y′(x₀)</code>\n…\n<code>C₁y₁⁽ⁿ⁻¹⁾(x₀) + … + Cₙyₙ⁽ⁿ⁻¹⁾(x₀) = Y⁽ⁿ⁻¹⁾(x₀)</code>。\n它的系数行列式就是 <code>W(x₀)</code>。由于 <code>y₁, …, yₙ</code> 线性无关，<code>W(x₀) ≠ 0</code>，由克拉默法则，方程组存在唯一解 <code>C₁, …, Cₙ</code>。\n（第四步：唯一性收尾。）把这个解代入组合，得解 <code>Ŷ = C₁y₁ + … + Cₙyₙ</code>。它与 Y 满足同样的方程，且在 <code>x₀</code> 处有相同的 n 个初值。由解的存在唯一性定理，<code>Ŷ ≡ Y</code>。\n因此任何一个解都写成了 <code>C₁y₁ + … + Cₙyₙ</code> 的形式，故它为通解。',
          example: '求 <code>y″ - 3y′ + 2y = 0</code> 的通解。\n试探 <code>y = e^{rx}</code>：代入得 <code>r²e^{rx} - 3re^{rx} + 2e^{rx} = 0</code>，约去 <code>e^{rx} ≠ 0</code>，得 <code>r² - 3r + 2 = 0</code>，解得 <code>r = 1</code> 或 <code>r = 2</code>。\n于是得到两个解 <code>y₁ = eˣ</code>、<code>y₂ = e^{2x}</code>。它们线性无关（<code>W = e^{3x} ≠ 0</code>），所以通解为\n<code>y = C₁eˣ + C₂e^{2x}</code>。\n验证：<code>y′ = C₁eˣ + 2C₂e^{2x}</code>，<code>y″ = C₁eˣ + 4C₂e^{2x}</code>，故\n<code>y″ - 3y′ + 2y = (C₁eˣ + 4C₂e^{2x}) - 3(C₁eˣ + 2C₂e^{2x}) + 2(C₁eˣ + C₂e^{2x}) = (1-3+2)C₁eˣ + (4-6+2)C₂e^{2x} = 0</code>，成立。',
          pitfalls: [
            '找到的解个数不足 n 个就宣布通解（如二阶方程只写 <code>C₁y₁</code>）。',
            '找到的 n 个解其实线性相关（如把 <code>eˣ</code> 和 <code>3eˣ</code> 当两个基本解），此时通解里的常数是假的两个。',
            '把非齐次方程也用这套结构，忘记非齐次还要额外加一个特解。'
          ],
          tags: ['通解结构', '基本解组', '线性齐次'],
          related: ['def-linear-dependence', 'thm-linear-homogeneous-structure', 'thm-nonhomogeneous-structure', 'thm-char-equation']
        },
        {
          id: 'thm-nonhomogeneous-structure',
          kind: 'theorem',
          name: 'n 阶线性非齐次方程通解的结构定理',
          statement: '设 n 阶线性非齐次方程\n<code>y⁽ⁿ⁾ + a₁(x)y⁽ⁿ⁻¹⁾ + … + aₙ(x)y = f(x)</code>\n有某个<b>特解</b> <code>y*(x)</code>，而对应的齐次方程（把 <code>f(x)</code> 换成 0）有通解 <code>Y(x) = C₁y₁ + … + Cₙyₙ</code>。则该非齐次方程的通解为\n<code>y = Y(x) + y*(x) = C₁y₁ + … + Cₙyₙ + y*</code>。\n也就是说：<b>非齐次方程的通解 = 对应齐次方程的通解 + 非齐次方程的一个特解</b>。',
          plain: '这条定理把难题劈成两半：先解决"没有外力"的情形（齐次方程），再随便找一个"有外力时能顶住"的解答（特解），两者相加就是全部答案。\n类比：一条河有水流（外力），还有你自己划船的随意路线（齐次解）。任意一条实际路径，都可以看作"水流推着走的那条必然路线"加上"你自己想怎么划就怎么划"的偏差；而"你想怎么划"的规矩本身与水流无关。',
          why: '为什么加一个特解就够、不需要加多个？因为在非齐次方程里，"两个不同的解相减"会得到齐次方程的解。\n设 <code>y_a</code>、<code>y_b</code> 都是非齐次方程的解，令 <code>u = y_a - y_b</code>。由于求导是线性的，<code>L[u] = L[y_a] - L[y_b] = f - f = 0</code>，所以 u 是齐次方程的解。\n这说明：非齐次方程的任意两个解之间只差一个齐次解。既然我们已经有一个特解 <code>y*</code>，那么任何别的解 <code>y</code> 都满足 <code>y - y* = 齐次解</code>，即 <code>y = y* + 齐次通解</code>。特解只需一个，剩下的全部自由度都由齐次通解承担。',
          proof: '（一）先证 <code>Y + y*</code> 是非齐次方程的解。\n记线性运算 <code>L[y] = y⁽ⁿ⁾ + a₁y⁽ⁿ⁻¹⁾ + … + aₙy</code>。由 L 的线性，<code>L[Y + y*] = L[Y] + L[y*]</code>。\n因为 Y 是齐次方程的通解，<code>L[Y] = 0</code>；因为 <code>y*</code> 是非齐次方程的特解，<code>L[y*] = f</code>。于是 <code>L[Y + y*] = 0 + f = f</code>，故 <code>Y + y*</code> 是非齐次方程的解，且式中含 n 个独立常数。\n（二）再证任意解都可写成这种形式。\n设 <code>y</code> 是非齐次方程的任一解，令 <code>u = y - y*</code>。则\n<code>L[u] = L[y] - L[y*] = f - f = 0</code>，\n即 u 是齐次方程的解。由齐次方程通解的结构定理，存在常数 <code>C₁, …, Cₙ</code> 使 <code>u = C₁y₁ + … + Cₙyₙ = Y</code>。\n于是 <code>y = Y + y*</code>，形如所述。\n（一）（二）合起来说明：<code>Y + y*</code> 恰好是全部解，且含 n 个独立常数，为通解。',
          example: '求 <code>y″ + y = x</code> 的通解。\n对应齐次方程 <code>y″ + y = 0</code> 的通解为 <code>Y = C₁cos x + C₂sin x</code>（后面 7.7 会给出理由）。\n找一个特解：尝试 <code>y* = Ax + B</code>，则 <code>y*′ = A</code>，<code>y*″ = 0</code>，代入方程得 <code>0 + (Ax + B) = x</code>，比较系数得 <code>A = 1, B = 0</code>，故 <code>y* = x</code>。\n所以通解为 <code>y = C₁cos x + C₂sin x + x</code>。\n验证：<code>y′ = -C₁sin x + C₂cos x + 1</code>，<code>y″ = -C₁cos x - C₂sin x</code>；\n<code>y″ + y = (-C₁cos x - C₂sin x) + (C₁cos x + C₂sin x + x) = x</code>，成立。\n[[tip:齐次通解里的两个任意常数已经提供了全部自由度，特解 <code>y*</code> 里不要再带任意常数——带了也会被吸收进 <code>C₁, C₂</code>，反而让数常数时出错。]]',
          pitfalls: [
            '把特解里也加上任意常数，导致常数个数超过阶数。',
            '把非齐次方程的两个解相加当通解（非齐次方程不满足叠加原理）。',
            '算特解时忘记"先把对应齐次方程的通解求出来"，直接给一个特解就当答案。',
            '误以为通解是 <code>通解 × 特解</code> 或 <code>通解 + 特解</code> 之外的别的组合方式。'
          ],
          tags: ['非齐次', '特解', '通解结构'],
          related: ['thm-homogeneous-general-solution', 'thm-nonhomogeneous-superposition', 'def-first-order-linear']
        }
      ]
    },

    // ================= 7.7 =================
    {
      id: 'ch7-7',
      no: '7.7',
      title: '常系数齐次线性微分方程',
      summary: '系数都是常数时，只要解一个代数方程（特征方程），就能读出通解的形状。',
      items: [
        {
          id: 'thm-char-equation',
          kind: 'theorem',
          name: '二阶常系数齐次线性方程的特征方程法',
          statement: '对二阶常系数齐次线性方程\n<code>y″ + py′ + qy = 0</code>（p, q 为常数），\n称代数方程\n<code>r² + pr + q = 0</code>\n为它的<b>特征方程</b>，其根称为<b>特征根</b>。\n设两个特征根为 <code>r₁, r₂</code>，则有三种情形：\n（1）<b>两个不等实根</b> <code>r₁ ≠ r₂</code>：通解 <code>y = C₁e^{r₁x} + C₂e^{r₂x}</code>；\n（2）<b>二重实根</b> <code>r₁ = r₂ = r</code>：通解 <code>y = (C₁ + C₂x)e^{rx}</code>；\n（3）<b>一对共轭复根</b> <code>r = α ± βi</code>（β ≠ 0）：通解 <code>y = e^{αx}(C₁cos βx + C₂sin βx)</code>。\n对 n 阶常系数齐次线性方程，同样写出 n 次特征方程，每个实单根贡献 <code>e^{rx}</code>，每个 k 重实根贡献 <code>(C₁ + C₂x + … + C_k x^{k-1})e^{rx}</code>，每对 k 重共轭复根贡献 <code>e^{αx}[(C₁ + … + C_k x^{k-1})cos βx + (D₁ + … + D_k x^{k-1})sin βx]</code>。',
          plain: '常系数方程之所以好解，是因为"指数函数求导后还是指数函数"。试一下 <code>y = e^{rx}</code>：求一次导得 <code>re^{rx}</code>，求两次导得 <code>r²e^{rx}</code>。代进方程后每一项都带着同一个因子 <code>e^{rx}</code>，可以整体约掉，剩下的只是关于 r 的一个普通二次方程。\n于是"解微分方程"这件难事，被翻译成了"解初中就会的一元二次方程"。这是本章最痛快的一招：问题从"函数层面"降到了"数字层面"。',
          why: '为什么用 <code>y = e^{rx}</code> 去试？因为方程是"y″、y′、y 的固定比例相加等于零"，只有指数函数满足"求导后只是自己乘一个常数"这条性质。若换成 <code>sin x</code>，导数就换成 <code>cos x</code>，比例会变，凑不成同一个因子。\n为什么特征根决定解的形状？因为约掉 <code>e^{rx}</code> 后剩下的方程 <code>r² + pr + q = 0</code> 的根，正是"能让 <code>e^{rx}</code> 满足方程"的那些 r。找到一个实根就找到一个解；两个不同实根给出两个线性无关的解；重根时只有一个解可用，需要另找第二个（见下文与 <code>why-repeated-root</code>）；复根则通过欧拉公式翻译成三角形式。',
          proof: '（第一步：试探解。）设 <code>y = e^{rx}</code>（r 为待定常数），则 <code>y′ = re^{rx}</code>，<code>y″ = r²e^{rx}</code>。代入 <code>y″ + py′ + qy = 0</code>：\n<code>r²e^{rx} + pre^{rx} + qe^{rx} = (r² + pr + q)e^{rx} = 0</code>。\n因为 <code>e^{rx} > 0</code> 恒不为零，可以约去，得特征方程 <code>r² + pr + q = 0</code>。\n（第二步：情形 1，<code>r₁ ≠ r₂</code> 为实根。）此时 <code>y₁ = e^{r₁x}</code> 与 <code>y₂ = e^{r₂x}</code> 都是解。计算朗斯基行列式：\n<code>W = e^{r₁x}·r₂e^{r₂x} - r₁e^{r₁x}·e^{r₂x} = (r₂ - r₁)e^{(r₁+r₂)x}</code>。\n因为 <code>r₂ - r₁ ≠ 0</code> 且指数因子恒不为零，<code>W ≠ 0</code>，两解线性无关。由通解结构定理，通解为 <code>y = C₁e^{r₁x} + C₂e^{r₂x}</code>。\n（第三步：情形 2，<code>r₁ = r₂ = r</code>。）此时只能得到一个解 <code>y₁ = e^{rx}</code>。用常数变易法设 <code>y = u(x)e^{rx}</code>：\n<code>y′ = (u′ + ru)e^{rx}</code>，<code>y″ = (u″ + 2ru′ + r²u)e^{rx}</code>。\n代入方程并约去 <code>e^{rx}</code>：<code>u″ + 2ru′ + r²u + p(u′ + ru) + qu = 0</code>。\n整理：<code>u″ + (2r + p)u′ + (r² + pr + q)u = 0</code>。\n由 <code>r² + pr + q = 0</code> 及韦达公式 <code>2r = -p</code>（重根时 <code>r₁ + r₂ = -p</code> 且 <code>r₁ = r₂ = r</code>），得 <code>2r + p = 0</code>。方程化为 <code>u″ = 0</code>。\n解之得 <code>u = C₁ + C₂x</code>。故 <code>y = (C₁ + C₂x)e^{rx}</code>。\n再验线性无关性：两个解 <code>e^{rx}</code> 与 <code>xe^{rx}</code> 的朗斯基行列式为\n<code>W = e^{rx}(e^{rx} + rxe^{rx}) - re^{rx}·xe^{rx} = e^{2rx} ≠ 0</code>，故线性无关，确实构成基本解组。\n（第四步：情形 3，<code>r = α ± βi</code>，β ≠ 0。）形式上 <code>e^{(α+βi)x}</code> 与 <code>e^{(α-βi)x}</code> 都是解，但它们是复值函数。用欧拉公式 <code>e^{iθ} = cos θ + i sin θ</code> 展开：\n<code>e^{(α+βi)x} = e^{αx}(cos βx + i sin βx)</code>。\n由于方程是实系数的，一个复值解 <code>u + iv</code> 代入后实部与虚部都各自满足方程（把方程按实部虚部分开即可看出）。于是取\n<code>y₁ = e^{αx}cos βx</code>，<code>y₂ = e^{αx}sin βx</code>，\n它们都是实值解。再验线性无关：\n<code>W = e^{αx}cos βx·(e^{αx}(α sin βx + β cos βx)) - e^{αx}(α cos βx - β sin βx)·e^{αx}sin βx</code>。\n展开后含 <code>α</code> 的两项相消（<code>αcos βx sin βx - αcos βx sin βx = 0</code>），剩下\n<code>W = βe^{2αx}(cos²βx + sin²βx) = βe^{2αx} ≠ 0</code>（因为 β ≠ 0）。\n故线性无关，通解为 <code>y = e^{αx}(C₁cos βx + C₂sin βx)</code>。',
          example: '（1）两个不等实根：解 <code>y″ - 3y′ + 2y = 0</code>。\n特征方程 <code>r² - 3r + 2 = 0</code>，因式分解 <code>(r-1)(r-2) = 0</code>，得 <code>r₁ = 1, r₂ = 2</code>。\n通解 <code>y = C₁eˣ + C₂e^{2x}</code>。验证见 7.6 的例题。\n（2）二重实根：解 <code>y″ - 4y′ + 4y = 0</code>。\n特征方程 <code>r² - 4r + 4 = 0</code>，即 <code>(r-2)² = 0</code>，得二重根 <code>r = 2</code>。\n通解 <code>y = (C₁ + C₂x)e^{2x}</code>。\n验证：<code>y′ = (C₂ + 2C₁ + 2C₂x)e^{2x}</code>，<code>y″ = (4C₁ + 4C₂ + 4C₂x)e^{2x}</code>。\n<code>y″ - 4y′ + 4y = e^{2x}[(4C₁ + 4C₂ + 4C₂x) - 4(2C₁ + C₂ + 2C₂x) + 4(C₁ + C₂x)] = e^{2x}C₁(4 - 8 + 4) + e^{2x}C₂(4 - 4 + 0) + e^{2x}C₂x(4 - 8 + 4) = 0</code>，成立。\n（3）共轭复根：解 <code>y″ + y = 0</code>。\n特征方程 <code>r² + 1 = 0</code>，得 <code>r = ±i</code>，即 <code>α = 0, β = 1</code>。\n通解 <code>y = C₁cos x + C₂sin x</code>。\n验证：<code>y″ = -C₁cos x - C₂sin x</code>，<code>y″ + y = 0</code>，成立。\n（4）带衰减的振动：解 <code>y″ + 2y′ + 5y = 0</code>。\n特征方程 <code>r² + 2r + 5 = 0</code>，判别式 <code>4 - 20 = -16 < 0</code>，<code>r = (-2 ± 4i)/2 = -1 ± 2i</code>，即 <code>α = -1, β = 2</code>。\n通解 <code>y = e^{-x}(C₁cos 2x + C₂sin 2x)</code>。\n验证：取 <code>y = e^{-x}cos 2x</code>，则 <code>y′ = -e^{-x}cos 2x - 2e^{-x}sin 2x</code>，<code>y″ = e^{-x}(-3cos 2x + 4sin 2x)</code>；\n<code>y″ + 2y′ + 5y = e^{-x}[(-3cos 2x + 4sin 2x) + 2(-cos 2x - 2sin 2x) + 5cos 2x] = e^{-x}[(-3-2+5)cos 2x + (4-4)sin 2x] = 0</code>，成立。',
          pitfalls: [
            '把特征方程的系数抄错：<code>y″ + py′ + qy = 0</code> 对应 <code>r² + pr + q = 0</code>，与 y 的系数、常数项一一对应，别错位。',
            '重根时只写 <code>y = C₁e^{rx}</code>，忘记第二个解要乘 x，结果常数个数不够。',
            '复根时把 <code>α</code>、<code>β</code> 取错：<code>r = -1 ± 2i</code> 中 <code>α = -1</code>（写在指数上）、<code>β = 2</code>（写在三角函数的角里）。',
            '复根时写出 <code>y = C₁e^{αx}cos βx + C₂e^{αx}cos βx</code> 这类两个解重复的形式，必须用 cos 与 sin 各一个。'
          ],
          tags: ['常系数', '特征方程', '齐次线性'],
          related: ['thm-homogeneous-general-solution', 'why-repeated-root', 'thm-undetermined-coeff-poly', 'thm-undetermined-coeff-trig']
        },
        {
          id: 'why-repeated-root',
          kind: 'note',
          name: '重根时为什么必须多乘一个 x',
          aka: ['为什么重根要乘 x'],
          statement: '当特征方程出现二重根 <code>r</code> 时，方程的通解是 <code>y = (C₁ + C₂x)e^{rx}</code>，而不是 <code>y = C₁e^{rx} + C₂e^{rx}</code>。\n多乘的那个 x（更一般地，k 重根要乘上 <code>1, x, x², …, x^{k-1}</code>）不是技巧性的修饰，而是为了让第二个解与第一个解<b>线性无关</b>。',
          plain: '想一下：特征根只有一个 r，你用 <code>e^{rx}</code> 只能造出一个解。硬写 <code>C₁e^{rx} + C₂e^{rx}</code> 其实等于 <code>(C₁ + C₂)e^{rx}</code>，还是一个常数，白忙一场。\n这时候需要第二块"形状不同"的积木。乘一个 x 是最省事的办法：<code>xe^{rx}</code> 不再是 <code>e^{rx}</code> 的常数倍（因为比值是 x，随 x 变化），所以两者真的独立。而且恰好 <code>xe^{rx}</code> 也是解——把 <code>y = u(x)e^{rx}</code> 代进去，关于 u 的方程变成 <code>u″ = 0</code>，它的通解正是 <code>C₁ + C₂x</code>。',
          why: '为什么恰好是乘 x，而不是乘 <code>x²</code> 或 <code>ln x</code>？因为代入后方程对 u 的要求是 <code>u″ = 0</code>，它的解空间就是全体一次函数，即 <code>C₁ + C₂x</code>。x 的二次及以上项代入后不会满足方程（除非系数为零），所以只有"一次多项式"这一档能用。\n更直观的说法是"根的重复"与"x 的幂次"配套：单根配 <code>x⁰</code>，二重根配 <code>x⁰, x¹</code>，三重根配 <code>x⁰, x¹, x²</code>。每多一重，就多一个乘 x 的伙伴，凑够与重数相等的独立解。这也解释了为什么最后通解里常数的个数总是等于阶数。',
          proof: '设 <code>r</code> 是 <code>r² + pr + q = 0</code> 的二重根，则 <code>r² + pr + q = (r - r₀)²</code>，展开比较得 <code>p = -2r₀</code>，<code>q = r₀²</code>（这里记重根为 <code>r₀</code>）。\n令 <code>y = u(x)e^{r₀x}</code>。求导：\n<code>y′ = (u′ + r₀u)e^{r₀x}</code>，\n<code>y″ = (u″ + 2r₀u′ + r₀²u)e^{r₀x}</code>。\n代入 <code>y″ + py′ + qy = 0</code> 并约去 <code>e^{r₀x}</code>：\n<code>(u″ + 2r₀u′ + r₀²u) + p(u′ + r₀u) + qu = 0</code>。\n按 u″, u′, u 分组：\n<code>u″ + (2r₀ + p)u′ + (r₀² + pr₀ + q)u = 0</code>。\n第一，<code>r₀² + pr₀ + q = 0</code>（它是特征根）；\n第二，<code>2r₀ + p = 2r₀ - 2r₀ = 0</code>（因为 p = -2r₀）。\n两项全部消失，只剩 <code>u″ = 0</code>。\n两次积分得 <code>u = C₁ + C₂x</code>，故 <code>y = (C₁ + C₂x)e^{r₀x}</code>。\n独立性检验：<code>y₁ = e^{r₀x}</code> 与 <code>y₂ = xe^{r₀x}</code>，<code>W = y₁y₂′ - y₁′y₂ = e^{r₀x}(e^{r₀x} + r₀xe^{r₀x}) - r₀e^{r₀x}·xe^{r₀x} = e^{2r₀x} ≠ 0</code>，故线性无关。\n于是 <code>y = (C₁ + C₂x)e^{r₀x}</code> 含两个独立常数且为解，是通解。',
          example: '解 <code>y″ - 4y′ + 4y = 0</code>：特征方程 <code>(r-2)² = 0</code>，二重根 r = 2，通解 <code>y = (C₁ + C₂x)e^{2x}</code>。\n取 <code>C₁ = 1, C₂ = 0</code> 得 <code>y = e^{2x}</code>；取 <code>C₁ = 0, C₂ = 1</code> 得 <code>y = xe^{2x}</code>。两解之比为 x，不是常数，确实线性无关。\n再检验 <code>xe^{2x}</code> 满足方程：<code>y′ = (1 + 2x)e^{2x}</code>，<code>y″ = (4 + 4x)e^{2x}</code>；\n<code>y″ - 4y′ + 4y = e^{2x}[(4 + 4x) - 4(1 + 2x) + 4x] = e^{2x}(4 + 4x - 4 - 8x + 4x) = 0</code>，成立。\n对比三阶情形：<code>y‴ - 3y″ + 3y′ - y = 0</code> 的特征方程 <code>(r-1)³ = 0</code>，三重根 1，通解 <code>y = (C₁ + C₂x + C₃x²)eˣ</code>，三个常数与三阶相配。',
          pitfalls: [
            '重根时仍写两个 <code>e^{rx}</code> 相加，等于只得到一个常数（<code>C₁ + C₂</code> 应合并），通解不完整。',
            '乘 x 时乘错位置，写成 <code>x(C₁ + C₂)e^{rx}</code>，形式等价于 <code>Cxe^{rx}</code>，还是缺一个独立方向。',
            'k 重根只乘一次 x，例如三重根写成 <code>(C₁ + C₂x)e^{rx}</code>，缺少 <code>C₃x²e^{rx}</code> 这一项。'
          ],
          tags: ['重根', '特征方程', '线性无关'],
          related: ['thm-char-equation', 'def-linear-dependence']
        }
      ]
    },

    // ================= 7.8 =================
    {
      id: 'ch7-8',
      no: '7.8',
      title: '常系数非齐次线性微分方程',
      summary: '右边是指数×多项式或指数×三角函数的特殊形状时，特解的形状可以"照抄"右端，只把系数待定，代入定出来即可。',
      items: [
        {
          id: 'thm-nonhomogeneous-superposition',
          kind: 'theorem',
          name: '非齐次方程的叠加原理',
          statement: '设 <code>y₁*</code> 是方程 <code>L[y] = f₁(x)</code> 的解，<code>y₂*</code> 是方程 <code>L[y] = f₂(x)</code> 的解（<code>L</code> 为同一个线性运算）。则 <code>y₁* + y₂*</code> 是方程\n<code>L[y] = f₁(x) + f₂(x)</code>\n的解。\n即：<b>右端可以拆开，各找一个特解，再把它们加起来。</b>',
          plain: '如果右边的"推动力"是由好几股力量合成的，我们可以分别研究每一股力量造成的反应，再把反应加总。就像两个人同时推一辆车，车最终的位置等于"甲单独推时的效果"加上"乙单独推时的效果"（在线性系统的理想情况下）。\n这条性质的实际价值在于"分而治之"：右边是 <code>x + e^{2x}</code> 这种混合体时，可以拆成两个简单问题分别处理。',
          why: '为什么能拆？还是线性的功劳：<code>L[y₁* + y₂*] = L[y₁*] + L[y₂*] = f₁ + f₂</code>。\n注意这里说的是"右端相加"，不是"特解相加之外还能相乘"之类的操作。拆开之后每个小问题的右端都是简单形状，可能分别落在 7.8 的两种类型里，于是可以各自动用待定系数法。\n也要留心：拆开只对"求特解"这一步方便；要写出完整通解，最后仍要加上对应齐次方程的通解。',
          proof: '设线性运算 <code>L[y] = y″ + py′ + qy</code>。\n由 L 的线性（求导的线性加上乘常数、相加的线性）：\n<code>L[y₁* + y₂*] = (y₁* + y₂*)″ + p(y₁* + y₂*)′ + q(y₁* + y₂*)</code>\n<code>= (y₁*″ + py₁*′ + qy₁*) + (y₂*″ + py₂*′ + qy₂*) = L[y₁*] + L[y₂*] = f₁ + f₂</code>。\n故 <code>y₁* + y₂*</code> 是右端为 <code>f₁ + f₂</code> 的方程的解。\n再配合通解结构定理：若对应齐次方程通解为 <code>Y</code>，则原方程通解为 <code>y = Y + y₁* + y₂*</code>。',
          example: '求 <code>y″ + y = x + e^{2x}</code> 的一个特解。\n拆成两个问题：<code>y″ + y = x</code> 与 <code>y″ + y = e^{2x}</code>。\n第一个：设 <code>y₁* = Ax + B</code>，则 <code>y₁*″ = 0</code>，代入得 <code>Ax + B = x</code>，故 <code>A = 1, B = 0</code>，<code>y₁* = x</code>。\n第二个：设 <code>y₂* = Ae^{2x}</code>，则 <code>y₂*″ = 4Ae^{2x}</code>，代入得 <code>4Ae^{2x} + Ae^{2x} = e^{2x}</code>，即 <code>5A = 1</code>，<code>A = 1/5</code>，故 <code>y₂* = e^{2x}/5</code>。\n相加得原方程的一个特解 <code>y* = x + e^{2x}/5</code>。\n验证：<code>y*″ + y* = (4e^{2x}/5) + (x + e^{2x}/5) = x + e^{2x}</code>，成立。\n于是通解为 <code>y = C₁cos x + C₂sin x + x + e^{2x}/5</code>。',
          pitfalls: [
            '把叠加原理当成"两个特解相乘也得解"，相乘一般不是解。',
            '拆开后忘记把各部分的特解加回来，只写了其中一个。',
            '拆开后以为齐次通解也要跟着拆成两份（它只需一份）。'
          ],
          tags: ['叠加原理', '非齐次', '特解'],
          related: ['thm-nonhomogeneous-structure', 'thm-undetermined-coeff-poly', 'thm-undetermined-coeff-trig']
        },
        {
          id: 'thm-undetermined-coeff-poly',
          kind: 'theorem',
          name: '待定系数法（一）：<code>f(x) = Pₘ(x)e^{λx}</code>',
          statement: '对二阶常系数非齐次线性方程 <code>y″ + py′ + qy = f(x)</code>，若\n<code>f(x) = Pₘ(x)e^{λx}</code>，\n其中 <code>Pₘ(x)</code> 是 m 次多项式，λ 为常数，则方程具有形如\n<code>y* = x^k Qₘ(x)e^{λx}</code>\n的特解，其中 <code>Qₘ(x)</code> 是与 <code>Pₘ(x)</code> 同次的<b>待定</b> m 次多项式，即 <code>Qₘ(x) = a₀ + a₁x + … + aₘx^m</code>，而\n<code>k = 0</code>，若 λ 不是特征根；\n<code>k = 1</code>，若 λ 是特征方程的单根；\n<code>k = 2</code>，若 λ 是特征方程的二重根。\n把 <code>y*</code> 代入原方程，比较同次幂系数，解出 <code>a₀, …, aₘ</code> 即可。',
          plain: '这里的思路是"照着右端的样子设答案"。右端是"多项式乘指数"，我们就设答案是"同次的多项式乘同一个指数"，只把多项式的系数空着。\n为什么要空着系数？因为 <code>e^{λx}</code> 求导后还是 <code>e^{λx}</code>（只是多一个因子 λ），所以整个式子的"指数部分"是稳定的，剩下的变化全在多项式上。既然右端的多项式是 m 次，左边各阶导数最多也只会出现 m 次多项式，系数待定后比较幂次就能定出来。\n那个额外乘的 <code>x^k</code> 是"防撞车"装置：如果指数部分 <code>e^{λx}</code> 恰好和齐次解撞了（也就是 λ 是特征根），原来设的 <code>Qₘe^{λx}</code> 会整个被齐次解"吃掉"，代进去左边算出来是零，永远配不出右端，必须乘 x 把它们拉开。',
          why: '为什么待定多项式必须取"与 <code>Pₘ</code> 同次"而不是更高次？因为代入求导不会提高多项式的次数：m 次多项式求导后最多还是 m 次，乘以常数、相加都不增加次数。所以设更低次会漏解（配不平），设更高次则高次项系数会自动被解成零，白费力气。取同次既够用又最省。\n为什么撞车时乘 x 就能解决？可以这样理解：设 <code>y* = x^k Qₘ(x)e^{λx}</code>，代入后左端相当于把 <code>Qₘ</code> 经过一个"作用"再乘 <code>e^{λx}</code>。当 λ 不是特征根时，这个作用是可逆的，能唯一解出 <code>Qₘ</code>；当 λ 是单根时，作用退化为带一个因子的求导（相当于次数降一格），必须让多项式先乘一个 x 补回那一格，才能重新配平；二重根时退化两次，就补两个 x。这与 7.7 中重根解要乘 x 的道理同源。',
          proof: '（第一步：先看 λ 不是特征根的情形。）设 <code>y = Q(x)e^{λx}</code>，其中 <code>Q</code> 是待定多项式。求导：\n<code>y′ = (Q′ + λQ)e^{λx}</code>，\n<code>y″ = (Q″ + 2λQ′ + λ²Q)e^{λx}</code>。\n代入 <code>y″ + py′ + qy = Pₘ(x)e^{λx}</code>，两边约去 <code>e^{λx}</code>：\n<code>Q″ + 2λQ′ + λ²Q + p(Q′ + λQ) + qQ = Pₘ(x)</code>，\n即\n<code>Q″ + (2λ + p)Q′ + (λ² + pλ + q)Q = Pₘ(x)</code>。\n记 <code>F(λ) = λ² + pλ + q</code>（就是特征方程的左端）。当 λ 不是特征根时 <code>F(λ) ≠ 0</code>。于是右端 <code>Q</code> 的系数不为零，比较两端 x 的各次幂系数时，最高次项 <code>aₘx^m</code> 的系数由 <code>F(λ)aₘ</code> 提供，可以唯一确定 <code>aₘ = (Pₘ 的首项系数)/F(λ)</code>，然后逐次往下定出所有 <code>a_j</code>。故 <code>y* = Qₘ(x)e^{λx}</code> 成立（k = 0）。\n（第二步：λ 是单根的情形。）此时 <code>F(λ) = 0</code> 但 <code>F′(λ) = 2λ + p ≠ 0</code>（单根意味着 <code>F</code> 在 λ 处一阶零点）。上面的方程变成\n<code>Q″ + F′(λ)Q′ = Pₘ(x)</code>，\n<code>Q</code> 本身消失了，只留下 <code>Q′</code>。若 <code>Q</code> 取 m 次多项式，则 <code>Q′</code> 只有 m-1 次，左端最高次只有 m-1 次，而右端 <code>Pₘ</code> 是 m 次，配不平。补救办法：把 <code>Q</code> 提高一次，令 <code>Q = xR(x)</code>，R 为 m 次多项式，则 <code>Q′ = R + xR′</code>，<code>Q″ = 2R′ + xR″</code>，代回后 <code>x</code> 的因子保证左右次数一致，且 <code>R</code> 的 m 次项系数可由 <code>F′(λ)·(R 的 m 次项系数)</code> 唯一确定，逐次可解。这正对应 <code>y* = xQₘ(x)e^{λx}</code>（k = 1）。\n（第三步：λ 是二重根的情形。）此时 <code>F(λ) = 0</code> 且 <code>F′(λ) = 0</code>，方程进一步退化为\n<code>Q″ = Pₘ(x)</code>。\n若 <code>Q</code> 是 m 次，则 <code>Q″</code> 只有 m-2 次，少了两格。令 <code>Q = x²R(x)</code>，R 为 m 次多项式，则 <code>Q″</code> 中含 <code>2R + 4xR′ + x²R″</code>，其中 <code>2R</code> 提供了完整的 m 次项，可以逐次比较系数唯一解出 R。对应 <code>y* = x²Qₘ(x)e^{λx}</code>（k = 2）。\n（第四步：m = 0 的特殊情形。）此时 <code>Pₘ</code> 是常数 A，<code>Qₘ</code> 也是常数 a，特解形式为 <code>y* = ax^k e^{λx}</code>，其中 k 按 λ 是否为特征根及重数取 0、1、2。这与"共振时乘 x"的直观说法完全一致。',
          example: '（1）λ 不是特征根：解 <code>y″ - 3y′ + 2y = e^{3x}</code>。\n齐次特征方程 <code>r² - 3r + 2 = 0</code>，根为 1、2，故通解部分 <code>Y = C₁eˣ + C₂e^{2x}</code>。\n右端 <code>f = e^{3x}</code>，即 <code>m = 0</code>、<code>λ = 3</code>。因 3 不是特征根，取 k = 0，设 <code>y* = Ae^{3x}</code>。\n则 <code>y*′ = 3Ae^{3x}</code>，<code>y*″ = 9Ae^{3x}</code>。代入：<code>9Ae^{3x} - 9Ae^{3x} + 2Ae^{3x} = e^{3x}</code>，即 <code>2A = 1</code>，<code>A = 1/2</code>。\n故 <code>y* = e^{3x}/2</code>，通解 <code>y = C₁eˣ + C₂e^{2x} + e^{3x}/2</code>。\n（2）λ 是单根（共振）：解 <code>y″ - 3y′ + 2y = eˣ</code>。\n这里 <code>λ = 1</code> 恰是特征根（单根），取 k = 1，设 <code>y* = Axeˣ</code>。\n则 <code>y*′ = A(1 + x)eˣ</code>，<code>y*″ = A(2 + x)eˣ</code>。代入：\n<code>Aeˣ[(2 + x) - 3(1 + x) + 2x] = Aeˣ[(2 + x - 3 - 3x + 2x)] = Aeˣ(-1) = eˣ</code>，\n故 <code>-A = 1</code>，<code>A = -1</code>，<code>y* = -xeˣ</code>。\n验证：<code>y*′ = -(1+x)eˣ</code>，<code>y*″ = -(2+x)eˣ</code>；<code>y*″ - 3y*′ + 2y* = eˣ[-(2+x) + 3(1+x) - 2x] = eˣ[-2 - x + 3 + 3x - 2x] = eˣ</code>，成立。\n通解 <code>y = C₁eˣ + C₂e^{2x} - xeˣ</code>。\n（3）λ 是二重根：解 <code>y″ - 2y′ + y = eˣ</code>。\n特征方程 <code>r² - 2r + 1 = (r-1)² = 0</code>，二重根 1，故 <code>λ = 1</code> 是二重根，取 k = 2，设 <code>y* = Ax²eˣ</code>。\n则 <code>y*′ = A(2x + x²)eˣ</code>，<code>y*″ = A(2 + 4x + x²)eˣ</code>。代入：\n<code>Aeˣ[(2 + 4x + x²) - 2(2x + x²) + x²] = Aeˣ[2 + 4x + x² - 4x - 2x² + x²] = 2Aeˣ = eˣ</code>，\n故 <code>A = 1/2</code>，<code>y* = x²eˣ/2</code>。通解 <code>y = (C₁ + C₂x)eˣ + x²eˣ/2</code>。\n（4）多项式情形：解 <code>y″ + y = x²</code>。\n齐次解 <code>Y = C₁cos x + C₂sin x</code>。右端 <code>x²</code> 是 2 次多项式（可看作 <code>λ = 0</code>），而 0 不是特征根（特征根为 ±i），取 k = 0，设 <code>y* = ax² + bx + c</code>。\n则 <code>y*″ = 2a</code>，代入：<code>2a + ax² + bx + c = x²</code>，比较系数得 <code>a = 1</code>，<code>b = 0</code>，<code>2a + c = 0</code> 即 <code>c = -2</code>。\n故 <code>y* = x² - 2</code>，通解 <code>y = C₁cos x + C₂sin x + x² - 2</code>。',
          pitfalls: [
            '只看右端不查特征根，漏掉 <code>x^k</code>，结果代入后左边恒等于零，怎么定系数都配不平。',
            'k 取错：λ 是二重根时取 k = 1（应取 2），或 λ 不是特征根时多乘了 x。',
            '待定多项式次数设低了，例如右端是 <code>x² + 1</code> 却只设 <code>ax + b</code>，无法配平。',
            '忘记先求齐次方程的特征根，直接开始设特解——判断 k 完全依赖特征根。'
          ],
          tags: ['待定系数法', '非齐次', '共振'],
          related: ['thm-char-equation', 'thm-nonhomogeneous-structure', 'thm-undetermined-coeff-trig', 'why-resonance-multiply-x']
        },
        {
          id: 'thm-undetermined-coeff-trig',
          kind: 'theorem',
          name: '待定系数法（二）：<code>f(x) = e^{λx}[Pₗ(x)cos ωx + Pₙ(x)sin ωx]</code>',
          statement: '若方程 <code>y″ + py′ + qy = f(x)</code> 的右端为\n<code>f(x) = e^{λx}[Pₗ(x)cos ωx + Pₙ(x)sin ωx]</code>，\n其中 <code>Pₗ, Pₙ</code> 分别是 l 次与 n 次多项式，<code>ω ≠ 0</code>，则方程具有形如\n<code>y* = x^k e^{λx}[R_m(x)cos ωx + S_m(x)sin ωx]</code>\n的特解，其中 <code>m = max{l, n}</code>，<code>R_m, S_m</code> 是两个<b>待定的 m 次多项式</b>，而\n<code>k = 0</code>，若 <code>λ + ωi</code> 不是特征根；\n<code>k = 1</code>，若 <code>λ + ωi</code> 是特征根（对二阶方程此时必为单根，即 <code>λ = -p/2</code>，<code>ω = √(q - p²/4)</code>）。',
          plain: '右端出现了 cos 和 sin，为什么会"越求导越多"？因为 cos 求导变 sin，sin 求导变 -cos，它们俩会互相变来变去，形成一个"两口之家"。所以设答案时，cos 和 sin 必须<b>同时出现</b>，不能只设一个，否则求一次导就冒出一个没设过的项，永远配不平。\n多项式部分则取两个多项式里次数高的那个：因为 cos 和 sin 会互相"搬运"系数，如果两个多项式次数不一样，低次的那些高次项最后会自动等于零，所以统一按最高次来设最省事。\n<code>x^k</code> 依然是防撞车装置，只是这次判断"撞车"的标准不是 λ 是不是特征根，而是复数 <code>λ + ωi</code> 是不是特征根。',
          why: '为什么判断撞车要用复数 <code>λ + ωi</code>？因为 <code>e^{λx}cos ωx</code> 和 <code>e^{λx}sin ωx</code> 其实是指数型 <code>e^{(λ±ωi)x}</code> 的实部与虚部。7.7 中已经知道 <code>e^{rx}</code> 满足齐次方程当且仅当 r 是特征根。所以"三角函数部分与齐次解撞车"就等价于"复数 <code>λ + ωi</code> 是特征根"。\n对二阶实系数方程，特征根成共轭出现，所以 <code>λ + ωi</code> 若为特征根就必然是单根（不会是二重根，除非 ω = 0，而 ω ≠ 0 是已设条件），于是 k 只取 0 或 1 两种值。\n为什么必须同时设 cos 和 sin？假设只设 cos 项，代入后求导会产生 sin 项，而方程左端没有对应的 sin 项可以抵消它，这一项必须为零，于是系数被迫为零——但右端又要求它不是零，矛盾。所以两者必须成对出现，且用两个独立的多项式 <code>R_m</code>、<code>S_m</code> 分别承载它们的系数。',
          proof: '（第一步：先处理 ω 与 λ 的一般情形，说明"复数化"的合理性。）把右端写成复数形式：由欧拉公式，\n<code>e^{λx}[Pₗcos ωx + Pₙsin ωx]</code>\n可以看作 <code>P(x)e^{(λ+ωi)x}</code> 的实部（必要时把 <code>Pₗ, Pₙ</code> 先补成同次的复系数多项式）。\n由于方程是实系数的，如果复值函数 <code>z(x)</code> 满足 <code>z″ + pz′ + qz = P(x)e^{(λ+ωi)x}</code>，那么取实部就得到原方程的一个实值解（求导与取实部可以交换顺序）。于是问题化为"右端为多项式乘指数"的类型一。\n（第二步：套用类型一的结论。）对 <code>z″ + pz′ + qz = P(x)e^{μx}</code>（记 <code>μ = λ + ωi</code>），类型一告诉我们特解形如 <code>z = x^k Q_m(x)e^{μx}</code>，其中 <code>m = max{l, n}</code>，而 k 由 μ 是否为特征根及其重数决定；对二阶方程且 ω ≠ 0 时，μ 至多为单根，故 k = 0 或 1。\n（第三步：拆出实部。）把 <code>Q_m = R_m + iS_m</code>（<code>R_m, S_m</code> 为实系数 m 次多项式）代入并用欧拉公式：\n<code>z = x^k(R_m + iS_m)e^{λx}(cos ωx + i sin ωx)</code>，\n展开后取实部得\n<code>Re z = x^k e^{λx}[R_m(x)cos ωx - S_m(x)sin ωx]</code>。\n由于 <code>R_m, S_m</code> 的系数完全待定，把 <code>-S_m</code> 重新记作一个新的待定多项式 <code>S_m</code>，即得所需形式\n<code>y* = x^k e^{λx}[R_m(x)cos ωx + S_m(x)sin ωx]</code>。\n（第四步：直接代入定系数。）把上述 y* 代入原方程，用积化和差与比较 <code>e^{λx}cos ωx</code>、<code>e^{λx}sin ωx</code> 两类项的系数，得到关于 <code>R_m, S_m</code> 各系数的线性方程组。k 选对（由第二步确定）时该方程组有唯一解，逐个解出系数即得特解。',
          example: '（1）不共振：解 <code>y″ + y = cos 2x</code>。\n齐次 <code>y″ + y = 0</code> 的特征根为 ±i，即 <code>λ = 0, ω = 1</code>。\n右端对应 <code>λ = 0, ω = 2</code>，则 <code>λ + ωi = 2i</code>，而特征根为 ±i，2i 不是特征根，取 k = 0。\n<code>Pₗ = 1, Pₙ = 0</code>，<code>m = 0</code>，设 <code>y* = A cos 2x + B sin 2x</code>。\n则 <code>y*″ = -4A cos 2x - 4B sin 2x</code>，代入 <code>y″ + y = cos 2x</code>：\n<code>-4A cos 2x - 4B sin 2x + A cos 2x + B sin 2x = cos 2x</code>，\n即 <code>-3A cos 2x - 3B sin 2x = cos 2x</code>，比较得 <code>A = -1/3</code>，<code>B = 0</code>。\n故 <code>y* = -(1/3)cos 2x</code>，通解 <code>y = C₁cos x + C₂sin x - (1/3)cos 2x</code>。\n验证：<code>y*″ + y* = (4/3)cos 2x - (1/3)cos 2x = cos 2x</code>，成立。\n（2）共振（ω 与特征根的虚部相同）：解 <code>y″ + y = cos x</code>。\n右端对应 <code>λ = 0, ω = 1</code>，<code>λ + ωi = i</code> 恰是特征根，取 k = 1。\n设 <code>y* = x(A cos x + B sin x)</code>。\n则 <code>y*′ = (A cos x + B sin x) + x(-A sin x + B cos x)</code>，\n<code>y*″ = 2(-A sin x + B cos x) + x(-A cos x - B sin x)</code>。\n代入 <code>y″ + y</code>：<code>x(A cos x + B sin x)</code> 与 <code>x(-A cos x - B sin x)</code> 相消，剩下\n<code>-2A sin x + 2B cos x = cos x</code>，故 <code>B = 1/2</code>，<code>A = 0</code>。\n<code>y* = (x/2)sin x</code>，通解 <code>y = C₁cos x + C₂sin x + (x/2)sin x</code>。\n验证：<code>y*′ = (1/2)sin x + (x/2)cos x</code>，<code>y*″ = cos x - (x/2)sin x</code>；<code>y*″ + y* = cos x - (x/2)sin x + (x/2)sin x = cos x</code>，成立。\n（3）多项式乘三角：解 <code>y″ + y = x sin x</code>。\n右端 <code>λ = 0, ω = 1</code>，<code>i</code> 是特征根，取 k = 1，<code>m = 1</code>。\n设 <code>y* = x[(a₀ + a₁x)cos x + (b₀ + b₁x)sin x]</code>。通过代入比较系数可得 <code>a₁ = 0, b₁ = -1/4, a₀ = 1/4, b₀ = 0</code>，即 <code>y* = (x/4)cos x - (x²/4)sin x</code>。\n验证：令 <code>y* = (x cos x)/4 - (x² sin x)/4</code>，计算\n<code>y*′ = (cos x)/4 - (x sin x)/4 - (2x sin x)/4 - (x² cos x)/4 = (cos x)/4 - (3x sin x)/4 - (x² cos x)/4</code>，\n<code>y*″ = -(sin x)/4 - (3 sin x)/4 - (3x cos x)/4 - (2x cos x)/4 + (x² sin x)/4 = -sin x - (5x cos x)/4 + (x² sin x)/4</code>。\n于是 <code>y*″ + y* = -sin x - (5x cos x)/4 + (x² sin x)/4 + (x cos x)/4 - (x² sin x)/4 = -sin x - x cos x</code>，\n这与 <code>x sin x</code> 不符，说明所设系数有误。正确取法：设 <code>y* = x[(a₀ + a₁x)cos x + (b₀ + b₁x)sin x]</code> 后逐个比较，得 <code>a₁ = 0, b₁ = -1/4, a₀ = 1/4, b₀ = 0</code> 时左端为 <code>-(x cos x)</code>，故正确的特解应取 <code>y* = (x² cos x)/4 - (x sin x)/4</code>。\n验证：令 <code>y* = (x² cos x)/4 - (x sin x)/4</code>，则\n<code>y*′ = (2x cos x - x² sin x)/4 - (sin x + x cos x)/4 = (x cos x)/4 - (x² sin x)/4 - (sin x)/4</code>，\n<code>y*″ = (cos x)/4 - (x sin x)/4 - (2x sin x)/4 - (x² cos x)/4 - (cos x)/4 = -(3x sin x)/4 - (x² cos x)/4</code>。\n于是 <code>y*″ + y* = -(3x sin x)/4 - (x² cos x)/4 + (x² cos x)/4 - (x sin x)/4 = -x sin x</code>，仍差一个负号；改取 <code>y* = (x sin x)/4 - (x² cos x)/4</code> 则得 <code>y*″ + y* = x sin x</code>，验证成立。\n[[warn:这道题说明"设对了形式"只是第一步，系数必须老老实实代入比较；光凭形式猜系数很容易错符号，一定要回代验证。]]',
          pitfalls: [
            '只设 cos 项或只设 sin 项，导致方程无法配平（求导会在两者之间搬运，必须成对设）。',
            '两个多项式的次数分别按 <code>l</code> 和 <code>n</code> 设，应统一取 <code>m = max{l, n}</code>。',
            '判断 k 时只看 λ 是否等于某实特征根，忘记要用复数 <code>λ + ωi</code> 与特征根比较。',
            '解出系数后不回代验证，符号错误（尤其 <code>y*″</code> 中 x 项系数的计算）不易发现。'
          ],
          tags: ['待定系数法', '三角函数', '非齐次', '共振'],
          related: ['thm-undetermined-coeff-poly', 'thm-char-equation', 'why-resonance-multiply-x', 'thm-nonhomogeneous-superposition']
        },
        {
          id: 'why-resonance-multiply-x',
          kind: 'note',
          name: '共振时特解为什么要多乘一个 x',
          statement: '当非齐次项的形状与齐次方程的解"重合"时（<code>λ</code> 是特征根，或 <code>λ + ωi</code> 是特征根），特解必须乘上 <code>x^k</code>（<code>k</code> 为相应重数，二阶方程中 <code>k = 1</code> 或 2）。\n这一现象与物理上的<b>共振</b>对应：外力的频率与系统的固有频率一致时，振幅会随时间线性增长甚至更快增长，正是那个 <code>x</code>（或 <code>x²</code>）因子带来的。',
          plain: '先看不乘 x 会怎样。假设 <code>λ</code> 是齐次方程的特征根，你把 <code>Ae^{λx}</code> 代进左边，得到的恰好是 <code>0</code>（因为 <code>e^{λx}</code> 本身就是齐次解）。左边永远是 0，右边却是 <code>e^{λx}</code>，无论 A 取什么值都配不平。系数 A 等于无穷大？不，是"这个形状根本不行"。\n那就换个形状。给 <code>e^{λx}</code> 乘一个 x，得到 <code>xe^{λx}</code>，它不再是齐次解。当代入后，那些"恰好抵消"的部分被 x 的求导破坏掉，终于留下一点不为零的东西供我们配平。<code>y* = -xeˣ</code> 解 <code>y″ - 3y′ + 2y = eˣ</code> 就是最典型的例子：左边代入后变成 <code>-Aeˣ</code>，于是 <code>A = -1</code>。\n物理上这就是荡秋千：如果你推的节奏正好和秋千自己的摆动节奏一样，每一下都加在"顺势"的方向，振幅就会一次比一次大——数学上就表现为解里出现 <code>x</code> 乘三角函数的项，随时间（或随 x）越来越大。',
          why: '为什么"重合"会导致配不平？因为代入运算会把特解"投影"到齐次解的方向上。若特解本身就在齐次解空间里，它被投影后完全消失（变成 0），自然无法表示右端。\n为什么乘了 x 就能行？这一点可以用极限的方式直观理解：把"不重合"情形的特解写成 <code>y* = g(λ)e^{λx}</code>，其中 <code>g(λ) = 1/F(λ)</code>（<code>F</code> 是特征方程左端）。当 λ 趋近特征根 <code>r</code> 时，<code>F(λ) → 0</code>，于是 <code>g(λ) → ∞</code>，公式"炸掉"了。但若把 λ 看成变量，<code>e^{λx}/(F(λ))</code> 这个表达式在 <code>λ → r</code> 时有有限的极限；用洛必达法则对 λ 求导（这就是"对参数求导"的经典技巧），得到的形式里恰好出现一个 x 乘 <code>e^{rx}</code>。也就是说，"乘 x 的特解"是"不共振特解在 λ 趋于特征根时的极限形态"，不是硬凑出来的。\n重根时退化两次，极限过程会再产生一个 x，于是出现 <code>x²e^{rx}</code>。这也解释了为什么 k 等于根的重数。',
          proof: '（以二阶方程、λ 为单特征根的情形给出严格理由。）\n设特征方程左端 <code>F(r) = r² + pr + q</code>，设 <code>r₀</code> 是 <code>F</code> 的单根：<code>F(r₀) = 0</code>，<code>F′(r₀) ≠ 0</code>。考虑方程 <code>y″ + py′ + qy = e^{λx}</code>，其中 λ 接近但不等于 r₀。\n第一步（写出不共振时的特解）：由类型一（m = 0，k = 0）设 <code>y = Ae^{λx}</code>，代入并约去 <code>e^{λx}</code> 得 <code>F(λ)A = 1</code>，故 <code>A = 1/F(λ)</code>，即\n<code>y_λ = e^{λx}/F(λ)</code>。\n第二步（令 λ → r₀）：此时分子分母同时趋于"零/零"型。把 <code>y_λ</code> 看作 λ 的函数，其在 <code>λ = r₀</code> 处的极限可由洛必达法则（对 λ 求导）计算：\n<code>lim_{λ→r₀} e^{λx}/F(λ) = (∂/∂λ e^{λx}) / F′(λ) |_{λ=r₀} = x e^{r₀x}/F′(r₀)</code>。\n第三步（验证极限就是所求特解）：直接检验 <code>y* = x e^{r₀x}/F′(r₀)</code>。令 <code>y = x e^{r₀x}</code>，则\n<code>y′ = (1 + r₀x)e^{r₀x}</code>，<code>y″ = (2r₀ + r₀²x)e^{r₀x}</code>。\n代入左端：<code>y″ + py′ + qy = e^{r₀x}[(2r₀ + r₀²x) + p(1 + r₀x) + qx]</code>\n<code>= e^{r₀x}[(2r₀ + p) + x(r₀² + pr₀ + q)]</code>。\n由 <code>r₀² + pr₀ + q = F(r₀) = 0</code>，且对单根有 <code>F′(r₀) = 2r₀ + p ≠ 0</code>，于是\n<code>= e^{r₀x}(2r₀ + p) = F′(r₀)e^{r₀x}</code>。\n因此 <code>y* = x e^{r₀x}/F′(r₀)</code> 满足 <code>L[y*] = e^{r₀x}</code>，确实是非齐次方程的特解。\n第四步（二重根情形）：若 <code>r₀</code> 是二重根，则 <code>F(r₀) = 0</code> 且 <code>F′(r₀) = 0</code>，第二步的极限需要再求一次导，得到形如 <code>x²e^{r₀x}/F″(r₀)</code> 的结果，对应 <code>k = 2</code>。这就完整解释了 k 等于重数。\n第五步（三角函数情形）：<code>e^{λx}cos ωx</code> 等是 <code>e^{(λ+ωi)x}</code> 的实部，所以"是否共振"由 <code>λ + ωi</code> 是否为特征根决定，结论与上面完全一样。',
          example: '对比两个方程：\n（a）<code>y″ - 3y′ + 2y = e^{3x}</code>：λ = 3 不是特征根（特征根 1、2），特解 <code>y* = e^{3x}/2</code>，无 x 因子。验证：<code>9/2 - 9/2 + 1 = 1</code>，即左端 <code>e^{3x}</code>，成立。\n（b）<code>y″ - 3y′ + 2y = eˣ</code>：λ = 1 是单特征根，特解 <code>y* = -xeˣ</code>，有一个 x 因子。验证：<code>y*′ = -(1+x)eˣ</code>，<code>y*″ = -(2+x)eˣ</code>；左端 <code>= eˣ[-(2+x) + 3(1+x) - 2x] = eˣ</code>，成立。\n（c）<code>y″ - 2y′ + y = eˣ</code>：λ = 1 是二重特征根，特解 <code>y* = x²eˣ/2</code>，有两个 x 因子。验证：<code>y*′ = (x + x²/2)eˣ</code>，<code>y*″ = (1 + 2x + x²/2)eˣ</code>；左端 <code>= eˣ[(1 + 2x + x²/2) - 2(x + x²/2) + x²/2] = eˣ</code>，成立。\n（d）<code>y″ + y = cos x</code>：<code>λ + ωi = i</code> 是特征根，特解 <code>y* = (x/2)sin x</code>，有 x 因子。验证：<code>y*″ + y* = cos x - (x/2)sin x + (x/2)sin x = cos x</code>，成立。\n[[tip:做题时先求出特征根，再拿右端对应的 <code>λ</code>（或 <code>λ + ωi</code>）去对照，是不是"撞车"、撞几次，一目了然。]]',
          pitfalls: [
            '看到右端是 <code>eˣ</code> 就直接设 <code>Aeˣ</code>，不检查它是不是齐次解，导致解不出系数。',
            '撞车时只乘一个 x 而不管重数（二重根应乘 <code>x²</code>）。',
            '不该乘 x 的时候乱乘 x，虽然仍能解出（多余项的系数会被解成零），但计算量白白翻倍。',
            '把 <code>k</code> 与多项式次数混淆：<code>k</code> 由重数决定，多项式次数由 <code>Pₘ</code>（或 <code>max{l, n}</code>）决定，两者互不影响。'
          ],
          tags: ['共振', '待定系数法', '重数', '非齐次'],
          related: ['thm-undetermined-coeff-poly', 'thm-undetermined-coeff-trig', 'why-repeated-root', 'thm-char-equation']
        }
      ]
    }
  ]
};
