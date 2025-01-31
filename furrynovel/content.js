@js:
var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function getContent(res) {
    let content = res.content
    // 获取 [uploadedimage:] 的图片链接
    let hasEmbeddedImages = content.match(RegExp(/\[uploadedimage:(\d+)-?(\d+)]/gm))
    if (hasEmbeddedImages) {
        resp = JSON.parse(java.ajax(util.urlLinpxNovelDetail(res.source_id)))
        Object.keys(resp.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${util.urlLinpxCoverUrl(resp.images[key].origin)}">`)
        })
    }

    // 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
    let matched = content.match(RegExp(/\[pixivimage:(\d+)-?(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let illustId, order
            let matched2 = matched[i].match(RegExp("(\\d+)-?(\\d+)"))
            let temp = matched2[0].split("-")
            illustId = temp[0]
            if (temp.length >= 2) {
                order = temp[1]
            }
            content = content.replace(`${matched[i]}`, `<img src="${util.urlIllustOriginal(illustId, order)}">`)
        }
    }

    // 替换 Pixiv 分页标记符号 [newpage]
    matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
    if (matched) {
        for (let i in matched){
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

            if (!util.REPLACE_BOOK_TITLE_MARKS) {
                // 默认替换成（括号）
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            } else {
                var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
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
    return content
}

function getNovelRes(result){
    let chapterId = 0, res = {}
    let isHtml = result.startsWith("<!DOCTYPE html>")
    let pattern = "(https?://)?(www\\.)?furrynovel\\.com/(zh|en|ja)/novel/\\d+(/chapter/\\d+)?"
    let fnWebpage = baseUrl.match(new RegExp(pattern))
    if (isHtml && fnWebpage) {
        let novelId = baseUrl.match(RegExp(/\/(\d+)\/chapter/))[1]
        try {
            chapterId = baseUrl.match(RegExp(/\/(\d+)\/chapter\/(\d+)/))[2]
        } catch (e) {
            chapterId = util.getAjaxJson(util.urlNovelChapterInfo(novelId)).data[0].id
        } finally {
            res = util.getAjaxJson(util.urlNovelChapterDetail(novelId, chapterId))
        }
    } else {
        res = JSON.parse(result)
    }
    if (res.data.length === 0) {
        java.log(`无法从 FurryNovel.com 获取当前小说`)
        java.log(JSON.stringify(res))
    }
    return res.data
}

(function () {
    return getContent(getNovelRes(result))
})()