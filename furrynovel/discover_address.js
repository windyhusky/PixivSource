@js:
let key = String(source.getVariable()).trim()
if (key === undefined || key === ""){
    java.longToast("可设置源变量，筛选发现内容")
} else {
    java.longToast(`正在搜索：${key}`)
}

li = [
    {"热门小说": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=popular&tags[]=${key}`},
    {"最新小说": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=latest&tags[]=${key}`},
    {"随便来点": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=random&tags[]=${key}`}
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