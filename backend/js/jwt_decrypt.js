const jwt = require('jsonwebtoken')
const env = require('../glitch/process_env')

exports.decryptor = (req, res, next) => {

    if (/^\/api\//.test(req.path)) {
        next()
    }
    else {

        var bearerHeader 
        try {
            bearerHeader = req.headers['authorization']
        } catch(e) {
            e.name = 'UnauthorizedError'
            throw e
        }

        var bearer = bearerHeader.split(" ");
        var tokenStr = bearer[1];

        jwt.verify(tokenStr, env.jwtKey, (err, data) => {
            if (err) {
                err.name = 'UnauthorizedError'
                throw err
            }
            else {
                req.user = data
                next()
            }
        })
    }
}