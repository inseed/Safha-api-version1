var {photoTransformer} = require('./photoTransformer')

var userInfosTransformer = function(userInfos) {
    return userInfos.map(userInfo => userInfoTransformer(userInfo))
}

var userInfoTransformer = function(userInfo){
    if (userInfo?.dataValues?.avatar) {
        userInfo.dataValues.avatar = photoTransformer(userInfo.dataValues.avatar)
    }
    if (userInfo?.dataValues?.bgPic) {
        userInfo.dataValues.bgPic = photoTransformer(userInfo.dataValues.bgPic)
    }
    return userInfo
}

module.exports = {
    userInfoTransformer,
    userInfosTransformer
}