'use strict';

const mtg = require('mtgsdk');

//since duplicate/unwanted entries sometimes make it to the database, this function will filter the duplicate names and cards with no image
const cards = (list) =>{
    const entries = [];
    const dupecheck = [];
    const le = list.length;

    for(let i = 0; i < le; i++){
        if(dupecheck.includes(list[i].name) === false && list[i].imageUrl !== undefined) {
            dupecheck.push(list[i].name);
            entries.push({name: list[i].name, URL: list[i].imageUrl, id: list[i].id})
        }
    }
    return entries
};


//function to search cards by name user has provided and return image, name, and id
const cardSearch = async (req, res) => {

    try {

        const query = req.query;
        let name = query.name;
        let id = query.id;

        if(name !==  undefined) {
            name = JSON.parse(name);
        }

        const card = await mtg.card.where({ name: name});

        res.json(cards(card))
    }
    catch (e) {
        console.error('controller error in card search', e)
    }
};

//function to search cards by id and return all the info to add to database
const entrySearch = async (req, res) => {
    try {
        const query = req.query;
        let id = query.id;

        if(id !==  undefined) {
            id = JSON.parse(id);
        }

        const card = await mtg.card.where({ id: id.id});

        res.json(cards(card))
    }
    catch (e) {
        console.error('controller error in entry search')
    }
};


module.exports = {
    cardSearch,
    entrySearch
};