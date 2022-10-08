const express = require('express')
const router = express.Router()

const handler = require('../router_handler/router_handler')

/* user 登录注册 */
router.post('/reguser', handler.reguser)    // 注册新用户
router.post('/login', handler.login)        // 用户登录

/* user 登录注册 */
/* my 个人中心 */
/* cate 类别管理 */
/* cate 文章管理 */

module.exports = router