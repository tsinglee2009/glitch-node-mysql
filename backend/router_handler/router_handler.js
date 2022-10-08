// user
const reguser = require('./user/reguser')
const login = require('./user/login')
// my
const getUserinfo = require('./my/get_userinfo')
const updateUserinfo = require('./my/update_userinfo')
const updatePwd = require('./my/update_pwd')
const updateAvatar = require('./my/update_avatar')
// cates
const articleCates = require('./cates/getcates')
const articleAddcates = require('./cates/addcate')
const articleDelcates = require('./cates/deletecate')
const articleGetcate = require('./cates/getcate')
const articleUpdatecate = require('./cates/updatecate')

module.exports = {
    reguser,
    login,
    getUserinfo,
    updateUserinfo,
    updatePwd,
    updateAvatar,
    articleCates,
    articleAddcates,
    articleDelcates,
    articleGetcate,
    articleUpdatecate,
}