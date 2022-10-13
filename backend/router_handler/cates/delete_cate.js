const db = require('../../js/database')

// 删除文章分类
module.exports = (req, res) => {

    // 删除文章分类至数据库
    const sql_update = `update ${req.USER_TABLE_CATES} set is_delete=1 where id=?`
    db.query(sql_update, req.params.id , (err, results) => {
        
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败！')
        }

        res.send({
            status: 0,
            message: '删除文章分类成功！'
        })
    })

}