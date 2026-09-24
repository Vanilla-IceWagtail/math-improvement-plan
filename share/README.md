# 分享素材

这个目录放的是用来分享本站的二维码和文案。

**在线网址：** https://vanilla-icewagtail.github.io/math-improvement-plan/

## 文件

| 文件 | 用途 |
| --- | --- |
| `share-qrcode.png` | 纯二维码，1024×1024 白底。发微信 / QQ / 短信时直接当图片发 |
| `share-qrcode.svg` | 纯二维码，矢量版。适合再加工（自己加标题、贴到海报上） |
| `share-qrcode-v0.1.7.png` | **带版本标注（当前版本）**，564×770。二维码下方写了「MATH TRAINER / v0.1.7 / 一句话介绍」 |
| `share-qrcode-v0.1.7.svg` | 带版本标注的矢量版，**含中文**（数学陪练 · 开源数学自学网站 / v0.1.7）。打印最清晰 |
| `share-qrcode-v0.1.6.png` / `.svg` | 历史版本，**已过时但保留** |
| `share-qrcode-v0.1.5.png` / `.svg` | 历史版本，**已过时但保留** |

所有素材都指向**同一个网址**，并且**全部用解码器反解验证过**：扫出来的字符串与上面的网址逐字符一致。
历史版本保留不删，是因为各版本的 release 说明里都链接了对应文件 —— 删掉会让那些链接变成 404；
二维码本身是静态的，网址没变，所以旧图照样能扫，区别只在下面印的版本号。

验证分两层：

| 命令 | 要不要装依赖 | 验什么 | 在 CI 里跑吗 |
| --- | --- | --- | --- |
| `npm run test-qrcode` | 不用（零依赖） | 文件齐备、PNG 结构合规（直接按规范解析字节流：IHDR/IDAT/CRC）、SVG 里有二维码路径、版本标注与 `package.json` 一致 | ✅ 跑 |
| `npm run verify-qrcode` | 要 `jsqr` + `pngjs` | **真的拿解码器扫一遍**：四份素材都能扫出正确网址；外加反向对照，确认解码器不是假阳性 | ❌ 不跑 |

> `verify-qrcode` 需要第三方解码器，缺依赖时会**直接报错退出**（不会静默跳过假装通过），
> 所以它刻意不进 CI —— 项目本身保持零依赖。发布分享素材前请在本机手动跑一次。

## 怎么分享

**最省事的方式**：直接发网址

```
https://vanilla-icewagtail.github.io/math-improvement-plan/
```

**当面给同学扫**：手机打开 `share-qrcode.png` 或 `share-qrcode-v0.1.7.png`，让对方扫码。

**发图片链接**（对方不用下载就能看到）：

```
https://raw.githubusercontent.com/Vanilla-IceWagtail/math-improvement-plan/main/share/share-qrcode-v0.1.7.png
```

> ⚠️ 微信里发 `raw.githubusercontent.com` 的图片链接**可能被拦**。
> 最稳的做法：先把图片存到手机相册，再当图片发出去。

**贴群公告 / 朋友圈文案**：抄这段

```
数学陪练 · 开源数学自学网站
https://vanilla-icewagtail.github.io/math-improvement-plan/

三大版块：
· 组题组 —— 可按章节、小节或知识点出题，入门→基础→提高→挑战 四档难度递进
· 错题本 —— 按记忆规律提醒复习（5 分钟到 60 天，共 10 档）
· 教材定理定义 —— 章→节→定义/定理 层层展开，配通俗解释与完整证明

收录同济《高等数学》上册（第八版）全 7 章、204 个条目，另有 194 道原创练习题。
可以把自己在题库网站导出的题目拖进来；也能导出题包分享给同学。
纯静态、零依赖、不用注册、不用联网，打开就能用。
```

## 重新生成二维码

改了域名或想更新版本标注时：

```bash
node scripts/make-qrcode.mjs                 # 生成全部素材（版本号取自 package.json）
npm run verify-qrcode                        # ⭐ 用解码器反解四份素材，确认真能扫出正确网址
npm run test-qrcode                          # 零依赖的结构性测试（CI 里跑的就是这个）
node scripts/make-qrcode.mjs --verify        # 等同于 npm run verify-qrcode
node scripts/make-qrcode.mjs --dump-font     # 打印点阵字模，人工核对标注文字
```

依赖（只有 `verify-qrcode` 需要，**装在项目外，不会污染仓库**）：

```bash
# Windows
mkdir "%TEMP%\dsh-qr2" && cd /d "%TEMP%\dsh-qr2" && npm install qrcode jsqr pngjs
# Linux / macOS
mkdir -p "$TMPDIR/dsh-qr2" && cd "$TMPDIR/dsh-qr2" && npm install qrcode jsqr pngjs
```

装在别处也行，用 `QR_MODULES=<那个 node_modules 的绝对路径>` 指过去即可。

实现的几个要点（都在 `scripts/` 里，无第三方运行时依赖）：

- **二维码矩阵**由 `qrcode` 库生成（临时装在系统临时目录，用完即删，项目保持零依赖）
- **PNG 编码**由仓库自带的 `scripts/lib/png.mjs` 完成（只用 Node 内置 `zlib`）
- **标注文字**用仓库自带的 `scripts/lib/bitmap-font.mjs`（5×7 点阵，仅英文大写与数字）
  —— 本机的无头浏览器在沙箱里起不来，没法把 SVG 转成 PNG，
  所以带标注的 PNG 是**自己画的**；需要中文标注时用那份 SVG
- 容错等级 **M**（约 15%），被挡住一小部分仍能扫出来

## 说明

- 二维码是**静态图片**，不会随网站更新自动变化。网址不变，所以旧图依然可用；
  只有想更新「版本标注」时才需要重新生成。
- 带版本标注的文件名里含版本号（如 `-v0.1.6`）。升级后重新生成会**新增**一份，
  旧的会保留（因为凡是发出去的图都收不回来，删掉反而会让人以为发错了）——
  只想留最新的话可以手动删掉旧的那份。当前最新是 **v0.1.6**。
- 二维码**只用于分享**：它不会出现在网站页面上，`share/` 目录也不在 GitHub Pages
  的发布范围内（线上访问 `…/share/share-qrcode.png` 会得到 404）。
  要发给别人请用上面的 raw 链接，或直接发图片文件。
