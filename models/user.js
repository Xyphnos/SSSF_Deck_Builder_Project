'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    decks: [{ type: mongoose.Types.ObjectId, ref: 'Deck', default: []}],
});

module.exports = mongoose.model('User', userSchema);
