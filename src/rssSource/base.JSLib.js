function getWebViewUA() {
    let {java} = this
    let userAgent = String(java.getWebViewUA())
    return String(userAgent)
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}

function sleepToast(text, second) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (second === undefined) {second = 0.01}
    this.sleep(1000*second)
}