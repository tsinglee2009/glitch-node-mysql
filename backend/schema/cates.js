const joi = require('joi')

// 新增文章分类的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

exports.add_cate_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        name,
        alias,
    }
}

// 删除文章分类的验证规则
const id = joi.number().integer().min(1).required()

exports.delete_cate_schema = {
    // /my/deletecate/:id
    params: {
        id
    }
}

// 根据id更新分类
exports.update_cate_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        id,
        name,
        alias,
    }
}