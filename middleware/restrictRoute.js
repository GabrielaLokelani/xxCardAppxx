const jwt = require('jsonwebtoken');


// RESTRICT ROUTE

const restrictRoute = function restrictRoute(req, res, next) {
        if (res.authenticate) {
            next()
        } else {
            res.redirect('/')
        }
}

module.exports = restrictRoute