const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const User = require('../models/User');

router.get('/',  authenticateLogin, async function (req, res, next) {
    res.render('userAccount', { loggedIn: res.authenticate, username: res.username });
})

module.exports = router;