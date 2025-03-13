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

function getWebviewJson(url, parseFunc) {
    const {java, cache} = this
    return cacheGetAndSet(cache, url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse(parseFunc(html))
    })
}


function urlUserAllWorks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`
}

function urlSearchNovel(name, page) {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
}
function urlSearchSeries(name, page) {
    return`https://www.pixiv.net/ajax/search/novels/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
}
function urlSearchArtwork(name, page) {
    return `https://www.pixiv.net/ajax/search/artworks/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=all&lang=zh`
}
function urlSearchManga(name, page) {
    return `https://www.pixiv.net/ajax/search/manga/${encodeURI(name)}?word=${encodeURI(name)}&order=date_d&mode=all&p=${page}s_mode=s_tag&type=manga&lang=zh`
}


// 完全匹配用户名
function urlSearchUser(userName) {
    return `https://www.pixiv.net/search/users?nick=${encodeURI(userName)}&s_mode=s_usr&nick_mf=1`
}

function urlCoverUrl(url) {
    return `${url}, {"headers": {"Referer":"https://www.pixiv.net/"}}`
}
function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}

function urlIllustOriginal(illustId, order) {
    let illustOriginal = getAjaxJson(urlIllustDetailed(illustId)).body.urls.original
    if (order >= 1) {
        illustOriginal = illustOriginal.replace(`_p0`, `_p${order - 1}`)
    }
    return illustOriginal
}

function urlSeriesIllustsUrl(userId, seriesId) {
    return `https://www.pixiv.net/user/${userId}/series/${seriesId}`
}
function urlSeriesIllustsDetailed(seriesId) {
    return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
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
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}
function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}
function sleepToast(text) {
    const {java} = this
    java.longToast(text)
    sleep(2000)
}

function updateSource(){
    return () => {
        const {java, source} = this;
        let updateUrl = "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json"
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
        <tr><td style="text-align: left;">${comment.slice(comment.length-7, comment.length).join("<br>")}</td></tr>
    </table>
    
    <div class="ann">
        <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json">
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