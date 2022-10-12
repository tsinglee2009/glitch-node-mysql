const express = require('express')
// 定义路由
const router = express.Router()
// 路由处理函数
const handler = require('../router_handler/router_handler')
// 表单数据校验
const expressJoi = require('@escook/express-joi')

// 校验规则
const { user_schema, pwd_schema, avatar_schema } = require('../schema/user')
const { userinfo_schema } = require('../schema/my')
const { add_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/cates')
const { add_article_schema, get_articles_schema, update_article_schema, pub_get_articles_schema } = require('../schema/articles')

// 路由列表

// user 用户注册、用户登录
router.post('/api/reguser', expressJoi(user_schema), handler.regUser)    // 注册新用户
router.post('/api/login', expressJoi(user_schema), handler.login)        // 用户登录
// my 个人信息
router.get('/my/userinfo', handler.getUserinfo)    // 获取用户信息
router.post('/my/userinfo', expressJoi(userinfo_schema), handler.updateUserinfo) // 更新用户信息
router.post('/my/updatepwd', expressJoi(pwd_schema), handler.updatePwd) // 重置密码
router.post('/my/update/avatar', expressJoi(avatar_schema), handler.updateAvatar) // 更新头像
// cates 文章分类管理
router.get('/my/article/cates', handler.getCateList) // 获取文章分类列表
router.post('/my/article/addcates', expressJoi(add_cate_schema), handler.addCate) // 新增文章分类
router.get('/my/article/deletecate/:id', expressJoi(delete_cate_schema), handler.deleteCate) // 删除文章分类
router.get('/my/article/cates/:id', expressJoi(delete_cate_schema), handler.getArticle) // 根据id获取分类
router.post('/my/article/updatecate', expressJoi(update_cate_schema), handler.updateCate) // 根据id更新分类
// articles 文章管理
router.get('/my/article/list', expressJoi(get_articles_schema), handler.getArticleList) // 获取文章列表
router.post('/my/article/add', expressJoi(add_article_schema), handler.addArticle) // 发布新文章
router.get('/my/article/delete/:id', handler.deleteArticle) // 根据id删除文章
router.get('/my/article/:id', handler.getArticle) // 根据id获取文章信息
router.post('/my/article/edit', expressJoi(update_article_schema), handler.updateArticle) // 根据id更新文章信息
// public 游客模式
router.get('/pub/article/list', expressJoi(pub_get_articles_schema), handler.pubGetArticles) // 游客 获取文章列表
router.get('/pub/article/:id', handler.pubGetArticle) // 游客 根据id获取文章信息

// 导出路由列表
module.exports = router