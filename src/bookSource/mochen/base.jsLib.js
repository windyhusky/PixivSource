function startBrowser(url, title) {
    const {java} = this
    if (!title) title = url
    let headers = {}
    headers["User-Agent"] = String(java.getWebViewUA())

    if (url.endsWith(".json")) {
        java.openUrl(`legado://import/importonline?src=${url}`)
    } else {
        java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
    }
}