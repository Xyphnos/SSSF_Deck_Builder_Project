'use strict';

const modify = `https://env-4077056.jelastic.metropolia.fi/modify/`;
const single = `https://env-4077056.jelastic.metropolia.fi/single/`;
const nform = document.getElementById('newDeck');
const bar = document.getElementById('create');
const ul = document.getElementById('decklist');

//gets all the decks that the current user has made
const getAll = async () =>{
    const check = await checkUser();
    console.log(check.decks);
    try{
        const json = await check.decks;
        console.log(json);
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li class="CLBG"><a class="DeckName" href="${single + json[i].id}">${json[i].name}<img src=${json[i].cover}></a></li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};

//creates a new deck for the user
const createNew = async (id) => {
    //this part creates the empty deck ad gives the deck a user
    const query = {
        query: ` mutation {
        addDeck(user: "${id}") {
            id
            name
            user
        }
   }
   `,
    };
    try{
        const result = await fetchGraphql(query);
        const addedID = result.addDeck.id;
        console.log(result);

        //this part adds the deck to the user
        const query2 = {
            query: ` mutation {
        addDeckToUser( id: "${id}", decks: "${addedID}") {
        id
        }
   }
   `,
        };
        try {
            const res = await fetchGraphql(query2);
        }catch(e){

        }
        //redirect the user to modify their new, and currently empty deck
        window.location.href = modify + `${addedID}`;
    }catch(e){
        console.error(e);
    }
};

window.addEventListener('load', async (event) =>{
    await getAll();
});

nform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const check = await checkUser();
    let uid = check.id;
    createNew(uid)
});