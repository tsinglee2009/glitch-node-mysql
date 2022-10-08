const db = require('../js/database')
const bcrypt = require('bcryptjs')

// 注册用户
module.exports = (req, res) => {

    // 客户端提交到服务器的用户信息
    const userinfo = req.body

    // 1. 对表单数据进行合法性检查 ===> 优化为 schema joi验证方式
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send('用户名或密码不合法！')
    // }
    
    // 2. 查询用户名是否已被注册
    const sql_check = `select * from ev_users where username=?`
    db.query(sql_check, userinfo.username, (err, results) => {
        // sql 执行失败
        if (err) return res.cc(err)
        // sql 执行成功
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }

        // 3. 对密码进行加密保护 bcrypt.hashSync(明文密码, 随机盐的长度)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 4. db 插入新用户
        const sql_insert = `insert into ev_users set ?`
        db.query(sql_insert, { username : userinfo.username, password : userinfo.password }, (err, results) => {
            // sql 执行失败
            if (err) return res.cc(err)
            // sql 执行成功，影响行数应该为 1
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！')
            }

            res.cc('注册成功！', 0)
        })

    })
}
