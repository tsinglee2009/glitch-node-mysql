const db = require('../../js/database')

// 游客模式，根据id获取文章信息
module.exports = (req, res) => {

    const sql_check = `select * from ev_articles where is_delete=0 and Id=?`
    db.query(sql_check, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            return res.cc('根据id获取文章信息失败！')
        }
        res.send({
            status: 0,
            message: '根据id获取文章信息成功！',
            data: results[0]
        })
    })
}