@js:
let SHOW_GENERAL_NOVELS_RANK = false
// 发现：排行榜显示一般小说

li = [
    {
        "title": "关注",
        "url": "https://www.pixiv.net/ajax/follow_latest/novel?p={{page}}&mode=all&lang=zh",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "追更",
        "url": "https://www.pixiv.net/ajax/watch_list/novel?p={{page}}&new=1&lang=zh",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "推荐",
        "url": "https://www.pixiv.net/ajax/top/novel?mode=all&lang=zh",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "发现",
        "url": "https://www.pixiv.net/ajax/novel/discovery?mode=all",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "收藏",
        "url": "https://www.pixiv.net/ajax/user/{{cache.get(\"pixiv:uid\")}}/novels/bookmarks?tag=&offset={{(page-1)*24}}&limit=24&rest=show&lang=zh",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    }
]

r18 = [
    {
        "title": "\uD83D\uDD1E 排行榜",
        "url": "",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":1
        }
    },
    {
        "title": "今日",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=daily_r18",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "本周",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=weekly_r18",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "R18G",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=r18g",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "男性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=male_r18",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "女性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=female_r18",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    }
]

general = [
    {
        "title": "\uD83C\uDD97 排行榜",
        "url": "",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":1
        }
    },
    {
        "title": "今日",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=daily",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "本周",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=weekly",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "本月",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=monthly",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "男性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=male",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    },
    {
        "title": "女性",
        "url": "https://www.pixiv.net/novel/ranking.php?mode=female",
        "style": {
            "layout_flexGrow": 1,
            "layout_flexBasisPercent":0.15
        }
    }
]


li = li.concat(r18)
if (SHOW_GENERAL_NOVELS_RANK === true){
    li = li.concat(general)
}
JSON.stringify(li)