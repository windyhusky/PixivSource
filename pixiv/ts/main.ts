import axios from "axios";

function searchNovels(keywords: string, page: number) {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(keywords)}?word=${encodeURI(keywords)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
}

const api = axios.create({
    timeout: 3000,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
        'Referer': 'https://www.pixiv.net',
    }
})

api.get(searchNovels("晓兔", 1)).then(resp => {
    console.log(JSON.stringify(resp))
}).catch(reason => {
        console.log(JSON.stringify(reason))
    }
)

let a: any
a = null
a = undefined
