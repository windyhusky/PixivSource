
// const result = require("./RecommendUsers.json");
const userinfo = require("./SearchUserResult.json");
// let resp = JSON.parse(result)

function test1() {
    const novels = [];
    for (const user in resp) {
        let username = resp[user].name
        let userinfo = require("./SearchUserResult.json");
        // let userinfo = getAjaxJson(urlSearchUsers(username));
        // console.log(userinfo.users)
        for (const userinfoKey in userinfo) {
            let novels = userinfo.users[0].novels
            // console.log(novels)
            break
        }
        // break
        return novels
    }
}


function handlerFollowing() {
    return () => {
        let novelList = []
        JSON.parse(result).body.users
            .filter(user => user.novels.length > 0)
            .map(user => user.novels)
            .forEach(novels => {
                return novels.forEach(novel => {
                    novelList.push(novel)
                })
            })
        return util.formatNovels(handNovels(novelList))
    }
}


function getAjaxJson(url) {
    return JSON.parse(node.ajax(url))
}


let novelList = []
let result = require("./RecommendUsers.json");
// let result = JSON.parse(result)
result.forEach(function(users) {
    console.log(users.name);
    let userInfo = require("./SearchUserResult.json");
    // let userInfo = getAjaxJson(urlSearchUser(users.name))

    let user = userInfo.users
        .filter(user => user.novels.length > 0)
        .map(user => user.novels)
        .forEach(novels => {
            return novels.forEach(novel => {
                // console.log(novel)
                novelList.push(novel)
            })
        })
});
console.log(novelList)