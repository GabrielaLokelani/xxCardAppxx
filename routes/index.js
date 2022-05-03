const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');



// GET HOME PAGE

router.get('/', authenticateLogin, async function(req, res, next) {
    let cards = await Card.find({}).lean();
    let decks = await Deck.find({}).lean();
    let messages = [];
    res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username, messages: messages });
});

router.post('/select/:id', authenticateLogin, restrictRoute, async function (req, res, next) {  
  const currentCookie = req.cookies.selected_cards;
  if (currentCookie == null) {
    res.cookie('selected_cards', [req.params.id]);
    res.redirect('/');
  } else {
    console.log("FAILED");
    res.redirect('/');
  }
})

module.exports = router;