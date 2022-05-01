const mongoose = require('mongoose')
const { Schema } = mongoose


const cardSchema = mongoose.Schema({
    cardName: String,
    cardLevel: Number,
    cardImage: String,
    cardDescription: String,
    cardPower: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    ratings: [Number]
})


module.exports = mongoose.model('Card', cardSchema);