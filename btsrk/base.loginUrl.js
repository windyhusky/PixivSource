function login() {
    resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,{"headers": {"User-Agent": "${cache.get("userAgent")}"}}`, '登录账号', false).body()
}

function logout() {
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie(); sleepToast(`已退出当前账号\n若无法登录，请再次点击"退出账号"`)
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

function startPixivSettings() {
    java.startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithub() {
    java.startBrowser("https://github.com/windyhusky/PixivSource", "书源介绍")
}
function startGithubIssue() {
    java.startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    java.startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}