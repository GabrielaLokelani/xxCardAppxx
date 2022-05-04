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
  let currentCookie = req.cookies.selected_cards;

  let cards = await Card.find({}).lean();
  let decks = await Deck.find({}).lean();
  if (currentCookie != undefined) {
    cards.forEach((card) => {
      JSON.parse(currentCookie).forEach((id) => {
        if (card._id.valueOf() == id) {
          card.selected = true
        }
      })
    })
  }
  let messages = [];
  res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username, messages: messages });
});

// SELECT CARDS

router.get('/select/:id', authenticateLogin, restrictRoute, async function (req, res, next) {
  let currentCookie = req.cookies.selected_cards;
  let cards = await Card.find({}).lean();
  let id = [req.params.id]
  if (currentCookie == undefined) {
    res.cookie('selected_cards', JSON.stringify(id));
  } else {
    let parsedCookie = JSON.parse(currentCookie);
    parsedCookie.push(req.params.id)
    console.log("SELECTED CARD IDs:", parsedCookie)
    res.clearCookie('selected_cards')
    res.cookie('selected_cards', JSON.stringify(parsedCookie))
  }
  if (currentCookie != undefined) {
    cards.forEach((card) => {
      JSON.parse(currentCookie).forEach((id) => {
        if (card._id.valueOf() == id) {
          card.selected = true
        }
      })
    })
  }

  res.redirect('/')
})

module.exports = router;