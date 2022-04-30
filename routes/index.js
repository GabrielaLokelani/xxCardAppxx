const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')
const Deck = require('../models/Deck')
const Card = require('../models/Card')

// GET HOME PAGE

router.get('/', authenticateLogin, async function(req, res, next) {
  const cards = await Card.find({}).lean()
  const decks = await Deck.find({}).lean()
  res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username});
});

module.exports = router;