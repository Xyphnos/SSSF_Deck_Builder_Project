'use strict';

const mtg = require('mtgsdk');


const lotus = async (req, res) => {
    try {
        const card = await mtg.card.find(3)
            .then(result => {
                return result.card.imageUrl
            });
        res.json(card)
    }
    catch(e){
        console.error('controller error', e)
    }
};


/*
const lotus = mtg.card.find(3)
    .then(result => {
        return result.card.imageUrl // "Black Lotus"
    });
*/

module.exports = {
    lotus,
};