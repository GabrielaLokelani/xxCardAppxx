const express = require("express");
const router = express.Router();
const authenticateLogin = require("../middleware/authenticateLogin");
const restrictRoute = require("../middleware/restrictRoute");
const Deck = require("../models/Deck");
const Card = require("../models/Card");
const DeckTag = require("../models/DeckTag");

// GET CREATE DECK PAGE

router.get(
    "/",
    authenticateLogin,
    restrictRoute,
    async function (req, res, next) {
        const currentCookie = req.cookies.selected_cards;

        let cards;
        if (currentCookie == undefined) {
            cards = [];
        } else {
            let selectedCards = JSON.parse(req.cookies.selected_cards);
            cards = await Card.find({
                _id: { $in: selectedCards },
            });
        }
        if (currentCookie != undefined) {
            cards.forEach((card) => {
                JSON.parse(currentCookie).forEach((id) => {
                    if (card._id.valueOf() == id) {
                        card.selected = true;
                    }
                });
            });
            res.render("createDeck", {
                cards: cards,
                loggedIn: res.authenticate,
                username: res.username,
            });
        } else {
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
            let messages = ["Please select cards before designing deck!"];
            res.render('index', { cards: cards, decks: decks, loggedIn: res.authenticate, username: res.username, messages: messages });
        }
    }
);

router.post(
    "/",
    authenticateLogin,
    restrictRoute,
    async function (req, res, next) {
        const deck = new Deck(req.body);
        const tags = req.body.tags.split(" ");
        deck.tags = tags;

        // TAGGING HERE
        if (req.body.tags != "") {
            tags.forEach(async (tag) => {
                let findTag = await DeckTag.findOne({ tag: tag }).exec();
                if (findTag == null) {
                    let newTag = new DeckTag({
                        tag: tag,
                        decks: [deck._id],
                    });
                    await newTag.save((err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("SAVED NEW DECK TAG:", doc);
                        }
                    });
                } else {
                    await DeckTag.findByIdAndUpdate(findTag._id, {
                        $push: { decks: deck._id },
                    }).exec();
                }
            });
            let selectedCards = req.cookies.selected_cards
            deck.cards = JSON.parse(selectedCards);
            deck.save((err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DECK SAVED:", doc);
                    res.clearCookie("selected_cards");
                    res.redirect("/");
                }
            });
        } else {
            let selectedCards = req.cookies.selected_cards
            deck.cards = JSON.parse(selectedCards);
            deck.save((err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DECK SAVED:", doc);
                    res.clearCookie("selected_cards");
                    res.redirect("/");
                }
            });
        }
    }
);

module.exports = router;
