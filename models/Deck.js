const mongoose = require('mongoose')
const { Schema } = mongoose


const deckSchema = mongoose.Schema({
    deckName: String,
    deckDescription: String,
    deckImage: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
    ratings: [Number]
})


module.exports = mongoose.model('Deck', deckSchema)