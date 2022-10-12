const db = require('../../js/database')

// 游客模式：获取文章列表
module.exports = (req, res) => {

    var pagesize = req.body.pagesize
    var pagenum = req.body.pagenum
    var cate_id = req.body.cate_id

    var filter = cate_id ? ` and cate_id=${cate_id}` : ``

    // format date
    var format_date = (data) => data.pub_date = moment(new Date(Date(data.pub_date))).format('YYYY-MM-DD HH:mm:ss')

    // 获取文章列表
    const sql_get = `select Id,title,pub_date,state,cate_id from ev_articles where is_delete=0 and state="已发布"${filter} limit ?,?`
    db.query(sql_get, [ pagesize * pagenum, pagesize ], (err, results) => {
        // sql err
        if (err) return res.cc(err)
        // reuslts
        var data = results
        // 根据获得到的结果 查询文章分类名称
        if (data.length > 0) {

            var sql_filter = `where is_delete=0`
            var tyeps_map = new Map()
            // 分类
            if (cate_id) {
                sql_filter += ` and id=${cate_id}`
            } else {
                var types = ``
                data.forEach((item, i) => {
                    if (!tyeps_map.get(item.cate_id)) {
                        tyeps_map.set(item.cate_id, '?')
                        
                        if (i === 0) {
                            types = `id=${item.cate_id}`
                        } else {
                            types += ` or id=${item.cate_id}`
                        }
                    }
                })
                sql_filter += ` and ${types}`
            }

            const sql_check = `select id,name from ev_article_cates ${sql_filter}`
            db.query(sql_check, (err, results) => {
                // sql err 
                if (err) return res.cc(err)
                // results
                results.forEach((item) => tyeps_map.set(item.id, item.name))
                // success
                data.forEach((item) => {
                    item.cate_name = tyeps_map.get(item.cate_id)
                    format_date(item)
                    item.cate_id = undefined
                })
                // 响应给客户端
                res.send({
                    status: 0,
                    message: '游客模式：获取文章列表成功！',
                    data
                })
            })
        }
        else {
            // 响应给客户端
            res.send({
                status: 0,
                message: '游客模式：获取文章列表成功！',
                data
            })
        }
    })
}