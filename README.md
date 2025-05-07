<div align="center">
<img width="125" height="125" src="doc/pic/Legado-Pixiv.png" alt="Legado x Pixiv"/>

## 开源阅读 Pixiv 书源
</div>


### 源起：为了更好的阅读体验
- Pixiv 官方 APP 阅读功能不够完善，阅读体验不佳
- 多数第三方 APP 没有优化过小说阅读功能
- [阅读 3.0 ](https://github.com/gedoor/legado) 可以自定义书源，阅读体验较好


### 支持网站：
- [Pixiv](https://www.pixiv.net)，一个以插画、漫画、小说为中心的艺术网站
- [Linpx](https://www.furrynovel.ink)，收录了 Pixiv 的大部分兽人小说与部分非兽人小说
- [兽人控小说站](https://www.furrynovel.com)，收录了 Pixiv, Bilibili 的大部分兽人小说


## 快速导入：[下载阅读](./doc/Download.md) =>  [导入书源](./doc/Import.md)

| 名称          | 免代理导入网址                                                         |
| ------------ | ------------------------------------------------------------------- |
| Import 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/import.json |
| BTSRK 订阅源  | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json  |
- jsdelivr CDN 免代理导入有1-2h的延迟（使用 Github Action 自动刷新 jsdelivr CDN 缓存）


<details>
<summary> Codeberg 镜像地址 </summary>

| 名称           | [Codeberg 镜像网址](https://codeberg.org/DowneyRem/PixivSource)　        |
| ------------- | ---------------------------------------------------------------------- |
| Pixiv 书源　   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/pixiv.json  |
| Linpx 书源　   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/linpx.json  |
| 兽人小说站书源   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/linpx.json  |
| BTSRK 订阅源   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json  |
| Books 订阅源   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/books.json  |
| Import 订阅源  | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/import.json |
- [Codeberg](https://codeberg.org/DowneyRem/PixivSource) 导入免代理，更新无延迟（网站服务不是很稳定）
</details>


<details>
<summary> Github 导入地址 </summary>

| 名称           | Github 导入网址                                                            |
| ------------- | ------------------------------------------------------------------------ |
| Pixiv 书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json  |
| Linpx 书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json  |
| 兽人小说站书源   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json  |
| BTSRK 订阅源   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json  |
| Books 订阅源   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json  |
| Import 订阅源  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/import.json |

> 更多导入方法详见：
> **[导入书源](./doc/ImportBookSource.md)** &
> **[导入订阅源](./doc/ImportRssSource.md)**
</details>


## 书源状态 & 功能
| 书源      | 状态 | 获取小说 | 支持P站特性 | 实现阅读功能 |
| -------- | --- | ------- | --------- | ---------- |
| Pixiv    | ✅ | ✅ 全站 | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| Linpx    | ✅ | ☑️ 部分 | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |
| 兽人小说  | ✅ | ☑️ 部分 | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索 ✅ 发现 ✅ 添加网址 ✅ 订阅源 |

### 书源功能
<details><summary> 🅿️ Pixiv 特性 </summary>

#### 已支持 Pixiv 特性
- 单篇小说：Pixiv 小说投稿时的【单篇完结作品】，即短篇小说
- 系列小说：Pixiv 小说投稿时的【连载系列作品】，即长篇小说
- <details><summary> ✅ ⭐️ 小说功能 </summary>
  
  - ✅ 关注作者（最新小说）
  - ✅ 追更列表
  - ✅ 推荐小说
  - ✅ 发现小说
  - ✅ 收藏小说（自己 & 他人）
  - ✅ 小说书签
  - ✅ 首页推荐
  - ✅ 章节评论
  </details>

- <details><summary> ✅ 🆕 最新 企划 约稿 </summary>
  
  - ✅ R18 小说
  - ✅ 一般小说（默认隐藏）
    >（可在书源设置中修改 `SHOW_GENERAL_NOVELS_NEW` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
  </details>

- <details><summary> ✅ 👑 小说排行 </summary>
  
  - ✅ R18 小说排行榜
  - ✅ 一般小说排行榜（默认隐藏）
    > (可在书源设置中修改 `SHOW_GENERAL_NOVELS_RANK` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
  </details>

- <details><summary> ✅ 🔥 原创热门 </summary>

  - ✅ R18 小说热门分类（默认隐藏）
  - ✅ 一般小说热门分类（默认隐藏）
    >（可在书源设置中修改 `SHOW_GENERAL_NOVELS_GENRE` `SHOW_GENERAL_NOVELS_GENRE` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
  </details>
  
- <details><summary> ✅ 🔧 小说工具（标记符号） </summary>

  - ✅ 完美支持的标记符
    - ✅ `[uploadedimage:自动生成ID]` 通过上传图片添加插画
    - ✅ `[pixivimage:作品ID-序号]` 通过作品ID添加插画
  - ☑️ 受阅读功能限制，无法完美支持的标记符
    - ☑️ `[newpage]` 分页
    - ☑️ `[chapter:章节名称]` 添加本章标题
    - ☑️ `[jump:链接目标的页面编号]` 页面跳转
    - ☑️ `[[jumpuri:标题 > 链接目标的URL]]` 添加超链接
    - ☑️ `[[rb:汉字 > 注音]]` 添加注音
      > 使用括号注音：`[[rb:汉字 > 注音]]` => `汉字（注音）`
    - ☑️ `汉字《注音》`选择`置き換える`后，Pixiv 会转换成`[[rb:汉字 > 注音]]`
      > 当`注音`位置是汉字时，恢复被替换的书名号：`[[rb:汉字 > 注音]]` => `汉字《注音》`
      > 
      > 默认开启，可在书源设置中修改 `REPLACE_BOOK_TITLE_MARKS`
  - 🈚️ 不支持的标记符
  </details>
</details>


<details><summary> 📖 阅读功能 </summary>

#### 已实现书源功能
- ✅ 搜索：书架页面，搜索小说，添加小说到书架
  - ✅ 搜索小说名称、标签、作者
  - ✅ 繁简通搜（小说名称、标签）
  - ✅ 字数过滤（关键词+空格+字数限制如：`关键词 字数3k`）
    - 字数限制规则：`3k 3k5 3w 3w5`
- ✅ 发现：发现页面，查看小说，添加小说到书架
  - ✅ 常规发现
  - ✅ 更新书源、订阅源
  - ✅ 设置源变量
    - <details><summary> ❤️ 他人收藏（Pixiv 小说 书源）</summary>
  
      - 发现 - 长按 **"Pixiv"** - 编辑 - 右上角菜单 - 设置源变量
      - 设置源变量：输入作者ID，一行一个，可添加作者名，保存
        ```
        12345 // 作者A
        67890 # 作者B
        ```
      - 发现：长按 **"Pixiv"**，刷新，查看他人收藏
      </details>
      
    - <details><summary> 🔎 筛选发现（兽人小说站 书源）</summary>

      - 发现 - 长按 **"兽人小说站"** - 编辑 - 右上角菜单 - 设置源变量  
      - 设置源变量：输入想要筛选的标签，以空格间隔（或一行一个），保存
        ```
        中文 原创  纯爱
        ```
      - 发现 - 长按 **"兽人小说站"** - 刷新 - 查看筛选后的小说
      </details>


- ✅ 添加网址：书架页面，通过 **【添加网址】** 添加小说到书架
  -  ✅ 支持同时添加多条网址链接（✅ 单篇 ✅ 系列）
- ✅ 订阅源：订阅页面，通过 **【订阅源】** 添加小说到书架
  - ✅ 添加小说到书架
  - ✅ 导入相应书源
</details>


<details><summary> ⚙️ 书源设置 </summary>

#### 书源功能设置
| 书源设置           | 默认状态 | 对应常量名称                    | 作用 |
| ---------------- | ------ | -------------------------- | --- |
| 繁简通搜　　　　　　 | ✅ 开启 | `CONVERT_CHINESE_CHARACTERS`| 搜索 |
| 最新小说显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_NOVELS_NEW`   | 发现 |
| 排行榜单显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_NOVELS_RANK`  | 发现 |
| 热门分类显示R18小说 | ⭕ 关闭 | `SHOW_R18_NOVELS_GENRE`     | 发现 |
| 热门分类显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_NOVELS_GENRE` | 发现 |
| 简介显示更多信息　   | ⭕ 关闭 | `MORE_INFO_IN_DESCRIPTION`  | 详情 |
| 显示小说原始链接　   | ✅ 开启 | `SHOW_ORIGINAL_NOVEL_LINK`  | 目录 |
| 恢复被替换的书名号   | ✅ 开启 | `REPLACE_BOOK_TITLE_MARKS`  | 正文 |
| 章首显示小说描述　   | ✅ 开启 | `SHOW_NOVEL_CAPTIONS`       | 正文 |
| 章尾显示小说评论　   | ✅ 开启 | `SHOW_NOVEL_COMMENTS`       | 正文 |
| 调试模式　　　　　   | ⭕ 关闭 | `DEBUG`                     | 全局 |
- 自定义设置：编辑书源 - 基本 - 变量说明 - 修改并保存
- 修改时，请修改`true` 为 `false`，或相反
- 每次更新书源后，需要重新设置
<details><summary> ⚙️ 书源配置代码 </summary>

```
{
  "CONVERT_CHINESE_CHARACTERS": true,
  "SHOW_GENERAL_NOVELS_NEW": false,
  "SHOW_GENERAL_NOVELS_RANK": false,
  "SHOW_R18_NOVELS_GENRE": false,
  "SHOW_GENERAL_NOVELS_GENRE": false,
  "MORE_INFO_IN_DESCRIPTION": false,
  "SHOW_ORIGINAL_NOVEL_LINK": true,
  "REPLACE_BOOK_TITLE_MARKS": true,
  "SHOW_NOVEL_CAPTIONS": true,
  "SHOW_NOVEL_COMMENTS": true,
  "DEBUG": false
}
```
</details>
</details>


### 订阅源功能
| 订阅源 | 包含网站 | 订阅源 | 包含网站 |
| ----- | ------ | ----- | ------- |
| btsrk | 1️⃣ [Pixiv 小说](https://www.pixiv.net/novel) <br /> 2️⃣ [Linpx 林匹克斯](https://www.furrynovel.ink) <br /> 3️⃣ [兽人控小说站](https://www.furrynovel.com) <br /> 4️⃣ [兽人控游戏索引](https://furrygames.top/zh-cn/list.html) <br /> 5️⃣ [兽人控游戏库](https://kemono.games/zh-Hans) <br /> 6️⃣ [兽展日历](https://www.furryeventchina.com) <br /> 7️⃣ [兽聚汇总](https://www.furryfusion.net/) | books | 1️⃣ [Yiove 书源仓库](https://shuyuan.yiove.com) <br/> 2️⃣ [喵公子书源管理](http://yuedu.miaogongzi.net/gx.html) <br/> 3️⃣ [阅读 APP 源](https://legado.aoaostar.com) <br/> 4️⃣ [阅读合集](https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b) <br/> 5️⃣ [源仓库](https://www.yckceo.com/yuedu/index/index.html) <br/> 6️⃣ [聚合搜索](https://legado.cn/thread-3723-1-1.html) <br/> 7️⃣ [阅读使用手册](https://www.yuque.com/legado/wiki) |


- btsrk 订阅源：Pixiv 、Linpx、兽人控小说站
  - ✅ 添加小说到书架 ✅ 导入相应书源
- books 订阅源：快速导入阅读相关资源（书源等）
- import 订阅源：便捷导入本项目整理的书源、订阅源


### 非本项目的其他资源
<details><summary> 📄 其他资源 </summary>

| 名称           | Github 导入网址                                                              |
| ------------- | --------------------------------------------------------------------------- |
| 通用书源　　　　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/normal.json   |
| 聚合搜索　　　　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json    |
| 书源订阅　　　　 | https://raw.githubusercontent.com/windyhusky/PixivSource/main/import.json   |
| Pixiv目录规则  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixivToc.json |

- **[通用书源](https://github.com/bushixuanqi/book-source)** ：是不世玄奇 为网文网站编写的通用书源，用搜索引擎获取全网小说。
- **[聚合搜索](https://legado.cn/thread-3723-1-1.html)** ：是不世玄奇 制作的聚合多个搜索引擎的订阅源，需要配合 **[通用书源](http://yuedu.miaogongzi.net/gx.html)** 使用。(集入 books 订阅源)
- **[书源订阅](https://gitee.com/feiniao6/yd)** ：是Thomas喲 制作的第三方规则订阅，旨在快速导入书源/订阅源。(已修改)
- **[Pixiv 目录规则](https://akaito.xyz/post/Legado)** ：是[一片痴心俱成灰](https://akaito.xyz/post/Legado) 为 Pixiv 本地小说制作的目录规则
</details>


## 使用教程
<details><summary> 📌 使用教程 </summary>

> ### 0. [阅读是什么软件？阅读简介](./doc/ReadMe.md)
> ### 0. [下载 开源阅读 Legado](./doc/Download.md)
> ### 1. [阅读使用教程（太长不看版）](./doc/TooLongToRead.md)
>> #### 1.1 [Pixiv 书源的导入与使用](./doc/Pixiv.md)
>> #### 1.2 [Linpx 书源的导入与使用](./doc/Linpx.md)
>> #### 1.3 [兽人控小说站 书源的导入与使用](./doc/FurryNovel.md)
>> #### 1.4 搜索小说、查看订阅，畅享阅读
> ### 2. [添加远程书籍](./doc/Remotebooks.md)，畅享阅读
> ### 3. [设置 Webdav 备份](./doc/WebdavBackup.md)
> ### 4. [故障排查与处理](./doc/TroubleShoot.md)
#### 此处教程由 [@FurryReading](https://t.me/FurryReading) 提供
</details>


## 免责声明
1. 开源阅读 Legado 是一个做了很多阅读功能的浏览器
2. 书源(及订阅源)是浏览器向网站请求数据、处理数据的一套方法
3. 使用开源阅读 Legado 阅读小说，相当于访问相关网页阅读小说
4. 开源阅读 Legado 内的作品数据均来自书源内的网站，作品版权归原作者或站方所有
5. 如有版权问题，请找到书源内的网站，向站方投诉


## 鸣谢
<details><summary> 📢 鸣谢 </summary>

- 感谢 [阅读 3.0 ](https://github.com/gedoor/legado) 提供的软件平台
- 感谢 [Linpx](https://github.com/libudu/linpx-web) 提供的 [网站服务](https://www.furrynovel.ink)
- 感谢 [兽人小说站](https://github.com/FurryNovel/Reader) 提供的 [网站服务](https://www.furrynovel.com)
- 感谢 [Pixiv.cat](https://github.com/pixiv-cat/pixivcat-backend) 提供的 [Pixiv 图片代理功能](https://pixiv.cat)
- 感谢 [通用书源](https://github.com/bushixuanqi/book-source) 及 [聚合搜索](https://legado.cn/thread-3723-1-1.html) 提供的添加书架的方法
- 感谢 [书源订阅(非官方仓库)](https://gitee.com/feiniao6/yd) 提供的导入书源、订阅源的方法
- 感谢 [Pixiv-utils](https://github.com/AgMonk/pixiv-utils) 、 [Pixiv go 客户端](https://github.com/NateScarlet/pixiv) 、 [Pixiv-web-api](https://github.com/YieldRay/pixiv-web-api) 整理的 Pixiv Web API
- 感谢 [一片痴心俱成灰](https://akaito.xyz/post/Legado) 提供的 Pixiv (标记符号) 目录规则
- 感谢 [@DowneyRem](https://github.com/DowneyRem) 提供的教程，这是他的兽人小说分享频道 [@FurryReading](https://t.me/FurryReading)
</details>

## TODO
- ~~Linpx 系列小说书源（上游不支持）~~

<details>
<summary> ✅ 已完成 </summary>

- ✅ Linpx 订阅源
- ✅ Pixiv 订阅源（使用JS注入，代码来自【聚合搜索】）
- ✅ 兽人控小说站 订阅源
- ✅ Pixiv 书源：关注作者的最新小说 https://github.com/windyhusky/PixivSource/issues/11
- ✅ Linpx 书源：推荐作者的近期小说
- ✅ Pixiv 书源：通过作品ID添加插画
- ✅ Linpx 书源：通过作品ID添加插画（使用 pixiv.cat ）
- ✅ Pixiv 书源：添加网址加入书架；订阅源添加到书架
- ✅ Pixiv 书源：追更列表 https://github.com/windyhusky/PixivSource/issues/14
- ✅ Pixiv 书源：排行榜 https://github.com/windyhusky/PixivSource/issues/13
- ✅ Pixiv 系列小说 书源 
- ✅ Pixiv 书源：完善字数统计 https://github.com/windyhusky/PixivSource/issues/18
- ✅ Pixiv 书源：显示更多信息 https://github.com/windyhusky/PixivSource/issues/17
- ✅ Pixiv & Linpx 书源：添加小说更新时间
- ✅ Pixiv & Linpx 书源：搜索作者
- ✅ import 订阅源：导入其他书源、订阅源
- ✅ Pixiv & Linpx 书源：添加小说章节字数
- ✅ Pixiv 书源：正文尾部加入小说评论
- ✅ Linpx 书源：搜索链接
- ✅ Pixiv & Linpx 书源：添加链接
- ✅ 兽人控小说站 书源
- ✅ 书源发现：更新书源和订阅源
- ✅ 订阅源：导入/更新书源
- ✅ Pixiv 漫画书源：搜索、详情、目录、正文
- ✅ Pixiv & Linpx & 兽人控小说站 书源：繁简通搜
</details>


## Stargazers over time
[![Stargazers over time](https://starchart.cc/windyhusky/PixivSource.svg?variant=adaptive)](https://starchart.cc/windyhusky/PixivSource)

