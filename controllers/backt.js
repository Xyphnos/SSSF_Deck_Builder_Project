'use strict';

const mtg = require('mtgsdk');


const lotus = async (req, res) => {
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
                    entries.push({name: list[i].name, URL: list[i].imageUrl})
                }
            }
            console.log(dupecheck);
            return entries
        };

        res.json(cards(card))
    }
    catch(e){
        console.error('controller error', e)
    }
};

module.exports = {
    lotus,
};