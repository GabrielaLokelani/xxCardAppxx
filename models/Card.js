const mongoose = require('mongoose')
const { Schema } = mongoose


const cardSchema = mongoose.Schema({
    cardName: String,
    cardDescription: String,
    cardImage: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    ratings: [Number]
})


module.exports = mongoose.model('Card', cardSchema)