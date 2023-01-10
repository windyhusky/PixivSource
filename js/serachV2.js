//
var userM


(function (res) {
    res = JSON.parse(res)
    let params = []

    // https://linpxapi.linpicio.com/pixiv/novels?ids[]=19026640&ids[]=18817795&ids[]=18726995&ids[]=18683668&ids[]=18655864&ids[]=18637208&ids[]=18622628&ids[]=18609612&ids[]=18593886&ids[]=18585073&ids[]=18573210&ids[]=18557957&ids[]=18534604&ids[]=18528112&ids[]=18521216&ids[]=18472031&ids[]=18401860&ids[]=18377629&ids[]=18341776&ids[]=18281849&ids[]=18219123&ids[]=18219113&ids[]=18169116&ids[]=18134909
    res.novels.forEach(novel => {
        params.push(`ids[]=${novel.id}`)
    })

    let detailed_novels = JSON.parse(java.ajax(`https://linpxapi.linpicio.com/pixiv/novels?${params.join('&')}`))



}(result))