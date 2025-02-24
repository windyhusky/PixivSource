
function updateSource(){
    return () => {
        const {java, source} = this;
        let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json"
        let onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[0]  // 第1个书源
        let comment = onlineSource.bookSourceComment.split("\n")

        let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 20vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 5vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/${source.bookSourceName}.md">🔰 使用教程</a></th>
        <tr><td>☁️ 远程仓库版本：${java.timeFormat(onlineSource.lastUpdateTime)}</td></tr>
        <tr><td>📥 阅读本地版本：${java.timeFormat(source.lastUpdateTime)}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(2,9).join("<br>")}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <div class="ann">
        <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json">
            <button><span>更新 ${source.bookSourceName} 书源</span></button>
        </a>
    </div>
    
    <div class="ann">
        <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新 ${source.bookSourceName} 订阅源</span></button>
        </a>
    </div>
</body>
</html>`;
        java.startBrowser(htm,'更新');
        return []
    }
}
