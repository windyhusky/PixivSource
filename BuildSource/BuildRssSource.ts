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

function buildRssSource(){
    // 需要在 项目根目录下执行
    let templatePath = `rssSource/furry.json`
    let defaultDataPath = `BuildSource/rssSource.json`

    // 读取基础模板
    let RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    RssSources = RssSources.slice(4, RssSources.length)
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

function buildSource(name){
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
    const pixiv = buildSource("pixiv")
    const linpx = buildSource("linpx")
    const furryNovel = buildSource("furryNovel")
    const repo = buildSource("repo")
    const normal = buildRssSource()
    const allSources = [pixiv, linpx, furryNovel, repo, ...normal]
    saveJsonFile("", "btsrk.json", allSources)
}

function buildImportSource() {
    // 需要在 项目根目录下执行
    let sourcePath = `rssSource/import`
    let defaultDataPath = `BuildSource/rssSource.json`

    // 读取基础模板
    let RssSource: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]
    // 读取各个构建后文件内容
    const header = readTextFile(path.join(sourcePath, "base.header.json"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const sortUrl  = readTextFile(path.join(sourcePath, "base.sortUrl.js"))
    const sourceComment = readTextFile(path.join(sourcePath, "base.sourceComment.txt"))
    const ruleArticles = readTextFile(path.join(sourcePath, "list.ruleArticles.js"))
    const ruleImage = readTextFile(path.join(sourcePath, "list.ruleImage.js"))
    const rulePubDate = readTextFile(path.join(sourcePath, "list.rulePubDate.js"))
    const ruleTitle = readTextFile(path.join(sourcePath, "list.ruleTitle.txt"))

    RssSource.header = header
    RssSource.loginUrl = loginUrl
    RssSource.sortUrl = sortUrl
    RssSource.sourceComment = sourceComment
    RssSource.ruleArticles = ruleArticles
    RssSource.ruleImage = ruleImage
    RssSource.rulePubDate = rulePubDate
    RssSource.ruleTitle = ruleTitle

    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === "") delete RssSource[key]
    })
    console.log(JSON.stringify([RssSource]))
    saveJsonFile("dist", "import.json", [RssSource])
}

function main() {
    // buildBTSRKSource()
    buildImportSource()
}

main()