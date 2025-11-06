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
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8")
    }
    return ""
}

function saveJsonFile(folder, fileName, data) {
    if (folder && !fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    const outputPath = path.join(folder, fileName)
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4), "utf-8")
    console.log(`✅ ${outputPath} 生成成功`)
}

function buildBookSource(sourceName): BookSource[] {
    let templateJsonPath = `scripts/${sourceName}.json`
    // let sourcePath = `book/${sourceName}`
    let sourcePath = sourceName

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
    // console.log(`${String(Date.now()).slice(0, 10)}251`)

    if (sourceName === "pixiv") {
        BookSourceJson[0].customOrder = 0
    } else if (sourceName === "pixiv_backup") {
        BookSourceJson[0].customOrder = 1
    } else if (sourceName === "pixiv_illust") {
        BookSourceJson[0].customOrder = 2
    } else if (sourceName === "linpx") {
        BookSourceJson[0].customOrder = 3
    } else if (sourceName === "furrynovel") {
        BookSourceJson[0].customOrder = 4
    }

    return BookSourceJson
}

function buildPixivSource() {
    // 组合 Pixiv 书源
    const pixivMain = buildBookSource("pixiv")
    const pixivBackup = buildBookSource("pixiv_backup")
    const pixivIllust = buildBookSource("pixiv_illust")
    const allSources = [...pixivMain, ...pixivBackup, ...pixivIllust]
    // 写入最终的 JSON 文件
    saveJsonFile("dist", "pixiv.json", allSources)
}

function buildLinpxSource() {
    // 组合 Pixiv 书源
    const linpx = buildBookSource("linpx")
    const furrynovel = buildBookSource("furrynovel")
    const allSources = [...linpx, ...furrynovel]
    // 写入最终的 JSON 文件
    saveJsonFile("dist", "linpx.json", allSources)
}

function main() {
    buildPixivSource()
    buildLinpxSource()
}

main()