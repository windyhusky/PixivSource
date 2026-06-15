let SHOW_GENERAL_NEW, SHOW_GENERAL_RANK
try {
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    SHOW_GENERAL_NEW = settings.SHOW_GENERAL_NEW     // 发现：最新、企划、约稿显示一般小说
} catch (e) {
    SHOW_GENERAL_NEW = false
}

li = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/illust?p={{page}}&mode=all&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/manga?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/illust?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏠 首页": "https://www.pixiv.net"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json"}
]

r18New = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/illust/new?lastId=0&limit=20&type=manga&r18=true&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/artworks?mode=r18&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/manga?mode=r18&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=r18&lang=zh"},
]

generalNew = [
    {"✅ 最新 企划 约稿 ✅": ""},
    {"最新": "https://www.pixiv.net/ajax/illust/new?lastId=0&limit=20&type=manga&lang=zh"},
    {"企划": "https://www.pixiv.net/ajax/user_event/portal/artworks?mode=all&p={{page}}&lang=zh"},
    {"约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/manga?mode=all&p={{page}}&lang=zh"},
    {"发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"}
]

r18Rank = [
    {"👑 排行榜单 👑": ""},
    {"今日": "https://www.pixiv.net/ranking.php?mode=daily_r18&p={{page}}&format=json"},
    {"本周": "https://www.pixiv.net/ranking.php?mode=weekly_r18&p={{page}}&format=json"},
    {"R18G": "https://www.pixiv.net/ranking.php?mode=r18g&p={{page}}&format=json"},
    {"男性": "https://www.pixiv.net/ranking.php?mode=male_r18&p={{page}}&format=json"},
    {"女性": "https://www.pixiv.net/ranking.php?mode=female_r18&p={{page}}&format=json"}
]

generalRank = [
    {"🏆 排行榜单 🏆": ""},
    {"今日": "https://www.pixiv.net/ranking.php?mode=daily&p={{page}}&format=json"},
    {"本周": "https://www.pixiv.net/ranking.php?mode=weekly&p={{page}}&format=json"},
    {"本月": "https://www.pixiv.net/ranking.php?mode=monthly&p={{page}}&format=json"},
    {"新人": "https://www.pixiv.net/ranking.php?mode=rookie&p={{page}}&format=json"},
    {"原创": "https://www.pixiv.net/ranking.php?mode=original&p={{page}}&format=json"},
    {"A I ": "https://www.pixiv.net/ranking.php?mode=original&p={{page}}&format=json"},
    {"男性": "https://www.pixiv.net/ranking.php?mode=male&p={{page}}&format=json"},
    {"女性": "https://www.pixiv.net/ranking.php?mode=female&p={{page}}&format=json"},
]

let source = [
    {"📘 书源相关 📘": ""},
    {"🏠 主页": "https://pixivsource.pages.dev"},
    {"🔰 指南": "https://pixivsource.pages.dev/Pixiv"},
    {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
    {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
]

li = li.concat(r18New)
if (SHOW_GENERAL_NEW) li = li.concat(generalNew)
li = li.concat(r18Rank)
if (SHOW_GENERAL_RANK) li = li.concat(generalRank)
li = li.concat(source)

// 添加格式
li.forEach(item => {
    item.title = Object.keys(item)[0]
    item.url = Object.values(item)[0]
    if (item.url.includes("https://www.pixiv.net")) item.url = urlIP(item.url)
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