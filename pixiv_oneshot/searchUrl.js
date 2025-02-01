@js:
java.put("page",page);java.put("key",key);
`https://www.pixiv.net/ajax/search/novels/${encodeURI(key)}?word=${encodeURI(key)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`;