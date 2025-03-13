@js:
java.put("page",page);java.put("key",key);
`https://www.pixiv.net/ajax/search/artworks/${encodeURI(key)}?word=${encodeURI(key)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&type=manga&lang=zh`