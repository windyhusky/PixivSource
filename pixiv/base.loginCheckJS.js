var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}
    let input = source.getVariable()  // [object JavaObject]
    try {
        if (input == "debug"|| input == "" || input == null) {
            var settings = JSON.parse(String(source.variableComment).split("//")[0])
            java.log("使用默认的设置")
        } else {
            var settings = JSON.parse(String(input).split("//")[0])
            java.log("使用自定义设置")
        }
    } catch (e) {
        java.log(e)
    }

    u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
    u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
    u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
    u.DEBUG = settings.DEBUG // 调试模式
    if (String(source.getVariable()) === "debug") {
        u.DEBUG = true // 调试模式
    }
    if (u.DEBUG === true) {
        // java.log(JSON.stringify(settings))
        // java.log(`SHOW_ORIGINAL_NOVEL_LINK = ${u.SHOW_ORIGINAL_NOVEL_LINK}`)
        // java.log(`REPLACE_BOOK_TITLE_MARKS = ${u.REPLACE_BOOK_TITLE_MARKS}`)
        // java.log(`MORE_INFO_IN_DESCRIPTION = ${u.MORE_INFO_IN_DESCRIPTION}`)
        java.log(`DEBUG = ${u.DEBUG}`)
    }


    u.debugFunc = (func) => {
        if (util.DEBUG) {
            func()
        }
    }
    u.cacheGetAndSet = (key, supplyFunc) => {
        let v = cache.get(key)
        if (v === undefined || v === null) {
            v = JSON.stringify(supplyFunc())
            // 缓存10分钟
            cache.put(key, v, 600)
        }
        return JSON.parse(v)
    }
    u.getAjaxJson = (url) => {
        return util.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
    }
    u.getWebviewJson = (url, parseFunc) => {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse(parseFunc(html))
        })
    }

    u.urlNovelUrl = (novelId) => {
        return `https://www.pixiv.net/novel/show.php?id=${novelId}`
    }
    u.urlNovelDetailed = (novelId) => {
        return `https://www.pixiv.net/ajax/novel/${novelId}`
    }
    u.urlNovel = (novelId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlNovelUrl(novelId)
        } else {
            return util.urlNovelDetailed(novelId)
        }
    }

    u.urlSeriesUrl = (seriesId) => {
        return `https://www.pixiv.net/novel/series/${seriesId}`
    }
    u.urlSeriesDetailed = (seriesId) => {
        return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
    }
    u.urlSeriesNovels = (seriesId, limit, offset) => {
        if (limit > 30) {
            limit = 30
        }
        if (limit < 10) {
            limit = 10
        }
        return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
    }

    u.urlUserUrl = (id) => {
        return `https://www.pixiv.net/users/${id}`
    }
    u.urlUserAllWorks = (uesrId) => {
        return `https://www.pixiv.net/ajax/user/${uesrId}/profile/all?lang=zh`
    }
    u.urlUserNovels = (nid, nidList) => {
        return `https://www.pixiv.net/ajax/user/${nid}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    }

    u.urlSearchNovel = (novelName, page) =>{
        return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
    }
    u.urlSearchSeries = (seriesName, page) => {
        return`https://www.pixiv.net/ajax/search/novels/${encodeURI(seriesName)}?word=${encodeURI(seriesName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
    }
    // 完全匹配用户名
    u.urlSearchUser = (username) => {
        return `https://www.pixiv.net/search/users?nick=${encodeURI(username)}&s_mode=s_usr&nick_mf=1`
    }
    u.urlSearchUserPartial = (username) => {
        return `https://www.pixiv.net/search/users?nick=${encodeURI(username)}&s_mode=s_usr`
    }

    u.urlCoverUrl = (url) => {
        return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
    }
    u.urlIllustUrl = (illustId) => {
        return `https://www.pixiv.net/artworks/${illustId}`
    }
    u.urlIllustDetailed = (illustId) => {
        return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
    }
    u.urlIllustOriginal = (illustId, order) => {
        let illustOriginal = util.getAjaxJson(util.urlIllustDetailed(illustId)).body.urls.original
        if (order >= 1) {
            illustOriginal = illustOriginal.replace(`_p0`, `_p${order - 1}`)
        }
        return illustOriginal
    }

    u.urlSeriesIllustsUrl = (uesrId, seriesId) => {
        return `https://www.pixiv.net/user/${uesrId}/series/${seriesId}`
    }
    u.urlSeriesIllustsDetailed = (seriesId) => {
        return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            // novel.title = novel.title
            // novel.userName = novel.userName
            novel.tags = novel.tags.join(",")

            if (novel.isOneshot === undefined) {  //单篇小说
                // novel.textCount = novel.textCount
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
                // novel.description = novel.description
                novel.lastChapter = novel.title
                novel.coverUrl = novel.url
                novel.aiType = novel.aiType - 1

            } else {  // 兼容系列搜索
                if (novel.isOneshot === true) {
                    novel.id = novel.novelId  //单篇（完结？）小说
                    novel.lastChapter = novel.title
                    novel.aiType = novel.aiType / 2

                } else {  // 真正的系列小说
                    novel.id = novel.latestEpisodeId  // 最近一篇
                    novel.latestPublishDate = novel.latestPublishDateTime
                    novel.seriesId = novel.id        // 真正的系列小说id
                    // let series = this.getAjaxJson(util.urlSeriesDetailed(novel.seriesId)).body
                    // novel.id = series.firstNovelId
                    // novel.aiType = novel.aiType
                }
                novel.textCount = novel.textLength
                novel.createDate = novel.createDateTime
                novel.updateDate = novel.updateDateTime
                novel.description = novel.caption
                novel.coverUrl = novel.cover.urls["480mw"] // 240mw, 480mw, 1200x1200, 128x128, original
            }

            novel.coverUrl = this.urlCoverUrl(novel.coverUrl)
            novel.detailedUrl = this.urlNovelDetailed(novel.id)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            const time1 = this.dateFormat(novel.createDate);
            const time2 = this.dateFormat(novel.updateDate);
            novel.description = `${novel.description}\n上传时间：${time1}\n更新时间：${time2}`
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${time1}\n更新：${time2}\n简介：${novel.description}`
            }
        })
        return novels
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function (novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            // 集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }
    // 从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, res = {}
            let isHtml = result.startsWith("<!DOCTYPE html>")
        if (isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                res = util.getAjaxJson(util.urlSeriesDetailed(id))
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    novelId = id
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.body !== undefined && res.body.firstNovelId !== undefined && res.body.firstNovelId !== null) {
            novelId = res.body.firstNovelId
        }
        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = util.getAjaxJson(util.urlNovelDetailed(novelId))
        }
        if (res.error || res.total === 0) {
            java.log(`无法从 Pixiv 获取当前小说`)
            return []
        }
        return res.body
    }

    u.dateFormat = function (str) {
        let addZero = function (num) {
            return num < 10 ? '0' + num : num;
        }
        let time = new Date(str);
        let Y = time.getFullYear() + "年";
        let M = addZero(time.getMonth() + 1) + "月";
        let D = addZero(time.getDate()) + "日";
        return Y + M + D;
    }
    u.timeTextFormat = function (text) {
        return `${text.slice(0, 10)} ${text.slice(11, 19)}`
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()

// 获取请求的user id方便其他ajax请求构造
let uid = java.getResponse().headers().get("x-userid")
if (uid != null) {
    cache.put("pixiv:uid", uid)
}
java.getStrResponse(null, null)