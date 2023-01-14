@js:

function urlNovelDetailed(nid) {
    return `https://www.pixiv.net/ajax/novel/${nid}`
}

(() => {
    let res = JSON.parse(result).body
    if (res.seriesNavData === null || res.seriesNavData === undefined) {
        return [{title: book.name, chapterUrl: baseUrl}]
    }

    var returnList = [];

    var seriesID = res.seriesNavData.seriesId
    var allChaptersCount = (() => {
        let responseBody = java.ajax("https://www.pixiv.net/ajax/novel/series/" + seriesID + "?lang=zh")
        let result = JSON.parse(responseBody).body.total
        // java.log("本目录有" + result + "章节");
        return result;
    })();

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        let url = "https://www.pixiv.net/ajax/novel/series_content/" + seriesID + "?limit=10&last_order=" + lastIndex + "&order_by=asc&lang=zh"
        res = JSON.parse(java.ajax(url))
        res = res.body.page.seriesContents
        // java.log(`发送获取章节URL:${url}`)
        // java.log(`响应结果:${JSON.stringify(res)}`)
        res.forEach(v => {
            v.chapterUrl = urlNovelDetailed(v.id)
        })
        return res;
    }

    //逻辑控制者 也就是使用上面定义的两个函数来做对应功能
    //要爬取的总次数
    let max = (allChaptersCount / 10) + 1
    for (let i = 0; i < max; i++) {
        //java.log("i的值:"+i)
        let list = sendAjaxForGetChapters(i * 10);
        //取出每个值
        list.forEach(v => {
            returnList.push(v);
        })
    }
    return returnList
})()