const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const User = require('../models/User');

router.get('/', authenticateLogin, async function (req, res, next) {
    const user = await User.findById(res.id).populate("cardCollection");
    let createdCards = await Card.find({creator: res.id});
    let createdDecks = await Deck.find({creator: res.id});
    res.render('userAccount', {
        userImage: user.userImageUrl,
        createdDecks: createdDecks,
        createdCards: createdCards,
        cardCollection: user.cardCollection, 
        loggedIn: res.authenticate,
        username: res.username
    });
})

module.exports = router;