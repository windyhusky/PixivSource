java.put("key", key)
java.put("page", page)
if (key.startsWith("@") || key.startsWith("＠")) {
    key = key.slice(1)
    java.log(`👤 搜索作者：${key}`)
} else if (key.startsWith("#") || key.startsWith("＃")) {
    key = key.slice(1)
    java.log(`#️⃣ 搜索标签：${key}`)
} else {
    java.log(`🔍 搜索内容：${key}`)
}

java.put("key", key)
urlSearchNovel(key, page)