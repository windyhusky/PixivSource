@js:
(() => {
    let res = Object(java.get("novel"))
    if (res.seriesNavData === null || res.seriesNavData === undefined) {
        return [
            {
                title: book.name,
                chapterUrl: baseUrl
            }
        ]
    }


    var hasChapters = (() => {
        return baseUrl.match(/show.php\?id=/) == null
    })();
    //java.log("有续章嘛？"+hasChapters)

    var returnList = [];
    if (hasChapters) {
        var seriesID = baseUrl.match(/series_content\/(.*?)\?/)[1]
        var allChaptersCount = (() => {
            //要取出baseUrl的seriesID数据
            let responseBody = java.ajax("https://www.pixiv.net/ajax/novel/series/" + seriesID + "?lang=zh")
            let result = JSON.parse(responseBody).body.total
            //java.log("本目录有"+result+"章节");
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
                v.chapterUrl = "https://www.pixiv.net/novel/show.php?id=" + v.id
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
    } else {

        let json = JSON.parse(result.match('{\"time.+}')[0]);

        var novels = (() => {
            var result = "";
            for (var key in json.novel) {
                result += JSON.stringify(json.novel[key]);
            }
            return JSON.parse(result);
        })();
        java.log(JSON.stringify(novels))
        returnList.push(novels)
    }
    return returnList
})()