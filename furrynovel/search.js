@js:
java.put("page",page);java.put("key",key);
`https://api.furrynovel.com/api/zh/novel?&page=${page}&order_by=popular&order=desc&keyword=${encodeURI(key)}&with_chapters=false&limit=8`;