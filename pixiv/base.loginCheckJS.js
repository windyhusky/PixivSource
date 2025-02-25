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
    java.log(`手动更新时间：${java.timeFormat(source.lastUpdateTime)}`) // 输出书源信息
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    if (settings !== null) {
        java.log("⚙️ 使用自定义设置")
    } else {
        settings = {}
        settings.SHOW_ORIGINAL_NOVEL_LINK = true
        settings.REPLACE_BOOK_TITLE_MARKS = true
        settings.MORE_INFO_IN_DESCRIPTION = false
        settings.SHOW_NOVEL_CAPTIONS = true
        settings.SHOW_NOVEL_COMMENTS = true
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
    u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
    u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
    u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
    u.SHOW_NOVEL_CAPTIONS = settings.SHOW_NOVEL_CAPTIONS  // 书籍简介显示更多信息
    u.SHOW_NOVEL_COMMENTS = settings.SHOW_NOVEL_COMMENTS  // 书籍简介显示更多信息
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

    // 处理 novels 列表
    u.handNovels = function (novels) {
        novels.forEach(novel => {
            // 处理正文 tag
            if (!(novel.tags instanceof Array)) {
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.updateDate = novel.uploadDate
                if (novel.seriesNavData !== null){
                    novel.seriesId = novel.seriesNavData.seriesId
                }
            }
            if (novel.tags === undefined || novel.tags === null) {
                novel.tags = []
            }
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            if (novel.isOneshot !== undefined) { // 搜索系列
                if (novel.isOneshot === true) {
                    novel.seriesId = undefined
                    novel.id = novel.novelId  // 获取真正的 novelId
                } else {  //系列
                    novel.seriesId = novel.id  // 获取系列小说id
                    // novel.id = novel.latestEpisodeId  // 最近一篇
                }
                novel.textCount = novel.textLength
                novel.description = novel.caption
                try {
                    novel.coverUrl = novel.cover.urls["480mw"]
                } catch (e) { // 可能 novel.cover === null
                    novel.coverUrl = ""
                }
                if (novel.createDate === undefined) {  // 兼容搜索作者获取获取系列小说
                    novel.createDate = novel.createDateTime
                    novel.updateDate = novel.updateDateTime
                }

            } else {  // 搜索作者，发现排行榜
                // novel.textCount = novel.textCount
                // novel.description = novel.description
                if (novel.coverUrl === undefined) {  // 兼容发现排行榜
                    novel.coverUrl = novel.url
                }
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
            }

            if (novel.seriesId === undefined || novel.seriesId === null) {  // 单篇
                novel.tags.unshift("单本")
                novel.latestChapter = novel.title
                novel.detailedUrl = urlNovelDetailed(novel.id)
            } else { // 系列
                // novel.seriesId = novel.seriesId
                let series = getAjaxJson(urlSeriesDetailed(novel.seriesId)).body
                novel.id = series.firstNovelId
                novel.title = series.title
                // novel.userName = novel.userName
                novel.tags = series.tags
                novel.textCount = series.publishedTotalCharacterCount
                // novel.lastChapter = getAjaxJson(urlNovelDetailed(series.lastNovelId)).body.title
                novel.description = series.caption
                novel.coverUrl = series.cover.urls["480mw"]
                novel.detailedUrl = urlSeriesDetailed(novel.seriesId)

                // 发送请求获取第一章 获取标签与简介
                let firstNovel = {}
                try {
                    firstNovel = getAjaxJson(urlNovelDetailed(series.firstNovelId)).body
                    novel.tags = novel.tags.concat(firstNovel.tags.tags.map(item => item.tag))
                } catch (e) {  // 防止系列首篇无权限获取
                    try {
                        firstNovel = getAjaxJson(urlSeriesNovels(novel.seriesId, 30, 0)).body.thumbnails.novel[0]
                        novel.id = novel.firstNovelId = firstNovel.id
                        novel.tags = novel.tags.concat(firstNovel.tags)
                    } catch (e) { // 防止系列首篇无权限获取
                        firstNovel = {}
                        firstNovel.description = ""
                    }
                }
                novel.tags.unshift("长篇")
                novel.tags = Array.from(new Set(novel.tags))
                if (novel.description === "") {
                    novel.description = firstNovel.description
                }
            }
        })
        util.debugFunc(() => {
            java.log(`处理小说完成`)
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = dateFormat(novel.createDate);
            novel.updateDate = dateFormat(novel.updateDate);

            novel.tags2 = []
            for (let i in novel.tags) {
                let tag = novel.tags[i]
                if (tag.includes("/")) {
                    let tags = tag.split("/")
                    novel.tags2 = novel.tags2.concat(tags)
                } else {
                    novel.tags2.push(tag)
                }
            }
            novel.tags = novel.tags2.join(",")
            
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}`
            }
        })
        return novels
    }

    // 正文，搜索：从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, seriesId = 0, res = {}
        // 兼容搜索直接输入链接
        pattern = "(https?://)?(api\\.|www\\.)?((furrynovel\\.(ink|xyz))|pixiv\\.net)(/ajax)?/(pn|(pixiv/)?novel)/(show\\.php\\?id=|series/)?\\d+(/cache)?"
        // pattern = String(bookSourceUrl).replace(".*", "")
        if (RegExp(pattern).test(result) && !(result.startsWith("<!DOCTYPE html>"))) {
            baseUrl = result.match(RegExp(pattern))[0]
            result = "<!DOCTYPE html>"
            java.log(`匹配链接：${baseUrl}`)
        }

        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                seriesId = id
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    res = getAjaxJson(urlNovelDetailed(id))
                    novelId = id
                }
            }
        } else {
            res = JSON.parse(result)
        }

        if (res.body !== undefined && res.body.firstNovelId !== undefined && res.body.firstNovelId !== null) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {  // 防止系列首篇无权限获取
            res = getAjaxJson(urlSeriesNovels(seriesId, 30, 0))
            res.body = res.body.thumbnails.novel[0]
            novelId = res.body.id
        }
        java.log(`匹配小说ID：${novelId}`)
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
            return {}
        }
        return res.body
    }

    // 详情、目录：从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function (result) {
        let seriesId = 0, res = {}
        // 兼容详情，添加网址直接输入链接
        // pixiv 默认分享信息中有 # 号，不会被识别成链接，无法使用添加网址
        // baseUrl = baseUrl.replace("#", "%23")
        pattern = "(https?://)?(api\\.|www\\.)?((furrynovel\\.(ink|xyz))|pixiv\\.net)(/ajax)?/(pn|(pixiv/)?novel)/(show\\.php\\?id=|series/)?\\d+(/cache)?"
        // pattern = String(bookSourceUrl).replace(".*", "")
        if (!(result.startsWith("<!DOCTYPE html>")) && JSON.parse(result).error === true && RegExp(pattern).test(baseUrl)) {
            baseUrl = baseUrl.match(RegExp(pattern))[0]
            result = "<!DOCTYPE html>"
            java.log(`匹配链接：${baseUrl}`)
        }

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
                    res = getAjaxJson(urlNovelDetailed(id))
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.body !== undefined && res.body.seriesNavData !== undefined && res.body.seriesNavData !== null) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = getAjaxJson(urlSeriesDetailed(seriesId))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
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