const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const DeckTag = require('../models/DeckTag');

// GET CREATE DECK PAGE

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const cards = await Card.find({}).lean();
    res.render('createDeck', { cards: cards, loggedIn: res.authenticate, username: res.username });
});

router.post('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const deck = new Deck(req.body);
    const tags = req.body.tags.split(' ');
    deck.tags = tags;

    // TAGGING HERE
    if (req.body.tags != '') {
        tags.forEach(async (tag) => {
            let findTag = await DeckTag.findOne({ tag: tag }).exec();
            if (findTag == null) {
                let newTag = new DeckTag ({
                    tag: tag,
                    decks: [deck._id]
                });
                await newTag.save((err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("SAVED NEW DECK TAG:", doc);
                    };
                });
            } else {
                await DeckTag.findByIdAndUpdate(findTag._id, { $push: { decks: deck._id } }).exec();
            };
        });
        deck.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("DECK SAVED:", doc);
            };
        })
    } else {
        deck.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("DECK SAVED:", doc);
            };
        });
    };
    res.redirect('/');
})

module.exports = router;