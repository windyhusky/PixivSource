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

    return content
})(result)