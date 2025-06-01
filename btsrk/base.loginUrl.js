function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}
function sleepToast(text, second) {
    const {java} = this
    java.log(text)
    java.longToast(text)
    if (second === undefined || second <= 3) {second = 3}
    sleep(1000*second)
}

function login() {
    resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,{"headers": {"User-Agent": "${cache.get("userAgent")}"}}`, '登录账号', false).body()
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

function getUserAgent() {
    let userAgent = String(source.getHeaderMap(true)).slice(12,-1)
    cache.put("userAgent", userAgent)
    // java.log(userAgent)
    return userAgent
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
    const {java, source} = this;
    let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json"
    let onlineSource = JSON.parse(java.get(updateUrl, {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14)',
        'X-Requested-With': 'XMLHttpRequest'
    }).body())[0]  // 第1个书源
    let comment = onlineSource.bookSourceComment.split("\n")

    let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 Pixiv 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 5vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> Pixiv 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md">🔰 使用教程</a></th>
        <tr><td>☁️ 远程仓库版本：${java.timeFormat(onlineSource.lastUpdateTime)}</td></tr>
        <tr><td>📥 阅读本地版本：${java.timeFormat(source.lastUpdateTime)}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(2, 9).join("<br>")}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(comment.length - 7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <div class="ann"></div>
    
    <table border="0" cellspacing="30">
        <th colspan="2"> 更新 Pixiv 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json">
            <button><span>更新书源</span></button>
            </a></div></td>
    
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/pixiv.json">
                <button><span>备用书源链接</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
                <button><span>更新订阅</span></button>
            </a></div></td>
    
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
                <button><span>备用订阅链接</span></button>
            </a>
            </div></td>
        </tr>
    </table>
</body>
</html>`;
    java.startBrowser(htm, '更新书源');
}