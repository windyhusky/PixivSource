@js:
(function (res) {
    res = JSON.parse(res)
    let content = res.content
    if (res.series !== null) {
        content = res.desc + "\n" + "—\n".repeat(2) + content
    }
    //将存在的pixiv图片链接替换为可访问的直连
    if (res.images !== undefined && res.images !== null) {
        Object.keys(res.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="https://linpxapi.linpicio.com/proxy/pximg?url=${res.images[key].preview}">`)
        })
    }
    return content
})(result)