@js:
java.put("page", page)
java.put("key", key)
let keyword = key.split(" ")
let limitedTextCount
if (key.includes("字数")) {
    limitedTextCount = keyword.pop()
    keyword = keyword.join(" ")
} else {
    limitedTextCount = ""
    keyword = key
}
java.put("keyword", keyword)
java.put("limitedTextCount", limitedTextCount)
urlSearchNovel(keyword, page)