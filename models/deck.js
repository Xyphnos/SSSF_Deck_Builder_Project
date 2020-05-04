'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: {type: String, required: true, default: "NewDeck"},
    cover: String,
    cards: [{
        card: {
            type: mongoose.Types.ObjectId, ref: 'Card',
        },
        amount: String,
    }],
    user: {
        type: String,
        user: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
        required: true
    }
});

module.exports = mongoose.model('Deck', deckSchema);