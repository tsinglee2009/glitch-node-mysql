// form-data 文章图片上传
const fs = require('fs')
const multer = require('multer')

// 文件上传后存储的位置
const uploadFolder = './uploads'
// 单个文件上传最大 4M
const max_size = 4 * 1000 * 1000

function createFolder(folder) {
    try {
        fs.accessSync(folder)
    } catch(e) {
        fs.mkdirSync(folder)
    }
}

createFolder(uploadFolder)

var  storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, uploadFolder)
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}.${file.originalname.replace(/.+\./g, '')}`)
    }
})

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: max_size
     },
})