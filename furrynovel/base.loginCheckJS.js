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
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
    u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
    u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
    u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
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

    u.urlNovelUrl = (novelId) => {
        return `https://furrynovel.com/zh/novel/${novelId}`
    }
    u.urlNovelDetail = (novelId) => {
        return `https://api.furrynovel.com/api/zh/novel/${novelId}`
    }
    u.urlNovelsDetail = (novelIds) => {
        return `https://api.furrynovel.com/api/zh/novel?${novelIds.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlNovelChapterInfo = (novelId) => {
        return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter`
    }
    u.urlNovelChapterDetail = (novelId, chapterId) => {
        return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter/${chapterId}`
    }
    u.urlCoverUrl = (pxImgUrl) => {
        return `https://img.furrynovel.com/?url=${pxImgUrl}`
    }

    u.urlLinpxNovelUrl = (novelId) => {
        return `https://furrynovel.ink/pixiv/novel/${novelId}/cache`
    }
    u.urlLinpxNovelDetail = (novelId) => {
        return `https://api.furrynovel.ink/pixiv/novel/${novelId}/cache`
    }
    u.urlLinpxCoverUrl = (pxImgUrl) => {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    }
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
    u.urlSourceUrl = (source, oneShot, id) => {
        if (source === "bilibili") {
            return `https://www.bilibili.com/read/readlist/rl${id}/`
        }
        if (source === "pixiv" && oneShot === true) {
            return `https://www.pixiv.net/novel/show.php?id=${id}`
        }
        if (source === "pixiv" && oneShot === false) {
            return `https://www.pixiv.net/novel/series/${id}`
        }
    }

    u.handNovels = function (novels) {
        novels.forEach(novel =>{
            // novel.id = novel.id
            novel.title = novel.name
            // novel.tags = novel.tags
            novel.userName = novel.author.name
            // novel.userId = novel.author.id
            novel.textCount = null
            novel.latestChapter = novel.latest_chapters[0].name
            novel.description = novel.desc
            novel.coverUrl = novel.cover
            novel.detailedUrl = util.urlNovelDetail(novel.id)

            // novel.source = novel.source
            novel.oneShot = novel.ext_data.oneShot
            novel.sourceId = novel.source_id
            novel.sourceUrl = util.urlSourceUrl(novel.source, novel.oneShot, novel.sourceId)

            novel.createDate = novel.created_at
            novel.updateDate = novel.updated_at
            novel.syncDate = novel.fetched_at
            // novel.status = novel.status
            if (novel.status !== "publish"){  // suspend
                java.log(util.urlNovelUrl(novel.id))
                java.log(novel.sourceUrl)
            }
        })
        return novels
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.tags = novel.tags.join(",")
            novel.createDate = util.dateFormat(novel.createDate)
            novel.updateDate = util.dateFormat(novel.updateDate)
            novel.syncDate = util.dateFormat(novel.syncDate)
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n
            同步时间：${novel.syncDate}`
            }
        })
        return novels
    }

    u.dateFormat = function(text) {
        return `${text.slice(0, 10)}`
    }
    u.timeTextFormat = function(text) {
        return `${text.slice(0, 10)} ${text.slice(11, 19)}`
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
java.getStrResponse(null, null)