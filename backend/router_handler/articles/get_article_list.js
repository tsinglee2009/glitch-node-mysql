const db = require('../../js/database')
const moment = require('moment')

// 文章管理 - 获取文章列表
module.exports = (req, res) => {

    var pagesize = req.body.pagesize
    var pagenum = req.body.pagenum
    var state = req.body.state
    var cate_id = req.body.cate_id

    var filter = `where is_delete=0`
    // check option params
    if (cate_id && state) {
        filter += ` and cate_id=${cate_id} and state="${state}"`
    } else if (cate_id) {
        filter += ` and cate_id=${cate_id}`
    } else if (state) {
        filter += ` and state="${state}"`
    }

    // format date
    var formatter = (d) => {
        return moment(new Date(Date(d))).format('YYYY-MM-DD HH:mm:ss')
    }

    // 获取文章列表
    const sql_get = `select Id,title,pub_date,state,cate_id from ev_articles ${filter} limit ?,?`
    db.query(sql_get, [ pagesize * pagenum, pagesize ], (err, results) => {
        // sql err
        if (err) return res.cc(err)
        // success
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
                    item.pub_date = formatter(item.pub_date)
                    item.cate_id = undefined
                })
                // 响应给客户端
                res.send({
                    status: 0,
                    message: '获取文章列表成功！',
                    data
                })
            })
        }
        else {
            // 响应给客户端
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data
            })
        }
    })
}