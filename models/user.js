'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    username: String,
    decks: [{ type: Schema.Types.ObjectId, ref: 'Deck' }]
});

module.exports = mongoose.model('User', userSchema);
