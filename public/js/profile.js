'use strict';

const apiURLi = 'http://localhost:3000/decks';
const apiURLu = 'http://localhost:3000/graphql';
const nform = document.getElementById('newDeck');
const bar = document.getElementById('create');
const ul = document.getElementById('decklist');

const getAll = async (username) =>{
    try{
        const result = await fetch(apiURLi + '?user=' + `${username}`);
        console.log(result);
        const json = await result.json();
        console.log('this is the getAll json', json);
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li><p>${json[i].name}<img src=${json[i].cover}></p></li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};


const fetchStuff = async (URL, query) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(query)
        };
        const response = await fetch(URL, options);
        const json = await response.json();
        console.log('This is the fetchStuff json', json);
        return json
    }
    catch(e){
        console.error('fetch error', e);
    }
};



const createNew = async (dname, username) => {
    console.log('asd');
    const query = {
        name: `${dname}`,
        user: `${username}`
    };
    try{
        const result = await fetchStuff(apiURLi, query);
        localStorage.setItem('token', result.token);
        window.location.href = 'modify.html';
    }catch(e){

    }
};

nform.addEventListener("submit", async (event) => {
    event.preventDefault();
    const deckName = create.value;
    createNew(deckName, username)
});