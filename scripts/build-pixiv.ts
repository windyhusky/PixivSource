import fs from "fs";
import path from "path";

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
    lastUpdateTime: number;
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
    return fs.readFileSync(filePath, "utf-8");
}

function buildPixivMainChannel(): BookSource[] {
    // 读取基础模板
    const pixivJson: BookSource[] = JSON.parse(
        readTextFile("scripts/pixiv_template.json"),
    );

    const pixivRoot = "projects/pixiv";
    const distRoot = path.join(pixivRoot, "dist");

    // 读取各个构建后的JS文件内容
    const jsLibContent = readTextFile(path.join(distRoot, "base.jsLib.js"));
    const loginUrlContent = readTextFile(
        path.join(distRoot, "base.loginUrl.js"),
    );
    const loginCheckJsContent = readTextFile(
        path.join(distRoot, "base.loginCheckJs.js"),
    );
    const catalogContent = readTextFile(path.join(distRoot, "catalog.js"));
    const contentContent = readTextFile(path.join(distRoot, "content.js"));
    const detailContent = readTextFile(path.join(distRoot, "detail.js"));
    const discoverAddressContent = readTextFile(
        path.join(distRoot, "discover_address.js"),
    );
    const discoverContent = readTextFile(path.join(distRoot, "discover.js"));
    const searchContent = readTextFile(path.join(distRoot, "search.js"));
    const searchUrlContent = readTextFile(path.join(distRoot, "searchUrl.js"));

    // 读取其他静态文件
    const readme = readTextFile(`${pixivRoot}/src/ReadMe.txt`);
    const bookUrlPattern = readTextFile(
        `${pixivRoot}/src/base.bookUrlPattern.txt`,
    ).trim();
    const loginUI = JSON.parse(
        readTextFile(`${pixivRoot}/src/base.loginUI.json`),
    );
    const variableComment = readTextFile(
        `${pixivRoot}/src/base.variableComment.txt`,
    );

    // 更新主书源
    pixivJson[0].bookSourceComment = readme;
    pixivJson[0].jsLib = jsLibContent;
    pixivJson[0].loginUrl = loginUrlContent;
    pixivJson[0].loginCheckJs = loginCheckJsContent;
    pixivJson[0].ruleToc.chapterList = `@js:\n${catalogContent}`;
    pixivJson[0].ruleContent.content = `@js:\n${contentContent}`;
    pixivJson[0].ruleBookInfo.init = `@js:\n${detailContent}`;
    pixivJson[0].exploreUrl = `@js:\n${discoverAddressContent}`;
    pixivJson[0].ruleExplore.bookList = `@js:\n${discoverContent}`;
    pixivJson[0].ruleSearch.bookList = `@js:\n${searchContent}`;
    pixivJson[0].searchUrl = `@js:\n${searchUrlContent}`;
    pixivJson[0].bookUrlPattern = bookUrlPattern;
    pixivJson[0].loginUi = JSON.stringify(loginUI);
    pixivJson[0].variableComment = variableComment;
    pixivJson[0].lastUpdateTime = Date.now();

    return pixivJson;
}

function main() {
    // 组合pixiv主书源
    const pixivMain = buildPixivMainChannel();
    // 加载其他书源
    const otherSources = JSON.parse(
        readTextFile("scripts/pixiv_other_sources.json"),
    );
    // 与其他书源合并
    const allSources = [...pixivMain, ...otherSources];

    // 写入最终的 JSON 文件
    if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist");
    }
    const outputPath = path.join("dist", "pixiv.json");
    fs.writeFileSync(outputPath, JSON.stringify(allSources, null, 4), "utf-8");

    console.log(`✅ ${outputPath} 生成成功`);
}

if (require.main === module) {
    main();
}

export { main };
