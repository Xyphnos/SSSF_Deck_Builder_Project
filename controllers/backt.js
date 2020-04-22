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
            const le = list.length;

            for(let i = 0; i < le; i++){
                entries.push(list[i].imageUrl)
            }

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