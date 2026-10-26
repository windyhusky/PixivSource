let keyword = String(source.getVariable()).replace("#", "")
let key = keyword.split(/[ 　,，、\n]/)
if (key.includes("")) {
    key.splice(key.indexOf(""), 1)
}
if (key.length === 0) {
    sleepToast("可设置源变量，筛选发现 🔍 ")
    sleepToast('发现页 - 长按"兽人控小说站" - 编辑 - 右上角菜单 - 设置源变量')
} else {
    sleepToast(`正在搜索：${key.join("、")}`)
}

let li = []
let novel = [
    {"🔥 热门": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=popular&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🆕 最新": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=latest&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🔄 随便": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=random&${key.map(v => "tags[]=" + v).join("&")}`},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json"},
]
let aoout = [
    {"📙 书源相关 📙": ""},
    {"🏠 主页": "https://pixivsource.pages.dev"},
    {"🔰 指南": "https://pixivsource.pages.dev/FurryNovel"},
    {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
    {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
]

li = li.concat(novel).concat(about)
// 格式化发现地址
li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
    delete item[Object.keys(item)[0]]
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexShrink = 1
    item.style.layout_alignSelf = "auto"
    item.style.layout_wrapBefore = "false"
    if (item.url === "") {
        item.style.layout_flexBasisPercent = 1
    } else {
        item.style.layout_flexBasisPercent = -1
    }
})
JSON.stringify(li)