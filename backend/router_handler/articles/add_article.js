const db = require('../../js/database')
const fs = require('fs')

// 文章管理 - 发布新文章
module.exports = (req, res) => {
    
    // 检查封面图片的有效性
    if (!req.file) {
        return res.cc('发布新文章失败！封面图片不能为空！')
    }

    // 如果执行失败，删除文件
    res.cc_pre_fn = () => fs.unlinkSync(req.file.path)

    // 检查文章分类
    const sql_check = `select * from ev_article_cates where is_delete=0 and id=?`
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
        // 添加新文章
        const sql_insert = `insert into ev_articles set ?`
        db.query(sql_insert, new_article, (err, results) => {
            // sql err
            if (err) return res.cc(err)
            // results err
            if (results.affectedRows !== 1) {
                return res.cc('发布新文章失败！请稍后重试')
            }
            res.cc('发布新文章成功！', 0)
        })
    })
}