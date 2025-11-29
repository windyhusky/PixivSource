var util = objParse(String(java.get("util")))
let emoji = {
    "normal": 101, "surprise": 102, "series": 103, "heaven": 104, "happy": 105,
    "excited": 106, "sing": 107, "cry": 108, "normal2": 201, "shame2": 202,
    "love2": 203, "interesting2": 204, "blush2": 205, "fire2": 206, "angry2": 207,
    "shine2": 208, "panic2": 209, "normal3": 301, "satisfaction3": 302, "surprise3": 303,
    "smile3": 304, "shock3": 305, "gaze3": 306, "wink3": 307, "happy3": 308,
    "excited3": 309, "love3": 310, "normal4": 401, "surprise4": 402, "series4": 403,
    "love4": 404, "shine4": 405, "sweet4": 406, "shame4": 407, "sleep4": 408,
    "heart": 501, "teardrop": 502, "star": 503
}

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function getNovelInfo(res) {
    // 放入小说信息以便登陆界面使用
    let novel = source.getLoginInfoMap()
    if (novel === undefined) novel = JSON.parse(cache.get("novel"))
    if (res && res.error === true) return
    novel.id = Number(res.id)
    novel.title = res.title
    novel.userId = res.userId
    novel.userName = res.userName

    if (res.bookmarkData) {
        novel.isBookmark = true
        cache.put(`collect${novel.id}`, res.bookmarkData.id)
        util.saveNovels("likeNovels", [Number(novel.id)])
    } else {
        novel.isBookmark = false
    }

    if (res.seriesNavData) {
        novel.seriesId = Number(res.seriesNavData.seriesId)
        novel.seriesTitle = res.seriesNavData.title
        novel.isWatched = res.seriesNavData.isWatched
        util.saveNovels("watchedSeries", [Number(novel.seriesId)])
    } else {
        novel.seriesId = null
        novel.seriesTitle = ""
        novel.isWatched = false
    }

    // 系列 + 阅读，使用当前章节名称
    if (novel.seriesId && util.environment.IS_LEGADO) {
        let novelIds = JSON.parse(cache.get(`novelIds${novel.seriesId}`))
        novel.id = novelIds[book.durChapterIndex]
        novel["章节名称"] = novel.title = book.durChapterTitle
        let bookmarkId = JSON.parse(cache.get(`collect${novel.id}`))
        novel.isBookmark = !!bookmarkId
    }

    // 添加投票信息
    if (res.pollData) novel.pollChoicesCount = res.pollData.choices.length
    else novel.pollChoicesCount = 0
    source.putLoginInfo(JSON.stringify(novel))
    cache.put("novel", JSON.stringify(novel))
}

function getContent(res) {
    getNovelInfo(res)  // 放入信息以便登陆界面使用
    let content = String(res.content)
    // let content = "undefined"
    if (content.includes("undefined")) {
        return checkContent()
    }

    // 在正文内部添加小说描述
    if (util.settings.SHOW_CAPTIONS && res.description !== "") {
        content = res.description + "\n" + "——————————\n".repeat(2) + content
    }

    // 获取 [uploadedimage:] 的图片链接
    if (res.textEmbeddedImages) {
        Object.keys(res.textEmbeddedImages).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${urlCoverUrl(res.textEmbeddedImages[key].urls.original)}">`)
        })
    }

    // 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
    let matched = content.match(RegExp(/\[pixivimage:(\d+)-?(\d+)]/gm))
    if (matched) {
        matched.forEach(pixivimage => {
            let matched2, illustId, order = 0
            if (pixivimage.includes("-")) {
                matched2 = pixivimage.match(RegExp("(\\d+)-(\\d+)"))
                illustId = matched2[1]; order = matched2[2]
            } else {
                matched2 = pixivimage.match(RegExp("\\d+"))
                illustId = matched2[0];
            }
            if (urlIllustOriginal(illustId, order)) {
                content = content.replace(`${pixivimage}`, `<img src="${urlIllustOriginal(illustId, order)}">`)
            } else {
                content = content.replace(`${pixivimage}`, ``)
            }
        })
    }

    // 替换 Pixiv 分页标记符号 [newpage]
    matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
    if (matched) {
        for (let i in matched) {
            content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
        }
    }

    // 替换 Pixiv 章节标记符号 [chapter:]
    matched = content.match(RegExp(/\[chapter:(.*?)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*?)]/m)
            let chapter = matched2[1].trim()
            content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
        }
    }

    // 替换 Pixiv 跳转页面标记符号 [[jump:]]
    matched = content.match(RegExp(/\[jump:(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }

    // 替换 Pixiv 链接标记符号 [[jumpuri: > ]]
    matched = content.match(RegExp(/\[\[jumpuri:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()
            // 阅读不支持超链接
            //content = content.replace(`${matchedText}`, `<a href=${urlLink}>${urlName}</a>`)
            if (urlLink === urlName) {
                content = content.replace(`${matchedText}`, `${urlName}`)
            } else {
                content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
            }
        }
    }

    // 替换 Pixiv 注音标记符号 [[rb: > ]]
    matched = content.match(RegExp(/\[\[rb:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()

            if (!util.settings.REPLACE_TITLE_MARKS) {
                // 默认替换成（括号）
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            } else {
                let reg = RegExp("[\\u4E00-\\u9FFF]+", "g");
                if (reg.test(kana)) {
                    // kana为中文，则替换回《书名号》
                    content = content.replace(`${matchedText}`, `${kanji}《${kana}》`)
                } else {
                    // 阅读不支持 <ruby> <rt> 注音
                    // content = content.replace(`${matchedText}`, `<ruby>${kanji}<rt>${kana}</rt></ruby>`)
                    content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
                }
            }
        }
    }

    // 添加投票
    if (res.pollData) {
        let poll = `📃 投票(✅${res.pollData.total}已投)：\n${res.pollData.question}\n`
        res.pollData.choices.forEach(choice => {
            poll += `选项${choice.id}：${choice.text}(✅${choice.count})\n`
        })
        content += "\n" + "——————————\n".repeat(2) + poll
    }

    // 添加评论
    if (util.settings.SHOW_COMMENTS) {
        return content + getComment(res)
    } else {
        return content
    }
}

function getComment(res) {
    // let resp = getAjaxJson(urlIP(urlNovelComments(res.id, 0, res.commentCount)), true)
    const limit = 50  // 模拟 Pixiv 请求
    let resp = {"error": false, "message": "", "body": {comments:[]} }
    let maxPage = (res.commentCount / limit) + 1
    for (let i = 0; i < maxPage; i++) {
        let result = getAjaxJson(urlIP(urlNovelComments(res.id, i*limit, 50)), true)
        if (result.error !== true && result.body.comments !== null) {
            resp.body.comments = resp.body.comments.concat(result.body.comments)
        }
    }

    // 刷新时，刷新评论，不更新正文
    let commentCount = resp.body.comments.length
    java.log(`【${res.title}】(${res.id})，共有${commentCount}条评论，${res.commentCount - commentCount}条回复`)
    if (commentCount === 0) {
        return ""
    }

    let comments = `💬 评论(共计${commentCount}条)：\n`
    resp.body.comments.forEach(comment => {
        if (comment.comment === "") {
            comment.comment = `<img src="${urlStampUrl(comment.stampId)}">`
        }
        if (Object.keys(emoji).includes(comment.comment.slice(1, -1))) {
            comment.emojiId = emoji[comment.comment.slice(1, -1)]
            comment.comment = `<img src="${urlEmojiUrl(comment.emojiId)}">`
        }
        if (comment.userId === String(cache.get("pixiv:uid"))) {
            comments += `@${comment.userName}：${comment.comment}(${comment.commentDate})(${comment.id})\n`
        } else {
            comments += `@${comment.userName}：${comment.comment}(${comment.commentDate})\n`
        }

        // 获取评论回复
        if (comment.hasReplies === true) {
            let resp = getAjaxJson(urlIP(urlNovelCommentsReply(comment.id, 1)), true)
            if (resp.error === true) return comments

            resp.body.comments.reverse().forEach(reply => {
                if (reply.comment === "") {
                    reply.comment = `<img src="${urlStampUrl(reply.stampId)}">`
                }
                if (Object.keys(emoji).includes(reply.comment.slice(1, -1))) {
                    reply.emojiId = emoji[reply.comment.slice(1, -1)]
                    reply.comment = `<img src="${urlEmojiUrl(reply.emojiId)}">`
                }
                if (comment.userId === String(cache.get("pixiv:uid"))) {
                    comments += `@${reply.userName}(⤴️@${reply.replyToUserName})：${reply.comment}(${reply.commentDate})(${reply.id})\n`
                } else {
                    comments += `@${reply.userName}(⤴️@${reply.replyToUserName})：${reply.comment}(${reply.commentDate})\n`
                }
            })
            comments += "——————————\n"
        }
    })
    if (comments) {
        comments = "\n" + "——————————\n".repeat(2) + comments
    }
    return comments
}

function checkContent() {
    let latestMsg = getAjaxJson(urlMessageThreadLatest(5))
    if (latestMsg.error === true) {
        java.log(JSON.stringify(latestMsg))

    } else if (latestMsg.body.total >= 1) {
        let msg = latestMsg.body.message_threads.filter(item => item.thread_name === "pixiv事務局")[0]
        if (msg === undefined) {
            sleepToast(`您于 ${java.timeFormat(new Date().getTime())} 触发 Pixiv 【请求限制】，建议稍候/重新登录再继续`, 3)
            // java.startBrowser("https://www.pixiv.net", '退出登录')
            // java.startBrowser("https://www.pixiv.net/logout.php",'退出登录')  // 不清除 WebView 缓存无法重新登录

        } else if (new Date().getTime()- 1000*msg.modified_at <= 3*24*60*60*1000) { // 3*24h内提醒
            sleepToast(`您于 ${java.timeFormat(1000*msg.modified_at)} 触发 Pixiv 【过度访问】，请修改密码并重新登录`, 3)
            sleepToast(`${msg.latest_content}`, 5)
            java.startBrowser("https://accounts.pixiv.net/password/change",'修改密码')
        }
    }
}

(() => {
    return getContent(util.getNovelResFirst(result))
})()