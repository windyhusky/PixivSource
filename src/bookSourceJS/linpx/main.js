/**
 * JS 源模板。
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
    bookSourceUrl: "https://furrynovel.ink",
    bookSourceName: "🦊 Linpx",
    bookSourceType: 0,
    bookSourceGroup: "🔞 Pixiv,🐲 Furry",
    bookSourceComment: "",
    // 发现分类，由 explore 抓取。数组每项 {title, url}，url 原样传入 explore；
    // 省略 url 的项渲染为分区标题。也接受“名称::url”每行一个的字符串形态。
    header: {"Referer":"https://linpx.ink/"},
    // loginUrl
    loginUi: [],
    exploreUrl: [
        // { title: "玄幻", url: "https://example.com/sort/1.html" },
        // { title: "都市", url: "https://example.com/sort/2.html" },
    ],
    concurrentRate: "30/5000",
    enabledCookieJar: true,
    lastUpdateTime: 0, // 版本时间戳（毫秒）；导入值较新时提示更新
};

/**
 * 登录UI v2（可选）：声明顶层 loginUi(state) 与 loginAction(action, state, form) 即启用，
 * state 由应用持有，弹窗关闭即弃。loginAction 返回命令对象：{ state } 重渲染、
 * { error: {key: 消息} } 字段红字、{ login: {...} } 持久化凭据（重开按 key 回填）、{ close: true } 关窗。
 * 行类型 text/password/label/select（options 单选）/button（countdown 秒）。
 */

const Jsoup = org.jsoup.Jsoup;

/**
 * 搜索书籍。
 * @param {string} key 搜索关键词
 * @param {number} page 页码，从 1 开始
 * @returns { [{name, bookUrl, author, kind, coverUrl, intro, wordCount, latestChapterTitle, tocUrl, type}] } 书籍数组或 JSON 字符串；name、bookUrl 必填，地址用绝对 URL
 */
function search(key, page) {
    let novels = []
    let resp = getAjaxJson(urlSearchNovel(key, page))
    java.log(urlSearchNovel(key, page))

    if (resp.error || resp.total === 0) return []
    novels = novels.concat(resp.novels)
    // java.log(JSON.stringify(novels))
    if (novels.length === 0) return []
    return formatNovels(handNovels(novels))
    // return formatNovels(handNovels(combineNovels(novels)))
}

/**
 * 获取发现页书籍，与 config.exploreUrl 成对使用。
 * @param {string} url exploreUrl 中的分类地址，原样传入
 * @param {number} page 页码，从 1 开始
 * @returns 同 search
 */
function explore(url, page) {
    const html = java.ajax(url);
    const list = [];
    return list;
}

/**
 * 获取书籍详情。可选；仅写出的字段覆盖原值。
 * @param {Object} book 搜索结果中的书籍对象
 * @returns { {name, author, intro, coverUrl, kind, wordCount, latestChapterTitle, tocUrl, type, variable} } 字段补丁对象或 JSON 字符串
 */
function getBookInfo(book) {
    let novelId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let novel = getAjaxJson(urlNovelDetailed(novelId))
    novel = formatNovels(handNovels([novel], true))[0]
    let result = getAjaxJson(urlSeriesDetailed(novel.seriesId))
    if (!novel.seriesId || novel.seriesId && result.error) {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return book
}

/**
 * 获取目录。
 * @param {Object} book 书籍对象
 * @returns { [{title, url, isVolume, isVip, isPay, wordCount, tag, resourceUrl}] } 目录数组或 JSON 字符串；title、url 必填，数组序即目录序
 */
function getChapters(book) {
    const html = java.ajax(book.tocUrl);
    const chapters = [];
    // chapters.push({ title: "第一卷", url: "第一卷", isVolume: true })
    // chapters.push({ title: "第1章", url: "https://example.com/read/1" })
    return chapters;
function urlNovel(novelId) {
    return urlNovelDetailed(novelId)
    // if (util.settings.SHOW_ORIGINAL_LINK) {
    //     return urlNovelUrl(novelId)
    // } else {
    //     return urlNovelDetailed(novelId)
    // }
}

function oneShotHandler(resp) {
    resp.textCount = resp.content.length
    resp.updateDate = timeTextFormat(resp.createDate)
    return [{
        title: resp.title.trim(),
        url: urlNovel(resp.id),
        tag: resp.tag,
        wordCount: resp.content.length,
        chapterInfo:`${resp.updateDate}　　${resp.textCount}字`
    }]
}

function seriesHandler(resp) {
    let novelUrls = resp.novels.map(item => urlNovelDetailed(item.id))
    let novels = getAjaxAllJson(novelUrls)

    novels.forEach(novel => {
        if (!novel.title) novel.title = novel.detail.title
        novel.title = novel.title.trim()
        novel.url = urlNovel(novel.id)
        if (novel.content) novel.wordCount = novel.content.length
        novel.updateDate = timeTextFormat(novel.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.wordCount}字`
        if (novel.content) delete novel.content
    })
    return novels
}

// 优化 未缓存系列目录的情况：从章节数据中，获取系列目录
function seriesContentHandler(resp) {
    let novels = [], prevNovels = [], nextNovels = []
    while (resp.series.prev !== null && resp.series.prev !== undefined) {
        prevNovels.push(resp.series.prev)
        resp = getAjaxJson(urlNovelDetailed(resp.series.prev.id))
    }
    nextNovels.push({id: resp.id, order: resp.series.order, title: resp.title})
    while (resp.series.next !== null && resp.series.prev !== undefined) {
        nextNovels.push(resp.series.next)
        resp = getAjaxJson(urlNovelDetailed(resp.series.next.id))
    }
    novels = novels.concat(prevNovels.reverse())
    novels = novels.concat(nextNovels)
    novels.forEach(novel => {
        novel.title = novel.title.trim()
        novel.chapterUrl = urlNovel(novel.id)
        novel.detail = getAjaxJson(urlNovelDetailed(novel.id))
        novel.textCount = novel.detail.content.length
        novel.updateDate = timeTextFormat(novel.detail.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.textCount}字`
        delete novel.detail
    })
    // java.log(JSON.stringify(novels))
    return novels
}

/**
 * 获取正文。运行时额外提供 nextChapterUrl，表示下一章地址，可能为 null。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns {string} 正文文本；返回空字符串视为失败。纯文本段落用 \n 分隔；
 *   也可将正文 HTML 传入 java.htmlFormat(html, chapter.url) 转换为文本并保留插图
 */
function getContent(chapter, book)


    const html = java.ajax(chapter.url);
    // return java.htmlFormat(Jsoup.parse(html).select("div.content").html(), chapter.url)
    return html;
}

/**
 * 段评统计，与 getReviewDetail 成对使用。章节加载后调用，返回各段落的评论数。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns { [{paraIndex, count, paraData}] } 数组或 JSON 字符串；paraIndex 段落序号（从 1 起），count 评论数（≤0 忽略），paraData 可选，传给 getReviewDetail
 */
function getReviewSummary(chapter, book) {
    const html = java.ajax(
        `${config.bookSourceUrl}/review/summary?cid=${chapter.url}`,
    );
    const list = [];
    // list.push({ paraIndex: 1, count: 5, paraData: "token" })
    return list;
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
    const html = java.ajax(
        `${config.bookSourceUrl}/review/detail?para=${paraIndex}&page=${page}`,
    );
    const items = [];
    // items.push({ content: "评论内容", name: "用户名", replies: [{ content: "回复内容" }] })
    return { items, nextPageUrl: null };
}

function handNovels(novels, isDetail) {
    novels.forEach(novel => {
        if (!novel.id) novel.id = novel._id
        // novel.title = novel.title
        // novel.userName = novel.userName
        // novel.userId = novel.userId
        // novel.tags = novel.tags
        if (novel.tags === undefined) {
            novel.tags = []
        }
        // novel.textCount = novel.length
        novel.description = novel.desc
        // novel.coverUrl = novel.coverUrl
        // novel.createDate = novel.createDate
        // novel.seriesId = novel.seriesId
        // novel.seriesTitle = novel.seriesTitle

        // 兼容详情页
        if (novel.content) {
            if (novel.series) {
                novel.seriesId = novel.series.id
                novel.seriesTitle = novel.series.title
            }
            novel.textCount = novel.length = novel.content.length
        }

        // 单篇添加更多信息
        if (!novel.seriesId) {
            novel.tags.unshift("单本")
            novel.textCount = novel.length
            novel.latestChapter = novel.title
            novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 搜索、详情：系列添加更多信息
        if (novel.seriesId) {
            novel.title = novel.seriesTitle
            novel.tags.unshift("系列")
            novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 详情：兼容无法从 Pixiv 获取系列详情的系列小说
        let series
        if (novel.seriesId && isDetail) {
            series = getAjaxJson(urlSeriesDetailed(novel.seriesId))
            // novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 详情：系列添加更多信息
        if (novel.seriesId && isDetail && !series.error) {
            java.log(`正在获取系列小说：${novel.seriesId}`)
            novel.id = series.novels[0].id
            // novel.title = novel.seriesTitle
            if (series.tags) novel.tags = novel.tags.concat(series.tags)
            novel.latestChapter = series.novels.reverse()[0].title
            novel.description = series.caption
            // 后端目前没有系列的 coverUrl 字段
            // novel.coverUrl = series.coverUrl
            // novel.coverUrl = series.novels[0].coverUrl
            novel.detailedUrl = urlSeriesDetailed(novel.seriesId)

            let firstNovel = getAjaxJson(urlNovelDetailed(novel.id))
            if (firstNovel.error !== true) {
                novel.tags = novel.tags.concat(firstNovel.tags)
                novel.createDate = firstNovel.createDate
                if (novel.description === "") {
                    novel.description = firstNovel.desc
                }
            }
        }
    })
    return novels
}

function formatNovels(novels) {
    novels.forEach(novel => {
        novel.title = novel.title.trim()
        if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
        novel.coverUrl = urlCoverUrl(novel.coverUrl)
        novel.createDate = dateFormat(novel.createDate)

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
        novel.tags = novel.tags.map(item => `#${item}`)
        novel.tags = novel.tags.join(",")

        // if (util.settings.MORE_INFORMATION) {
        //     novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
        // } else {
        //     novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
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

// JSLib cache
var cacheSaveSeconds = 30*24*60*60  // 长期缓存 30 天
var cacheTempSeconds = 10*60*1000   // 冷却时间 10 分钟
function cacheGetAndSet(key, supplyFunc, requestUpdate) {
    const {java, cache} = this
    let timestamp = 0
    let v = getFromCacheObject(key)
    if (Array.isArray(v)) {
        try {
            timestamp = v[0].timestamp
        } catch (e) {
            timestamp = 0
        }
    } else if (v) {
        timestamp = v.timestamp
    }

    const isExpired = v && (new Date().getTime() >= timestamp + cacheTempSeconds)
    const isError = v && (v.error === true) && isExpired
    requestUpdate = requestUpdate && isExpired

    if (!v || requestUpdate || isError) {
        v = supplyFunc()
        let now = new Date().getTime()
        // getAjaxJson getWebviewJson 时间戳写入对象本身
        if (!Array.isArray(v)) {
            v = Object.assign({timestamp: now}, v)
        }
        // else {
        //     // getAjaxAllJson 时间戳写入第一个元素（读取时 v[0].timestamp）// 不重复写入
        //     if (v.length > 0) v[0] = Object.assign({timestamp: now}, v[0])
        // }
        putInCacheObject(key, v, cacheSaveSeconds)
    }
    return v
}

function putInCache(name, object, saveSeconds) {
    if (saveSeconds === undefined) saveSeconds = 0
    if (object) cache.put(name, object, saveSeconds)
}
function getFromCache(name) {
    let object = cache.get(name)
    if (object === undefined) return null  // 兼容源阅
    return object
}

function putInCacheObject(objectName, object, saveSeconds) {
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}
function getFromCacheObject(objectName) {
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅
    return JSON.parse(object)
}

function getAjaxJson(url, requestUpdate) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    }, requestUpdate)
}
function getAjaxAllJson(urls, requestUpdate) {
    let batchKey = JSON.stringify(urls)
    return cacheGetAndSet(batchKey, () => {
        let results = []
        let now = new Date().getTime()
        let responses = java.ajaxAll(urls)
        for (let i in urls) {
            let data = JSON.parse(responses[i].body())
            data = Object.assign({timestamp: now}, data)
            results.push(data)
            putInCacheObject(urls[i], data, cacheSaveSeconds)
        }
        return results
    }, requestUpdate)
}

// JSLib url
function urlNovelUrl(novelId) {
    return `https://linpx.ink/pixiv/novel/${novelId}`
}
function urlNovelDetailed(novelId) {
    return `https://api.linpx.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelsDetailed(nidList) {
    return `https://api.linpx.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
}

function urlSourceUrl(novelId) {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://api.linpx.ink/pixiv/series/${seriesId}/cache`
}

function urlUserUrl(userId) {
    return `https://linpx.ink/pixiv/user/${userId}`
}
function urlUserDetailed(userId) {
    return `https://api.linpx.ink/pixiv/user/${userId}/cache`
}
function urlUsersDetailed(uidList) {
    return `https://api.linpx.ink/pixiv/users/cache?${uidList.map(v => "ids[]=" + v).join("&")}`
}
function urlUserFavorite() {
    return "https://api.linpx.ink/fav/user/cache"
}

function urlSearchNovel(novelName, page) {
    return `https://api.linpx.ink/pixiv/search/novel/${novelName}/cache?page=${page}`
}
function urlSearchUsers(userName) {
    return `https://api.linpx.ink/pixiv/search/user/${userName}/cache`
}

function urlCoverUrl(pxImgUrl) {
    return urlPxImgUrlLinpx(pxImgUrl)
}
function urlPxImgUrlLinpx(pxImgUrl) {
    if (!pxImgUrl.trim()) return ""
    let url = `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    let headers = {"Referer": "https://linpx.ink/"}
    return `${url}, ${JSON.stringify({headers: headers})}`
}

// JSLib date
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
function timeFormat(str) {
    let time = new Date(str);
    let YY = time.getFullYear()
    let MM = this.addZero(time.getMonth() + 1)
    let DD = this.addZero(time.getDate())
    let hh = this.addZero(time.getHours())
    let mm = this.addZero(time.getMinutes())
    let ss = this.addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}
function sleepToast(text, seconds) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (seconds === undefined) {seconds = 0.01}
    this.sleep(seconds)
}
