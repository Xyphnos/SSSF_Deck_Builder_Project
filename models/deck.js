const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deckSchema = new Schema({
    Name: String,
    cards: {
            card: [Number],
            required: true,
    }
});

module.exports = mongoose.model('Deck', deckSchema);