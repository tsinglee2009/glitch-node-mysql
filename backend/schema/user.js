// 定义表单数据验证规则
const joi = require('joi')

// 用户名的验证规则
const username = joi.string().pattern(/[0-9A-Za-z_]{4,12}/).required()
// 用户密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
// 头像验证规则
const avatar = joi.string().dataUri().required()

// 用户信息
exports.user_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        username,
        password,
    }
}

// 重置密码
module.exports.pwd_schema = {
    body : {
        oldPwd : password,
        newPwd : joi.not(joi.ref('oldPwd')).concat(password),
    }
}

// 更新头像
module.exports.avatar_schema = {
    body : {
        avatar,
    }
}