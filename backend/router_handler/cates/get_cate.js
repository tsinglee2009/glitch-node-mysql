const db = require('../../js/database')

// 根据id获取文章分类
module.exports = (req, res) => {
    
    const sql_check = `select * from ${req.USER_TABLE_CATES} where id=?`
    db.query(sql_check, req.params.id, (err, results) => {
        
        if (err) return res.cc(err)

        if (results.length !== 1) {
            return res.cc('获取文章分类信息失败！')
        }

        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0]
        })
    })
}