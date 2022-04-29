const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')
const restrictRoute = require('../middleware/restrictRoute')
const Deck = require('../models/Deck')
const Card = require('../models/Card')

// GET ABOUT PAGE

router.get('/', authenticateLogin, restrictRoute, function(req, res, next) {

    // TEST PLATFORM FOR SCHEMAS AND MONGO
    // NEW DECK

    const deck = new Deck()
    deck.deckName = "Cat Deck"
    deck.deckDescription = "A deck for cats and cat-like pets."
    deck.deckImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.E-8dUX4RrcU_kYtNfFg4dAHaHa%26pid%3DApi&f=1'
    deck.creator = res.id
    deck.tags = ['cats', 'furr', 'service animals']
    deck.cards = []
    deck.ratings = [1,1,3]
    deck.save()

    res.render('createDeck', { loggedIn: res.authenticate, username: res.username });
});

module.exports = router;

