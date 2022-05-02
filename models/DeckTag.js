const mongoose = require('mongoose')
const { Schema } = mongoose


const deckTagSchema = mongoose.Schema({
    // to-do: validate deckTag as a single alphanumeric word
    tag: String,
    decks: [{type: Schema.Types.ObjectId, ref: 'Deck'}]
})


module.exports = mongoose.model('DeckTag', deckTagSchema);