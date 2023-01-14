function urlSeries(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
}

function urlSeriesNovels(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=10&last_order=0&order_by=asc&lang=zh`
}

function urlUserInfo(uid) {
    return `https://www.pixiv.net/ajax/user/${uid}`
}

function urlUserAllWorks(uid) {
    return `https://www.pixiv.net/ajax/user/${uid}/profile/all?lang=zh`
}

function urlUserNovels(uid, nidList) {
    return `https://www.pixiv.net/ajax/user/273832/profile/novels?ids%5B%5D=19026640`
}

function a() {
    return `https://www.pixiv.net/ajax/user/273832/novels?ids[]=14075807&ids[]=17342422`
}

// 完全匹配用户名
function urlSearchUser(username) {
    return `https://www.pixiv.net/search_user.php?s_mode=s_usr&nick=${encodeURI(username)}&nick_mf=1`
}