const db = require('../../js/database')

// 添加文章分类
module.exports = (req, res) => {

    // 查询新增分类的 name 或 alias 是否被占用
    const sql_check = `select * from ev_article_cates where name=? or alias=?`
    db.query(sql_check, [ req.body.name, req.body.alias ], (err, results) => {

        if (err) return res.cc(err)

        var is_cached = false

        // 判断被占用情况
        if (results.length === 2) {
            return res.cc('新增失败！name和alias分别被占用！')
        }
        if (results.length === 1) {
            if (req.body.name === results[0].name && req.body.alias === results[0].alias) {
                if (results[0].is_delete === 0) {
                    return res.cc('新增失败！name和alias同时被占用！')
                }
                is_cached = true
            }
            else if (req.body.name === results[0].name) {
                return res.cc('新增失败！name被占用！')
            }
            else {
                return res.cc('新增失败！alias被占用！')
            }
        }

        // 新增文章分类至数据库
        if (is_cached) {
            const sql_update = `update ev_article_cates set is_delete=0 where id=?`
            db.query(sql_update, results[0].id, (err, results) => {

                if (err) return res.cc(err)

                res.send({
                    status: 0,
                    message: '新增文章分类成功！'
                })
            })
        }
        else {
            const sql_insert = `insert into ev_article_cates set ?`
            db.query(sql_insert, req.body, (err, results) => {
                
                if (err) return res.cc(err)

                res.send({
                    status: 0,
                    message: '新增文章分类成功！'
                })
            })
        }
    })

}