const process_env = require('./glitch/process_env')
const express = require('express')

var app = express()

// 中间件：配置cors跨域
const cors = require('cors')
app.use(cors())

// 前端静态网页
app.use('/', express.static('./frontend'))
app.use('/uploads/', express.static('./uploads'))
// 前端显示图片
app.get('/uploads/*', (req, res) => {
    res.sendFile(__dirname + "/" + req.url);
})

// 中间件：通用消息返回
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        if (status === 1 && res.cc_pre_fn) res.cc_pre_fn()
        var msg = err instanceof Error ? err.message : err
        res.send({ status, message: msg})
    }
    next()
})

// 中间件：解析表单数据 : x-www-form-urlencoded
app.use(express.urlencoded({ extended : false, limit: '2mb' }))

// 中间件：解析表单数据校验 : multipart/form-data
const uploader = require('./js/uploader')
app.use(uploader.any())

// // 中间件：解析token 身份认证
// var expressjwt = require("express-jwt")
// app.use(expressjwt({ secret: process_env.jwtKey }).unless({
//     path: [ 
//         /^\/api\//, 
//         /^\/pub\//,
//     ] 
// }))

// 中间件：解析token 身份认证
const jwt_decrypt = require('./js/jwt_decrypt')
app.use(jwt_decrypt.decryptor)
// unless : /^\/api\/|\/pub\//

// 新增用户表名处理
const usertables = require('./js/usertables')
app.use(usertables)

// 导入并使用路由
const router = require('./router/router')
app.use(router)

// 异常处理
const joi = require('joi')
const multer = require('multer')
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // token 身份认证失败的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }
    // form-data 不合法
    if (err instanceof multer.MulterError) {
        return res.cc('form-data 不合规范')
    }
    // 未知的错误
    // res.cc(err)
    res.send(err.stack)
})

// 启动服务器
app.listen(process_env.PORT, () => {
    console.log('express is running at ' + process_env.PROJECT_DOMAIN)
    console.log('process.env.test_key : ' + process_env.test_key)
})