const joi = require('joi')

// 新增文章的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required()
const state = joi.string().valid('已发布', '草稿').required()
// 获取文章列表
const op_cate_id = joi.number().integer().min(1).optional()
const op_state = joi.string().valid('已发布', '草稿').optional()
const pagesize = joi.number().integer().min(5).required()
const pagenum = joi.number().integer().min(0).required()
// 更新文章信息
const Id = joi.number().integer().min(1).required()

exports.add_article_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body : {
        title,
        cate_id,
        content,
        state,
    }
}

exports.get_articles_schema = {
    body : {
        cate_id : op_cate_id,
        state : op_state,
        pagesize,
        pagenum,
    }
}

exports.update_article_schema = {
    body : {
        Id,
        title,
        cate_id,
        content,
        state
    }
}

// 游客模式
exports.pub_get_articles_schema = {
    body : {
        pagesize,
        pagenum,
        op_cate_id,
    }
}