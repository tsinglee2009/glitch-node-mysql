const db = require('../../js/database')

// 只保留一个文件
function get_single_file(req) {
    if (req.files.length === 0) return null
    for (var i = 1; i < req.files.length; i++)
        fs.unlinkSync(req.files[i].path)
    return req.files[0]
}

// 更新头像
module.exports = (req, res) => {

    // 检查封面图片的有效性
    var file = get_single_file(req)
    if (!file) {
        return res.cc('更新头像失败！图片不能为空！')
    }

    // 如果执行失败，删除文件
    res.cc_pre_fn = () =>  fs.unlinkSync(file.path)

    const sql_update = `update ev_users set user_pic=? where id=?`
    db.query(sql_update, [ file.path, req.user.id ], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新头像失败！')
        }
        res.cc('更新头像成功！', 0)
    })
}