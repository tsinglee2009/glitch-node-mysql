const process_env = require('./glitch/process_env')
const express = require('express')
const db = require('./database')

var app = express()

app.get('/', (req, res) => {
    res.send(process_env.test_key)
})

app.listen(process_env.PORT, () => {
    console.log('express is running at ' + process_env.PROJECT_DOMAIN)
    console.log('process.env.test_key : ' + process_env.test_key)
})