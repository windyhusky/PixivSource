function getWebViewUA() {
    let userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    return String(userAgent)
}

function login() {}

function startBrowser(url, title) {
    let msg = "", headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    if (url.includes("https://github.com")) {
        if (url.includes("issues")) msg += "🐞 反馈问题"
        else if (url.includes("doc")) msg += "🔰 使用指南"
        else msg += "⭐️ 收藏项目"
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("https://t.me")) {
        if (url.includes("FurryReading")) msg += "🐺 兽人阅读频道"
        else if (url.includes("joinchat")) msg += "🐞 反馈群组"
        msg += "\n\n即将打开 Telegram\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg)
    java.startBrowser(`${url}, ${headers}`, title)
}

function startGithub() {
    startBrowser("https://github.com/windyhusky/PixivSource", "书源介绍")
}
function startGithubLogin() {
    startBrowser("https://github.com/login?return_to=https://github.com/windyhusky/PixivSource", "收藏项目")
}
function startGithubIssue() {
    startBrowser("https://github.com/windyhusky/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}
function startTelegram() {
    startBrowser("https://t.me/PixivSource", "Pixiv 书源频道")
}
function startTelegram2() {
    startBrowser("https://t.me/FurryReading", "兽人阅读频道")
}