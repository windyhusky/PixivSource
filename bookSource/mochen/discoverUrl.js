@js:
li = [
    {"墨辰整合系列:禁止倒卖倒卖": ""},
    { "𓆩书源整理:星之墨辰𓆪": ""},
    {"◎聊天交流:粉丝Q群◎": "https://qm.qq.com/cgi-bin/qm/qr?k=rUUJKC7XHbI1fikv-ZkOdLNDbvcjwjTN&jump_from=webapi&authKey=WbUzWBYiuP9tgqOe8tQ0SB/03XvkOHeXp5m0qDXGMOmG7c0eVNP0PujgHPXuD7lF" },
    {"✯更新发布:哔哩哔哩✯": "https://space.bilibili.com/501149848" },
    {"»`ʚ新书源渠道:微信公众号ɞ´«": "https://mp.weixin.qq.com/s/s5KDR59Vlc1bckp-I-Ph0w" },
    {"🔸导入书源🔸": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json" },
    {"🔹导入订阅🔹": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json" },
]

// 处理按钮
li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
    delete item[Object.keys(item)[0]]

    // 添加格式
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexShrink = 1
    item.style.layout_alignSelf = "auto"
    item.style.layout_wrapBefore = "false"
    if (item.title.includes("导入")) {
        item.style.layout_flexBasisPercent = -1
    } else {
        item.style.layout_flexBasisPercent = 1
    }
})

java.longToast(`\n\n作者主页：\nhttps://space.bilibili.com/501149848`)
JSON.stringify(li)