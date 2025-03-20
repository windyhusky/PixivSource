@js:
let SHOW_GENERAL_ILLUST_NEW, SHOW_GENERAL_ILLUST_RANK
try {
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    SHOW_GENERAL_ILLUST_NEW = settings.SHOW_GENERAL_ILLUST_NEW     // 发现：最新、企划、约稿显示一般小说
    SHOW_GENERAL_ILLUST_RANK = settings.SHOW_GENERAL_ILLUST_RANK   // 发现：排行榜显示一般小说
} catch (e) {
    SHOW_GENERAL_ILLUST_NEW = true
    SHOW_GENERAL_ILLUST_RANK = true
}

li = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/illust?p={{page}}&mode=all&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/manga?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/illust?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏠 首页": "https://www.pixiv.net"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/pixiv.json"},
]

r18New = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/illust/new?lastId=0&limit=20&type=manga&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/artworks?mode=all&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/manga?mode=all&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/illust/discovery?mode=all&lang=zh"},
]

r18Rank = [
    {"👑 排行榜单 👑": ""},
    {"今日": "https://www.pixiv.net/ranking.php?mode=daily_r18&content=manga&p={{page}}&format=json"},
    {"本周": "https://www.pixiv.net/ranking.php?mode=weekly_r18&content=manga&p={{page}}&format=json"},
    {"R18G": "https://www.pixiv.net/ranking.php?mode=r18g&content=manga&p={{page}}&format=json"},
    {"男性": "https://www.pixiv.net/ranking.php?mode=male_r18"},
    {"女性": "https://www.pixiv.net/ranking.php?mode=female_r18"},
]

generalRank = [
    {"🏆 排行榜单 🏆": ""},
    {"今日": "https://www.pixiv.net/ranking.php?mode=daily&content=manga&p={{page}}&format=json"},
    {"本周": "https://www.pixiv.net/ranking.php?mode=weekly&content=manga&p={{page}}&format=json"},
    {"本月": "https://www.pixiv.net/ranking.php?mode=monthly&content=manga&p={{page}}&format=json"},
    {"新人": "https://www.pixiv.net/ranking.php?mode=rookie&content=manga&p={{page}}&format=json"},
]

bookmarks = [{"❤️ 他人收藏 ❤️": ""}]

li = li.concat(r18New)
li = li.concat(r18Rank)
// if (SHOW_GENERAL_ILLUST_RANK === true) {
    li = li.concat(generalRank)
// }

try {
    authors = String(source.getVariable()).split("\n")
    if (authors[0].trim() !== "" && authors.length >= 1) {
        for (let i in authors) {
            if (authors[i] !== "") {
                let authorId = authors[i].match(RegExp(/\d+/))[0]
                let resp = JSON.parse(java.ajax(`https://www.pixiv.net/ajax/user/${authorId}`))
                if (resp.error !== true) {
                    let bookmark = {}
                    bookmark[resp.body.name] = `https://www.pixiv.net/ajax/user/${authorId}/illusts/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh`
                    bookmarks.push(bookmark)
                }
            }
        }
        li = li.concat(bookmarks)
    } else {
        sleepToast("可设置源变量，查看他人收藏 ❤️ ")
        sleepToast('发现 - 长按"Pixiv" - 编辑 - 右上角菜单 - 设置源变量')
    }
} catch (e) {
    sleepToast("⚠️源变量设置有误")
    sleepToast("设置源变量：输入作者ID，一行一个，可添加作者名，保存")
}

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