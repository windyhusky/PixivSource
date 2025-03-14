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
        settings.SHOW_ORIGINAL_ILLUST_LINK = true
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
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
                illust.coverUrl = illust.url = illust.urls.regular
                illust.updateDate = illust.uploadDate

                if (illust.seriesNavData !== null){
                    illust.series = {}
                    illust.series.id = illust.seriesNavData.seriesId
                    illust.series.title = illust.seriesNavData.title
                    // illust.illustId = illusts.id
                    // illust.seriesId = illust.id
                    // illust.id = illust.series.id
                    // illust.title = illusts.series.title
                } else {
                    illust.latestChapter = illust.title
                }
            }
            illust.textCount = null
            // illust.pageCount = illust.pageCount
            // illust.description = illust.description
            illust.coverUrl = illust.url
            illust.detailedUrl = urlIllustDetailed(illust.id)

            // illust.createDate = illust.createDate
            // illust.updateDate = illust.updateDate
            // illust.aiType = illust.aiType
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
        let seriesId = 0, res = {}
        let isJson = isJsonString(result)
        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net/(artworks|ajax/illust)/\\d+"
            let isIllust = baseUrl.match(new RegExp(pattern))
            if (isIllust) {
                java.log(`匹配插画ID：${id}`)
                res = getAjaxJson(urlIllustDetailed(id))
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.body !== undefined && res.body.seriesNavData !== null) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = getAjaxJson(urlSeriesDetailed(seriesId))
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