'use strict';

const mtg = require('mtgsdk');

const lotus = async () => {
    try {
        res.json(
            await mtg.card.find(3) // "Black Lotus"
        )
    }
    catch(e){
        console.error(e)
    }
};


module.exports = {
    lotus,
};