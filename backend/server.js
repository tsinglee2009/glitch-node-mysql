const process_env = require('./glitch/process_env')
const database = require('./js/database')
const express = require('express')

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

// 导入并使用路由：user
const router_user = require('./router/router')
app.use('/api', router_user)

// 默认路由
app.get('/', (req, res) => {
    res.send('Hello Glitch')
})

app.listen(process_env.PORT, () => {
    console.log('express is running at ' + process_env.PROJECT_DOMAIN)
    console.log('process.env.test_key : ' + process_env.test_key)
})