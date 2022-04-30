const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')
const restrictRoute = require('../middleware/restrictRoute')
const Deck = require('../models/Deck')
const Card = require('../models/Card')

// GET ABOUT PAGE

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const cards = await Card.find({}).lean()
    res.render('createDeck', { cards: cards, loggedIn: res.authenticate, username: res.username });
});

router.post('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const deck = new Deck(req.body);
    deck.save((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("DECK SAVED!")
        }
    })
    res.redirect('/')
})

module.exports = router;

