const fs = require('fs')
// 存储文件到本地

// 文件上传后存储的位置
const uploadFolder = './upfiles'

function createFolder(folder) {
    try {
        fs.accessSync(folder)
    } catch(e) {
        fs.mkdirSync(folder)
    }
}

createFolder(uploadFolder)

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