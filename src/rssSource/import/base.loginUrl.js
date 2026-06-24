a = String(source.sourceComment);
reg1 = /\s*『.*?』\s*/g
reg2 = /.+《(.*?)》.*/
sortName = []

b = a.match(reg1);
b = a.split(reg1).map((list, i) => {
    if (!/^\s*$/.test(list)) {
        try {
            sort = b[i - 1].match(/『(.*?)』/)[1] + "::";
        }
        catch (err) {
            sort = "🌟 精选推荐::"
        }

        url = [];
        Sort = [""];
        list.split(/\s*\n\s*/).map(text => {
            text = String(text);
            if (text.split('::').length == 2 && /^(?!.*(&&|•)).*::/.test(text)) {
                Sort.push(text);
            } else {
                text.split(/\s*(&&|•)\s*/).map(text => {
                    if (text.split('::').length == 2) Sort.push(text);
                    else if (!/^\s*::/.test(sort) && reg2.test(text)) url.push(text);
                });
            }
        });
        return sort += url.join('•') + Sort.join('\n');
    }
    return list
}).map(text => {
    text = String(text).replace(/^\s*::\s*|\s*::\s*$/g, '');

    text = text.split('\n').map(text=>{
        if (/《/.test(text)) text = text.replace(/^(.+?::)(https?\:\/\/(www.)?baidu.com\/?\?wd=\s*)*/, '$1https://www.baidu.com/?wd=');


// 更改连接符
        return text.replace(/\s*(♞♞|★)\s*/g, '•');
    }).join('\n');
    if (/::/.test(text)) {
        sortName.push(text.replace(/::.*/g, ''))
        return text
    }
    return "";
}).join('\n');










function set(json) {
    json = JSON.stringify(json).replace(/(".+?)(\d[,}])/g,'\n\t\t$1 $2').replace(/}$/,'\n}');
    return source.setVariable(json);
}

function get() {
    try {
        v = JSON.parse(source.getVariable());
    } catch (e) {
        v = null
    }
    if (v == null || Array.isArray(v)) v = {};
}
get()

sortName = sortName.join(',').replace(/\s*\n\s*/g, ',').split(',').map($ => {
    $ = $.trim()
    if (v[$] == undefined) v[$] = 1;
    return $;
}).join(',');
b = b.split('\n').map(text => {
    t = text.trim()
    return v[t.split(/\s*::/)[0]] ? t : ""
}).join('\n');
set(v);


//log字符串
function login(t) {
    if (t == undefined) return true;
    java.log(t);
    java.toast(t);
}


//log当前分类状态
function look(type) {
    get();
    if (JSON.stringify(v) == "{}") $('全部分类');
    if(type){
        t = [{name:"　　　　    ༺ˇ»`ʚ  分类选择  ɞ´«ˇ༻   　　　　",type:"button",action:"$('全部分类')"}
            ,{name:"　 查看分类设置 　",type:"button",action:"look(0)"}
            ,{name:"　 格式分组名称 　",type:"button",action:"look(1)"}];
        for (key in v) t.push({
            name:key,
            type:"button",
            action:"$('"+key+"')"
        });
        t.push({name: "　　　　　　　反馈Q群：365976134　　　　　　　",type:"button",action:"http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134"});
        set(t)
        t = "【格式发现】\n\t❗数组是复制到登录ui的❗\nemmm，登录日志好像没办法长按复制。\n已保存到源变量，去源变量那里复制吧。";
    }
    else{
        t = "【分类状态】";
        for (key in v) t += '\n\t' + key + '=>' + (v[key] ? '启用' : '禁用');
    }
    return login(t);
}


//启用/禁用
function $(sort, name) {
    get();
    if (name == undefined) name = sort.split(',')[0];
    name = name.trim()
    if (name == '全部分类') {
        sort = sortName;
    } else { //屏蔽错误分类
        sort1 = []
        sort2 = sortName.split(',')
        sort.split(',').map(key1 => {
            key1 = key1.trim();
            for (i in sort2) {
                key2 = sort2[i].trim();
                if (key1 == key2) {
                    sort1.push(key1);
                    break;
                }
            }
        })
        sort = sort1.join(',')
    }
    if (!/^\s*$/.test(sort)) {
        sort = String(sort).split(',');
        f = sort.length > 1 ? '分组' : '分类';
        V = v[sort[0]];
        if (name == '全部分类') v = {};
        login('【更改成功】\n『' + f + '』 ' + name + ': 已' + (V ? '禁用' : '启用'));
        sort.map(key => v[key] = V ? 0 : 1);
        return set(v);
    }
    return login('【无法更改】\n原因：没有有效分类(分类名称不正确)')
}