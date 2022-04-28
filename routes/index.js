const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')

// GET HOME PAGE

router.get('/', authenticateLogin, function(req, res, next) {
  res.render('index', { loggedIn: res.authenticate, username: res.username });
});

module.exports = router;