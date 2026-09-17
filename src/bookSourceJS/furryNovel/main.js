/**
 * 纯 JavaScript 单文件书源模板。
 * config 配置对象加若干函数声明即完整书源：search、getChapters、getContent 必须实现，
 * getBookInfo 可选，config.exploreUrl 与 explore 成对使用。
 * getReviewSummary 与 getReviewDetail 成对声明即启用段评。
 *
 * - 可直接使用 java、source、cookie、cache、baseUrl 等绑定。网络请求为同步 API，
 *   如 java.ajax(url)；调试输出用 java.log(msg)；完整 API 参阅应用内帮助。
 * - 每次函数调用在新作用域执行；跨请求状态用 cache.put/get 或 source.setVariable/getVariable。
 * - 支持常用 ES6 语法；不支持 class、async/await、Promise 回调和函数展开调用。
 * - book/chapter 属性、java.ajax 和 Jsoup 的返回值可能是 Java 字符串对象，使用字符串方法
 *   或进行判空前，先用 String(value) 转换。
 */

/**
 * 书源配置。字段名与 BookSource 实体一致。
 * 常用可选字段包括 header（JSON 格式请求头）、loginUrl（登录页地址，WebView 登录）、
 * loginUi（表单登录，RowUi 数组，与顶层 login 函数成对）、concurrentRate、
 * enabledCookieJar 和 jsLib。enabled、customOrder 等用户态字段由应用维护。
 */
const config = {
    bookSourceUrl: "https://furrynovel.com",
    bookSourceName: "🐯 兽人小说站",
    bookSourceType: 0, // 0 文本，1 音频，2 图片，3 下载
    bookSourceGroup: "🔞 Pixiv,🐲 Furry",
    bookSourceComment: "",
    // 发现分类，由 explore 抓取。数组每项 {title, url}，url 原样传入 explore；
    // 省略 url 的项渲染为分区标题。也接受“名称::url”每行一个的字符串形态。
    exploreUrl: [
        // { title: "玄幻", url: "https://example.com/sort/1.html" },
        // { title: "都市", url: "https://example.com/sort/2.html" },
    ],
    lastUpdateTime: 1788019258510, // 版本时间戳（毫秒）；导入值较新时提示更新
}

const Jsoup = org.jsoup.Jsoup

/**
 * 搜索书籍。
 * @param {string} key 搜索关键词
 * @param {number} page 页码，从 1 开始
 * @returns { [{name, bookUrl, author, kind, coverUrl, intro, wordCount, latestChapterTitle, tocUrl, type}] } 书籍数组或 JSON 字符串；name、bookUrl 必填，地址用绝对 URL
 */
function search(key, page) {
    let novels = []
    java.log(urlSearchNovel(key, page))
    let resp = getAjaxJson(urlSearchNovel(key, page))
    if (resp.code === 200 && resp.count > 0) {
        novels = novels.concat(resp.data)
    }
    novels = novels.sort((a, b) => (a.source_id > b.source_id ? 1 : -1))
    return formatNovels(handNovels(novels))
}

/**
 * 获取发现页书籍，与 config.exploreUrl 成对使用。
 * @param {string} url exploreUrl 中的分类地址，原样传入
 * @param {number} page 页码，从 1 开始
 * @returns 同 search
 */
function explore(url, page) {
    const html = java.ajax(url)
    const list = []
    return list
}

/**
 * 获取书籍详情。可选；仅写出的字段覆盖原值。
 * @param {Object} book 搜索结果中的书籍对象
 * @returns { {name, author, intro, coverUrl, kind, wordCount, latestChapterTitle, tocUrl, type, variable} } 字段补丁对象或 JSON 字符串
 */
function getBookInfo(book) {
    const html = java.ajax(book.bookUrl)
    return {
        intro: "",
        coverUrl: "",
        latestChapterTitle: "",
        tocUrl: book.bookUrl,
    }
}

/**
 * 获取目录。
 * @param {Object} book 书籍对象
 * @returns { [{title, url, isVolume, isVip, isPay, wordCount, tag, resourceUrl}] } 目录数组或 JSON 字符串；title、url 必填，数组序即目录序
 */
function getChapters(book) {
    const html = java.ajax(book.tocUrl)
    const chapters = []
    // chapters.push({ title: "第一卷", url: "第一卷", isVolume: true })
    // chapters.push({ title: "第1章", url: "https://example.com/read/1" })
    return chapters
}

/**
 * 获取正文。运行时额外提供 nextChapterUrl，表示下一章地址，可能为 null。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns {string} 正文文本；返回空字符串视为失败。纯文本段落用 \n 分隔；
 *   也可将正文 HTML 传入 java.htmlFormat(html, chapter.url) 转换为文本并保留插图
 */
function getContent(chapter, book) {
    const html = java.ajax(chapter.url)
    // return java.htmlFormat(Jsoup.parse(html).select("div.content").html(), chapter.url)
    return html
}

/**
 * 段评统计，与 getReviewDetail 成对使用。章节加载后调用，返回各段落的评论数。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns { [{paraIndex, count, paraData}] } 数组或 JSON 字符串；paraIndex 段落序号（从 1 起），count 评论数（≤0 忽略），paraData 可选，传给 getReviewDetail
 */
function getReviewSummary(chapter, book) {
    const html = java.ajax(`${config.bookSourceUrl}/review/summary?cid=${chapter.url}`)
    const list = []
    // list.push({ paraIndex: 1, count: 5, paraData: "token" })
    return list
}

/**
 * 段评详情，与 getReviewSummary 成对使用。点击段评图标时调用，支持翻页。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @param {number} paraIndex 段落序号
 * @param {string} paraData getReviewSummary 返回的附加数据，可能为空字符串
 * @param {number} page 页码，从 1 开始
 * @returns { {items: [{content, id, name, avatar, badge, replies}], nextPageUrl} } content 必填，replies 为同结构子评论数组；nextPageUrl 非空则可继续翻页，翻页由 page 递增自行拼接
 */
function getReviewDetail(chapter, book, paraIndex, paraData, page) {
    const html = java.ajax(`${config.bookSourceUrl}/review/detail?para=${paraIndex}&page=${page}`)
    const items = []
    // items.push({ content: "评论内容", name: "用户名", replies: [{ content: "回复内容" }] })
    return { items, nextPageUrl: null }
}

function getAjaxJson(url) {
    return JSON.parse(java.ajax(url))
}

// URL
function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/novel/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}`
}
function urlNovelDetailLinpx(sourceId) {
    return `https://api.linpx.ink/pixiv/novel/${sourceId}/cache`
}
function urlNovelsDetail(novelIds) {
    return `https://api.furrynovel.com/api/zh/novel?${novelIds.map(v => "ids[]=" + v).join("&")}`
}
function urlNovelChapterUrl(novelId, chapterId) {
    return `https://furrynovel.com/zh/novel/${novelId}/chapter/${chapterId}`
}
function urlNovelChapterInfo(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter`
}
function urlNovelChapterDetail(novelId, chapterId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter/${chapterId}`
}

function urlSourceUrl(source, oneShot, sourceId) {
    if (source === "bilibili") {
        return `https://www.bilibili.com/read/readlist/rl${sourceId}/`
    }
    if (source === "pixiv" && oneShot === true) {
        return `https://www.pixiv.net/novel/show.php?id=${sourceId}`
    }
    if (source === "pixiv" && oneShot === false) {
        return `https://www.pixiv.net/novel/series/${sourceId}`
    }
}

function urlSearchNovel(name, page) {
    return `https://api.furrynovel.com/api/zh/novel?page=${page}&order_by=popular&keyword=${name}`
}
function urlSearchUser(name, page) {
    return `https://api.furrynovel.com/api/zh/novel?keyword=${name}&page=${page}`
}
function urlUserUrl(name) {
    return `https://furrynovel.com/zh/search?keyword=${name}`
}


function addZero(num) {
    return String(num).padStart(2, '0')
}
function dateFormat(str) {
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = this.addZero(time.getMonth() + 1) + "月";
    let D = this.addZero(time.getDate()) + "日";
    return Y + M + D;
}


// Handler
function handNovels(novels) {
    novels.forEach((novel) => {
        // novel.id = novel.id
        novel.title = novel.name
        // novel.tags = novel.tags
        novel.userName = novel.author.name
        // novel.userId = novel.author.id
        novel.textCount = null
        if (novel.latest_chapters === undefined) {
            novel.latestChapter = null
            novel.detailedUrl = urlNovelDetail(novel.id)
        } else {
            novel.latestChapter = novel.latest_chapters[0].name
            novel.detailedUrl = urlNovelUrl(novel.id)
        }
        novel.description = novel.desc
        novel.coverUrl = novel.cover
        novel.sourceUrl = urlSourceUrl(novel.source, novel.ext_data.oneshot, novel.source_id)

        novel.createDate = novel.created_at
        novel.updateDate = novel.updated_at
        novel.syncDate = novel.fetched_at
        // novel.status = novel.status
        // if (novel.status !== "publish") {  // suspend
        //     java.log(urlNovelUrl(novel.id))
        //     java.log(novel.sourceUrl)
        // }
    })
    return novels
}

function formatNovels(novels) {
    novels.forEach((novel) => {
        novel.title = novel.title.trim()
        if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
        novel.tags2 = []
        for (let i in novel.tags) {
            let tag = novel.tags[i]
            if (tag.includes("/")) {
                let tags = tag.split("/")
                novel.tags2 = novel.tags2.concat(tags)
            } else {
                novel.tags2.push(tag)
            }
        }
        novel.tags = Array.from(new Set(novel.tags2))
        novel.tags = novel.tags.map((item) => `#${item}`)
        novel.tags = novel.tags.join(",")

        novel.createDate = dateFormat(novel.createDate)
        novel.updateDate = dateFormat(novel.updateDate)
        novel.syncDate = dateFormat(novel.syncDate)
        // if (util.settings.MORE_INFORMATION) {
            novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
        // } else {
        //     novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n同步时间：${novel.syncDate}`
        // }

        novel.name = novel.title
        novel.bookUrl = novel.detailedUrl
        novel.author = novel.userName
        novel.kind = novel.tags
        // novel.coverUrl = novel.coverUrl
        novel.intro = novel.description
        novel.wordCount = novel.textCount
        novel.latestChapterTitle = novel.latestChapter
        novel.tocUrl = novel.catalogUrl
    })
    return novels
}