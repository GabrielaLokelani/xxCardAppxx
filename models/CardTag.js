const mongoose = require('mongoose')
const { Schema } = mongoose


const cardTagSchema = mongoose.Schema({
    // to-do: validate cardTag as a single alphanumeric word
    tag: String,
    cards: [{type: Schema.Types.ObjectId, ref: 'Card'}]
})


module.exports = mongoose.model('CardTag', cardTagSchema);