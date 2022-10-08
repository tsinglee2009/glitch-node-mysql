const db = require('../../js/database')
const env = require('../../glitch/process_env')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 用户登录
module.exports = (req, res) => {
    
    var userinfo = req.body

    // 1. 验证表单数据是否合法
    // schema/user

    // 2. 根据用户名查询用户数据
    const sql_check = `select * from ev_users where username=?`
    db.query(sql_check, userinfo.username, (err, results) => {
        // sql 查询失败
        if (err) res.cc(err)

        // 判断是否存在用户数据，不存在说明用户名错误
        if (results.length !== 1) {
            return res.cc('登录失败！')
        }

        // 判断用户密码是否正确
        if (!bcrypt.compareSync(userinfo.password, results[0].password)) {
            return res.cc('密码错误')
        }

        // 生成token
        // a. 剔除 password 和 user_pic
        const user = { ...results[0], user_pic: '', password: '' }
        // b. 定义token密钥
        // process_env config
        // c. 对用户信息进行加密
        const tokenStr = jwt.sign(user, env.jwtKey, { expiresIn: env.jwtExp })

        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })
    })

}