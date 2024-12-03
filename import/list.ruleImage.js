$.uri@js:
u0 = String(java.get('url'));
u1 = u0.match(/uri":"([^"]+)/);
u2 = u0.match(/img":"([^"]+)/);
uri=String(result)||(u2?u2[1]:u1?u1[1]:"");
function $(reg){
    return uri.match(reg)?true:false
}


src =
    $(/https?:\/\/|^\d{3}(\/\d\d){3}$/)? uri:
        $(/【[^】]/)? baseUrl.match(/【(.*?)(】|$)/)[1]:

            // 默认封面
            ""||source.sourceIcon;

// 补全链接
src.match(/^\d{3}(\/\d\d){3}$/)?`http://avatar.coolapk.com/data/${src}_avatar_middle.jpg`:src