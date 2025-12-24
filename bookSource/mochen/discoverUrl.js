@js:
li = [
    {"title": "墨辰整合系列:禁止倒卖倒卖"},
    {"title": "𓆩书源整理:星之墨辰𓆪"},
    {
        "title": "⭐️聊天交流:粉丝Q群⭐️",
        "url": "https://qm.qq.com/cgi-bin/qm/qr?k=rUUJKC7XHbI1fikv-ZkOdLNDbvcjwjTN&jump_from=webapi&authKey=WbUzWBYiuP9tgqOe8tQ0SB/03XvkOHeXp5m0qDXGMOmG7c0eVNP0PujgHPXuD7lF"
    },
    {
        "title": "💫更新发布:哔哩哔哩💫",
        "url": "https://space.bilibili.com/501149848"
    },
    {
        "title": "✨新书源渠道:微信公众号✨",
        "url": "https://mp.weixin.qq.com/s/s5KDR59Vlc1bckp-I-Ph0w"
    },
    {"title": "求点赞"},
    {"title": "求关注"},
    {"title": "求投币"}
]

// 添加格式
li.forEach(item => {
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexShrink = 1
    item.style.layout_alignSelf = "auto"
    item.style.layout_wrapBefore = "false"
    if (item.title.length !== 3) {
        item.style.layout_flexBasisPercent = 1
    } else {
        item.style.layout_flexBasisPercent = -1
    }
})

java.longToast(`（作者主页）\nhttps://space.bilibili.com/501149848`)
JSON.stringify(li)