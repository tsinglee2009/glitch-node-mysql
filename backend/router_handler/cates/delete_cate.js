const db = require('../../js/database')

// 删除文章分类
module.exports = (req, res) => {

    if (req.params.id === 1) {
        return res.cc('默认分类禁止删除！')
    }

    // 删除文章分类至数据库
    const sql_update = `update ${req.USER_TABLE_CATES} set is_delete=1 where id=?`
    db.query(sql_update, req.params.id , (err, results) => {
        
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败！')
        }

        // 更新当前分类的文章为默认分类
        const sql_check = `select id from ${req.USER_TABLE_CATES} where alias="${db.default_cate_names.alias}"`
        db.query(sql_check, (err, results) => {
            if (err) return res.cc(err)
            if (results.length !== 1) return res.cc('查询分类失败！')
            // default id
            const default_id = results[0].id

            const sql_check_del = `select id from ${req.USER_TABLE_CATES} where id=${req.params.id}`
            db.query(sql_check_del, (err, results) => {
                if (err) return res.cc(err)
                if (results.length !== 1) return res.cc('查询类型id失败！')

                // deleted id
                const deleted_id = results[0].id

                // 更新被删除的分类文章列表
                const sql_update = `select Id from ${req.USER_TABLE_ARTICLES} where cate_id=${deleted_id}`
                db.query(sql_update, (err, results) => {
                    if (err) return res.cc(err)

                    var itrMap = new Map()
                    results.forEach((element, i) => itrMap.set(i + '', element.Id));
                    // 更新每篇文章的类型
                    update_article_cate(itrMap.entries(), { table: req.USER_TABLE_ARTICLES, id: default_id }, (err) => {
                        if (null !== err) return res.cc(err)
                        // 
                        res.send({
                            status: 0,
                            message: '删除文章分类成功！'
                        })
                    })
                })
            })
        })
    })

    // 轮询修改文章分类
    function update_article_cate(itr, data, callback) {

        var item = itr.next().value

        if (item) {
            const sql =  `update ${data.table} set cate_id=${data.id} where Id=${item[1]}`
            db.query(sql, (err, results) => {
                if (err) return callback(err)
                if (results.affectedRows !== 1) return callback('查询文章id结果异常')

                update_article_cate(itr, data, callback)
            });
        }
        else
        {
            callback(null)
        }
    }

}