import fs from "fs"
import path from "path"

interface BookSource {
    bookSourceComment: string;
    bookSourceGroup: string;
    bookSourceName: string;
    bookSourceType: number;
    bookSourceUrl: string;
    bookUrlPattern: string;
    concurrentRate: string;
    customOrder: number;
    enabled: boolean;
    enabledCookieJar: boolean;
    enabledExplore: boolean;
    exploreUrl: string;
    header: string;
    jsLib: string;
    lastUpdateTime: number | string;
    loginCheckJs: string;
    loginUi: string;
    loginUrl: string;
    respondTime: number;
    ruleBookInfo: {
        author: string;
        canReName: string;
        coverUrl: string;
        init: string;
        intro: string;
        kind: string;
        lastChapter: string;
        name: string;
        tocUrl: string;
        wordCount: string;
    };
    ruleContent: {
        content: string;
        imageStyle: string;
    };
    ruleExplore: {
        author: string;
        bookList: string;
        bookUrl: string;
        coverUrl: string;
        intro: string;
        kind: string;
        lastChapter: string;
        name: string;
        wordCount: string;
    };
    ruleSearch: {
        author: string;
        bookList: string;
        bookUrl: string;
        checkKeyWord: string;
        coverUrl: string;
        intro: string;
        kind: string;
        lastChapter: string;
        name: string;
        wordCount: string;
    };
    ruleToc: {
        chapterList: string;
        chapterName: string;
        chapterUrl: string;
        isPay: string;
        isVip: string;
        updateTime: string;
    };
    searchUrl: string;
    variableComment: string;
    weight: number;
}

function readTextFile(filePath: string): string {
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf-8")
    else return ""
}

function buildBookSource(sourceName): BookSource[] {
    let templateJsonPath, sourcePath
    switch (sourceName) {
        case ("PixivMain"):
            templateJsonPath = "scripts/pixiv_template.json"
            sourcePath = "./pixiv"
            break
        case ("PixivBackup"):
            templateJsonPath = "scripts/pixiv_template.json"
            sourcePath = "./pixiv_backup"
            break
        case ("pixivIllust"):
            templateJsonPath = "scripts/pixiv_template.json"
            sourcePath = "./pixiv_illust"
            break
    }

    // 读取基础模板
    const BookSourceJson: BookSource[] = JSON.parse(readTextFile(templateJsonPath))

    // 读取各个构建后文件内容
    const readme = readTextFile(path.join(sourcePath, "ReadMe.txt"))
    const loginUrlContent = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json"))
    const loginCheckJsContent = readTextFile(path.join(sourcePath, "base.loginCheckJs.js"))
    const variableComment = readTextFile(path.join(sourcePath, "base.variableComment.txt"))
    const jsLibContent = readTextFile(path.join(sourcePath, "base.jsLib.js"))

    const searchUrlContent = readTextFile(path.join(sourcePath, "searchUrl.js"))
    const searchContent = readTextFile(path.join(sourcePath, "search.js"))

    const discoverAddressContent = readTextFile(path.join(sourcePath, "discover_address.js"))
    const discoverContent = readTextFile(path.join(sourcePath, "discover.js"))

    const detailContent = readTextFile(path.join(sourcePath, "detail.js"))
    const catalogContent = readTextFile(path.join(sourcePath, "catalog.js"))
    const contentContent = readTextFile(path.join(sourcePath, "content.js"))

    // 更新主书源
    BookSourceJson[0].bookSourceComment = readme
    BookSourceJson[0].loginUrl = loginUrlContent
    BookSourceJson[0].loginUi = loginUI
    BookSourceJson[0].loginCheckJs = loginCheckJsContent
    BookSourceJson[0].variableComment = variableComment
    BookSourceJson[0].jsLib = jsLibContent

    BookSourceJson[0].searchUrl = `@js:\n${searchUrlContent}`
    BookSourceJson[0].ruleSearch.bookList = `@js:\n${searchContent}`

    BookSourceJson[0].exploreUrl = `@js:\n${discoverAddressContent}`
    BookSourceJson[0].ruleExplore.bookList = `@js:\n${discoverContent}`

    BookSourceJson[0].ruleBookInfo.init = `@js:\n${detailContent}`
    BookSourceJson[0].ruleToc.chapterList = `@js:\n${catalogContent}`
    BookSourceJson[0].ruleContent.content = `@js:\n${contentContent}`

    BookSourceJson[0].lastUpdateTime = `${String(Date.now()).slice(0, 10)}251`
    console.log(`${String(Date.now()).slice(0, 10)}251`)


    switch (sourceName) {
        case ("PixivMain"):
            BookSourceJson[0].customOrder = 0
            BookSourceJson[0].enabled = true
            BookSourceJson[0].enabledExplore = true
            break
        case ("PixivBackup"):
            BookSourceJson[0].customOrder = 1
            BookSourceJson[0].enabled = false
            BookSourceJson[0].enabledExplore = false
            break
        case ("PixivIllust"):
            BookSourceJson[0].customOrder = 2
            BookSourceJson[0].enabled = true
            BookSourceJson[0].enabledExplore = true
            break
    }
    return BookSourceJson
}

function main() {
    // 组合pixiv主书源
    const pixivMain = buildBookSource("PixivMain")
    const pixivBackup = buildBookSource("PixivBackup")
    // 加载其他书源
    const otherSources = JSON.parse(readTextFile("scripts/pixiv_other_sources.json"))
    // 与其他书源合并
    const allSources = [...pixivMain, ...otherSources]

    // 写入最终的 JSON 文件
    if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist")
    }
    const outputPath = path.join("dist", "pixiv.json")
    fs.writeFileSync(outputPath, JSON.stringify(allSources, null, 4), "utf-8")
    console.log(`✅ ${outputPath} 生成成功`)
}


main()