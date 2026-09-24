# 分享素材

这个目录放的是用来分享本站的二维码和文案。

**在线网址：** https://vanilla-icewagtail.github.io/math-improvement-plan/

## 文件

| 文件 | 用途 |
| --- | --- |
| `share-qrcode.png` | 纯二维码，1024×1024 白底。发微信 / QQ / 短信时直接当图片发 |
| `share-qrcode.svg` | 纯二维码，矢量版。适合再加工（自己加标题、贴到海报上） |
| `share-qrcode-v0.1.5.png` | **带版本标注**，564×770。二维码下方写了「MATH TRAINER / v0.1.5 / 一句话介绍」 |
| `share-qrcode-v0.1.5.svg` | 带版本标注的矢量版，**含中文**（数学陪练 · 开源数学自学网站 / v0.1.5）。打印最清晰 |

四张都指向同一个网址。`share-qrcode.png` 与 `share-qrcode-v0.1.5.png` 已用解码器
**反解验证**：扫出来的字符串与上面的网址逐字符一致。

## 怎么分享

**最省事的方式**：直接发网址

```
https://vanilla-icewagtail.github.io/math-improvement-plan/
```

**当面给同学扫**：手机打开 `share-qrcode.png` 或 `share-qrcode-v0.1.5.png`，让对方扫码。

**发图片链接**（对方不用下载就能看到）：

```
https://raw.githubusercontent.com/Vanilla-IceWagtail/math-improvement-plan/main/share/share-qrcode-v0.1.5.png
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
node scripts/make-qrcode.mjs             # 生成全部素材（版本号取自 package.json）
node scripts/make-qrcode.mjs --verify    # 反解已有 PNG，确认能扫出正确网址
node scripts/make-qrcode.mjs --dump-font # 打印点阵字模，人工核对标注文字
npm run test-qrcode                      # 完整的二维码素材测试
```

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
- 带版本标注的文件名里含版本号（如 `-v0.1.5`）。升级后重新生成会**新增**一份，
  旧的会保留 —— 只想留最新的话可以手动删掉旧的那份。
