'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name:  String,
    cmc: String,
    colors: [{type: String}],
    types: [{type: String}],
    subtypes: [{type: String}],
    power: String,
    toughness: String,
    imageUrl: String,
    cid: String,

});

module.exports = mongoose.model('Card', cardSchema);