@js:
li = [
    {"墨辰整合系列:禁止倒卖倒卖": ""},
    { "𓆩书源整理:星之墨辰𓆪": ""},
    {"粉丝交流-企鹅群聊": "https://qm.qq.com/cgi-bin/qm/qr?k=M8ogRciE3lxKu-x8HOvt0fD5uGBsaF2F&jump_from=webapi&authKey=68Tr+kChZDAh90aSPPl83RRRUM7CNok4cTjbJ3qifO8RmbKf5AIMBJ8P3EzaOCQL" },
    {"◾️哔哩哔哩◾️": "https://space.bilibili.com/501149848" },
    {"◽️新公众号◽️": "https://mp.weixin.qq.com/s/P59hLgSVWso0Sxwuyj7tSg" },
    {"🔸夸克网盘-更新合集🔸": "https://pan.quark.cn/s/b0e1c6e0252c" },
    {"🔹百度网盘-更新合集🔹": "https://pan.baidu.com/s/1j-UGCyyihVRR2_JHf3jClg?pwd=1234" },
]

buHuanHang = [
    "◾️哔哩哔哩◾️",
    "◽️新公众号◽️",
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
    if (buHuanHang.includes(item.title)) {
        item.style.layout_flexBasisPercent = -1
    } else {
        item.style.layout_flexBasisPercent = 1
    }
})

java.longToast(`\n\n作者主页：\nhttps://space.bilibili.com/501149848`)
JSON.stringify(li)