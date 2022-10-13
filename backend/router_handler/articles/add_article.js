const db = require('../../js/database')
const upfiler = require('../../js/upfiler')
const fs = require('fs')

// 文章管理 - 发布新文章
module.exports = (req, res) => {
    
    // 检查封面图片的有效性
    if (!req.file) {
        return res.cc('发布新文章失败！封面图片不能为空！')
    }

    // 如果执行失败，删除文件
    res.cc_pre_fn = () =>  fs.unlinkSync(req.file.path)

    // 检查文章分类
    const sql_check = `select * from ${req.USER_TABLE_CATES} where is_delete=0 and id=?`
    db.query(sql_check, req.body.cate_id, (err, results) => {
        // sql err
        if (err) return res.cc(err)
        // results err
        if (results.length !== 1) {
            return res.cc('发布新文章失败！文章分类不存在！')
        }
        // 附加uploads图片路径
        var new_article = {
            ...req.body,
            cover_img: req.file.path,
            pub_date: new Date(),
            author_id: req.user.id,
        }

        // 文章内容等待保存到文件
        var article_content = new_article.content
        new_article.content = 'preparing ...' // 等待写入文件

        // 添加新文章
        const sql_insert = `insert into ${req.USER_TABLE_ARTICLES} set ?`
        db.query(sql_insert, new_article, (err, results) => {
            // sql err
            if (err) return res.cc(err)
            // results err
            if (results.affectedRows !== 1) {
                return res.cc('发布新文章失败！请稍后重试')
            }
            // 将文章内容存储问文件
            var article_id = results.insertId
            upfiler.saveArticleFile(req.user.id, article_id, article_content, (err, path) => {
                if (err) return res.cc(err)
                // update db
                const sql_update = `update ${req.USER_TABLE_ARTICLES} set content="${path}" where Id=${article_id}`
                db.query(sql_update, (err, results) => {
                    if (err) return res.cc(err)
                    if (results.affectedRows !== 1) return res.cc('发布文章时更新内容路径失败！')
                    // 文件保存成功
                    res.cc('发布新文章成功！', 0)
                })
            })
        })
    })
}