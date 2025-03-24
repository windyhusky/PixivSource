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

function getConvertNovels() {
    let MAXPAGES = 2, novels = []
    let novelName = String(java.get("key"))
    let name = java.s2t(java.t2s(java.s2t(novelName)))
    let resp = getAjaxJson(urlSearchNovel(name, 1))
    java.log(urlSearchNovel(name, 1))
    novels = novels.concat(resp.data)
    // for (let page = 2; page < resp.lastPage, page < MAXPAGES; page++) {
    //     novels = novels.concat(getAjaxJson(urlSearchNovel(name, page)).data)
    //     java.log(urlSearchNovel(name, page))
    // }
    return novels
}

(() => {
    let novels = []
    novels = novels.concat(util.getNovels())
    if (util.CONVERT_CHINESE_CHARACTERS) novels = novels.concat(getConvertNovels())
    return util.formatNovels(util.handNovels(novels))
})();