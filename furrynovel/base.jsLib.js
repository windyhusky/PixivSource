function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        // 缓存10分钟
        cache.put(key, v, 600)
    }
    return JSON.parse(v)
}
function getAjaxJson(url) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url))
    })
}

function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/novel/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}`
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

function urlSearchNovel(name, page) {
    return `https://api.furrynovel.com/api/zh/novel?page=${page}&order_by=popular&keyword=${encodeURI(name)}`
}

function urlLinpxNovelDetail(sourceId) {
    return `https://api.furrynovel.ink/pixiv/novel/${sourceId}/cache`
}
function urlLinpxCoverUrl(pxImgUrl) {
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

function dateFormat(text) {
    return `${text.slice(0, 10)}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}
function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
}
function sleepToast(text) {
    const {java} = this
    java.longToast(text)
    sleep(2000)
}

function updateSource() {
    const {java, source} = this;
    let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json"
    let onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[1]  // 第2个书源
    let comment = onlineSource.bookSourceComment.split("\n")
    let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 20vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 5vh; width: 40vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/FurryNovel.md">🔰 使用教程</a></th>
        <tr><td>☁️ 远程仓库版本：${java.timeFormat(onlineSource.lastUpdateTime)}</td></tr>
        <tr><td>📥 阅读本地版本：${java.timeFormat(source.lastUpdateTime)}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(2, 7).join("<br>")}</td></tr>
        <tr><td style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
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