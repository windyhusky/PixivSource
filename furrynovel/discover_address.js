@js:
let key = []
let keyword = String(source.getVariable()).replace("#", "")
if (keyword.includes("\n")) {
    keyword = keyword.replace(RegExp(/\s+/g), "\n")
    key = keyword.split("\n")
}
if (keyword.includes(" ")) {
    keyword = keyword.replace(RegExp(/\s+/g), " ")
    key = keyword.split(" ")
}
if (key.length === 0){
    java.longToast("可设置源变量，筛选发现内容")
    sleep(2000)
    java.longToast('发现页 - 长按"兽人控小说站" - 登录 - 编辑 - 右上角菜单 - 设置源变量')
} else {
    java.longToast(`正在搜索：${key.join("、")}`)
}

let li = [
    {"🔥 热门": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=popular&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🆕 最新": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=latest&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🔄 随便": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=random&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/linpx.json"},
]

// 格式化发现地址
li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
    delete item[Object.keys(item)[0]]
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexBasisPercent = 0.15
})
JSON.stringify(li)