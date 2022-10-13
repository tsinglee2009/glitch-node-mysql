const db = require('../../js/database')
const upfiler = require('../../js/upfiler')

// 文章管理 - 根据id删除文章
module.exports = (req, res) => {
    
    const sql_delete = `update ${req.USER_TABLE_ARTICLES} set is_delete=1 where Id=?`
    db.query(sql_delete, req.params.id, (err, results) => {
        if (err) res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('根据id删除文章失败！')
        }

        // 删除文章内容对应的文件
        upfiler.deleteArticleFile(req.user.id, req.params.id)

        res.cc('根据id删除文章成功！', 0)
    })
}