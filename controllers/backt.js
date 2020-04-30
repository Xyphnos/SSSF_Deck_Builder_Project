'use strict';

const mtg = require('mtgsdk');


const cardSearch = async (req, res) => {

    try {

        const query = req.query;
        let name = query.name;
        let id = query.id;

        if(name !==  undefined) {
            name = JSON.parse(name);
        }
        if(id !==  undefined) {
            id = JSON.parse(id);
        }

        /*
        const card = await mtg.card.find(id)
            .then(result => {
                return result.card
            });
         */

        const card = await mtg.card.where({ name: name});


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
            console.log(entries);
            return entries
        };

        res.json(cards(card))
    }
    catch (e) {
        console.error('controller error', e)
    }
};

const entrySearch = async (req, res) => {

    try {

        const query = req.query;
        let name = query.name;
        let id = query.id;

        if(name !==  undefined) {
            name = JSON.parse(name);
        }
        if(id !==  undefined) {
            id = JSON.parse(id);
        }

        /*
        const card = await mtg.card.find(id)
            .then(result => {
                return result.card
            });
         */

        const card = await mtg.card.where({ name: name});


        const cards = (list) =>{
            const entries = [];
            const dupecheck = [];
            const le = list.length;

            for(let i = 0; i < le; i++){
                if(dupecheck.includes(list[i].name) === false && list[i].imageUrl !== undefined) {
                    dupecheck.push(list[i].name);
                    entries.push({
                        name: list[i].name,
                        cmc: list[i].cmc,
                        colors: list[i].colors,
                        types: list[i].types,
                        subtypes: list[i].subtypes,
                        power: list[i].power,
                        toughness: list[i].toughness,
                        imageURL: list[i].imageUrl,
                        cid: list[i].id,
                    })
                }
            }
            console.log(entries);
            return entries
        };

        res.json(cards(card))
    }
    catch (e) {
        console.error('controller error', e)
    }
};


module.exports = {
    cardSearch,
    entrySearch
};