var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

// 存储seriesID
var first = true;
var seriesSet = {
    keywords: "Linpx:Search",
    has: (value) => {
        let page = Number(java.get("page"))
        if (page === 1 && first) {
            first = false
            cache.deleteMemory(this.keywords)
            return false
        }

        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            return false
        }
        let set = new Set(JSON.parse(v))
        return set.has(value)
    },

    add: (value) => {
        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            cache.putMemory(this.keywords, JSON.stringify([value]))

        } else {
            let arr = JSON.parse(v)
            if (typeof arr === "string") {
                arr = Array(arr)
            }
            arr.push(value)
            cache.putMemory(this.keywords, JSON.stringify(arr))
        }
    },
};

function getUser(username, exactMatch) {
    let resp = getAjaxJson(urlSearchUsers(String(username)))
    java.log(urlSearchUsers(String(username)))
    // java.log(JSON.stringify(resp))
    if (resp.error || resp.users.length === 0) {
        return []
    }
    if (!exactMatch) {
        return resp.users
    }
    // 只返回用户名完全一样的用户
    return resp.users.filter(user => {
        return user.name === username
    })
}

function getUserNovels(nidList) {
    let page = Number(java.get("page"))
    // 分页
    let list = nidList.slice((page - 1) * 20, page * 20)
    if (list.length === 0) {
        return []
    }
    // java.log(`NIDURL:${urlNovelsDetailed(list)}`)
    return getWebviewJson(urlNovelsDetailed(list))
}

function findUserNovels() {
    let novelList = []
    let username = String(java.get("key"))
    let userArr = getUser(username, false)
    // 获取用户所有小说
    let uidList = userArr.filter(user => {
        return user.novels.length > 0
    }).map(user => user.id)
    // java.log(JSON.stringify(uidList))

    if (uidList.length > 0) {
        let list = getWebviewJson(urlUsersDetailed(uidList))  // 包含所有小说数据
        // java.log(JSON.stringify(list))
        let nidList = []
        // 从两层数组中提取novelsId
        list.forEach(user => {
            user.novels
                // 按id降序排序-相当于按时间降序排序
                .reverse()
                .forEach(nid => nidList.push(nid))
        })
        // java.log(JSON.stringify(nidList))
        getUserNovels(nidList).forEach(novel => {
            novelList.push(novel)
        })
    }
    // java.log(JSON.stringify(novelList))
    return novelList.reverse()  // 新小说前置
}

function getNovels() {
    if (result.startsWith("<!DOCTYPE html>") || JSON.parse(result).error) {
        return []
    } else {
        return JSON.parse(result).novels
    }
}

function search(name, page=1) {
    let resp = getAjaxJson(urlSearchNovel(name, page))
    java.log(urlSearchNovel(name, page))
    if (resp.error === undefined && resp.total > 0) {
        return resp.novels
    } else {
        return []
    }
}

function getConvertNovels() {
    let novels = []
    let novelName = String(java.get("key"))
    let name1 = String(java.s2t(novelName))
    let name2 = String(java.t2s(novelName))
    if (name1 !== novelName) novels = novels.concat(search(name1))
    if (name2 !== novelName) novels = novels.concat(search(name2))
    return novels
}

(() => {
    let novels = []
    novels = novels.concat(getNovels())
    novels = novels.concat(findUserNovels())
    if (util.CONVERT_CHINESE) novels = novels.concat(getConvertNovels())
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.handNovels(util.combineNovels(novels)))
})()