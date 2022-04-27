// A simple card template to get started...
const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    cardName: String,
    cardDescription: String,
})


module.exports = mongoose.model('Card', cardSchema)