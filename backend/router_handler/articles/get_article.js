const db = require('../../js/database')
const upfiler = require('../../js/upfiler')

// 文章管理 - 根据id获取文章信息
module.exports = (req, res) => {
    
    const sql_check = `select * from ${req.USER_TABLE_ARTICLES} where Id=?`
    db.query(sql_check, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            return res.cc('根据id获取文章信息失败！')
        }

        // 获取文章内容
        upfiler.getArticleFileContent(req.user.id, req.params.id, (err, data) => {
            if (err) return res.cc(err)
            // 文章内容
            results[0].content = data || ''
            // 响应客户端
            res.send({
                status: 0,
                message: '根据id获取文章信息成功！',
                data: results[0]
            })
        })

    })
}