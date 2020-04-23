'use strict';

const mtg = require('mtgsdk');
const deckModel = require('../models/deck');
const userModel = require('../models/user');

const deckGet = async (req, res) => {
    try {
        const decks = await deckModel.findById(req.query.id);
        res.json(decks);
    } catch (e) {
        console.error('deckGet', e);
    }
};
const deckGetAll = async (req, res) => {
    try {
        const decks = await userModel.findById(req.query.id);
        res.json(decks);
    } catch (e) {
        console.error('deckGetAll', e);
    }
};
const deckAdd = async (req, res) => {
    try {
        const post = await deckModel.create({
            name: req.query.name,
            user: req.query.user
        });
        res.send(`Station created with id: ${post._id}.`);
    } catch(e){
        console.error('station_post', e);
    }
};
const deckDelete = async (req, res) => {

};
const deckModify = async (req, res) => {

};

module.exports = {
    deckAdd,
    deckDelete,
    deckModify,
    deckGet,
    deckGetAll,
};