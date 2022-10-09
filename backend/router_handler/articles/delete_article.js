const db = require('../../js/database')

// 文章管理 - 根据id删除文章
module.exports = (req, res) => {
    
    console.log(req.params.id)
    const sql_delete = `update ev_articles set is_delete=1 where Id=?`
    db.query(sql_delete, req.params.id, (err, results) => {
        if (err) res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('根据id删除文章失败！')
        }
        res.cc('根据id删除文章成功！', 0)
    })
}