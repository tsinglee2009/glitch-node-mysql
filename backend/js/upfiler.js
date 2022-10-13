const fs = require('fs')
// 存储文件到本地

exports.getArticleFilePath = (userid, article_id) => {
    return `upfiles/user${userid}_ariticle${article_id}`
}

exports.deleteArticleFile = (userid, article_id) => {

    const savePath = exports.getArticleFilePath(userid, article_id)

    try { fs.unlinkSync(savePath) } catch(e) { }
}

exports.saveArticleFile = (userid, article_id, content, callback) => {

    const savePath = exports.getArticleFilePath(userid, article_id)

    fs.writeFile(savePath, content, 'utf8', function(err) {
        if (err) {
            return callback(err, "文件写入失败")
        } else {
            return callback(null, savePath)
        }
      })
}

exports.getArticleFileContent = (userid, article_id, callback) => {

    const savePath = exports.getArticleFilePath(userid, article_id)

    fs.readFile(savePath, 'utf8', callback)
}