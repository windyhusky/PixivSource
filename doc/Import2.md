## ⓪ 订阅源来源
**请查看[书源获取方式](./Import.md)，一般二者会同时提供**
- 官方频道 [@legado_channels](https://t.me/legado_channels)
- [源仓库](https://www.yckceo.com/yuedu/rss/index.html)
- [阅读论坛](https://legado.cn/forum-rssSources-1.html)

书源分享【订阅源】：
- [喵公子订阅源](https://yd.mgz6.cc/)  
- [阅读 APP 源](https://legado.aoaostar.com/)  
- [阅读合集 订阅源](https://flowus.cn/share/923f5a35-6dcf-47d1-b8eb-b9c5ef3ed39b)


## ① 导入订阅源 [官方教程](https://www.yuque.com/legado/wiki/grqch2)

### O.其他导入方式

**A.文件导入更简单**

**B.规则订阅易更新**

**上述导入方式大同小异，故不再复述，请查看[书源获取方式](./Import.md)**


### C.网络导入也方便

请【**开启代理**】后，复制下面的【订阅书源】链接

```
Linpx 订阅源
https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrkWeb.json
```

#### 1.打开【订阅】页面，点击右上角【设置】

![img](pic/SubscriptionPage.png)

#### 2.点击右上角的三点菜单，选择【网络导入】

![img](pic/SubscriptionWebImport.png)

#### 3.粘贴订阅源链接，点击确定

![img](pic/SubscriptionAdding.png)

#### 4.导入完成并启用订阅源

![img](pic/SubscriptionPage.png)

**无法网络导入时，请尝试开启代理，或过段时间重试**

![img](pic/SubscriptionFinished.png)


### D.Schema 链接导入最方便【适用于书源提供方】
大多一键导入书源/订阅源，都是采用了这种方式

#### 0.【书源提供方】为按钮等添加链接

```
可通过url唤起阅读进行一键导入,url格式: legado://import/{path}?src={url}

path类型: bookSource,rssSource,replaceRule,textTocRule,httpTTS,theme,readConfig,addToBookshelf
path类型解释: 书源,订阅源,替换规则,本地txt小说目录规则,在线朗读引擎,主题,阅读排版,添加到书架
legado://import/addToBookshelf?src={url}
```
取自官方API：https://github.com/gedoor/legado#api-


导入 Linpx 订阅源的连接如下：
```
yuedu://rsssource/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrkWeb.json

legado://import/rssSource?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrkWeb.json
```

#### 1.点击链接，跳转阅读
浏览器打开：**[喵公子订阅源](https://dy.mgz6.cc/)**

一键导入按钮的链接，即为下面这条链接：
```
yuedu://rsssource/importonline?src=http://yuedu.miaogongzi.net/shuyuan/miaogongziDY.json
```

点击链接，跳转阅读
![img](pic/OpenInLegado.png)


#### 2.选择订阅源并导入

![img](https://telegra.ph/file/bb3c9457f21b4be72f878.png)