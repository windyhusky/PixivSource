function getWebViewUA() {
    const {java, cache} = this
    let userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    // java.log(`userAgent=${userAgent}`)
    return String(userAgent)
}

function startBrowser(url, title) {
    const {java} = this
    if (!title) title = url
    let headers = {}
    headers["User-Agent"] = this.getWebViewUA()

    if (url.endsWith(".json")) {
        java.openUrl(`legado://import/importonline?src=${url}`)
    } else {
        java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
    }
}