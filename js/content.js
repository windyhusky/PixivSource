@js:
(function (res) {
    res = JSON.parse(res)
    let content = res.content
    //链接替换 如果有的话
    if (res.images !== undefined && res.images !== null) {
        Object.keys(res.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="https://linpxapi.linpicio.com/proxy/pximg?url=${res.images[key].preview}">`)
        })
    }
    return content
})(result)