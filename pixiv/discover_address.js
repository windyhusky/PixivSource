@js:
let SHOW_GENERAL_NOVELS_NEW, SHOW_GENERAL_NOVELS_RANK, SHOW_GENERAL_NOVELS_GENRE
try {
    settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
    SHOW_GENERAL_NOVELS_NEW = settings.SHOW_GENERAL_NOVELS_NEW     // 发现：最新、企划、约稿显示一般小说
    SHOW_GENERAL_NOVELS_RANK = settings.SHOW_GENERAL_NOVELS_RANK   // 发现：排行榜显示一般小说
    SHOW_GENERAL_NOVELS_GENRE = settings.SHOW_GENERAL_NOVELS_RANK  // 发现：热门分类显示一般小说
} catch (e) {
    SHOW_GENERAL_NOVELS_NEW = false
    SHOW_GENERAL_NOVELS_RANK = false
    SHOW_GENERAL_NOVELS_GENRE = false
}

li = [
    {"⭐️ 关注": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh"},
    {"📃 追更": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=r18&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=all&lang=zh"},
    {"❤️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh"},
    {"㊙️ 收藏": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=hide&lang=zh"},
    {"🏷️ 书签": "https://www.pixiv.net/novel/marker_all.php"},
    {"🏠 首页": "https://www.pixiv.net"},
]

r18New = [
    {"🆕 最新 企划 约稿 💰": ""},
    {"🆕 最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=true&lang=zh"},
    {"📑 企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=r18&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=r18&p={{page}}&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=r18&lang=zh"},
]

generalNew = [
    {"🆙 最新 企划 约稿 💰": ""},
    {"🆙 最新": "https://www.pixiv.net/ajax/novel/new?lastId=0&limit=20&r18=false&lang=zh"},
    {"📄 企划": "https://www.pixiv.net/ajax/user_event/portal/novels?mode=all&p={{page}}&lang=zh"},
    {"💰 约稿": "https://www.pixiv.net/ajax/commission/page/request/complete/novels?mode=all&p={{page}}&lang=zh"},
    {"📝 编辑": "https://www.pixiv.net/novel/editors_picks"},
    {"💯 推荐": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh"},
    {"🔍 发现": "https://www.pixiv.net/ajax/novel/discovery?mode=safe&lang=zh"},
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
    {"🔝 排行榜单 🔝": ""},
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

bookmarks = [{"❤️ 他人收藏 ❤️": ""}]

li = li.concat(r18New)
li = li.concat(r18Rank)
li = li.concat(r18Genre)
if (SHOW_GENERAL_NOVELS_NEW === true) {
    li = li.concat(generalNew)
}
if (SHOW_GENERAL_NOVELS_RANK === true) {
    li = li.concat(generalRank)
}
if (SHOW_GENERAL_NOVELS_GENRE === true) {
    li = li.concat(generalgGenre)
}

try {
    authors = String(source.getVariable()).split("\n")
    if (authors[0].trim() !== "" && authors.length >= 1) {
        for (let i in authors) {
            if (authors[i] !== "") {
                let authorId = authors[i].match(RegExp(/\d+/))[0]
                let resp = JSON.parse(java.ajax(`https://www.pixiv.net/ajax/user/${authorId}`))
                if (resp.error !== true) {
                    let bookmark = {}
                    bookmark[resp.body.name] = `https://www.pixiv.net/ajax/user/${authorId}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh`
                    bookmarks.push(bookmark)
                }
            }
        }
        li = li.concat(bookmarks)
    }
} catch (e) {
    java.longToast("源变量设置有误")
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