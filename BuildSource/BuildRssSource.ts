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
        item.articleStyle = defaultData.articleStyle
        item.enableJs = defaultData.enableJs
        item.enabled = defaultData.enabled
        item.enabledCookieJar = defaultData.enabledCookieJar
        item.loadWithBaseUrl = defaultData.loadWithBaseUrl
        item.showWebLog = defaultData.showWebLog
        item.singleUrl = defaultData.singleUrl
        item.type = defaultData.type
        item.lastUpdateTime = defaultData.lastUpdateTime
    })

    console.log(JSON.stringify(RssSources, null, 4))
    saveJsonFile("dist", "btstk.json", RssSources)
    return RssSources
}


function main() {
    buildRssSource()
}

main()