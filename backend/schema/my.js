const joi = require('joi')

// 更新用户信息的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.userinfo_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        id,
        nickname,
        email,
    }
}