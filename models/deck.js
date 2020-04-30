'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: {type: String, required: true},
    cover: String,
    cards: [{
        card: { type: Schema.Types.ObjectId, ref: 'Card'},
        amount: {type: String},
        default: [],
    }],
    user: {
        type: String,
        user: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        required: true
    }
});

module.exports = mongoose.model('Deck', deckSchema);