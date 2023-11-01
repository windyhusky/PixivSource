# PixivSource

### 为 Pixiv 与类 Pixiv 网站制作的 [阅读 3.0 ](https://github.com/gedoor/legado) 的书源


# 快速导入

| 免代理导入 | 名称                                 | 网址                                                         |
| -------- | ------------------------------------ | ------------------------------------------------------------ |
| ✔        | [Pixiv](https://www.pixiv.net/)      | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json |
| ✔        | [Linpx](https://linpx.linpicio.com/) | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json |
| ✔        | btsrk订阅源                          | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrkWeb.json |
| ❌       | [Pixiv](https://www.pixiv.net/)      | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json |
| ❌       | [Linpx](https://linpx.linpicio.com/) | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json |
| ❌       | btsrk订阅源                          | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrkWeb.json |


## 源状态

| 对应网站 | 可用状态 | 备注 |
| ----- | -------- | ----------------------------------------------- |
| [Pixiv](https://www.pixiv.net/) | ✔ | https://www.pixiv.net/ |
| [Linpx](https://linpx.linpicio.com/) | ✔ | https://github.com/libudu/linpx-web |
| btsrk | ✔ | [Linpx - 首页 (furrynovel.xyz)](https://www.furrynovel.xyz/)<br />[兽人控游戏索引 (furrygames.top)](https://furrygames.top/zh-cn/list.html)<br />[兽人控游戏库 (kemono.games)](https://kemono.games/zh-Hans)<br />[兽展日历 (furryeventchina.com)](https://www.furryeventchina.com) |

- linpx 是 pixiv 的子集，包含其全部兽人小说与部分非兽人小说
- btsrk 是 订阅源。目前整合了兽人控游戏索引、兽人控游戏库与Linpx 旨在提供兽人文化网站的快捷访问

## 下载阅读

### 1. Android 版

**点击链接，下载安装包并安装，推荐使用共存版**

https://miaogongzi.lanzout.com/b01rgkhhe

| 下载站点                                                     | 版本           | 备注                 |
| ------------------------------------------------------------ | -------------- | -------------------- |
| [Github Release](https://github.com/gedoor/legado/releases/latest) | 有限制，稳定版 | 需要代理             |
| [Github Action](https://github.com/gedoor/legado/actions)    | 无限制，开发版 | 需要代理    需要登录 |
| [阅读Beta版 蓝奏云](https://miaogongzi.lanzout.com/b01rgkhhe) |                | 无需代理    无需登录 |

### 2. 苹果 iOS 版

官方正在进行 [iOS版](https://github.com/gedoor/YueDuFlutter) 的开发，[近期在TF测试](https://gedoor.github.io/download)

可能支持相同书源的软件：

- [源阅读](https://github.com/kaich/Yuedu) 现已下架
- 青果阅读 不完全兼容阅读书源




## 通用教程
### 1. [阅读是什么软件？阅读简介](./doc/Legado.md)
### 2. [如何获取书源？导入书源？](./doc/Import.md)
### 3. [如何导入订阅源？](./doc/Import2.md)
### 4. [如何设置 Webdav 备份？](./doc/WebdavBackup.md)

更多内容请查看[官方使用说明](https://www.yuque.com/legado/wiki/xz)


## 专用教程
### 1. [Pixiv 书源的导入与使用](./doc/Pixiv.md)
### 2. [Linpx 书源的导入与使用](./doc/Linpx.md)


# 鸣谢
- 感谢 [阅读 3.0 ](https://github.com/gedoor/legado) 提供的软件平台
- 感谢 [Linpx](https://github.com/libudu/linpx-web) 提供的网站服务 https://www.furrynovel.xyz
- 感谢 [@DowneyRem](https://github.com/DowneyRem) 提供的教程，这是他的兽人小说推荐频道 [@FurryNovels](https://t.me/FurryNovels)

# TODO

- Pixiv书源关注用户的小说不按照更新时间+作者排序，只按照更新时间来排序

- 避免多次翻页
