❗️0、0、开始❗️
❗️0、0、结束❗️




{{}}@js:
url=String(java.getString('$.url')).trim();



//【..导入】
if(url.match(/^..导入/)){
    uri=url.replace(/导入.*/,'');
    url=url.replace(/.*导入/,'');
    path =
        (uri=="一键"||uri=="自动")?"auto":
            uri=="书源"?"bookSource":
                uri=="订阅"?"rssSource":
                    uri=="净化"?"replaceRule":
                        url=="目录"?"textTocRule":
                            url=="TTS"?"httpTTS":
                                url=="主题"?"theme":
                                    url=="排版"?"readConfig":
                                        "";
    url=url.match(/^legado\:\/\//)?url:`legado://import/${path}?src=`+url;
    url = String(url).replace(/^(.*?src=)(.*)/,(mat, $1, $2)=>{
        return $1+encodeURIComponent($2);
    });


    result=`<title>{{$.name_all}}</title>
<iframe src="${url}" hidden></iframe>
<br><h2>{{$.name_all}}</h2>
<h5>导入失败？多试试几次</h5>

<h6><b>
↓资源链接，点击复制
<a href="${url}">一键导入</a>
<textarea id="copy" onclick="copy()">${decodeURIComponent(String(url).replace(/legado.*?src=/,''))}</textarea>
{{$.time}}
</b></h6>

<style>
a{float:right;text-decoration:none}
h2{text-align:center;font-size:30px }
h5{text-align:center;font-size:20px }
h6{margin:0 2;position:sticky;top:30%;font-size:14px}
textarea{width:100%;border-radius:5px}
</style><script>
function copy(){
	document.getElementById('copy').select()
	document.execCommand('copy')
	alert("复制成功")
}
</script>`}



//【自定义html】
else if(url.match(/\d+、\d+、/)){
    reg=new RegExp('❗️'+url+'开始❗️\\s*([\\s\\S]+?)\\s*❗️'+url+'结束❗️');
//默认禁止放大缩小
    result=result.match(reg)?
        '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">'+result.match(reg)[1]:'<br>未找到对应html'
}

else{result=''}