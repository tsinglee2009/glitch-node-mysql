const express = require('express')
const process_env = require('./glitch/process_env')

var app = express()

app.get('/', (req, res) => {
    res.send(process_env.test_key)
})

app.listen(80, () => {
    console.log('express is running at 127.0.0.1')
    console.log('env : ' + process_env.test_key)
})