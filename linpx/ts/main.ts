import axios from "axios";

const baseApi = axios.create({
    baseURL: 'https://linpxapi.linpicio.com/',
    timeout: 5 * 1000,
});


const key = "晓兔"

baseApi.get(`pixiv/search/novel/${encodeURI(key)}`).then(r =>
    console.log(r)
)