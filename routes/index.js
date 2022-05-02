const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin')
const Deck = require('../models/Deck')
const Card = require('../models/Card')
const CardTag = require('../models/CardTag')
const DeckTag = require('../models/DeckTag')



// GET HOME PAGE

router.get('/', authenticateLogin, async function(req, res, next) {

  // HANDLE QUERY LOGIC
  if (req.query.search != '' && req.query.search != undefined) {
    let cards = await Card.find({}).where('cardName').equals({'$regex' : req.query.search, '$options' : 'i'}).exec()
    let decks = await Deck.find({}).where('deckName').equals({'$regex' : req.query.search, '$options' : 'i'}).exec()
    let taggedCards = await CardTag.find({}).where('tag').equals({'$regex' : req.query.search, '$options' : 'i'}).populate('cards')
    if (taggedCards.length != 0) {
      taggedCards = taggedCards[0].cards
    }
    let taggedDecks = await DeckTag.find({}).where('tag').equals({'$regex' : req.query.search, '$options' : 'i'}).populate('decks')
    if (taggedDecks.length != 0) {
      taggedDecks = taggedDecks[0].decks
    }
    let messages = []
      res.render('index', { searched: req.query.search, cards: cards, decks: decks, taggedCards: taggedCards, taggedDecks: taggedDecks, loggedIn: res.authenticate, username: res.username, messages: messages });
  } else {
    let cards = await Card.find({}).lean()
    let decks = await Deck.find({}).lean()
    let messages = []
    res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username, messages: messages });
  }
});


// GET SEARCH ROUTE

// router.get('/search', authenticateLogin, async function(req, res, next) {

  // SEARCH LOGIC

  // if (req.query.search != '') {
  //     console.log(req.query.search)
  //     console.log("NOT SKIPPED")

      // const cards = await Card.find({}).where('cardName').equals({'$regex' : req.query.search, '$options' : 'i'}).exec()
  //     const decks = await Deck.find({}).where('deckName').equals({'$regex' : req.query.search, '$options' : 'i'}).exec()
      // const taggedCards = await CardTag.find({}).where('tag').equals({'$regex' : req.query.search, '$options' : 'i'}).populate('cards')
  //     console.log(taggedCards)
  //     let messages = []
  //         res.render('index', { cards: cards, decks: decks, taggedCards: taggedCards, loggedIn: res.authenticate, username: res.username, messages: messages });
  // console.log(cards)
  // } else if (req.query.search == '') {
  //     console.log("SKIPPED")
  //     res.redirect('/')
  // }
  // res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username});
// });

module.exports = router;