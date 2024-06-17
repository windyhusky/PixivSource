@js:

// 小说
const DOMAIN_NAME = 'https://api.furrynovel.com/api/zh'


function urlNovelDetail(novelId) {
    return `${DOMAIN_NAME}/novel/${novelId}`
}

function urlNovelChaptersInfo(novelId) {
    return `${DOMAIN_NAME}/${novelId}/chapter`
}

function urlNovelChapterDetail(novelId, chapterId) {
    return `${DOMAIN_NAME}/novel/${novelId}/chapter/${chapterId}`
}


(() => {
    let dataList = JSON.parse(result).data
    for (let data of dataList) {
        // 只显示最新的一个章节
        if (data.latest_chapters && data.latest_chapters.length > 0) {
            data.latest_chapter = urlNovelChapterDetail(data.id,data.latest_chapters[0].id)
        }

        if (!data.tags){
            data.tags = []
        }

        data.detail_url = urlNovelChaptersInfo(data.id)
        data.tags = data.tags.join(",")
        data.author_name = data.author.name
    }
    return dataList
})()