function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}

function sleepToast(text, second) {
    java.log(text)
    java.longToast(text)
    if (second === undefined || second <= 3) {second = 3}
    sleep(1000*second)
}

function login() {
    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,{"headers": {"User-Agent": "${cache.get("userAgent")}"}}`, '登录账号', false)
    if (resp.code() === 200) getCookie(); getCsrfToken()
    return resp.body()
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`已退出当前账号\n退出后请点击右上角的✔️退出\n登录请点击“登录账号”进行登录`)
}

function removeCookie() {
    cookie.removeCookie('https://www.pixiv.net')
    cookie.removeCookie('https://accounts.pixiv.net')
    cookie.removeCookie('https://accounts.google.com')
    cookie.removeCookie('https://api.weibo.com')
    cache.delete("pixivCookie")
    cache.delete("csfrToken")  // 与登录设备有关
    cache.delete("headers")
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
    let csfrToken = getWebviewJson("https://www.pixiv.net/", html => {
        return JSON.stringify(html.match(/token\\":\\"([a-z0-9]{32})/)[1])
    })
    // java.log(csfrToken)
    cache.put("csfrToken", csfrToken)  // 与登录设备有关
    return csfrToken
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (pixivCookie.includes("first_visit_datetime")) {
        // java.log(pixivCookie)
        cache.put("pixivCookie", pixivCookie, 60*60)
        return pixivCookie
    }
}

function startBrowser(url, title) {
    let userAgent = cache.get("userAgent")
    if (userAgent === null) userAgent = getUserAgent()
    java.startBrowser(`${url},{"headers": {${userAgent}}}`, title)
}
function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startPixivMessages() {
    startBrowser("https://www.pixiv.net/messages.php", "查看私信")
}
function startPixivNotification() {
    startBrowser("https://www.pixiv.net/notify_all.php", "查看通知")
}
function startPixivMuteUser() {
    startBrowser("https://www.pixiv.net/settings/viewing/mute?type=user", "屏蔽用户")
}
function startPixivBlockUsers() {
    startBrowser("https://www.pixiv.net/settings/privacy/block-users", "查黑名单")
}

function startGithub() {
    startBrowser("https://github.com/windyhusky/PixivSource", "书源介绍")
}
function startGithubIssue() {
    startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}

function updateSource() {
    const {java, source} = this
    let onlineSource, comment
    try {
        let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json"
        onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[0]  // 第1个书源
        comment = onlineSource.bookSourceComment.split("\n")
    } catch (e) {
        try {
            let updateUrl = "https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json"
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[0]  // 第1个书源
            comment = onlineSource.bookSourceComment.split("\n")
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime()}
            comment = source.bookSourceComment.split("\n")
        }
    }

    let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 Pixiv 书源</title>
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
        <th colspan="2"> Pixiv 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md">🔰 使用指南</a></th>
        <tr><td>☁️ 远程仓库版本：${java.timeFormat(onlineSource.lastUpdateTime)}</td></tr>
        <tr><td>📥 阅读本地版本：${java.timeFormat(source.lastUpdateTime)}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(2,9).join("<br>")}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 Pixiv 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/pixiv.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/pixiv.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`;
    java.startBrowser(htm,'更新书源');
    return []
}