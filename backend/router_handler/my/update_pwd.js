const db = require('../../js/database')
const bcrypt = require('bcryptjs')

module.exports = (req, res) => {
    // 查询用户信息
    const sql_check = `select * from ev_users where id=?`
    db.query(sql_check, req.user.id, (err, results) => {
        // sql 查询失败
        if (err) return res.cc(err)
        // 数据是否存在
        if (results.length !== 1) {
            return res.cc('用户不存在')
        }
        // 判断旧密码是否正确
        if (!bcrypt.compareSync(req.body.oldPwd, results[0].password)) {
            return res.cc('原密码错误！')
        }

        // 更新数据库中的密码
        var newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        const sql_update = `update ev_users set password=? where id=?`
        db.query(sql_update, [ newPwd, req.user.id ], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('重置密码失败，请稍后再试！')
            }
            res.cc('重置密码成功！')
        })
    })
}