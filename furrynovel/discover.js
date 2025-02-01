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
    return util.formatNovels(util.handNovels(getNovels()))
})();