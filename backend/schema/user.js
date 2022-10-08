// 定义表单数据验证规则
const joi = require('joi')

// 用户名的验证规则
const username = joi.string().alphanum().min(4).max(10).required()
// 用户密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

exports.user_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        username,
        password,
    }
}