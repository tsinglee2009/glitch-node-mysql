const db = require('../../js/database')
const upfiler = require('../../js/upfiler')
const fs = require('fs')

// 只保留一个文件
function get_single_file(req) {
    if (req.files.length === 0) return null
    for (var i = 1; i < req.files.length; i++)
        fs.unlinkSync(req.files[i].path)
    return req.files[0]
}

// 文章管理 - 根据id更新文章
module.exports = (req, res) => {

    var data = req.body
    data.pub_date = new Date()

    var file = get_single_file(req)
    
    // 检查封面图片的有效性，没有的话就不变
    if (file) {
        data.cover_img = file.path
        // 如果执行失败，删除文件
        res.cc_pre_fn = () => fs.unlinkSync(file.path)
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