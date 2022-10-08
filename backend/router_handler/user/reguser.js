const db = require('../../js/database')

// 注册用户
module.exports = (req, res) => {

    // 客户端提交到服务器的用户信息
    const userinfo = req.body

    // 1. 对表单数据进行合法性检查
    if (!userinfo.username || !userinfo.password) {
        return res.send('用户名或密码不合法！')
    }
    
    // 查询用户名是否已被注册
    const sql = `select * from ev_users where username=?`
    db.query(sql, userinfo.username, (err, results) => {

        if (err) {
            return res.cc(err)
        }

        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }

        res.cc('用户注册', 0)
    })
}