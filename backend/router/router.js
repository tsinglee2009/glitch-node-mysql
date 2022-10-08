const express = require('express')
// 定义路由
const router = express.Router()
// 路由处理函数
const handler = require('../router_handler/router_handler')
// 表单数据校验
const expressJoi = require('@escook/express-joi')

// 校验规则
const { user_schema } = require('../schema/user')

/* user 登录注册 */
router.post('/reguser', expressJoi(user_schema), handler.reguser)    // 注册新用户
router.post('/login', expressJoi(user_schema), handler.login)        // 用户登录

/* user 登录注册 */
/* my 个人中心 */
/* categry 类别管理 */
/* article 文章管理 */

module.exports = router