@js:
java.put("key", key)
java.put("page", page)
let keyword = key.split(" ")
let limitedTextCount
if (key.includes("字数") || key.includes("字數") ) {
    limitedTextCount = keyword.pop()
    keyword = keyword.join(" ")
} else {
    limitedTextCount = ""
    keyword = key
}
java.put("keyword", keyword)
java.put("limitedTextCount", limitedTextCount)
if (keyword.startsWith("@") || keyword.startsWith("＠")) {
    keyword = keyword.slice(1)
    java.log(`👤 搜索作者：${keyword}`)
} else if (keyword.startsWith("#") || keyword.startsWith("＃")) {
    keyword = keyword.slice(1)
    if (keyword.includes("@") || keyword.includes("＠")) {
        let author = keyword.match(new RegExp(/[@＠](.*)/))
        keyword = keyword.replace(author[0], "").trim()
        java.put("inputAuthor", author[1])
    }
    java.put("keyword", `#${keyword}`)
    java.log(`#️⃣ 搜索标签：${keyword}`)
} else {
    java.log(`🔍 搜索内容：${keyword}`)
}
urlSearchSeries(keyword, page)