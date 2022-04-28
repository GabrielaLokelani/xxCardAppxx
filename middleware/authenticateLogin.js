const jwt = require('jsonwebtoken');


// AUTHENTICATE JWT

const authenticateLogin = function authenticateLogin(req, res, next) {
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.authenticate = false
            next()
        } else {
            res.authenticate = true
            res.username = decoded.username
            res.id = decoded.id
            next()
        }
    })
}

module.exports = authenticateLogin