@js:
let pixiv =[
    {"🅿️ 登录账号": "login()" },
    {"⚙️ 账号设置": "startPixivSettings()" },
    {"🔙 退出账号": "logout()" },
]
let source = [
    {"🆙 更新书源": "updateSource()" },
    {"🔰 使用指南": "startGithubReadme()" },
    {"✈️ 直连模式": "editSettings('IPDirect')" },
]
let novel = [
    {"章节名称": "text" },
    {"❤️ 公开收藏": "novelBookmarkFactory(1)" },
    {"📃 追更系列": "seriesWatchFactory()" },
    {"❤️ 收藏系列": "novelsBookmarkAdd()" },

    {"🖤 取消收藏": "novelsBookmarkDelete()" },
    {"⭐️ 关注作者": "userFollowFactory()"},
    {"🚫 屏蔽作者": "userBlock()"},
]
let comment = [
    {"输入内容": "text" },
    {"✅ 发送评论": "novelCommentAdd()" },
    {"🗑️ 删除评论": "novelCommentDelete()" },
    {"🧹 清除缓存": "cleanCache()" },

    {"🚫 添加屏蔽": "blockAddFactory()" },
    {"⭕️ 删除屏蔽": "blockDeleteFactory()" },
    {"👀 查看屏蔽": "blockShowFactory()" },

    {"📌 喜欢标签": "likeTagsAdd()" },
    {"🗑️ 删除标签": "likeTagsDelete()" },
    {"👀 查看标签": "likeTagsShow()" },

    {"❤️ 他人收藏": "likeAuthorsAdd()" },
    {"🖤 取消收藏": "likeAuthorsDelete()" },
    {"👀 查看收藏": "likeAuthorsShow()" },
]

let settings = [
    {"书源设置": "text" },
    {"⚙️ 当前设置": "showSettings()" },
    {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
    {"👤 搜索作者": "editSettings('SEARCH_AUTHOR')" },

    {"🀄 繁简通搜": "editSettings('CONVERT_CHINESE')" },
    {"📖 更多简介": "editSettings('MORE_INFORMATION')" },
    {"📅 更新时间": "editSettings('SHOW_UPDATE_TIME')" },

    {"🔗 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },
    {"📚 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
    {"🖼️ 显示描述": "editSettings('SHOW_CAPTIONS')" },

    {"💬 显示评论": "editSettings('SHOW_COMMENTS')" },
    {"❤️ 显示收藏": "editSettings('SHOW_LIKE_NOVELS')" },
    {"📃 显示追更": "editSettings('SHOW_WATCHED_SERIES')" },

    {"⏩ 快速模式": "editSettings('FAST')" },
    {"🐞 调试模式": "editSettings('DEBUG')" },
    {"🔍 搜索说明": "readMeSearch()" },
]

let li = pixiv.concat(source)
try {
    if (book) li = li.concat(novel)
    if (book) li = li.concat(comment)
} catch (e) {}
li = li.concat(settings)

li.forEach(item => {
    item.name = Object.keys(item)[0]
    if (Object.values(item)[0] === "text") {
        item.type = "text"
    } else {
        item.type = "button"
        item.action = Object.values(item)[0]
    }
    delete item[Object.keys(item)[0]]
    if (item.type === "button") {
        item.style = {}
        item.style.layout_flexGrow = 1
        item.style.layout_flexBasisPercent = -1
    }
})

JSON.stringify(li)