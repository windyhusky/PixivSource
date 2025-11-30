// java.log(event)
// java.log(typeof event)

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
    text += `\n\n小说链接：\n${book.bookUrl}\n\n分享自【开源阅读】兽人控小说站书源。使用添加网址，快速添加本文`
    java.copyText(text)
}


// // 开始阅读，登录界面添加当前章节名称
// if (event === "startRead") {
// }
// // 保存阅读，登录界面添加当前章节名称
// if (event === "saveRead") {
// }
// // 结束阅读
// if (event === "endRead") {
// }

// // 添加书架
// if (event === "addBookShelf") {}
// // 移除书架
// if (event === "delBookShelf") {}
//
// 自定义按钮
// if (event === "clickCustomButton") {
// }
// // 开始书架刷新
// if (event === "startShelfRefresh") {}
// // 结束书架刷新
// if (event === "endShelfRefresh") {}