const db = require('../../js/database')

module.exports = (req, res) => {

    // req.user 是token解析中间件的产物
    // console.log(req.user)

    const sql_check = `select id, username, nickname, email, user_pic from ev_users where id=?`
    db.query(sql_check, req.user.id, (err, results) => {
        // sql 查询失败
        if (err) return res.cc(err)
        // sql 查询成功，获取用户信息
        if (results.length !== 1) {
            return res.cc('获取用户信息失败！')
        }
        // 用户信息获取成功 
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}