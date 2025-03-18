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

    // 处理 novels 列表
    u.handNovels = function (novels){
        novels.forEach(novel => {
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            // novel.tags = novel.tags
            if (novel.tags === undefined) {
                novel.tags = []
            }
            // 兼容详情页
            if (novel.content !== undefined) {
                if (novel.series !== undefined && novel.series !== null) {
                    novel.seriesId = novel.series.id
                    novel.seriesTitle = novel.series.title
                }
                novel.textCount = novel.length = novel.content.length
            }
            if (novel.seriesId === undefined || novel.seriesId === null) {
                novel.tags.unshift("单本")
                novel.textCount = novel.length
                novel.latestChapter = novel.title
                novel.description = novel.desc
                // novel.coverUrl = novel.coverUrl
                novel.detailedUrl = urlNovelDetailed(novel.id)
            } else {
                java.log(`正在获取系列小说：${novel.seriesId}`)
                let series = getAjaxJson(urlSeriesDetailed(novel.seriesId))
                novel.id = series.novels[0].id
                novel.title = series.title
                novel.tags = novel.tags.concat(series.tags)
                novel.tags.unshift("长篇")
                novel.textCount = null  // 无数据
                novel.createDate = null  // 无数据
                novel.latestChapter = series.novels.reverse()[0].title
                novel.description = series.caption
                // 后端目前没有系列的 coverUrl 字段
                // novel.coverUrl = series.coverUrl
                novel.coverUrl = series.novels[0].coverUrl
                novel.detailedUrl = urlNovelDetailed(novel.id)

                let firstNovel = getAjaxJson(urlNovelDetailed(novel.id))
                novel.tags = novel.tags.concat(firstNovel.tags)
                novel.tags = Array.from(new Set(novel.tags))
                novel.createDate = firstNovel.createDate
                if (novel.description === "") {
                    novel.description = firstNovel[0].desc
                }
            }
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.createDate = dateFormat(novel.createDate);

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
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
            }
        })
        return novels
    }

    // 从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, res = {}
        let isJson = isJsonString(result)
        let isHtml = result.startsWith("<!DOCTYPE html>")
        // 兼容搜索直接输入链接
        pattern = "(https?://)?(api\\.|www\\.)?((furrynovel\\.(ink|xyz))|pixiv\\.net)(/ajax)?/(pn|(pixiv/)?novel)/(show\\.php\\?id=|series/)?\\d+(/cache)?"
        // pattern = String(bookSourceUrl).replace(".*", "")
        if (!isJson && !isHtml && result.match(new RegExp(pattern))) {
            baseUrl = result.match(RegExp(pattern))[0]
            java.log(`匹配链接：${baseUrl}`)
        }

        let id = baseUrl.match(new RegExp("\\d+"))[0]
        let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
        let isSeries = baseUrl.match(new RegExp(pattern))
        if (isSeries) {
            java.log(`系列ID：${id}`)
            res = getAjaxJson(urlSeriesDetailed(id))
        } else {
            let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
            let isNovel = baseUrl.match(new RegExp(pattern))
            if (isNovel) {
                novelId = id
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.total !== undefined && res.total !== null) {
            novelId = res.novels[0].id
        }
        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = getAjaxJson(urlNovelDetailed(novelId))
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
        let isJson = isJsonString(result)
        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (!isJson && isHtml) {
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
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.series !== undefined && res.series !== null) {
            seriesId = res.series.id
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = getAjaxJson(urlSeriesDetailed(seriesId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
java.getStrResponse(null, null)