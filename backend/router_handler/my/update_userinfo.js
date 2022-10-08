const db = require('../../js/database')

module.exports = (req, res) => {

    // req.user 是token解析中间件的产物
    // console.log(req.user)

    const sql_update = `update ev_users set ? where id=?`
    db.query(sql_update, [ req.body, req.body.id ], (err, results) => {
        // sql 查询失败
        if (err) return res.cc(err)
        // sql 查询成功，获取用户信息
        if (results.affectedRows !== 1) {
            return res.cc('更新用户信息失败！')
        }
        // 更新数据用户信息成功
        res.send({
            status: 0,
            message: '更新用户信息成功',
            data: results[0]
        })
    })
}