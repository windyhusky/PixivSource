@js:

li = [
    {"热门小说": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=popular`},
    {"最新小说": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=latest`},
    {"随便来点": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=random`}
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