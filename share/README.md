# 分享素材

这个目录放的是用来分享本站的图片和文案。

**在线网址：** https://vanilla-icewagtail.github.io/math-improvement-plan/

## 文件

| 文件 | 用途 |
| --- | --- |
| `share-qrcode.png` | 1024×1024，白底黑块。发微信 / QQ / 短信时直接当图片发 |
| `share-qrcode.svg` | 矢量版，放大不糊。适合打印成海报、贴纸、班会 PPT |

两个二维码都指向上面的网址，已用解码器反向验证过（扫出来与网址逐字符一致）。

## 怎么分享

**最省事的方式**：直接发网址

```
https://vanilla-icewagtail.github.io/math-improvement-plan/
```

**当面给同学扫**：手机打开 `share-qrcode.png`，让对方扫码。

**发图片链接**（对方不用下载就能看到二维码图片）：

```
https://raw.githubusercontent.com/Vanilla-IceWagtail/math-improvement-plan/main/share/share-qrcode.png
```

**贴群公告 / 朋友圈文案**：抄这段

```
数学陪练 · 开源数学自学网站
https://vanilla-icewagtail.github.io/math-improvement-plan/

三大版块：
· 组题组 —— 按知识点出题，入门→基础→提高→挑战 四档难度递进
· 错题本 —— 按记忆规律提醒复习（5 分钟到 60 天，共 10 档）
· 教材定理定义 —— 章→节→定义/定理 层层展开，配通俗解释与完整证明

收录同济《高等数学》上册（第八版）全 7 章、204 个条目，另有 194 道原创练习题。
纯静态、零依赖、不用注册、不用联网，打开就能用。
```

## 说明

- 这是**静态图片**，不会随网站更新而自动变化。因为网址不会变，所以不需要重新生成。
- 如果将来改了域名或仓库名，需要重新生成二维码：把新网址用任意二维码工具重新生成即可，
  或者用项目里的做法（`qrcode` 包 + `--error-correction-level M`）输出 PNG/SVG。
- 二维码容错等级为 M（约 15%），被挡住一小部分仍能扫出来。
