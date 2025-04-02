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

function search(name, page=1) {
    let resp = getAjaxJson(urlSearchNovel(name, page))
    java.log(urlSearchNovel(name, page))
    if (resp.code === 200 && resp.count > 0) {
        return resp.data
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
    novels = novels.concat(util.getNovels())
    if (util.CONVERT_CHINESE_CHARACTERS) novels = novels.concat(getConvertNovels())
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.handNovels(novels))
})();