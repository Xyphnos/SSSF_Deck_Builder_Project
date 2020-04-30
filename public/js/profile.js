'use strict';

const apiURLi = 'http://localhost:3000/decks';
const modify = `http://localhost:3000/modify/`;
const nform = document.getElementById('newDeck');
const bar = document.getElementById('create');
const ul = document.getElementById('decklist');

const getAll = async (username) =>{
    try{
        const result = await fetch(apiURLi + '?user=' + `${username}`);
        const json = await result.json();
        console.log(json);
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li><a href="${modify + json[i]._id}">${json[i].name}<img src=${json[i].cover}></a></li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};


const createNew = async (dname, username, id) => {
    const query = {
        query: ` mutation {
        addDeck(name: "${dname}", user: "${username}") {
            id
            name
            cover
            cards {
                name
                imageUrl
            }
            user
        }
   }
   `,
    };
    try{
        const result = await fetchGraphql(query);
        const addedID = result.addDeck.id;
        localStorage.setItem('token', result.token);

        const query2 = {
            query: ` mutation {
        addDeckToUser( id: "${id}", decks: "${addedID}") {
        id
        }
   }
   `,
        };
        try {
            console.log(query);
            const res = await fetchGraphql(query2);
            console.log(res);
        }catch(e){

        }
        window.location.href = modify + `${dname}`;
    }catch(e){
        console.error(e);
    }
};

window.addEventListener('load', async (event) =>{
    const check = await checkUser();
    const username = check.username;
    await getAll(username);
});

nform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const check = await checkUser();
    const deckName = bar.value;
    const username = check.username;
    let uid = check.id;
    createNew(deckName, username, uid)
});