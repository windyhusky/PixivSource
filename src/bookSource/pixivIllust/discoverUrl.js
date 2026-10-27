let settings = getFromCacheObject("pixivIllustSettings")
if (!settings) settings = setDefaultSettings()
let li =[]

let adultDefault = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/illust?p={{page}}&mode=all&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/manga?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/illust?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixivUid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏠 首页": "https://www.pixiv.net"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json"}
]

let generalDefault = [
    {"✅ 常规 推荐 ✅": ""},
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/illust?p={{page}}&mode=all&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/illust?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=safe&lang=zh"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json"},
]

let adultNew = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/illust/new?lastId=0&limit=20&type=manga&r18=true&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/artworks?mode=r18&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/manga?mode=r18&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=r18&lang=zh"},
]

let generalNew = [
    {"✅ 最新 企划 约稿 ✅": ""},
    {"最新": "https://www.pixiv.net/ajax/illust/new?lastId=0&limit=20&type=manga&lang=zh"},
    {"企划": "https://www.pixiv.net/ajax/user_event/portal/artworks?mode=all&p={{page}}&lang=zh"},
    {"约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/manga?mode=all&p={{page}}&lang=zh"},
    {"发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"}
]

let adultRank = [
    {"👑 排行榜单 👑": ""},
    {"今日": "https://www.pixiv.net/ranking.php?mode=daily_r18&p={{page}}&format=json"},
    {"本周": "https://www.pixiv.net/ranking.php?mode=weekly_r18&p={{page}}&format=json"},
    {"R18G": "https://www.pixiv.net/ranking.php?mode=r18g&p={{page}}&format=json"},
    {"男性": "https://www.pixiv.net/ranking.php?mode=male_r18&p={{page}}&format=json"},
    {"女性": "https://www.pixiv.net/ranking.php?mode=female_r18&p={{page}}&format=json"}
]

let generalRank = [
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

let about = [
    {"📘 书源相关 📘": ""},
    {"🏠 主页": "https://pixivsource.pages.dev"},
    {"🔰 指南": "https://pixivsource.pages.dev/Pixiv"},
    {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
    {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
]


// 添加发现
if (settings.SHOW_ADULT) li = li.concat(adultDefault)
if (settings.SHOW_GENERAL) li = li.concat(generalDefault)
if (settings.SHOW_NEW_ADULT) li = li.concat(adultNew)
if (settings.SHOW_NEW_GENERAL) li = li.concat(generalNew)
if (settings.SHOW_RANK_ADULT) li = li.concat(adultRank)
if (settings.SHOW_RANK_GENERAL) li = li.concat(generalRank)
if (settings.SHOW_ABOUT) li = li.concat(about)


// 添加格式
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