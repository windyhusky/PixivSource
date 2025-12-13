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

function startGithubIntroduction() {
    startBrowser("https://downeyrem.github.io/PixivSource/BetterExperience", "阅读指南")
}
function startGithubReadme() {
    startBrowser("https://downeyrem.github.io/PixivSource/Pixiv", "书源指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithub() {
    startBrowser("https://github.com/DowneyRem/PixivSource", "书源介绍")
}
function startGithubWebdavBackup() {
    startBrowser("https://downeyrem.github.io/PixivSource/WebdavBackup", "远程书籍")
}
function startGithubRemoteBooks() {
    startBrowser("https://downeyrem.github.io/PixivSource/RemoteBooks", "远程书籍")
}
function startGithubSponsor() {
    startBrowser("https://downeyrem.github.io/PixivSource/Sponsor", "支持开发")
}

function startTelegram() {
    startBrowser("https://t.me/PixivSource", "书源频道")
}
function startTelegramLegadoBeta() {
    startBrowser("https://t.me/Legado_Beta", "阅读频道")
}
function startTelegramFurryReading() {
    startBrowser("https://t.me/FurryReading", "兽人阅读频道")
}