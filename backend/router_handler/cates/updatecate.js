const db = require('../../js/database')

// 根据id更新文章分类
module.exports = (req, res) => {
    
    const sql_check = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    db.query(sql_check, [ req.body.id, req.body.name, req.body.alias ], (err, results) => {
        
        if (err) return res.cc(err)

        // name 或 alias 被占用
        if (results.length === 2) {
            return res.cc('新增失败！name和alias分别被占用！')
        }
        if (results.length === 1) {
            if (req.body.name === results[0].name && req.body.alias === results[0].alias) {
                return res.cc('新增失败！name和alias同时被占用！')
            }
            else if (req.body.name === results[0].name) {
                return res.cc('新增失败！name被占用！')
            }
            else {
                return res.cc('新增失败！alias被占用！')
            }
        }

        // 开始更新
        const sql_update = `update ev_article_cate set ? where id=?`
        db.query(sql_update, [ req.body, req.body.id ], (err, results) => {

            if (err) return res.cc(err)
            
            if (results.affectedRows !== 1) {
                return res.cc('更新分类信息失败！')
            }
            
            res.cc('更新分类信息成功！', 0)
        })
    })
}