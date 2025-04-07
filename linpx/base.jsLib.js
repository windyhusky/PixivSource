function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        // 缓存10分钟
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}
function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) === "object") {
            return true
        }
    } catch(e) {}
    return false
}
function getAjaxJson(url) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url))
    })
}
function getWebviewJson(url) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}

function urlNovelUrl(novelId) {
    return `https://furrynovel.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelDetailed(novelId) {
    return `https://api.furrynovel.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelsDetailed(nidList) {
    return `https://api.furrynovel.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
}
function urlNovelComments(novelId) {
    return `https://api.furrynovel.ink/pixiv/novel/${novelId}/comments`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://api.furrynovel.ink/pixiv/series/${seriesId}/cache`
}

function urlUsersDetailed(uidList) {
    return `https://api.furrynovel.ink/pixiv/users/cache?${uidList.map(v => "ids[]=" + v).join("&")}`
}

function urlSearchNovel(novelName, page) {
    return `https://api.furrynovel.ink/pixiv/search/novel/${novelName}/cache?page=${page}`
}
function urlSearchUsers(userName) {
    return `https://api.furrynovel.ink/pixiv/search/user/${userName}/cache`
}

function urlCoverUrl(pxImgUrl) {
    return `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
}
function urlIllustOriginal(illustId, order) {
    // 使用 pixiv.cat 获取插图
    let illustOriginal = `https://pixiv.re/${illustId}.png`
    // let illustOriginal = `https://pixiv.nl/${illustId}.png`
    if (order >= 1) {
        illustOriginal = `https://pixiv.re/${illustId}-${order}.png`
        // illustOriginal = `https://pixiv.nl/${illustId}-${order}.png`
    }
    return illustOriginal
}

function dateFormat(str) {
    let addZero = function (num) {
        return num < 10 ? '0' + num : num;
    }
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = addZero(time.getMonth() + 1) + "月";
    let D = addZero(time.getDate()) + "日";
    return Y + M + D;
}
function timeTextFormat(text) {
    if (text === undefined) {
        return ""
    }
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}

function updateSource() {
    return () => {
        const {java, source} = this;
        let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json"
        let onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[0]  // 第1个书源
        let comment = onlineSource.bookSourceComment.split("\n")
        let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 20vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 5vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/${source.bookSourceName}.md">🔰 使用教程</a></th>
        <tr><td>☁️ 远程仓库版本：${java.timeFormat(onlineSource.lastUpdateTime)}</td></tr>
        <tr><td>📥 阅读本地版本：${java.timeFormat(source.lastUpdateTime)}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(2,9).join("<br>")}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(comment.length-2, comment.length).join("<br>")}</td></tr>
    </table>
    
    <div class="ann">
        <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json">
            <button><span>更新 ${source.bookSourceName} 书源</span></button>
        </a>
    </div>
    
    <div class="ann">
        <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新 ${source.bookSourceName} 订阅源</span></button>
        </a>
    </div>
</body>
</html>`;
        java.startBrowser(htm,'更新');
        return []
    }
}