const db = require('../../js/database')
const upfiler = require('../../js/upfiler')
const fs = require('fs')

// 文章管理 - 根据id更新文章
module.exports = (req, res) => {

    var data = req.body
    data.pub_date = new Date()
    
    // 检查封面图片的有效性，没有的话就不变
    if (req.file) {
        data.cover_img = req.file.path
        // 如果执行失败，删除文件
        res.cc_pre_fn = () => fs.unlinkSync(req.file.path)
    }

    // 文章内容等待保存到文件
    var article_content = data.content

    const savePath = upfiler.getArticleFilePath(req.user.id, data.Id)
    data.content = savePath // 不更新数据库中的文件路径

    const sql_update = `update ${req.USER_TABLE_ARTICLES} set ? where Id=?`
    db.query(sql_update, [ data, data.Id ], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('根据id更新文章失败！')
        }

        // 文章内容有更新
        if (savePath !== article_content) {
            upfiler.saveArticleFile(req.user.id, data.Id, article_content, (err, path) => {
                if (err) return res.cc(err)
                res.cc('根据id更新文章成功！', 0)
            })
        }
        else {
            res.cc('根据id更新文章成功！', 0)
        }
    })
}