@js:
(() => {
    let res = JSON.parse(result).body
    let content = res.content
    if (res.seriesNavData !== undefined && res.seriesNavData !== null && res.description !== "") {
        content = res.description + "\n" + "——————————\n".repeat(2) + content
    }
    let hasEmbeddedImages = res.textEmbeddedImages !== undefined && res.textEmbeddedImages !== null
    if (hasEmbeddedImages) {
        Object.keys(res.textEmbeddedImages).forEach((key) => {
            // content = content.replace(`[uploadedimage:${key}]`, `<img src="https://linpxapi.linpicio.com/proxy/pximg?url=${res.textEmbeddedImages[key].urls.original}">`)
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${res.textEmbeddedImages[key].urls.original}">`)
        })
    }
    return content
})()
