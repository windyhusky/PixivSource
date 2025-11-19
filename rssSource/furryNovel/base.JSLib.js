function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}

function sleepToast(text, second) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (second === undefined) {second = 0.01}
    sleep(1000*second)
}

let bookSourceCommentText = `兽人控小说站书源

书源版本：无法获取
可用功能：✅搜索✅发现✅添加网址✅订阅源
搜索小说：✅单篇✅系列✅作者✅标签
发现小说：✅热门小说✅最新小说✅随便来点
添加网址：✅兽人控小说站链接
订阅用法：点击订阅源打开小说/系列小说，点击【加入书架】按钮，添加小说到书架

书源发布：Pixiv 书源频道 https://t.me/PixivSource
兽人阅读频道 https://t.me/FurryReading
项目地址：https://github.com/DowneyRem/PixivSource
使用教程：https://github.com/DowneyRem/PixivSource/blob/main/doc/FurryNovel.md

规则订阅：Import 订阅源
https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/import.json
https://raw.githubusercontent.com/DowneyRem/PixivSource/main/import.json

⚙️ 书源设置：
书源管理 - 编辑书源 - 基本 - 变量说明 - 修改并保存

🔎 筛选发现：
发现 - 长按"Pixiv" - 编辑 - 右上角菜单 - 设置源变量
设置源变量：输入想要搜索/筛选的标签，以空格间隔（或一行一个），保存
发现 - 长按"Pixiv" - 刷新 - 查看他人收藏
`.trim()

function updateSource() {
    const {java, source} = this
    let onlineSource, comment
    java.longToast("🆙 更新书源\n\nJsdelivr CDN 更新有延迟\nGithub 更新需代理")
    try {
        let updateUrl = "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json"
        onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[1]  // 第1个书源
        comment = onlineSource.bookSourceComment.split("\n")
    } catch (e) {
        try {
            let updateUrl = "https://raw.githubusercontent.com/DowneyRem/PixivSource/main/linpx.json"
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[1]  // 第1个书源
            comment = onlineSource.bookSourceComment.split("\n")
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime(), bookSourceComment: bookSourceCommentText}
            comment = onlineSource.bookSourceComment.split("\n")
        }
    }

    let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 FurryNovel 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 6vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> FurryNovel 书源 
        <a href="https://github.com/DowneyRem/PixivSource/blob/main/doc/FurryNovel.md">🔰 使用指南</a>
        || <a href="https://github.com/DowneyRem/PixivSource/blob/main/doc/Sponsor.md">❤️ 赞助开发</a>
        </th>
        <tr>
            <td>☁️ 远程版本：${onlineSource.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${java.timeFormat(onlineSource.lastUpdateTime)}</td>
        </tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(3, 8).join("<br>")}</td></tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 Linpx 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/linpx.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/linpx.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`
    java.startBrowser(htm,'更新书源')
    return []
}