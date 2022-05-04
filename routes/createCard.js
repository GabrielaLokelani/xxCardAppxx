const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const CardTag = require('../models/CardTag');


//GET CREATE CARD PAGE

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    res.render('createCard', { loggedIn: res.authenticate, username: res.username });
});

router.post('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const card = new Card(req.body);
    const tags = req.body.tags.split(' ');
    card.tags = tags;

    // TAGGING HERE
    if (req.body.tags != '') {
        tags.forEach(async (tag) => {
            let findTag = await CardTag.findOne({ tag: tag }).exec();
            if (findTag == null) {
                let newTag = new CardTag ({
                    tag: tag,
                    cards: [card._id]
                });
                await newTag.save((err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("SAVED NEW CARD TAG:", doc);
                    };
                })
            } else {
                await CardTag.findByIdAndUpdate(findTag._id, { $push: { cards: card._id } }).exec();
            };
        });
        card.creator = res.id
        card.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("CARD SAVED:", doc);
            };
        })
    } else {
        card.creator = res.id
        card.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("CARD SAVED:", doc);
            };
        });
    };
    res.redirect('/');
});

module.exports = router;