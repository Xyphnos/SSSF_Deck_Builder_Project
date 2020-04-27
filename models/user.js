'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    username: {type: String, unique: true},
    decks: [{ type: Schema.Types.ObjectId, ref: 'Deck' }],
    avatar: String,
});

module.exports = mongoose.model('User', userSchema);
