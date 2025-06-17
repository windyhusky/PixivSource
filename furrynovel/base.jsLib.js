function cacheGetAndSet(cache, key, supplyFunc) {
    let v = cache.get(key)
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc())
        cache.put(key, v, 7*24*60*60)  // 延长缓存时间至7天
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
    return `https://api.furrynovel.com/api/zh/novel?page=${page}&order_by=popular&keyword=${name}`
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
function timeFormat(str) {
    let addZero = function (num) {
        return num < 10 ? '0' + num : num;
    }
    let time = new Date(str);
    let YY = time.getFullYear()
    let MM = addZero(time.getMonth() + 1)
    let DD = addZero(time.getDate())
    let hh = addZero(time.getHours())
    let mm = addZero(time.getMinutes())
    let ss = addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
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
    const {java, source} = this
    let onlineSource, comment, sourceName, sourceNameCapitalize, index = 0
    if (source.bookSourceUrl.includes("pixiv")) sourceName = "pixiv"
    else if (source.bookSourceUrl.includes("furrynovel")) sourceName = "linpx"
    sourceNameCapitalize = sourceName[0].toUpperCase() + sourceName.substring(1)

    if (source.bookSourceName.includes("备用")) index = 1
    else if (source.bookSourceName.includes("漫画")) index = 2
    if (source.bookSourceUrl.includes("furrynovel.com")) {
        sourceNameCapitalize = "FurryNovel"
        index = 1
    }

    try {
        let updateUrl = `https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json`
        onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
    } catch (e) {
        try {
            let updateUrl = `https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json`
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime(), bookSourceComment: source.bookSourceComment}
        }
    }
    comment = source.bookSourceComment.split("\n")
    // comment = source.bookSourceComment.split("\n")
    let htm = `data:text/html; charset=utf-8,
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 6vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/FurryNovel.md">🔰 使用指南</a></th>
        <tr>
            <td>☁️ 远程版本：${onlineSource.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(onlineSource.lastUpdateTime)}</td>
        </tr>
        <tr>
            <td>📥 本地版本：${source.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(source.lastUpdateTime)}</td>
        </tr> 
        <tr><td colspan="2" style="text-align: left;">${comment.slice(3, 8).join("<br>")}</td></tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 ${source.bookSourceName} 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/${sourceName}.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`;
    java.startBrowser(htm,'更新书源');
    return []
}