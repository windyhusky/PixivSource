import fs from "fs"
import path from "path"

interface RssSource {
    articleStyle: number
    customOrder: number
    enableJs: boolean
    enabled: boolean
    enabledCookieJar: boolean
    header: string
    injectJs: string
    jsLib: string
    lastUpdateTime: number
    loadWithBaseUrl: boolean
    loginUi: string
    loginUrl: string
    preload: boolean
    showWebLog: boolean
    singleUrl: boolean
    sourceComment: string
    sourceGroup: string
    sourceIcon: string
    sourceName: string
    sourceUrl: string
    type: number
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
    let templatePath = `BuildSource/furrySites.json`
    let defaultDataPath = `BuildSource/rssSource.json`
    // console.log(sourcePath)
    // console.log(templatePath)
    // console.log(defaultDataPath)

    // 读取基础模板
    const RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    // 填充默认数据
    RssSources.forEach(item => {
        Object.keys(defaultData).forEach((key) => {
            if (item[key] === undefined) item[key] = defaultData[key]
            if (item[key] === "") delete item[key]
        })
    })

    // console.log(JSON.stringify(RssSources, null, 4))
    // saveJsonFile("dist", "btstk.json", RssSources)
    return RssSources
}

function buildSource(name){
    let sourcePath = `rssSource/${name}`
    let templatePath = `rssSource/furry.json`
    let defaultDataPath = `BuildSource/rssSource.json`
    // console.log(sourcePath)
    // console.log(templatePath)
    // console.log(defaultDataPath)

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

    const header = readTextFile(path.join(sourcePath, "base.header.json"))
    const jsLib = readTextFile(path.join(sourcePath, "base.jsLib.js"))
    const inJectJs = readTextFile(path.join(sourcePath, "webview.inject.js"))

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
    RssSource.injectJs = inJectJs
    RssSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)

    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === "") delete RssSource[key]
    })

    // console.log(JSON.stringify(RssSource, null, 4))
    // saveJsonFile("dist", "btstk.json", RssSource)
    return RssSource
}


function main() {
    // buildRssSource()
    buildBTSRKSource("pixiv")
}

main()