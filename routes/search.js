const express = require("express");
const router = express.Router();
const authenticateLogin = require("../middleware/authenticateLogin");
const restrictRoute = require("../middleware/restrictRoute");
const Deck = require("../models/Deck");
const Card = require("../models/Card");
const CardTag = require("../models/CardTag");
const DeckTag = require("../models/DeckTag");

// GET SEARCH RESULTS

router.get("/", authenticateLogin, async function (req, res, next) {
  console.log("SEARCHED!")
  // HANDLE QUERY LOGIC
  if (req.query.search != "" && req.query.search != undefined) {
    let cards = await Card.find({})
      .where("cardName")
      .equals({ $regex: req.query.search, $options: "i" })
      .exec();
    let decks = await Deck.find({})
      .where("deckName")
      .equals({ $regex: req.query.search, $options: "i" })
      .exec();
    let taggedCards = await CardTag.find({})
      .where("tag")
      .equals({ $regex: req.query.search, $options: "i" })
      .populate("cards");
    if (taggedCards.length != 0) {
      taggedCards = taggedCards[0].cards;
    };
    let taggedDecks = await DeckTag.find({})
      .where("tag")
      .equals({ $regex: req.query.search, $options: "i" })
      .populate("decks");
    if (taggedDecks.length != 0) {
      taggedDecks = taggedDecks[0].decks;
    };
    let messages = [];
    res.render("index", {
      searched: req.query.search,
      cards: cards,
      decks: decks,
      taggedCards: taggedCards,
      taggedDecks: taggedDecks,
      loggedIn: res.authenticate,
      username: res.username,
      messages: messages,
    });
  } else {
    res.redirect('/');
  };
});

router.post("/select/:id", authenticateLogin, restrictRoute, async function (req, res, next) {
  const currentCookie = req.cookies.selected_cards;
  if (currentCookie == null) {
    res.cookie("selected_cards", [req.params.id]);
    res.redirect("/");
  } else {
    console.log("FAILED");
    res.redirect("/");
  };
});

module.exports = router;