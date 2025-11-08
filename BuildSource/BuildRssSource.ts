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

function buildRssSource(sourceName:string): RssSource {
    sourceName = "btsrk"
    let sourcePath = `rssSource/${sourceName}`
    // let templatePath = `BuildSource/${sourceName}.json`
    let templatePath = `BuildSource/rssSource.json`

    // 读取基础模板
    const rssSource: RssSource = JSON.parse(readTextFile(templatePath))[0]
    console.log(JSON.stringify(rssSource, null, 4))

    return rssSource
}