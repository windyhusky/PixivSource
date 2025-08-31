<div align="center">
<img width="125" height="125" src="doc/pic/Legado-Pixiv.png" alt="Legado x Pixiv"/>

## 开源阅读 Pixiv 书源
</div>


### 源起：为了更好的阅读体验
- Pixiv 小说功能不够完善，阅读体验不佳
- 多数第三方 APP 没有优化过小说阅读功能
- [阅读 3.0 ](https://github.com/gedoor/legado) 可以自定义书源，阅读体验较好


### 兼容软件：

| 书源　　 | 阅读 Beta    | 源阅 Test Flight |
| ------- | ----------- | --------------- |
| 小说书源 | 3.25.0527   | 1.0 (112)       |
| 小说备用 | 3.23.0503?  | 1.0 (112)       |


## 快速导入：[下载阅读](./doc/Download.md) =>  [导入书源](./doc/Import.md)

| 名称          | 免代理导入网址                                                        |
| ------------ | ------------------------------------------------------------------- |
| Pixiv 书源    | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json  |
| BTSRK 订阅源  | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json  |
| Import 订阅源 | https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/import.json |
- 免代理导入有延迟


<details>
<summary> Github 导入地址 </summary>

| 名称           | [Github 项目网址](https://github.com/windyhusky/PixivSource)               |
| ------------- | ------------------------------------------------------------------------- |
| Pixiv 书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json  |
| Linpx 书源　   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json  |
| 兽人小说站书源  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/linpx.json  |
| BTSRK 订阅源   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json  |
| Books 订阅源   | https://raw.githubusercontent.com/windyhusky/PixivSource/main/books.json  |
| Import 订阅源  | https://raw.githubusercontent.com/windyhusky/PixivSource/main/import.json |

> 更多导入方法详见：
> **[导入书源](./doc/ImportBookSource.md)** &
> **[导入订阅源](./doc/ImportRssSource.md)**
</details>


<details>
<summary> Codeberg 镜像地址 </summary>

| 名称           | [Codeberg 镜像网址](https://codeberg.org/DowneyRem/PixivSource)　       |
| ------------- | ---------------------------------------------------------------------- |
| Pixiv 书源　   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/pixiv.json  |
| Linpx 书源　   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/linpx.json  |
| 兽人小说站书源  | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/linpx.json  |
| BTSRK 订阅源   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json  |
| Books 订阅源   | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/books.json  |
| Import 订阅源  | https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/import.json |
- [Codeberg](https://codeberg.org/DowneyRem/PixivSource) 免代理，更新无延迟（网站服务不是很稳定）
</details>



## 书源状态 & 功能
| 书源     | 状态 | 支持 Ｐ站 特性 | 实现 阅读 功能 |
| ------- | ---- | --------- | ------- |
| Pixiv   |  ✅  | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索小说 ✅ 发现小说  ✅ 添加网址 |
| Linpx   |  ✅  | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索小说 ✅ 发现小说  ✅ 添加网址 |
| 兽人小说  |  ✅  | ✅ 单篇 ✅ 系列 ✅ 插图 | ✅ 搜索小说 ✅ 发现小说  ✅ 添加网址 |

### 书源功能
<details><summary> 🅿️ Ｐ站特性 </summary>

#### 已支持 Pixiv 特性
- ✅ 单篇小说：Pixiv 小说投稿时的【单篇完结作品】，即短篇小说
- ✅ 系列小说：Pixiv 小说投稿时的【连载系列作品】，即长篇小说
- <details><summary> ✅ ⭐️ 小说功能 </summary>
  
  - ✅ 关注作者（最新小说）
    - 发现：✅ 查看关注作者的最新小说
    - 登录界面：✅ 关注作者 ✅ 取消关注
  - ✅ 追更列表 
    - 发现：✅ 查看追更列表 
    - 登录界面：✅ 加入追更 ✅ 取消追更
  - ✅ 收藏小说
    - 发现：✅ 查看收藏（公开 & 私密）✅ 查看他人收藏（设置源变量）
    - 登录界面：✅ 加入收藏 ✅ 取消收藏
    - 登录界面：✅ 收藏系列 ✅ 取消收藏系列（特色功能）
  - ✅ 小说书签
    - 发现：✅ 查看书签（第1页）
    - 登录界面：✅ 加入书签 ✅ 删除书签
  - ✅ 章节评论
    - 章节正文：✅ 查看评论
    - 登录界面：✅ 发送评论 ✅ 删除评论
  - ✅ 推荐小说
  - ✅ 发现小说
  - ✅ 首页推荐
  </details>

- <details><summary> ✅ 🆕 最新 企划 约稿 </summary>
  
  - ✅ R18 小说
  - ✅ 一般小说（默认隐藏）
    >（可在书源设置中修改 `SHOW_GENERAL_NEW` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
  </details>

- <details><summary> ✅ 👑 小说排行 </summary>
  
  - ✅ R18 小说排行榜
  - ✅ 一般小说排行榜（默认隐藏）
    > (可在书源设置中修改 `SHOW_GENERAL_RANK` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
  </details>

- <details><summary> ✅ 🔥 原创热门 </summary>

  - ✅ R18 小说热门分类（默认隐藏）
  - ✅ 一般小说热门分类（默认隐藏）
    >（可在书源设置中修改 `SHOW_GENERAL_GENRE` `SHOW_GENERAL_GENRE` )，更改后需要在发现页面刷新分类（发现：长按"Pixiv"，刷新）
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
      > 默认开启，可在书源设置中修改 `REPLACE_TITLE_MARKS`
  - 🈚️ 不支持的标记符
  </details>
</details>


<details><summary> 📖 阅读功能 </summary>

#### 已实现阅读功能
- <details><summary> ✅ 🔍 搜索小说 </summary>

    - ✅ 🔍 常规搜索（默认同时搜索小说名称、标签、作者）
    - ✅ 🀄️ 繁简通搜（支持：小说名称、标签）
    - ✅ 👤 作者专搜（格式：`@作者名称`）
      - 搜索作者时不进行繁简转换
    - ✅ #️⃣ 标签专搜（格式：`#标签` `#小说名称`）
    - ✅ ⏬ 字数过滤（格式：`关键词 + 空格 + 字数3k`）
      - 字数限制规则：`3k 3k5 3w 3w5`
      - 例如：`校园 字数3k` `校园 纯爱 字数3k`
  </details>

- <details><summary> ✅ ⭐️ 发现小说 </summary>

  - ✅ ⭐️ 常规发现
  - ✅ 🆙 更新书源、订阅源
  - ✅ 📌 喜欢标签（自定义）
  - ✅ ❤️ 他人收藏（自定义）
  </details>

- <details><summary> ✅ 🔗 添加网址 </summary>

  - ✅ 单篇链接 ✅ 系列链接
  - ✅ 支持同时添加多条网址链接
  </details>

- <details><summary> ✅ 🌐 订阅源 </summary>

  - ✅ 添加小说到书架
  - ✅ 导入书源/更新书源
  - ✅ 登录界面（部分功能同下）
  </details>
  
- <details><summary> ✅ 🚩 登录界面 </summary>

  - 账号：✅ 登录 ✅ 退出 ✅ 设置
  - 书源：✅ 更新 ✅ 指南 ✅ 反馈
  - 单篇：✅ 收藏 ✅ 评论 ✅ 分享
  - 系列：✅ 追更 ✅ 收藏 ✅ 分享
  - 评论：✅ 发送 ✅ 删除 ✅ 获取（正文）
  - 作者：✅ 关注 ✅ 拉黑 ✅ 屏蔽（本地）
  - 评论：✅ 发送 ✅ 删除 ✅ 获取（正文）
</details>


<details><summary> ⚙️ 书源设置 </summary>

#### 书源功能设置
##### 1.书源默认配置
⚙️ 书源设置：
- <details><summary> 1️⃣ 常规设置 </summary>
  ⚙️ 常规设置：打开小说 - 菜单 - 登录 - 点击下方按钮
  
  | 书源设置　　 | 默认状态 | 常量名称　　           | 作用 |
  | --------- | ------ | --------------------- | --- |
  | 繁简通搜　　 | ✅ 开启 | `CONVERT_CHINESE`     | 搜索 |
  | 显示更多信息 | ⭕ 关闭 | `MORE_INFORMATION`    | 详情 |
  | 显示更新时间 | ✅ 开启 | `SHOW_UPDATE_TIME`    | 目录 |
  | 显示原始链接 | ✅ 开启 | `SHOW_ORIGINAL_LINK`  | 目录 |
  | 恢复书名号　 | ✅ 开启 | `REPLACE_TITLE_MARKS` | 正文 |
  | 显示小说描述 | ✅ 开启 | `SHOW_CAPTIONS`       | 正文 |
  | 显示小说评论 | ✅ 开启 | `SHOW_COMMENTS`       | 正文 |
  | 快速模式　　 | ⭕ 关闭 | `FAST`                | 全局 |
  | 调试模式　　 | ⭕ 关闭 | `DEBUG`               | 全局 |

  - 快速模式：
    - 繁简通搜、更新时间、原始链接、显示评论，对搜索速度稍有影响
    - 搜索默认搜索作者，这对搜索速度有很大影响
    - 开启时，上述功能默认关闭
    - 关闭时，上述功能默认还原到开启前的状态
  </details>

- <details><summary> 2️⃣ 发现设置 </summary>
  
  ⚙️ 发现设置：编辑书源 - 基本 - 变量说明 - 修改并保存
  - ⚠️ 修改时，请修改`true` 为 `false`，或相反
  - ⚠️ 每次更新书源后，需要重新修改发现设置
  
  | 书源发现设置    | 默认状态 | 对应常量名称           | 作用 |
  | ------------ | ------ | -------------------- | --- |
  | 最新显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_NEW`   | 发现 |
  | 排行显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_RANK`  | 发现 |
  | 热门显示R18小说 | ⭕ 关闭 | `SHOW_R18_GENRE`     | 发现 |
  | 热门显示一般小说 | ⭕ 关闭 | `SHOW_GENERAL_GENRE` | 发现 |

  </details>

- <details><summary> 3️⃣ 默认配置代码 </summary>
  
  ```
  {
    "CONVERT_CHINESE": true,
    "SHOW_UPDATE_TIME": true,
    "MORE_INFORMATION": false,
    "SHOW_ORIGINAL_LINK": true,
    
    "REPLACE_TITLE_MARKS": true,
    "SHOW_CAPTIONS": true,
    "SHOW_COMMENTS": true,
    
    "FAST": true,
    "DEBUG": false,
    
    "SHOW_GENERAL_NEW": false,
    "SHOW_GENERAL_RANK": false,
    "SHOW_R18_GENRE": false,
    "SHOW_GENERAL_GENRE": false
  }
  ```
  </details>


##### 2.设置源变量
- <details><summary> 🚫 屏蔽作者(本地)（Pixiv 书源）</summary>

  - 方法1️⃣：打开小说 - 菜单 - 登录 - 🚫 屏蔽作者
    - ▶️ 搜索任意小说，同步屏蔽作者数据
  - 方法2️⃣：编辑书源 - 菜单 - 设置源变量 - 修改并保存
    - 设置源变量：输入作者ID，【英文逗号】间隔
      - ```
        12345, 67890
        ```
    - ▶️ 搜索任意小说，同步屏蔽作者数据
  </details>

- <details><summary> 🔎 筛选发现（兽人小说站 书源）</summary>

  - 1️⃣ 发现 - 长按 **"兽人小说站"** - 编辑 - 右上角菜单 - 设置源变量  
  - 2️⃣ 源变量：输入想筛选的标签，空格间隔（或一行一个），保存
    ```
    中文 原创  纯爱
    ```
  - 3️⃣ 更新：发现 - 长按 **"兽人小说站"** - 刷新 - 查看筛选后的小说
</details>
</details>


<details><summary> ⏩ 速率限制 </summary>

#### 书源请求限制
##### 1.最大缓存时间
<details><summary> 最大缓存时间：7天 </summary>

- 书源内部 JsLib 使用 `getAjaxJson() getAjaxAllJson() getWebviewJson() urlIllustOriginal() ` 等，访问网络资源时，会默认写入缓存，最多存放7天
- 后续如果重复请求同一内容，在缓存时间内则不会发送请求，而是直接读取缓存数据，加快请求速度的同时，减少实际请求次数
- 登录界面中的功能使用了 `getPostBody()`，不受此限制
- 获取/刷新目录、获取/刷新评论，会强制更新，不受此限制


- 自定义：编辑书源 - 基本 - JSLib - 修改并保存
```
var cacheSaveSeconds = 7*24*60*60  // 缓存时间7天，可以延长，不建议缩至过短
```
- **每次更新书源后，需要重新设置**
</details>


##### 2.请求速率限制
<details><summary> 速率限制：每2s访问3次 </summary>

- 因为上面设置了最大缓存时间，会减少实际的（重复的）网络请求
- ~~此处网络请求速率限制可适当调高~~，但账号因此受限请自负其责


- 自定义：编辑书源 - 基本 - 并发率 - 修改并保存
  ```
  180/60000    60s内访问180次（默认）
  ```
- **每次更新书源后，需要重新设置**
</details>


##### 3.【正文为空】提示
<details><summary> 无法获取正文时，弹出提示 </summary>

短时间内请求过多会无法获取正文。 此时弹出窗口，提示：
```
您于X时X分触发 Pixiv 【请求限制】，建议 稍候/重新登录 再继续
```
</details>


##### 4.【过度访问】提示
<details><summary> 过度访问后，提示修改密码 </summary>

- 触发 Pixiv 的过度访问后的【3天内】，每4个小时检测1次弹出提示，并推荐修改密码
```
您于X时X分触发 Pixiv 【过度访问】，请修改密码并重新登录。如已修改请忽略
```
</details>
</details>


## 订阅源
<details><summary> 🐲 btsrk 订阅源 </summary>

### 🐲 btsrk 订阅源：快速导入小说网站等订阅
<table>
<th> btsrk 订阅源 </th> <th> 订阅源功能 </th>
<tr>
  <td><a href="https://www.pixiv.net/novel"> 1️⃣ Pixiv 小说</a></td>
  <td  rowspan="3"> ✅ 添加小说<br>✅ 导入书源<br>✅ 登录界面 <br></td>
</tr>
<tr><td><a href="https://www.furrynovel.ink"> 2️⃣ Linpx 林匹克斯</a></td></tr>
<tr><td><a href="https://www.furrynovel.com"> 3️⃣ 兽人控小说站</a></td></tr>

<tr>
  <td><a href="https://furrygames.top/zh-cn/list.html"> 4️⃣ 兽人控游戏索引</a></td>
  <td  rowspan="4">✅ 快速访问<br>🐺 兽人网站</td>
</tr>
<tr><td><a href="https://kemono.games/zh-Hans"> 5️⃣ 兽人控游戏库</a></td></tr>
<tr><td><a href="https://www.furryeventchina.com"> 6️⃣ 兽展日历</a></td></tr>
<tr><td><a href="https://www.furryfusion.net"> 7️⃣ 兽聚汇总</a></td></tr>
</table>
</details>


<details><summary> 📚 books 订阅源 </summary>

### 📚 books 订阅源：快速导入阅读书源、订阅源等资源
| 名称           | Github 导入网址                                               |
| ------------- | ------------------------------------------------------------ |
| 源仓库　　　　  | https://www.yckceo.com/yuedu/index/index.html                |
| Yiove 书源仓库　| https://shuyuan.yiove.com                                    |
| 喵公子书源管理　 | https://yuedu.miaogongzi.net/gx.html                         |
| 阅读 APP 源　　 | https://legado.aoaostar.com                                  |
| 阅读合集　 　　 | https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b  |
| 聚合搜索  |  |
| 阅读使用手册  | https://www.yuque.com/legado/wiki |
</details>


<details><summary> 📄 import 订阅源 </summary>

### 📄 import 订阅源 （非本项目的其他资源）
- import 订阅源：导入本项目整理的书源、订阅源等

| 名称           | 相关网址                                                              |
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
> ### 2. [添加远程书籍](./doc/RemoteBooks.md)，畅享阅读
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
- 感谢 [Jsdelivr](https://www.jsdelivr.com/) 提供的 CDN 加速服务(免代理)
- 感谢 [通用书源](https://github.com/bushixuanqi/book-source) 及 [聚合搜索](https://legado.cn/thread-3723-1-1.html) 提供的添加书架的方法
- 感谢 [书源订阅(非官方仓库)](https://gitee.com/feiniao6/yd) 提供的导入书源、订阅源的方法
- 感谢 [Pixiv-utils](https://github.com/AgMonk/pixiv-utils) 、 [Pixiv go 客户端](https://github.com/NateScarlet/pixiv) 、 [Pixiv-web-api](https://github.com/YieldRay/pixiv-web-api) 整理的 Pixiv Web API
- 感谢 [@Luoyacheng](https://github.com/Luoyacheng) ，从他的 [书源仓库](https://github.com/Luoyacheng/yuedu) 学到了很多方法
- 感谢 [@一片痴心俱成灰](https://akaito.xyz/post/Legado) 提供的 Pixiv (标记符号) 目录规则
- 感谢 [Pixiv Previewer](https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer) 脚本提供的从 Pixiv 网页获取 csfr token 的方法 
- 感谢 [@Eigeen](https://github.com/eigeen) 使用 TS 重构了本项目，并修复了部分 Bug
- 感谢 [@SuCan127](https://github.com/SuCan127) 测试【源阅】的兼容性
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

