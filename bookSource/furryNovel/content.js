var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function replaceUploadedImage(res, content) {
    // 获取 [uploadedimage:] 的图片链接
    let hasEmbeddedImages = content.match(RegExp(/\[uploadedimage:(\d+)-?(\d+)]/gm))
    if (hasEmbeddedImages) {
        resp = getAjaxJson(urlLinpxNovelDetail(res.source_id))
        Object.keys(resp.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${urlLinpxCoverUrl(resp.images[key].origin)}">`)
        })
    }
    return content
}
function replacePixivImage(content) {
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
    return content
}
function replaceNewPage(content) {
    // 替换 Pixiv 分页标记符号 [newpage]
    let matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
    if (matched) {
        for (let i in matched) {
            content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
        }
    }
    return content
}
function replaceChapter(content) {
    // 替换 Pixiv 章节标记符号 [chapter:]
    let matched = content.match(RegExp(/\[chapter:(.*?)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*?)]/m)
            let chapter = matched2[1].trim()
            content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
        }
    }
    return content
}
function replaceJumpPage(content) {
    // 替换 Pixiv 跳转页面标记符号 [[jump:]]
    let matched = content.match(RegExp(/\[jump:(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }
    return content
}
function replaceJumpUrl(content) {
    // 替换 Pixiv 链接标记符号 [[jumpuri: > ]]
    let matched = content.match(RegExp(/\[\[jumpuri:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()

            // if (util.environment.IS_LEGADO) {
            //     content = content.replace(`${matchedText}`, `<a href=${urlLink}> ${urlName}</a>`)
            // } else {
            if (urlLink === urlName) {
                content = content.replace(`${matchedText}`, `${urlName}`)
            } else {
                content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
            }
            // }
        }
    }
    return content
}
function replaceRb(content) {
    // 替换 Pixiv 注音标记符号 [[rb: > ]]
    let matched = content.match(RegExp(/\[\[rb:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()

            if (!util.REPLACE_TITLE_MARKS) {
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
    return content
}

function getContent(res) {
    let content = res.content
    // 替换 Pixiv 标记符
    content = replaceUploadedImage(res, content)
    content = replacePixivImage(content)
    content = replaceNewPage(content)
    content = replaceChapter(content)
    content = replaceJumpPage(content)
    content = replaceJumpUrl(content)
    content = replaceRb(content)
    return content
}

(function () {
    return getContent(util.getNovelRes(result, "content"))
})()