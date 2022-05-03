const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');

// GET ABOUT PAGE

router.get('/', authenticateLogin, function(req, res, next) {
    res.render('about', { loggedIn: res.authenticate, username: res.username });
});

module.exports = router;