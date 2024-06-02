@js:
(function (res) {
    res = JSON.parse(res)
    let content = res.content
    if (res.series !== null && res.desc !== undefined && res.desc !== "") {
        content = res.desc + "\n" + "——————————\n".repeat(2) + content
    }

    // 获取 [uploadedimage:] 的图片链接
    //将存在的pixiv图片链接替换为可访问的直连
    if (res.images !== undefined && res.images !== null) {
        Object.keys(res.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="https://pximg.furrynovel.ink/?url=${res.images[key].origin}">`)
        })
    }

    // // 获取 [pixivimage:] 的图片链接
    let rex = /\[pixivimage:(\d+)]/gm
    let matched = content.match(RegExp(rex))
    if (matched) {
        for (let i in matched) {
            let illustId = matched[i].match(RegExp("\\d+"))
            // let illustOriginal = `https://pixiv.cat/${illustId}.png`  // 已墙不可用
            let illustOriginal = `https://pixiv.re/${illustId}.png`
            // let illustOriginal = `https://pixiv.nl/${illustId}.png`
            content = content.replace(`${matched[i]}`, `<img src="${illustOriginal}">`)
        }
    }

    // 替换 Pixiv 标记符号 [newpage] [chapter:]
    // 阅读不支持分页符，因此在 `[chapter:]`添加空行
    content = content.replace(`[newpage]`, `<div style="page-break-after:always"></div>`)
    matched = content.match(RegExp(/\[chapter:(.*)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*)]/m)
            let chapter = matched2[1].trim()
            if (("第".includes(chapter))||("章".includes(chapter))){
                // chapter = `${chapter}`
            }
            else {
                chapter = `第${Number(i)+1}节 ${chapter}`
            }
            content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}${chapter}<p>​<p/>`)
        }
    }

    // 替换 Pixiv 跳转页面标记符号 `[[jump:]]`
    matched = content.match(/\[jump:(\d+)]/gm)
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }

    // 替换 Pixiv 链接标记符号 `[[jumpuri: > ]]`
    matched = content.match(/\[\[jumpuri:(.*)>(.*)]]/gm)
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*)>(.*)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()
            // 阅读不支持超链接
            //content = content.replace(`${matchedText}`, `<a href=${urlLink}>${urlName}</a>`)
            if (urlLink === urlName) {
                content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
            }
            else{
                content = content.replace(`${matchedText}`, `${urlName}`)
            }
        }
    }




    return content
})(result)