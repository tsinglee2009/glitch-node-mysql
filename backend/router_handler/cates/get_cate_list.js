const db = require('../../js/database')

// 获取文章分类列表
module.exports = (req, res) => {

    const sql_check = `select id,name,alias from ${req.USER_TABLE_CATES} where is_delete=0 order by id asc`
    db.query(sql_check, (err, results) => {

        if (err) return res.cc(err)

        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        })
    })

}