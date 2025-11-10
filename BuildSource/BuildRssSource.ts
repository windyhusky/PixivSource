import fs from "fs"
import path from "path"

interface RssSource {
    articleStyle: number
    concurrentRate: string
    contentBlacklist: string
    contentWhitelist: string
    coverDecodeJs: string
    customOrder: number
    enableJs: boolean
    enabled: boolean
    enabledCookieJar: boolean
    header: string
    injectJs: string
    jsLib: string
    lastUpdateTime: number
    loadWithBaseUrl: boolean
    loginCheckJs: string
    loginUi: string
    loginUrl: string
    preload: boolean
    ruleArticles: string
    ruleContent: string
    ruleDescription: string
    ruleImage: string
    ruleLink: string
    ruleNextPage: string
    rulePubDate :string
    ruleTitle :string
    searchUrl :string
    shouldOverrideUrlLoading: string
    showWebLog: boolean
    singleUrl: boolean
    sortUrl : string
    sourceComment: string
    sourceGroup: string
    sourceIcon: string
    sourceName: string
    sourceUrl: string
    startHtml: string
    startJs: string
    startStyle: string
    style: string
    type: number
    variableComment: string
}

function readTextFile(filePath: string): string {
    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8").trim()
        return data.split("\r\n").join("\n")
    }
    return ""
}

function saveJsonFile(folder:string, fileName:string, data:any):void {
    if (folder && !fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    const outputPath = path.join(folder, fileName)
    data = JSON.stringify(data, null, 4)
    fs.writeFileSync(outputPath, data, "utf-8",)
    console.log(`✅  ${outputPath} 生成成功`)
}

function buildRssSource(sourceName:string): RssSource[] {
    // 需要在 项目根目录下执行
    let templatePath = `rssSource/${sourceName}.json`
    let defaultDataPath = `BuildSource/rssSource.json`

    // 读取基础模板
    let RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    if (sourceName === "furry") RssSources = RssSources.slice(4, RssSources.length)
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    // 填充默认数据
    RssSources.forEach(item => {
        Object.keys(defaultData).forEach((key) => {
            if (item[key] === undefined) item[key] = defaultData[key]
            if (item[key] === "") delete item[key]  // 去除空键
        })
    })
    return RssSources
}

function buildNovelSource(name){
    // 需要在 项目根目录下执行
    let sourcePath = `rssSource/${name}`
    let templatePath = `rssSource/furry.json`
    let defaultDataPath = `BuildSource/rssSource.json`

    let sourceName
    if (name === "pixiv") sourceName = "Pixiv"
    else if (name === "linpx") sourceName = "Linpx"
    else if (name === "furryNovel") sourceName = "兽人小说站"
    else sourceName = "Pixiv 书源 Github"

    // 读取基础模板
    const RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    const RssSource: RssSource = RssSources.find(item => item.sourceName === sourceName)
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    // 读取各个构建后文件内容
    const sourceComment = readTextFile(path.join(sourcePath, "ReadMe.txt"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json"))

    const header = readTextFile(path.join("rssSource", "base.header.json"))
    const jsLib = readTextFile(path.join(sourcePath, "base.jsLib.js"))
    const injectJs = readTextFile(path.join(sourcePath, "webview.inject.js"))

    // 填充默认数据
    Object.keys(defaultData).forEach((key) => {
        if (RssSource[key] === undefined) RssSource[key] = defaultData[key]
        if (RssSource[key] === "") delete RssSource[key]
    })

    // 更新订阅
    RssSource.sourceComment = sourceComment
    RssSource.loginUrl = loginUrl
    RssSource.loginUi = loginUI
    RssSource.loginUrl = loginUrl

    RssSource.header = header
    RssSource.jsLib = jsLib
    RssSource.injectJs = injectJs
    RssSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)

    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === "") delete RssSource[key]
    })
    return RssSource
}

function buildBTSRKSource() {
    const pixiv = buildNovelSource("pixiv")
    const linpx = buildNovelSource("linpx")
    const furryNovel = buildNovelSource("furryNovel")
    const repo = buildNovelSource("repo")
    const furrySites = buildRssSource("furry")
    const allSources = [pixiv, linpx, furryNovel, repo, ...furrySites]
    saveJsonFile("", "btsrk.json", allSources)
}

function buildImportSource() {
    // 需要在 项目根目录下执行
    let sourcePath = `rssSource/import`
    let defaultDataPath = `BuildSource/rssSource.json`

    // 读取基础模板
    let RssSource: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]
    // 读取各个构建后文件内容
    const sourceComment = readTextFile(path.join(sourcePath, "base.sourceComment.txt"))
    const sortUrl  = readTextFile(path.join(sourcePath, "base.sortUrl.js"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const header = readTextFile(path.join(sourcePath, "base.header.json"))

    const ruleArticles = readTextFile(path.join(sourcePath, "list.ruleArticles.js"))
    const ruleNextPage = readTextFile(path.join(sourcePath, "list.ruleNextPage.js"))
    const ruleTitle = readTextFile(path.join(sourcePath, "list.ruleTitle.txt"))

    const rulePubDate = readTextFile(path.join(sourcePath, "list.rulePubDate.js"))
    const ruleDescription = readTextFile(path.join(sourcePath, "list.ruleDescription.js"))
    const ruleImage = readTextFile(path.join(sourcePath, "list.ruleImage.js"))
    const ruleLink = readTextFile(path.join(sourcePath, "list.ruleLink.js"))

    RssSource.sourceName = "书源订阅"
    RssSource.sourceUrl = "https://codeberg.org/DowneyRem/PixivSource"
    RssSource.sourceIcon = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/doc/pic/Legado-Pixiv.png"
    RssSource.sourceGroup = "🅿️ Pixiv,🐲 Furry,书源"
    RssSource.variableComment = "【刷新分类】【刷新分类】【刷新分类】"
    RssSource.singleUrl = false
    RssSource.lastUpdateTime = 1739808000251
    // RssSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)

    // 基本页面，按顺序排序
    RssSource.sourceComment = sourceComment
    RssSource.sortUrl = sortUrl
    RssSource.loginUrl = loginUrl
    RssSource.header = header

    // 列表页面，按顺序排序
    RssSource.ruleArticles = ruleArticles
    RssSource.ruleNextPage = ruleNextPage
    RssSource.ruleTitle = ruleTitle
    RssSource.rulePubDate = rulePubDate
    RssSource.ruleDescription = ruleDescription
    RssSource.ruleImage = ruleImage
    RssSource.ruleLink = ruleLink

    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === "") delete RssSource[key]
    })
    saveJsonFile("", "import.json", [RssSource])
}

function main() {
    buildBTSRKSource()
    // buildImportSource()
}

main()