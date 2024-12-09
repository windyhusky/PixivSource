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

(() => {
    // 获取网址id，请求并解析数据，调试用
    var novelId = 0, res = ""
    let isHtml = result.startsWith("<!DOCTYPE html>")
    if (isHtml) {
        let isSeries = baseUrl.match(new RegExp("pixiv(\\.net|)/(ajax/)?(novel/)?series/\\d+"))
        if (isSeries) {
            let seriesId = baseUrl.match(new RegExp("\\d+"))[0]
            novelId = util.getAjaxJson(util.urlSeriesDetailed(seriesId)).body.firstNovelId
            java.log(`系列ID：${seriesId}`)
        } else {
            let isNovel = baseUrl.match(new RegExp("pn|pixiv(\\.net)?/(ajax/)?novel"))
            if (isNovel) {
                novelId = baseUrl.match(new RegExp("\\d+"))[0]
            }
        }
        java.log(`正文：匹配小说ID：${novelId}`)
        res = util.getAjaxJson(util.urlNovelDetailed(novelId)).body

    } else {
        res = JSON.parse(result).body
        if (res.total === 0) {
            return []
        }
    }

    let content = res.content
    // 在正文内部添加小说描述
    if (res.seriesNavData !== undefined && res.seriesNavData !== null && res.description !== "") {
        content = res.description + "\n" + "——————————\n".repeat(2) + content
    }

    // 获取 [uploadedimage:] 的图片链接
    let hasEmbeddedImages = res.textEmbeddedImages !== undefined && res.textEmbeddedImages !== null
    if (hasEmbeddedImages) {
        Object.keys(res.textEmbeddedImages).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${res.textEmbeddedImages[key].urls.original}">`)
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
            java.log(matched[i])
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

            if (util.REPLACE_WITH_BOOK_TITLE_MARKS === true) {
                // 默认替换成（括号）
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            } else {
                var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if (reg.test(kana)) {
                    // kana为中文，则替换回《书名号》
                    content = content.replace(`${matchedText}`, `${kanji}《${kana}》`)
                } else{
                    // 阅读不支持 <ruby> <rt> 注音
                    // content = content.replace(`${matchedText}`, `<ruby>${kanji}<rt>${kana}</rt></ruby>`)
                    content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
                }
            }
        }
    }

    return content
})()
