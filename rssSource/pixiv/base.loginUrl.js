function getWebViewUA() {
    let userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    return String(userAgent)
}

function login() {
    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": ${getWebViewUA()}}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCookie(); getCsrfToken()
        return true
    } else {
        java.log(resp.code()); sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败")
        return false
    }
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
}

function removeCookie() {
    cookie.removeCookie('https://www.pixiv.net')
    cookie.removeCookie('https://accounts.pixiv.net')
    cookie.removeCookie('https://accounts.google.com')
    cookie.removeCookie('https://api.weibo.com')
    cache.delete("pixivCookie")
    cache.delete("pixivCsrfToken")  // 与登录设备有关
    cache.delete("headers")
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
    let pixivCsrfToken
    let html = java.webView(null, "https://www.pixiv.net/", null)
    try {
        pixivCsrfToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
    } catch (e) {
        pixivCsrfToken = null
    }
    // java.log(pixivCsrfToken)
    cache.put("pixivCsrfToken", pixivCsrfToken)  // 与登录设备有关
    return pixivCsrfToken
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (pixivCookie.includes("first_visit_datetime")) {
        // java.log(pixivCookie)
        cache.put("pixivCookie", pixivCookie, 60*60)
        return pixivCookie
    } else {
        cache.delete("pixivCookie")
        // sleepToast("未登录账号( pixivCookie)")
        return null
    }
}

function startBrowser(url, title) {
    let msg = "", headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    if (url.includes("https://www.pixiv.net")) {
        if (url.includes("settings")) msg += "⚙️ 账号设置"
        else msg += "⤴️ 分享小说"
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("https://github.com")) {
        if (url.includes("issues")) msg += "🐞 反馈问题"
        else if (url.includes("doc")) msg += "🔰 使用指南"
        else msg += "⭐️ 收藏项目"
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg)
    java.startBrowser(`${url}, ${headers}`, title)
}

function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}

function startGithubIntroduction() {
    startBrowser("https://downeyrem.github.io/PixivSource/BetterExperience", "阅读指南")
}
function startGithubReadme() {
    startBrowser("https://downeyrem.github.io/PixivSource/Pixiv", "书源指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithubLogin() {
    startBrowser("https://github.com/login?return_to=https://github.com/DowneyRem/PixivSource", "收藏项目")
}
function startGithubSponsor() {
    startBrowser("https://downeyrem.github.io/PixivSource/Sponsor", "赞助开发")
}
function startTelegram() {
    startBrowser("https://t.me/PixivSource", "Pixiv 书源频道")
}