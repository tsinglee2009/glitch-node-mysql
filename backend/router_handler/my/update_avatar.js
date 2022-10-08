const db = require('../../js/database')

// 更新头像
module.exports = (req, res) => {

    const sql_update = `update ev_users set user_pic=? where id=?`
    db.query(sql_update, [ req.body.avatar, req.user.id ], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新头像失败！')
        }
        res.cc('更新头像成功！', 0)
    })
}