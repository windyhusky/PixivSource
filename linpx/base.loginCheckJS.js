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
    let input =  String(source.getVariable())  // [object JavaObject]
    var settings = {}
    try {
        if (input != "debug" && input != "" && input != null) {
            settings = JSON.parse(input.split("//")[0])
            java.log("使用自定义设置")
        } else {
            settings = JSON.parse(String(source.variableComment).split("//")[0])
            java.log("自定义设置为空，使用默认设置")
        }
    } catch (e) {
        settings = JSON.parse(String(source.variableComment).split("//")[0])
        java.log("自定义设置有误，使用默认设置")
    } finally {
        u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
        u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
        u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
        u.DEBUG = settings.DEBUG // 调试模式
    }

    if (input === "debug") {
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
    u.getWebviewJson = (url) => {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
        })
    }

    u.urlNovelUrl = (id) => {
        return `https://furrynovel.ink/pixiv/novel/${id}/cache`
    }
    u.urlNovelDetailed = (id) => {
        return `https://api.furrynovel.ink/pixiv/novel/${id}/cache`
    }
    u.urlNovelsDetailed = (nidList) => {
        return `https://api.furrynovel.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlNovelComments = (novelId) => {
        return `https://api.furrynovel.ink/pixiv/novel/${novelId}/comments`
    }
    u.urlNovel = (novelId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlNovelUrl(novelId)
        } else {
            return util.urlNovelDetailed(novelId)
        }
    }

    // u.urlSeriesUrl = function (id) {
    //     return `https://furrynovel.ink/pixiv/series/${id}/cache`
    // }
    u.urlSeriesUrl = (seriesId) => {
        return `https://www.pixiv.net/novel/series/${seriesId}`
    }
    u.urlSeriesDetailed = (id) => {
        return `https://api.furrynovel.ink/pixiv/series/${id}/cache`
    }

    u.urlUserUrl = (id) => {
        return `https://furrynovel.ink/pixiv/user/${id}/cache`
    }
    u.urlUserDetailed = (id) => {
        return `https://api.furrynovel.ink/pixiv/user/${id}/cache`
    }
    u.urlUsersDetailed = (nidList) => {
        return `https://api.furrynovel.ink/pixiv/users/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
    }

    u.urlSearchNovel = (novelname) => {
        return `https://api.furrynovel.ink/pixiv/search/novel/${novelname}/cache`
    }
    u.urlSearchUsers = (username) => {
        return `https://api.furrynovel.ink/pixiv/search/user/${username}/cache`
    }

    u.urlCoverUrl = (pxImgUrl) => {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    }
    // u.urlIllustUrl = function (illustId) {
    //     return `https://www.pixiv.net/artworks/${illustId}`
    // }
    u.urlIllustOriginal = (illustId, order) => {
        // 使用 pixiv.cat 获取插图
        let illustOriginal = `https://pixiv.re/${illustId}.png`
        // let illustOriginal = `https://pixiv.nl/${illustId}.png`
        if (order >= 1) {
            illustOriginal = `https://pixiv.re/${illustId}-${order}.png`
            // illustOriginal = `https://pixiv.nl/${illustId}-${order}.png`
        }
        return illustOriginal
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            // novel.createDate = novel.createDate
            novel.textCount = novel.length
            novel.description = novel.desc
            novel.detailedUrl = util.urlNovelDetailed(novel.id)
            if (novel.seriesId !== undefined && novel.seriesId !== null) {
                novel.title = novel.seriesTitle
                novel.length = null

                java.log(`正在获取系列小说：${novel.seriesId}`)
                let series = util.getAjaxJson(util.urlSeriesDetailed(novel.seriesId))
                // 后端目前没有系列的coverUrl字段
                // novel.coverUrl = util.urlCoverUrl(series.coverUrl)
                novel.coverUrl = util.urlCoverUrl(series.novels[0].coverUrl)

                if (series.caption === "") {
                    let firstNovels = util.getAjaxJson(util.urlNovelsDetailed([series.novels[0].id]))
                    if (firstNovels.length > 0) {
                        novel.description = firstNovels[0].desc
                    } else {
                        novel.description = "该小说可能部分章节因为权限或者被删除无法查看"
                    }
                } else {
                    novel.description = series.caption
                }

                //如果没有标签 取第一章的tag
                if (series.tags.length === 0) {
                    // 系列至少会有一章
                    novel.tags = series.novels[0].tags
                } else {
                    novel.tags = series.tags
                }

                if (novel.tags === undefined) {
                    novel.tags = []
                }
                novel.tags.unshift("长篇")


            } else {
                if (novel.tags === undefined) {
                    novel.tags = []
                }
                novel.tags.unshift("单本")
                novel.coverUrl = util.urlCoverUrl(novel.coverUrl)
            }

            novel.tags = novel.tags.join(",")
            novel.createDate = util.dateFormat(novel.createDate)
            // novel.description = `${novel.description}\n更新时间：${novel.time}`
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
            }
        })
        return novels
    }
    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书，需要判断是否为 null
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            //集合中没有该系列解析为一本书
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
        if (res.total !== undefined && res.total !== null) {
            novelId = res.novels[0].id
        }
        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = util.getAjaxJson(util.urlNovelDetailed(novelId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
    }
    // 从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function (result) {
        let seriesId = 0, res = {}
        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                seriesId = id
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    java.log(`匹配小说ID：${id}`)
                    res = util.getAjaxJson(util.urlNovelDetailed(id))
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.series !== undefined && res.series !== null) {
            seriesId = res.series.id
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = util.getAjaxJson(util.urlSeriesDetailed(seriesId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
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
        if (text === undefined) {
            return ""
        }
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