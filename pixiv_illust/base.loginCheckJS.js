var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}, settings = {}
    java.log(String(source.bookSourceComment).split("\n")[0]) // 输出书源信息
    java.log(`本地书源更新时间：${java.timeFormat(source.lastUpdateTime)}`) // 输出书源信息
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    if (settings !== null) {
        java.log("⚙️ 使用自定义设置")
    } else {
        settings = {}
        settings.SEARCH_ILLUSTS = true
        settings.SHOW_ORIGINAL_ILLUST_LINK = true
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
    u.SEARCH_ILLUSTS = settings.SEARCH_ILLUSTS  // 搜索插画
    u.SHOW_ORIGINAL_ILLUST_LINK = settings.SHOW_ORIGINAL_ILLUST_LINK  // 目录处显示小说源链接，但会增加请求次数
    u.DEBUG = settings.DEBUG // 调试模式

    if (u.DEBUG === true) {
        java.log(JSON.stringify(settings, null, 4))
        java.log(`DEBUG = ${u.DEBUG}`)
    }
    u.debugFunc = (func) => {
        if (util.DEBUG) {
            func()
        }
    }

    u.handIllusts = function (illusts) {
        illusts.forEach(illust => {
            // illust.id = illust.id
            // illust.title = illust.title
            // illust.userName = illust.userName
            // illust.tags = illust.tags
            if (!(illust.tags instanceof Array)) {
                illust.tags = illust.tags.tags.map(item => item.tag)
                illust.coverUrl = illust.url = illust.urls.regular  // 兼容正文搜索
                illust.updateDate = illust.uploadDate
            }
            illust.textCount = null
            // illust.pageCount = illust.pageCount
            // illust.description = illust.description
            illust.coverUrl = illust.url
            illust.detailedUrl = urlIllustDetailed(illust.id)
            // illust.createDate = illust.createDate
            // illust.updateDate = illust.updateDate
            // illust.aiType = illust.aiType

            if (illust.seriesNavData === undefined || illust.seriesNavData === null) {
                illust.latestChapter = illust.title
            } else {
                illust.seriesId = illust.seriesNavData.seriesId
                illust.title = illust.seriesNavData.title
            }

            if (illust.seriesId !== undefined) {
                let resp = getAjaxJson(urlSeriesDetailed(illust.seriesId)).body
                let series = resp.illustSeries.filter(item => item.id === illust.seriesId)[0]
                // illust.title = illust.title
                illust.tags = illust.tags.concat(series.tags)
                illust.latestChapter = resp.thumbnails.illust.filter(item => item.id === series.latestIllustId)[0].title
                illust.description = series.description
                if (series.url === undefined) {
                    let firstChapter = getAjaxJson(urlIllustDetailed(series.firstIllustId)).body
                    illust.coverUrl = firstChapter.urls.regular
                    illust.tags = illust.tags.concat(firstChapter.tags.tags.map(item => item.tag))
                }
                illust.createDate = series.createDate
                illust.updateDate = series.updateDate
                illust.total = series.total
            }
        })
        return illusts
    }

    u.formatIllusts = function (illusts) {
        illusts.forEach(illust => {
            illust.title = illust.title.replace(RegExp(/^\s+|\s+$/g), "")
            illust.tags = Array.from(new Set(illust.tags))
            illust.tags = illust.tags.join(",")
            illust.coverUrl = urlCoverUrl(illust.coverUrl)
            illust.createDate = dateFormat(illust.createDate)
            illust.updateDate = dateFormat(illust.updateDate)
            if (util.MORE_INFO_IN_DESCRIPTION) {
                illust.description = `\n书名：${illust.title}\n作者：${illust.userName}\n标签：${illust.tags}\n上传：${illust.createDate}\n更新：${illust.updateDate}\n简介：${illust.description}`
            } else {
                illust.description = `\n${illust.description}\n上传时间：${illust.createDate}\n更新时间：${illust.updateDate}`
            }
        })
        return illusts
    }

    u.getIllustRes = function (result) {
        let illustId = 0, res = {}
        let isJson = isJsonString(result)
        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (!isJson && isHtml) {
            let pattern1 = "(https?://)?(www\\.)?pixiv\\.net/(artworks|ajax/illust)/(\\d+)"
            let isIllust = baseUrl.match(new RegExp(pattern1))
            let pattern2 = "(https?://)?(www\\.)?pixiv\\.net/(user/\\d+|ajax)/series/(\\d+)"
            let isSeries = baseUrl.match(new RegExp(pattern2))

            if (isIllust) {
                illustId = isIllust[4]
            } else if (isSeries) {
                seriesId = isSeries[4]
                java.log(`匹配系列ID：${seriesId}`)
                illustId = getAjaxJson(urlSeriesDetailed(seriesId)).body.page.series.reverse()[0].workId
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (illustId) {
            java.log(`匹配插画ID：${illustId}`)
            res = getAjaxJson(urlIllustDetailed(illustId))
        }
        if (res.error) {
            java.log(`无法从 Pixiv 获取当前漫画`)
            java.log(JSON.stringify(res))
            return []
        }
        return res.body
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