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
    const html = java.ajax(
        `${config.bookSourceUrl}/search?q=${encodeURI(key)}&p=${page}`,
    );
    const list = [];
    // list.push({ name: "书名", bookUrl: "https://example.com/book/1", author: "作者" })
    return list;
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
    const html = java.ajax(book.bookUrl);
    return {
        intro: "",
        coverUrl: "",
        latestChapterTitle: "",
        tocUrl: book.bookUrl,
    };
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
}

/**
 * 获取正文。运行时额外提供 nextChapterUrl，表示下一章地址，可能为 null。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns {string} 正文文本；返回空字符串视为失败。纯文本段落用 \n 分隔；
 *   也可将正文 HTML 传入 java.htmlFormat(html, chapter.url) 转换为文本并保留插图
 */
function getContent(chapter, book) {
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


// JSLib
function getAjaxJson(url, requestUpdate) {
    return JSON.parse(java.ajax(url))
}
// function getAjaxJson(url, requestUpdate) {
//     const {java, cache} = this
//     return this.cacheGetAndSet(url, () => {
//         return JSON.parse(java.ajax(url))
//     }, requestUpdate)
// }
function getAjaxAllJson(urls, requestUpdate) {
    let batchKey = JSON.stringify(urls)
    return this.cacheGetAndSet(batchKey, () => {
        let results = []
        let now = new Date().getTime()
        let responses = java.ajaxAll(urls)
        for (let i in urls) {
            let data = JSON.parse(responses[i].body())
            data = Object.assign({timestamp: now}, data)
            results.push(data)
            this.putInCacheObject(urls[i], data, cacheSaveSeconds)
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
