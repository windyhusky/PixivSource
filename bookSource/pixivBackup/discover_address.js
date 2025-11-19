let SHOW_R18_GENRE, SHOW_GENERAL_NEW, SHOW_GENERAL_RANK, SHOW_GENERAL_GENRE
try {
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    SHOW_R18_GENRE = settings.SHOW_R18_GENRE         // 发现：热门分类显示R18小说
    SHOW_GENERAL_NEW = settings.SHOW_GENERAL_NEW     // 发现：最新、企划、约稿显示一般小说
    SHOW_GENERAL_RANK = settings.SHOW_GENERAL_RANK   // 发现：排行榜显示一般小说
    SHOW_GENERAL_GENRE = settings.SHOW_GENERAL_GENRE // 发现：热门分类显示一般小说
} catch (e) {
    SHOW_R18_GENRE = false
    SHOW_GENERAL_NEW = false
    SHOW_GENERAL_RANK = false
    SHOW_GENERAL_GENRE = false
}

li = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=r18&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=r18&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=r18&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏷️ 书签": "https://www.pixiv.net/novel/marker_all.php"},
    {"🏠 首页": "https://www.pixiv.net"},
]

normal = [
    {"✅ 常规 小说 推荐 ✅": ""},
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=safe&lang=zh"},
    {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/pixiv.json"},
]

r18New = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=true&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=r18&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=r18&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=all&lang=zh"},
]

generalNew = [
    {"✅ 最新 企划 约稿 ✅": ""},
    {"最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=false&lang=zh"},
    {"企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=all&p={{page}}&lang=zh"},
    {"约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=all&p={{page}}&lang=zh"},
    {"编辑": "https://www.pixiv.net/novel/editors_picks"},
]

r18Rank = [
    {"👑 排行榜单 👑": ""},
    {"今日": "https://www.pixiv.net/novel/ranking.php?mode=daily_r18"},
    {"本周": "https://www.pixiv.net/novel/ranking.php?mode=weekly_r18"},
    {"R18G": "https://www.pixiv.net/novel/ranking.php?mode=r18g"},
    {"男性": "https://www.pixiv.net/novel/ranking.php?mode=male_r18"},
    {"女性": "https://www.pixiv.net/novel/ranking.php?mode=female_r18"}
]

generalRank = [
    {"🏆 排行榜单 🏆": ""},
    {"今日": "https://www.pixiv.net/novel/ranking.php?mode=daily"},
    {"本周": "https://www.pixiv.net/novel/ranking.php?mode=weekly"},
    {"本月": "https://www.pixiv.net/novel/ranking.php?mode=monthly"},
    {"男性": "https://www.pixiv.net/novel/ranking.php?mode=male"},
    {"女性": "https://www.pixiv.net/novel/ranking.php?mode=female"},
    {"新人": "https://www.pixiv.net/novel/ranking.php?mode=rookie"},
    {"原创": "https://www.pixiv.net/novel/ranking.php?mode=weekly_original"},
    {"AI生成": "https://www.pixiv.net/novel/ranking.php?mode=weekly_ai"}
]

r18Genre = [
    {"🔥 原创热门 🔥": ""},
    {"男性": "https://www.pixiv.net/ajax/genre/novel/male?mode=r18&lang=zh"},
    {"女性": "https://www.pixiv.net/ajax/genre/novel/female?mode=r18&lang=zh"},
    {"恋爱": "https://www.pixiv.net/ajax/genre/novel/romance?mode=r18&lang=zh"},
    {"异世界奇幻": "https://www.pixiv.net/ajax/genre/novel/isekai_fantasy?mode=r18&lang=zh"},
    {"现代奇幻": "https://www.pixiv.net/ajax/genre/novel/contemporary_fantasy?mode=r18&lang=zh"},
    {"悬疑": "https://www.pixiv.net/ajax/genre/novel/mystery?mode=r18&lang=zh"},
    {"恐怖": "https://www.pixiv.net/ajax/genre/novel/horror?mode=r18&lang=zh"},
    {"科幻": "https://www.pixiv.net/ajax/genre/novel/sci-fi?mode=r18&lang=zh"},
    {"文学": "https://www.pixiv.net/ajax/genre/novel/literature?mode=r18&lang=zh"},
    {"情感": "https://www.pixiv.net/ajax/genre/novel/drama?mode=r18&lang=zh"},
    {"历史": "https://www.pixiv.net/ajax/genre/novel/historical_pieces?mode=r18&lang=zh"},
    {"耽美": "https://www.pixiv.net/ajax/genre/novel/bl?mode=r18&lang=zh"},
    {"百合": "https://www.pixiv.net/ajax/genre/novel/yuri?mode=r18&lang=zh"},
    {"散文·诗歌": "https://www.pixiv.net/ajax/genre/novel/poetry?mode=r18&lang=zh"},
    {"随笔·纪实": "https://www.pixiv.net/ajax/genre/novel/non-fiction??mode=r18&lang=zh"},
    {"剧本": "https://www.pixiv.net/ajax/genre/novel/screenplays?mode=r18&lang=zh"},
    {"评论": "https://www.pixiv.net/ajax/genre/novel/reviews?mode=r18&lang=zh"},
    {"其他": "https://www.pixiv.net/ajax/genre/novel/other?mode=r18&lang=zh"}
]

generalgGenre = [
    {"❤️‍🔥 原创热门 ❤️‍🔥": ""},
    {"综合": "https://www.pixiv.net/ajax/genre/novel/all?mode=safe&lang=zh"},
    {"恋爱": "https://www.pixiv.net/ajax/genre/novel/romance?mode=safe&lang=zh"},
    {"异世界奇幻": "https://www.pixiv.net/ajax/genre/novel/isekai_fantasy?mode=safe&lang=zh"},
    {"现代奇幻": "https://www.pixiv.net/ajax/genre/novel/contemporary_fantasy?mode=safe&lang=zh"},
    {"悬疑": "https://www.pixiv.net/ajax/genre/novel/mystery?mode=safe&lang=zh"},
    {"恐怖": "https://www.pixiv.net/ajax/genre/novel/horror?mode=safe&lang=zh"},
    {"科幻": "https://www.pixiv.net/ajax/genre/novel/sci-fi?mode=safe&lang=zh"},
    {"文学": "https://www.pixiv.net/ajax/genre/novel/literature?mode=safe&lang=zh"},
    {"情感": "https://www.pixiv.net/ajax/genre/novel/drama?mode=safe&lang=zh"},
    {"历史": "https://www.pixiv.net/ajax/genre/novel/historical_pieces?mode=safe&lang=zh"},
    {"耽美": "https://www.pixiv.net/ajax/genre/novel/bl?mode=safe&lang=zh"},
    {"百合": "https://www.pixiv.net/ajax/genre/novel/yuri?mode=safe&lang=zh"},
    {"散文·诗歌": "https://www.pixiv.net/ajax/genre/novel/poetry?mode=safe&lang=zh"},
    {"随笔·纪实": "https://www.pixiv.net/ajax/genre/novel/non-fiction??mode=safe&lang=zh"},
    {"剧本": "https://www.pixiv.net/ajax/genre/novel/screenplays?mode=safe&lang=zh"},
    {"评论": "https://www.pixiv.net/ajax/genre/novel/reviews?mode=safe&lang=zh"},
    {"其他": "https://www.pixiv.net/ajax/genre/novel/other?mode=safe&lang=zh"}
]

let likeTagLinks = [{"📌 喜欢标签 📌":""}]
let othersBookmarks = [{"❤️ 他人收藏 ❤️": ""}]

li = li.concat(normal)
li = li.concat(r18New)
if (SHOW_GENERAL_NEW === true) {
    li = li.concat(generalNew)
}
li = li.concat(r18Rank)
if (SHOW_GENERAL_RANK === true) {
    li = li.concat(generalRank)
}
if (SHOW_R18_GENRE === true) {
    li = li.concat(r18Genre)
}
if (SHOW_GENERAL_GENRE === true) {
    li = li.concat(generalgGenre)
}
sleepToast('使用指南🔖\n\n发现 - 更新 - 点击"🔰 使用指南" - 查看')

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