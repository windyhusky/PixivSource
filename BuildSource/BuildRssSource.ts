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

function buildRssSource(sourceName:string){
    sourceName = "pixiv"
    // 需要在 项目根目录下执行
    let sourcePath = `rssSource/${sourceName}`
    let templatePath = `rssSource/${sourceName}/furry.json`
    let defaultDataPath = `BuildSource/rssSource.json`
    // console.log(sourcePath)
    // console.log(templatePath)
    // console.log(defaultDataPath)

    // 读取基础模板
    const RssSource: RssSource[] = JSON.parse(readTextFile(templatePath))
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    const loginUi = readTextFile(path.join(sourcePath, "base.loginUI.json"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))

    const header = readTextFile(path.join(sourcePath, "base.header.json"))
    const jsLibContent = readTextFile(path.join(sourcePath, "base.jsLib.js"))
    const injectContent = readTextFile(path.join(sourcePath, "webview.inject.js"))

    // 更新订阅
    RssSource.forEach(item => {
        // 填充默认数据
        item.articleStyle = defaultData.articleStyle
        item.enableJs = defaultData.enableJs
        item.enabled = defaultData.enabled
        item.enabledCookieJar = defaultData.enabledCookieJar
        item.loadWithBaseUrl = defaultData.loadWithBaseUrl
        item.showWebLog = defaultData.showWebLog
        item.singleUrl = defaultData.singleUrl
        item.type = defaultData.type
        item.lastUpdateTime = defaultData.lastUpdateTime

        if (sourceName === "pixiv") {

            item.loginUrl = loginUrl
            item.loginUi = loginUi
            item.header = header
            item.jsLib = jsLibContent

            item.injectJs = injectContent
            item.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)
        }
    })

    console.log(JSON.stringify(RssSource, null, 4))
    return RssSource
}

function main() {
    buildRssSource("")
}

main()