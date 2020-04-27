'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    name: String,
    cards: {
        card: [{ type: Schema.Types.ObjectId, ref: 'Card', default: [] }],
    },
    user: {
        user: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        required: true
    }
});

module.exports = mongoose.model('Deck', deckSchema);