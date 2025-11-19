function login() {}

function getWebViewUA() {
    let userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    return String(userAgent)
}

function startBrowser(url, title) {
    let msg = "", headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    if (url.includes("https://github.com")) {
        if (url.includes("issues")) msg += "🐞 反馈问题"
        else if (url.includes("doc")) msg += "🔰 使用指南"
        else msg += "⭐️ 收藏项目"
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg)
    java.startBrowser(`${url}, ${headers}`, title)
}

// function updateSource() {
//     java.openUrl("legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json")
// }

function startGithub() {
    startBrowser("https://github.com/DowneyRem/PixivSource", "书源介绍")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithubReadme() {
    startBrowser("https://github.com/DowneyRem/PixivSource/blob/main/doc/Pixiv.md", "使用指南")
}
function startGithubSponsor() {
    startBrowser("https://github.com/DowneyRem/PixivSource/blob/main/doc/Sponsor.md", "赞助开发")
}
function startTelegramPixivSource() {
    startBrowser("https://t.me/PixivSource", "Pixiv 书源频道")
}
function startTelegramFurryReading() {
    startBrowser("https://t.me/FurryReading", "兽人阅读频道")
}