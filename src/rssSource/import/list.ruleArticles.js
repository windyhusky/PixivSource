<js>
    try {
    $ = JSON.parse(src).text;
    if ($ == "no file") $ = [];
} catch (err) {
    reg = /^(https?\:\/\/((www|m)\.)?baidu\.com\/?\?wd=\s*)+/i;

    if (baseUrl == source.sourceUrl) {
    $ = [{
    name_all: "无法获取分类？可能没有启用",
    time: "右上角 - 【登录】启用，再【刷新分类】"
}]
}



    //网站整合
    else if (baseUrl.match(reg)) {
    $ = [];
    baseUrl.replace(reg, '').
    split(/\s*•\s*/).map($$ => $.push({
    name_all: $$.match(/.*?《(.*?)》/)[1],
    time: $$.match(/◎.*?◎/) ? $$.match(/.*?◎(.*?)◎/)[1] : "",
    uri: $$.match(/【.*?】/) ? $$.match(/.*?【(.*?)】/)[1] : "",
    url: $$.match(/^([^【《◎]*),?/)[1]
}));
}



    //蓝奏云
    else {

    //蓝奏云非分组链接
    if (String(java.getString('text.举报文件@href')).length) {
    $ = [{
    name_all: String(java.getString('class.md@textNodes')),
    icon: String(java.getString('class.md@textNodes')).replace(/.*\./, ''),
    size: String(java.getString('class.mtt@text')).replace(/\( /, '').replace(/ \)/, ''),
    time: String(java.getString('class.mf@textNodes')).replace(/.*\n/, ''),
    uri: baseUrl.replace(/^(.+com).*\/(.+)$/, '$2'),
    url: baseUrl.replace(/^(.+com).*\/(.+)$/, '$1/tp/$2')
}]
}


    //取消分享
    else if (String(java.getString('.off@text')).match(/取消分享/)) {
    $ = [{
    name_all: java.getString('.off@text'),
    time: baseUrl.replace(/[#\?].*/g, ''),
    url: baseUrl.replace(/[#\?].*/g, '')
}]
}


    //蓝奏云分组链接
    else {
    json = [];
    name = java.getString('.user-radio@text||title@text')
    java.getElements('#folder .mlink').forEach(a => {
    java.setContent(a);
    json.push({
    name_all: java.getString('.filename@textNodes'),
    url: java.getString('a@href'),
    time: '🗂️ folder　📑 ' + (String(java.getString('.filesize@text')) || name)
})
})
    java.setContent(src);


    mat = baseUrl.match(/^(.*?\.com)[^##]*\/(.+)$/)
    url = mat[1]
    uri = mat[2]

    function $(reg) {
    return uri.match(reg) ? true : false
}


    //get【pwd】(链接提取码)
    pwd =
    $(/##[^【]/) ? uri.match(/##(.*?)(【|$)/)[1] :
    "";



    head = {
    method: "POST",
    params: {
    uri: uri,
    img: $(/【[^】]/) ? uri.match(/【([^】]+)/)[1] : ""
}
}




    //get 【body】
    eval(src.match(/var pgs;([\s\S]*?pgs.+;)/)[1]);
    eval('$=' + src.match(/data :([\s\S]*?\})/)[1]);
    head.body = Object.keys($).map(key => key + "=" + $[key]).join('&');


    //补全【url】
    url += "/filemoreajax.php," + JSON.stringify(head);



    //ajax
    $ = JSON.parse(java.ajax(url));
    $ = json.concat($.text != 0 ? $.text :

    //密码错误提示
    [{
    name_all: $.info,
    time: uri.replace(/[#\?].*/, '') + $.info,
    url: baseUrl.replace(/[#\?].*/, '')
}])
    baseUrl = url
}
}
}
    java.put('url', baseUrl);
    JSON.stringify($);
</js>$.[*]