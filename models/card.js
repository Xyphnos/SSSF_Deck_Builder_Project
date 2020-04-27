'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: {type: String, unique: true},
    cmc: String,
    colors: String,
    types: [{type: String}],
    subtypes: [{type: String}],
    power: String,
    toughness: String,
    imageUrl: {type: String, unique: true},
    id: {type: String, unique: true},

});

module.exports = mongoose.model('Card', cardSchema);