'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    Name: String,
    cards: {
            card: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
            required: true,
    }
});

module.exports = mongoose.model('Deck', deckSchema);