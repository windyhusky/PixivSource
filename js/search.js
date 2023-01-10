@js:
var userMap = new Map();
var ajaxCount = 0;

(function (res) {
    res = JSON.parse(res)

    function findUser(userId) {
        let obj = userMap.get(userId);
        if (obj === undefined || obj === null) {
            obj = java.ajax(`https://linpxapi.linpicio.com/pixiv/user/${userId}`)
            obj = JSON.parse(obj)
            ajaxCount++
            userMap.set(userId, obj)
        }
        return obj
    }

    res.novels.forEach(v => {
        let userInfo = findUser(v.userId)
    })

}(result))


//分类
tags[ *
]

//封面
{
    {
        `"https://linpxapi.linpicio.com/proxy/pximg?url=${result.coverUrl}`
    }
}

//详细
{
    {
        `https://linpxapi.linpicio.com/pixiv/novel/${result.id}/cache`
    }
}

{{`https://linpxapi.linpicio.com/pixiv/search/novel/${encodeURI(key)}?page=${page}`}}

@js:
java.put("key",key);
`https://linpxapi.linpicio.com/pixiv/search/novel/${encodeURI(key)}?page=${page}`