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

function getNovels() {
    if (JSON.parse(result).code === 200 && JSON.parse(result).count > 0){
        return JSON.parse(result).data
    } else {
        return []
    }
}

(() => {
    let novels = []
    novels = novels.concat(getNovels())
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.handNovels(novels))
})();