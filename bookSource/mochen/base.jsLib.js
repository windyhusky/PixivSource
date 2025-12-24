function startBrowser(url, title) {
    const {java} = this
    let headers = `{"headers": {"User-Agent":"${java.getWebViewUA()}"}}`
    java.startBrowser(`${url}, ${headers}`, title)
}