function login() {}

function startBrowser(url, title) {
    let msg = "", headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`
    if (url.includes("pixiv.net")) {
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("github")) {
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("https://t.me/")){
        msg += "\n\n即将打开 Telegram\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg)
    java.startBrowser(`${url}, ${headers}`, title)
}

function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithub() {
    startBrowser("https://github.com/DowneyRem/PixivSource", "收藏项目")
}

function startGithubIntroduction() {
    startBrowser("https://pixivsource.pages.dev/BetterExperience", "使用指南")
}
function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/FurryNovel", "书源指南")
}
function startGithubWebdavBackup() {
    startBrowser("https://pixivsource.pages.dev/WebdavBackup", "备份恢复")
}
function startGithubRemoteBooks() {
    startBrowser("https://pixivsource.pages.dev/RemoteBooks", "远程书籍")
}
function startGithubSponsor() {
    startBrowser("https://pixivsource.pages.dev/Sponsor", "支持开发")
}

function startTelegram() {
    startBrowser("https://t.me/PixivSource", "书源频道")
}
function startTelegramLegado() {
    startBrowser("https://t.me/ReadSigma", "阅读频道")
}
function startTelegramFurryReading() {
    startBrowser("https://t.me/FurryReading", "兽人阅读频道")
}