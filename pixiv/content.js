@js:
(() => {
    let res = JSON.parse(result).body
    let content = res.content
    if (res.seriesNavData !== undefined && res.seriesNavData !== null) {
        content = res.description + "\n" + "——————————\n".repeat(2) + content
    }
    let hasEmbeddedImages = res.textEmbeddedImages !== undefined && res.textEmbeddedImages !== null
    if (hasEmbeddedImages) {
        Object.keys(res.textEmbeddedImages).forEach((key) => {
            //todo 使用了linpx的图片代理 目前只能想到这样解决
            content = content.replace(`[uploadedimage:${key}]`, `<img src="https://linpxapi.linpicio.com/proxy/pximg?url=${res.textEmbeddedImages[key].urls.original}">`)
        })
    }
    return content
})()