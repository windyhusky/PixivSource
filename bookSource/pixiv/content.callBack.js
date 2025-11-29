java.log(event)
java.log(typeof event)

// 恢复阅读搜索作者
if (event === "clickBookName") {
    java.searchBook(book.name)
}
// 恢复阅读搜索作者
if (event === "clickAuthor") {
    java.searchBook(book.author)
}
