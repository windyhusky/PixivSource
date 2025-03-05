@js:
let keyword = String(source.getVariable()).replace("#", "")
let key = keyword.split(/[ 　,，、\n]/)
if (key.length === 0) {
    sleepToast("可设置源变量，筛选发现 🔍 ")
    sleepToast('发现页 - 长按"兽人控小说站" - 编辑 - 右上角菜单 - 设置源变量')
} else {
    sleepToast(`正在搜索：${key.join("、")}`)
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