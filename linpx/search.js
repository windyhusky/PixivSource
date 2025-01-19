@js:
var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function getUser(username, exactMatch) {
    // let resp = util.getAjaxJson(util.urlSearchUsers(String(username)))
    let resp = java.ajax(util.urlSearchUsers(String(username)))  // 兼容搜索链接
    if (resp.startsWith("<!DOCTYPE html>") || JSON.parse(result).error) {
        return []
    }
    resp = JSON.parse(resp)
    if (resp.users.length === 0) {
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
    // java.log(`NIDURL:${util.urlNovelsDetailed(list)}`)
    return util.getWebviewJson(util.urlNovelsDetailed(list))
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


function findUserNovels(username) {
    let novelList = []
    // 查询用户
    let userArr = getUser(username, true)
    // 获取用户所有小说
    let uidList = userArr.filter(user => {
        return user.novels.length > 0
    }).map(user => user.id)

    if (uidList.length > 0) {
        let list = util.getWebviewJson(util.urlUsersDetailed(uidList))  // 包含所有小说数据
        let nidList = []
        // 从两层数组中提取novelsId
        list.forEach(user => {
            user.novels
                // 按id降序排序-相当于按时间降序排序
                .reverse()
                .forEach(nid => nidList.push(nid))
        })
        getUserNovels(nidList).forEach(novel => {
            novelList.push(novel)
        })
    }
    return novelList
}

function getNovels(){
    if (result.startsWith("<!DOCTYPE html>") || JSON.parse(result).error) {
        return []
    } else {
        return JSON.parse(result).novels
    }
}

function getLinkNovels() {
    try {
        return util.getNovelRes(String(java.get("key")))
    } catch (e) {
        return []
    }
}

(function () {
    let novels = []
    novels = novels.concat(getNovels())
    novels = novels.concat(getLinkNovels())
    findUserNovels(java.get("key")).forEach(v => {
        novels.push(v)
    })
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.combineNovels(novels))
}(result))