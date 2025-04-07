@js:
java.put("page", page)
java.put("key", key)
let keyword = key.split(" ")
if (key.includes("字数")) {
    keyword.splice(keyword.length-1, 1)
    keyword = keyword.join(" ")
    java.put("keyword", keyword)
}
`https://www.pixiv.net/ajax/search/novels/${keyword}?word=${keyword}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`;