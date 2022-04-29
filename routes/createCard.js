const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')
const restrictRoute = require('../middleware/restrictRoute')
const Deck = require('../models/Deck')
const Card = require('../models/Card')

//GET THE CREATE CARD PAGE

router.get('/', authenticateLogin, restrictRoute, function(req, res, next) {
    res.render('createCard', { loggedIn: res.authenticate, username: res.username });
});

router.post('/', authenticateLogin, restrictRoute, function(req, res, next) {

    const card = new Card(req.body);
    card.save((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("CARD SAVED!")
        }
    })
    res.redirect('/')
});

module.exports = router;