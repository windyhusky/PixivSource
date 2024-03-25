# 开源阅读 Pixiv 书源
### (类) Pixiv 网站的 [阅读 3.0 ](https://github.com/gedoor/legado) 的书源
- [Pixiv](https://www.pixiv.net/) 是一个以插画、漫画、小说为中心的艺术网站
- [Linpx](https://linpx.linpicio.com/) 收录了 Pixiv 全部兽人小说与部分非兽人小说
- [兽人控小说站](https://www.furrynovel.com) 收录了 Pixiv, Bilibili 等网站的兽人小说


# 快速导入
| 名称         | 免代理导入网址                                                      |
| -------------| ------------------------------------------------------------------ |
| 所有书源　    | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/allbook.json |
| 所有订阅源　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/allrss.json |
| Pixiv 书源 　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json |
| Linpx 书源　 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json |
| 通用书源　   | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/normal.json |
| btsrk 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json |
| books 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/books.json |
- 免代理导入可能会有1天左右的更新延迟


<details>
<summary>  Github 导入地址 </summary>

| 名称          | Github 导入网址                                                        |   
| ------------ | ------------------------------------------------------------------ |
| 所有书源　    |  https://raw.githubusercontent.com/windyhusky/PixivSource/main/allbook.json |
| 所有订阅源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/allrss.json |
| Pixiv 书源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json | 
| Linpx 书源　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json |       
| 通用书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/normal.json |     
| btsrk 订阅源 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json |   
| books 订阅源 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json |    
- Github 导入无延迟
</details>




## 源状态、功能
| 书源      | 状态 | 获取小说 | 支持P站特性 | 实现阅读功能 |
| --------- | --- | --------- | --------------- | ------------ |
| Pixiv     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ⭕️ 小说插画 | ✅ 搜索 ✅ 发现 ❌ 添加网址 ❌ 订阅源 |
| Linpx     | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ⭕️ 小说插画 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| 兽人小说站 | ❌ | ⭕️ 部分 | ✅ 单篇 ✅ 系列 ❌ 小说插画 | ❌ 搜索 ❌ 发现 ❌ 添加网址 ✅ 订阅源 |
| [通用书源](https://github.com/bushixuanqi/book-source) | ✅ | ✅ 全网 |  | ✅ 搜索 ❌ 发现 ✅ 添加网址 ✅ 订阅源 |


Pixiv 特性：
- 单篇小说：Pixiv 小说投稿时的【单篇完结作品】，即短篇小说
- 系列小说：Pixiv 小说投稿时的【连载系列作品】，即长篇小说
- 小说插画：✅ 通过上传添加的插画 [uploadedimage] ；❌ 通过作品ID添加的插画 [pixivimage] 


阅读功能：
- 搜索：书架页面，搜索小说，添加小说到书架
- 发现：发现页面，发现小说，添加小说到书架
- 添加网址：书架页面，通过【添加网址】添加小说到书架
- 订阅源：订阅页面，通过【订阅源】添加小说到书架


| 订阅源 | 状态 | 包含内容 |
| ----- | ---- | -------------- |
| btsrk | ✅ | 1️⃣ [Linpx 林匹克斯](https://www.furrynovel.xyz/)<br />2️⃣ [兽人控小说网](https://www.furrynovel.com)<br />3️⃣ [兽人控游戏索引](https://furrygames.top/zh-cn/list.html)<br />4️⃣ [兽人控游戏库](https://kemono.games/zh-Hans)<br />5️⃣ [兽展日历](https://www.furryeventchina.com)<br />6️⃣ [兽聚汇总](https://www.furryfusion.net/) |
| books | ✅ | 1️⃣ [喵公子书源管理](https://yd.mgz6.cc/)<br/>2️⃣ [阅读 APP 源](https://legado.aoaostar.com/)<br/>3️⃣ [阅读合集](https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b/)<br/>4️⃣ [源仓库](https://www.yckceo.com/yuedu/index/index.html)<br/>5️⃣ [阅读论坛](https://legado.cn/)<br/>6️⃣ [聚合搜索(通用书源)](https://legado.cn/thread-3723-1-1.html)<br/>7️⃣ [阅读使用手册](https://www.yuque.com/legado/wiki) |


- btsrk 订阅源：整合了Linpx、兽人小说站、兽人控游戏索引、兽人控游戏库等网站，旨在快速访问兽人文化网站
- books 订阅源：整合了多个分享阅读书源、订阅源等的订阅源，旨在快速导入阅读相关资源
-  [通用书源](https://github.com/bushixuanqi/book-source)：（非本项目）是不世玄奇为众多网文网站编写的通用书源，旨在使用搜索引擎获取全网小说资源
- [聚合搜索](https://legado.cn/thread-3723-1-1.html)：（非本项目）是多个搜索引擎的聚合入口，需要配合 **[搜索引擎书源/通用书源](http://yuedu.miaogongzi.net/gx.html)** 使用



## 下载阅读

### 1. Android 版
**点击链接，下载安装包并安装，推荐使用共存版**
https://miaogongzi.lanzout.com/b01rgkhhe


| 下载站点                                                      | 版本          | 备注              |
| ------------------------------------------------------------ | ------------  | ----------------- |
| [喵公子阅读资源 (蓝奏云)](https://yd.mgz6.cc/)                 | 　　　　稳定版 | 无需代理，无需登录 |
| [阅读Beta版 蓝奏云](https://miaogongzi.lanzout.com/b01rgkhhe) | 　　　　开发版 | 无需代理，无需登录 |
| [Github Release](https://github.com/gedoor/legado/releases)  | 有限制，稳定版 | 需要代理，无需登录 |
| [Github Action](https://github.com/gedoor/legado/actions)    | 无限制，开发版 | 需要代理，需要登录 |
| [Telegram 频道](https://t.me/Legado_Channels)                | 　　　　稳定版 | 需要代理，需要登录 |
| [Telegram 频道(Beta版)](https://t.me/Legado_Beta)            | 　　　　开发版 | 需要代理，需要登录 |

### 2. 苹果 iOS 版

官方正在进行 [iOS版](https://github.com/gedoor/YueDuFlutter) 的开发，[近期在TF测试](https://gedoor.github.io/download)，最新消息请见：[Telegram 频道(iOS版)](https://t.me/legado_ios)


| 下载站点                                              | 版本          | 备注              |
| ---------------------------------------------------- | ------------- | ----------------- |
| ~~[GitHub](https://github.com/gedoor/YueDuFlutter)~~ |               | 开发中，暂不可下载 |
| ~~[Telegram 频道(iOS版)](https://t.me/legado_ios)~~   |               | 开发中，暂不可下载 |


可能支持相同书源的软件：
| 软件名称 | 备注                       |
| ------- | -------------------------- |
| ~~[读不舍手](https://apps.apple.com/us/app/%E8%AF%BB%E4%B8%8D%E8%88%8D%E6%89%8B/id1662413517)~~ | 不完全兼容阅读书源，广告较多 |
| ~~[青果阅读](https://apps.apple.com/us/app/qing-guo-du-shu/id1142490639)~~ | 不完全兼容阅读书源，现已下架 |
| ~~[源阅读](https://github.com/kaich/Yuedu)~~ | 停止维护，AppStore 已下架 |


## 通用教程
### 1. [阅读是什么软件？阅读简介](./doc/Legado.md)
### 2. [如何获取书源？导入书源？](./doc/Import.md)
### 3. [如何导入订阅源？](./doc/Import2.md)
### 4. [如何设置 Webdav 备份？](./doc/WebdavBackup.md)

更多内容请查看[官方使用说明](https://www.yuque.com/legado/wiki/xz)


## 专用教程 [@FurryNovels](https://t.me/FurryNovels)
### 1. [Pixiv 书源的导入与使用](./doc/Pixiv.md)
### 2. [Linpx 书源的导入与使用](./doc/Linpx.md)


# 鸣谢
- 感谢 [阅读 3.0 ](https://github.com/gedoor/legado) 提供的软件平台
- 感谢 [Linpx](https://github.com/libudu/linpx-web) 提供的网站服务 https://www.furrynovel.xyz
- 感谢 [@DowneyRem](https://github.com/DowneyRem) 提供的教程，这是他的兽人小说推荐频道 [@FurryNovels](https://t.me/FurryNovels)


# TODO
- Pixiv 系列小说 专用书源
- ~~Linpx 系列小说 专用书源~~
- Pixiv 书源：通过作品ID添加的插画 [pixivimage]
- ~~Linpx 书源：通过作品ID添加的插画 [pixivimage]~~
- Pixiv 书源：添加网址加入书架
- ✅  Pixiv 订阅源
- ✅  兽人控小说站订阅源
- Pixiv 书源：追更列表、最新小说
- Pixiv 书源：每日每周排行榜 [#13](https://github.com/windyhusky/PixivSource/issues/13)
- Linpx 书源：推荐作者的小说
- 兽人控小说站：书源
- Pixiv 书源：按照时间排序关注用户的小说
- Pixiv 书源：避免多次翻页 [#11](https://github.com/windyhusky/PixivSource/issues/11) 

