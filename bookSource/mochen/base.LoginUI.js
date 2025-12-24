@js:
let li = [
{"𓆩书源整理:星之墨辰𓆪": "" },
{"⟡聊天交流:粉丝Q群⟡": "https://qm.qq.com/cgi-bin/qm/qr?k=rUUJKC7XHbI1fikv-ZkOdLNDbvcjwjTN&jump_from=webapi&authKey=WbUzWBYiuP9tgqOe8tQ0SB/03XvkOHeXp5m0qDXGMOmG7c0eVNP0PujgHPXuD7lF" },
{"⛥视频更新：哔哩哔哩⛦": "https://space.bilibili.com/501149848" },
{"☾新书源渠道：微信公众号☽": "https://mp.weixin.qq.com/s/s5KDR59Vlc1bckp-I-Ph0w" },
{"🔸导入书源🔸": "" },
{"🔹导入订阅🔹": "" },
]

// 处理按钮
li.forEach(item => {
    item.name = Object.keys(item)[0]
    item.type = "button"
    if (Object.values(item)[0] !== "") {
        item.action = `startBrowser('${Object.values(item)[0]}')`;
    }
    delete item[Object.keys(item)[0]]

    // 添加格式
    item.style = {}
    item.style.layout_flexGrow = 1
    if (item.name.includes("导入")) {
        item.style.layout_flexBasisPercent = -1
    } else {
        item.style.layout_flexBasisPercent = 1
    }
})

JSON.stringify(li)