@js:
let li = [
    {"𓆩书源整理:星之墨辰𓆪": "" },
    {"⟡粉丝交流-企鹅群聊⟡": "https://qm.qq.com/cgi-bin/qm/qr?k=M8ogRciE3lxKu-x8HOvt0fD5uGBsaF2F&jump_from=webapi&authKey=68Tr+kChZDAh90aSPPl83RRRUM7CNok4cTjbJ3qifO8RmbKf5AIMBJ8P3EzaOCQL" },
    {"⛥视频更新:哔哩哔哩⛦": "https://space.bilibili.com/501149848" },
    {"☾新书源渠道:微信公众号☽": "https://mp.weixin.qq.com/s/P59hLgSVWso0Sxwuyj7tSg" },
    {"🔸夸克网盘更新🔸": "https://pan.quark.cn/s/b0e1c6e0252c" },
    {"🔹百度网盘更新🔹": "https://pan.baidu.com/s/1j-UGCyyihVRR2_JHf3jClg?pwd=1234" },
]

buHuanHang = [
    "🔸夸克网盘更新🔸",
    "🔹百度网盘更新🔹",
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
    if (buHuanHang.includes(item.name)) {
        item.style.layout_flexBasisPercent = -1
    } else {
        item.style.layout_flexBasisPercent = 1
    }
})

JSON.stringify(li)