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
        java.log(resp.code()); sleepToast("⚠️ 登录失败")
        return false
    }
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
    let csfrToken
    let html = java.webView(null, "https://www.pixiv.net/", null)
    try {
        csfrToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
    } catch (e) {
        csfrToken = null
    }
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
    } else {
        cache.delete("pixivCookie")
        // sleepToast("未登录账号( pixivCookie)")
        return null
    }
}

function getLikeAuthors() {
    let authorIds = []
    try {
        let authors = String(source.getVariable()).split("\n")
        if (authors[0].trim() !== "" && authors.length >= 1) {
            for (let i in authors) {
                if (authors[i] !== "") {
                    let authorId = authors[i].match(RegExp(/\d+/))[0]
                    authorIds.push(authorId)
                }
            }
            sleepToast(`❤️ 他人收藏\n✅ 已导入作者数据\n\n${JSON.stringify(authorIds)}\n\n更新发现：发现 - 长按\"Pixiv\" - 刷新 - 查看收藏`, 2)
            cache.put("pixivLikeAuthors", JSON.stringify(authorIds))
        } else {
            cache.put("pixivLikeAuthors", JSON.stringify(authorIds))
            sleepToast("❤️ 他人收藏\n\n❎ 已经清空作者数据")
        }
    } catch (e) {
        sleepToast("❤️ 他人收藏\n⚠️ 【订阅源】源变量设置有误\n输入作者ID，一行一个，可添加作者名，保存")
    }
}

function startBrowser(url, title) {
    let headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    java.startBrowser(`${url}, ${headers}`, title)
}
function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startPixivMessages() {
    startBrowser("https://www.pixiv.net/messages.php", "查看私信")
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