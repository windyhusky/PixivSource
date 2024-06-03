var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}

    u.urlCoverUrl = function (pxImgUrl) {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}`
    }

    u.urlIllustUrl = function (illustId) {
        // 使用 pixiv.cat 获取插图
        // return `https://pixiv.cat/${illustId}.png`  // 已墙不可用
        return `https://pixiv.re/${illustId}.png`
        // return `https://pixiv.nl/${illustId}.png`
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()

// 获取请求的user id方便其他ajax请求构造
let uid = java.getResponse().headers().get("x-userid")
if (uid != null) {
    cache.put("pixiv:uid", uid)
}
java.getStrResponse(null, null)