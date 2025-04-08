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
        settings.CONVERT_CHINESE_CHARACTERS = true
        settings.SHOW_ORIGINAL_NOVEL_LINK = true
        settings.REPLACE_BOOK_TITLE_MARKS = true
        settings.MORE_INFO_IN_DESCRIPTION = false
        // settings.SHOW_NOVEL_CAPTIONS = true    //无数据
        settings.SHOW_NOVEL_COMMENTS = true
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    }
    u.CONVERT_CHINESE_CHARACTERS = settings.CONVERT_CHINESE_CHARACTERS  // 搜索：搜索时进行繁简转换
    u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
    u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
    u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
    // u.SHOW_NOVEL_CAPTIONS = settings.SHOW_NOVEL_CAPTIONS  // 章首显示描述  //无数据
    u.SHOW_NOVEL_COMMENTS = settings.SHOW_NOVEL_COMMENTS  // 章尾显示评论
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

    u.getNovels = function () {
        if (JSON.parse(result).code === 200 && JSON.parse(result).count > 0) {
            return JSON.parse(result).data
        } else {
            return []
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
            if (novel.latest_chapters === undefined) {
                novel.latestChapter = null
                novel.detailedUrl = urlNovelDetail(novel.id)
            } else {
                novel.latestChapter = novel.latest_chapters[0].name
                novel.detailedUrl = urlNovelUrl(novel.id)
            }
            novel.description = novel.desc
            novel.coverUrl = novel.cover

            // novel.source = novel.source
            novel.oneShot = novel.ext_data.oneShot
            novel.sourceId = novel.source_id
            novel.sourceUrl = urlSourceUrl(novel.source, novel.oneShot, novel.sourceId)

            novel.createDate = novel.created_at
            novel.updateDate = novel.updated_at
            novel.syncDate = novel.fetched_at
            // novel.status = novel.status
            // if (novel.status !== "publish") {  // suspend
            //     java.log(urlNovelUrl(novel.id))
            //     java.log(novel.sourceUrl)
            // }
        })
        return novels
    }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
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
            novel.tags = Array.from(new Set(novel.tags2))
            novel.tags = novel.tags.join(",")
            novel.createDate = dateFormat(novel.createDate)
            novel.updateDate = dateFormat(novel.updateDate)
            novel.syncDate = dateFormat(novel.syncDate)
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n同步时间：${novel.syncDate}`
            }
        })
        return novels
    }

    u.getNovelRes = function (result, type) {
        let res = {data: []}, chapterId = 0
        let isHtml = result.startsWith("<!DOCTYPE html>")
        let pattern = "(https?://)?(www\\.)?furrynovel\\.com/(zh|en|ja)/novel/\\d+(/chapter/d+)?"
        let fnWebpage = baseUrl.match(new RegExp(pattern))

        if (isHtml && fnWebpage) {
            let novelId = baseUrl.match(new RegExp("\\d+"))[0]
            if (type === "detail") {
                res = getAjaxJson(urlNovelDetail(novelId))
            } else if (type === "catalog") {
                res = getAjaxJson(urlNovelChapterInfo(novelId))
            } else if (type === "content") {
                try {
                    chapterId = baseUrl.match(RegExp(/\/(\d+)\/chapter\/(\d+)/))[2]
                } catch (e) {
                    chapterId = getAjaxJson(urlNovelChapterInfo(novelId)).data[0].id
                } finally {
                    res = getAjaxJson(urlNovelChapterDetail(novelId, chapterId))
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.data.length === 0) {
            java.log(`无法从 FurryNovel 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.data
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
java.getStrResponse(null, null)