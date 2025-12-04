<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# ✨ 臻享阅读 ✨
### 🅿️ [开源阅读](https://github.com/gedoor/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


## 你是否被下面的问题所困扰？
### 官方 APP 的小说阅读体验堪忧
<details><summary> 👎 阅读体验堪忧 </summary>

- 小说功能缺陷
  - 没有小说书架
  - 没有首行缩进
  - 不能保存阅读进度
  - 拉黑功能并非屏蔽
- 搜索功能缺陷
  - 默认搜索标签，而非小说名称
  - 不能直接搜索作者名称，获取其小说
- 基础功能却需要付费
  - 浏览记录是 Vip 功能
  - 屏蔽标签是 Vip 功能
  - 屏蔽作者是 Vip 功能
</details>


### 第三方 APP 的小说阅读体验不佳
> 软件整理自 https://linux.do/t/topic/657910
<details><summary> 🈚️ 无小说功能 </summary>

- [PixEz Viewer](https://github.com/ultranity/Pix-EzViewer)
- [Pi Pixiv](https://github.com/darriousliu/PiPixiv)
</details>

<details><summary> 👎 阅读体验明显不如 Pixiv </summary>

- [Pixiv Shaft](https://github.com/CeuiLiSA/Pixiv-Shaft) 
- [Pixiv Artvier](https://github.com/kerrinz/pixiv-artvier) 
- [Pixes](https://github.com/wgh136/pixes)
</details>

<details><summary> 😞 阅读体验略逊色于 Pixiv </summary>

- [PixEz Flutter](https://github.com/Notsfsssf/pixez-flutter)
- [Pixiv Multi Platform](https://github.com/magic-cucumber/Pixiv-MultiPlatform)
- [Pixiv Viewer](https://github.com/asadahimeka/pixiv-viewer)
</details>

**迄今为止（2025.12），上述软件依然没有一个小说阅读体验超过了 Pixiv**


## 你是否想改善你的阅读体验呢？<br>如果你的回答是“是”，那么你可能需要：
## 开源阅读 + Pixiv 书源
> [!NOTE]
> 
> **我们的目标：做最好的 Pixiv 的小说阅读器**


### 开源阅读软件
> [!IMPORTANT]
>
> 点击链接，下载 **【新共存版】** 安装包并安装软件
>
> https://miaogongzi.lanzout.com/b01rgkhhe

像常规阅读软件一样，也有：书架、搜索、发现、我的 等页面

<details><summary> 🖼 软件界面 </summary>

### 📚 书架页面
添加小说后如图：
![img](./pic/LegadoBookShelf.png)

### 🔎 搜索页面
添加书源后如图：
![img](./pic/SearchViaLegado.png)

### 🌟 发现页面
添加书源后如图：

![img](./pic/LegadoDiscover.png)

### 👤 我的页面
多数阅读软件的我的页面都有登录账号

与常规阅读软件不同，【开源阅读】的我的页面，最上面却是【书源管理】

![img.png](pic/LegadoProfile.png)

【书源管理】和【备份与恢复】这两项非常重要，稍后讲解
</details>


## 概念介绍
### 📖 书源
> [!NOTE]
> **【开源阅读】没有账号体系，软件本身并不提供小说资源**
> 
> **提供小说资源的是【书源】，准确来说是书源内部的网站**

有什么网站的书源，就可以看什么网站的小说
- 有【起点】书源，就可以看 起点网文
- 有【番茄】书源，就可以看 番茄小说
- 有【Pixiv】书源，就可以看 Pixiv 的小说

### 🌐 订阅源
既然提到了书源，也顺便说一下订阅源
> [!NOTE]
> 订阅源类似于RSS，甚至可以听音乐看视频
- 书源、订阅源的内部数据不同，添加源（网络导入、规则订阅）的时候需要区分一下
- 这里使用的是一键导入，不需要区分

> [!IMPORTANT]
> 
> **点击下方链接，导入书源、订阅源**
> 
> 🅿️ [一键导入 Pixiv 书源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json)
>
> 🐲 [一键导入 Pixiv 订阅源](https://loyc.xyz/b/cdx.html?src=legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/btsrk.json)
- 一般来说，书源开发者同时提供书源和订阅源的话，最好都要导入
- 这样才能保证最佳的使用体验


## 书源配置
### ⚙️ 书源管理
打开书源管理，有书源的话，点击书源菜单后，应该是这样的：
![img.png](pic/PixivLogin1.png)
注意这里的【登录】和【调试】，这两个功能很重要，我们稍后讲解


### 🅿️ 登录账号
> [!NOTE]
> 
> **有账号的网站，在书源里登录账号才能阅读相关小说**

#### 1. 开启代理工具
此处略过，请自行学习，**最好开启【全局代理】**

#### 2. 登录 Pixiv 账号
**我的 - 书源管理 - 菜单 - 登录 - 登录账号**

![img](./pic/PixivLogin1.png)

![img](./pic/PixivLoginUIAccount.png)

**登录你的账号，登录成功后，点击右上角的对勾**

![img](./pic/PixivLogin2.jpg)
> [!TIP]
>
> **如果需要验证码，请更换代理，或过段时间再次尝试**
- 登录成功后，就可以使用 Pixiv 书源查看小说了
- 但还请注意，此时阅读的配置还没有全部完成


## 阅读设置
### 💾 [备份与恢复](WebdavBackup.md)
> [!IMPORTANT]
>
> **【开源阅读】没有账号体系，不能在登录书源网站的同时恢复数据**
>
> **需要配置 Webdav 服务，才能从云端恢复数据**
> 
> **详见：[备份与恢复](WebdavBackup.md)**

### 🔄 关闭自动刷新
> [!IMPORTANT]
> 
> **使用时，请在设置里，关闭自动刷新**
> 
> **否则很容易触发触发请求限制，甚至封号**

我的 - 其他设置 - 自动刷新
![img](./pic/LegadoSettingsAutoRefreash.png)
> [!NOTE]
> 
> **截止到这里，你基本上就拥有了完整的阅读体验了**
> 
> **可以像是使用常规阅读软件一样，使用开源阅读了**

### ☁️ [远程书籍](RemoteBooks.md)（可选）
> [!TIP]
> 使用支持 Webdav 的网盘，阅读网盘上的书籍
> 
> **详见：[远程书籍](RemoteBooks.md)**


## 书源功能
### 🖼 登陆界面
> [!TIP]
> **书源众多功能均在登陆页面内**

打开登录界面：
- ①我的 - 书源管理 - Pixiv 小说 - 登录

![img.png](pic/PixivLogin1.png)

- ②小说阅读界面 - Pixiv 小说 - 登录

![img.png](pic/PixivLogin0.png)

- 两种方式都可以打开登陆界面

![img](./pic/PixivLoginUI.png)


### ✈ 直连模式
<details><summary> ✈ 直连模式 </summary>

登录账号后，可在登录界面打开直连模式
![img](pic/PixivIPDirect0.png)
直连模式，无需代理，即可获取小说
![img](pic/PixivIPDirect.png)
🚫 直连模式不可用功能：
- 搜索作者 
- 原始链接 
- 发现 书签 
- 发现 首页 
- 发现 排行榜
</details>


### ⏺ 互动功能
<details><summary> ⏺ 互动功能 </summary>

![img](./pic/PixivLoginUINovels.png)
- ❤️ 公开收藏：公开收藏、取消收藏
- 📃 追更系列：追更系列、取消追更
- ❤️ 收藏系列：公开收藏系列内的每篇小说（可追加收藏）
-
- 🖤 取消收藏：取消收藏单篇、取消收藏系列内的每篇小说
- ⭐️ 关注作者：关注作者、取消关注
- 🚫 屏蔽作者：屏蔽作者、取消屏蔽（本地）
-
- ✅ 发送评论：当前章节下发送评论（手动刷新章节，更新评论）
- 🗑 删除评论：当前章节下删除评论（手动刷新章节，更新评论）
- 🧹 清除缓存：清除当前章节的正文缓存（手动刷新章节，更新正文和评论）
</details>


### ⚙️ 书源设置
<details><summary> ⚙️ 书源设置 </summary>

![img](./pic/PixivLoginUISettings.png)
- ⚙️ 当前设置：显示当前设置
- ⚙️ 默认设置：恢复默认设置
- 👤 搜索作者：默认搜索作者
-
- 🀄 繁简通搜：搜索进行繁简转换（搜索作者不转换）
- 📖 更多简介：详情显示更多简介
- 📅 更新时间：目录显示更新时间
-
- 🔗 原始链接：显示原始链接
- 📚 恢复《》：恢复正文内被替换的书名号《》
- 🖼️ 显示描述：章首显示描述
-
- 💬 显示评论：章尾显示评论
- ❤️ 显示收藏：搜索发现 显示/屏蔽 收藏单篇小说
- 📃 显示追更：搜索发现 显示/屏蔽 追更系列小说
-
- ⏩ 快速模式：开启快速模式（关闭**默认搜索作者等**影响搜索速度的功能）
- 🐞 调试模式：开启调试模式
- 🔍 搜索说明：显示搜索说明
</details>

### ▶️ 更多内容
> 详见：[Pixiv 书源的导入与使用](./Pixiv.md)


## ☕️ [支持开发](./Sponsor.md)
> [!NOTE]
>
> **如果书源帮到了你，欢迎请开发者喝杯咖啡**
> 
> **你的鼓励是持续更新的动力～**