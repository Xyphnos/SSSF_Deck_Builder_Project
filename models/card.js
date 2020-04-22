'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: {type: String, unique: true},
    cmc: {type: String, unique: true},
    colors: {type: String, unique: true},
    types: {type: String, unique: true},
    subtypes: {type: String, unique: true},
    power: {type: String, unique: true},
    toughness: {type: String, unique: true},
    imageUrl: {type: String, unique: true},
    id: {type: String, unique: true},

});

module.exports = mongoose.model('Card', cardSchema);