// 路由处理函数模块

// user 用户注册、用户登录
const regUser = require('./user/reguser')
const login = require('./user/login')
// my 个人信息
const getUserinfo = require('./my/get_userinfo')
const updateUserinfo = require('./my/update_userinfo')
const updatePwd = require('./my/update_pwd')
const updateAvatar = require('./my/update_avatar')
// cates 文章分类管理
const getCateList = require('./cates/get_cate_list')
const addCate = require('./cates/add_cate')
const deleteCate = require('./cates/delete_cate')
const getCate = require('./cates/get_cate')
const updateCate = require('./cates/update_cate')
// articles 文章管理
const getArticleList = require('./articles/get_article_list')
const addArticle = require('./articles/add_article')
const deleteArticle = require('./articles/delete_article')
const getArticle = require('./articles/get_article')
const updateArticle = require('./articles/update_article')

// 导出路由处理函数
module.exports = {
    regUser,
    login,
    getUserinfo,
    updateUserinfo,
    updatePwd,
    updateAvatar,
    getCateList,
    addCate,
    deleteCate,
    getCate,
    updateCate,
    getArticleList,
    addArticle,
    deleteArticle,
    getArticle,
    updateArticle,
}