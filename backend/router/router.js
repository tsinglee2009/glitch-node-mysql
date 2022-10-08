const express = require('express')
// 定义路由
const router = express.Router()
// 路由处理函数
const handler = require('../router_handler/router_handler')
// 表单数据校验
const expressJoi = require('@escook/express-joi')

// 校验规则
const { user_schema, pwd_schema, avatar_schema } = require('../schema/user')
const { userinfo_schema } = require('../schema/userinfo')
const { article_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/article_cate')

// 路由列表

/* user 注册、登录 */
router.post('/api/reguser', expressJoi(user_schema), handler.reguser)    // 注册新用户
router.post('/api/login', expressJoi(user_schema), handler.login)        // 用户登录
/* my 个人中心 */
router.get('/my/userinfo', handler.getUserinfo)    // 获取用户信息
router.post('/my/userinfo', expressJoi(userinfo_schema), handler.updateUserinfo) // 更新用户信息
router.post('/my/updatepwd', expressJoi(pwd_schema), handler.updatePwd) // 重置密码
router.post('/my/update/avatar', expressJoi(delete_cate_schema), handler.updateAvatar) // 更新头像
/* article-cate 文章类别管理 */
router.get('/my/article/cates', handler.articleCates) // 获取文章分类列表
router.post('/my/article/addcates', expressJoi(article_cate_schema), handler.articleAddcates) // 新增文章分类
router.get('/my/article/deletecate/:id', expressJoi(delete_cate_schema), handler.articleDelcates) // 删除文章分类
router.get('/my/article/cates/:id', expressJoi(delete_cate_schema), handler.articleGetcate) // 根据id获取分类
router.post('/my/article/updatecate', expressJoi(update_cate_schema), handler.articleUpdatecate) // 根据id更新分类
/* article 文章管理 */

module.exports = router