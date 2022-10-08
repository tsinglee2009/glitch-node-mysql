const process_env = require('./glitch/process_env')
const database = require('./js/database')
const express = require('express')
const joi = require('joi')

var app = express()

// 中间件：配置cors跨域
const cors = require('cors')
app.use(cors())

// 中间件：解析表单数据 : x-www-form-urlencoded
app.use(express.urlencoded({ extended : false }))

// 中间件：通用消息返回
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        var msg = err instanceof Error ? err.message : err
        res.send({ status, message: msg})
    }
    next()
})

// 中间件：解析token 身份认证
var expressjwt = require("express-jwt")
app.use(expressjwt({ secret: process_env.jwtKey }).unless({ path: [/^\/api\//]}))

// 导入并使用路由：user
const router_user = require('./router/router')
app.use('/api', router_user)

// 默认路由
app.get('/', (req, res) => {
    res.send('Hello Glitch')
})

// 异常处理
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // token 身份认证失败的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }
    // 未知的错误
    res.cc(err)
})

// 启动服务器
app.listen(process_env.PORT, () => {
    console.log('express is running at ' + process_env.PROJECT_DOMAIN)
    console.log('process.env.test_key : ' + process_env.test_key)
})