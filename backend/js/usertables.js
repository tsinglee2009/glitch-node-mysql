const db = require('./database')

module.exports = (req, res, next) => {
    
    try {
        var userid = req.user.id

        if (userid) {
            req.USER_TABLE_CATES = db.get_user_cates_table_name(userid)
            req.USER_TABLE_ARTICLES = db.get_user_articles_table_name(userid)
        }
    }
    catch(e) {

    }

    next()
}