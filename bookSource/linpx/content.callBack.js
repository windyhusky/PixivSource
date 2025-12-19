// 恢复阅读搜索作者
if (event === "clickBookName") {
    java.searchBook(book.name)
}
// 恢复阅读搜索作者
if (event === "clickAuthor") {
    java.searchBook(book.author)
}
// 覆盖阅读默认分享
if (event === "clickShareBook") {
    let text = `我正在看：【${book.author}】创作的《${book.name}》`
    if (!!book.durChapterTitle && String(book.name) !== String(book.durChapterTitle)) {
        text += `的 【${book.durChapterTitle}】`
    }
    text += `\n\n小说链接：\n${book.bookUrl}\n\n分享自【开源阅读】Linpx书源。使用添加网址，快速添加本文`
    java.copyText(text)
}

// 保存阅读，更新登录界面的章节名称
if (event === "saveRead") {
    // sleepToast(book.durChapterTitle)
    source.putLoginInfo(JSON.stringify({"章节名称": book.durChapterTitle}))
}

// 开始书架刷新
if (event === "startShelfRefresh") {
    source.putConcurrent("1/2000")
}
// 结束书架刷新
if (event === "endShelfRefresh") {
    source.putConcurrent("3/2000")
}