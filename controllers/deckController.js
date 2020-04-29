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
const decks = async (list) =>{
    const entries = [];
    const le = list.length;

    for(let i = 0; i < le; i++){
        let en = list[i];
        let d = await deckModel.findOne({_id: en});
        entries.push(d);
    }
    return entries
};

const deckGetAll = async (req, res) => {
    try {
        const name = await req.query.user;
        if(name === undefined) {
            const model = await deckModel.find();
            res.json(model);
        }
        else{
            const user = await userModel.findOne({username: name});
            const ud = user.decks;
            const asd = await decks(ud);
            res.json(asd);
        }
    } catch (e) {
        console.error('deckGetAll', e);
    }
};
const deckAdd = async (req, res) => {
    try {
        const name = req.query.user;

        const post = await deckModel.create({
            name: req.query.name,
            user: name
        });
        const user = {username: name};
        await userModel.findOneAndUpdate(user, {decks: post._id});
        res.send(`Deck created with id: ${post._id}.`);
    } catch(e){
        console.error('deckAdd', e);
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