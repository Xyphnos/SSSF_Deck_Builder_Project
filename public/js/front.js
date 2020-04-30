'use strict';
const apiURLu = 'http://localhost:3000/decks';
const ul = document.getElementById('decklist');

const getEvery = async () =>{
    try{
        const result = await fetch(apiURLu);
        const json = await result.json();
        let limit;
        if(json.length < 10){
            limit = json.length;
        }
        else{
            limit = 10;
        }

        for( let i = 0; i < limit; i++) {
            ul.innerHTML += `<li><p>${json[i].name}<img src=${json[i].cover}></p></li>`;
        }
        loader.classList.toggle('fadeOut');
    }catch(e){

    }
};


window.addEventListener('load', async (event) =>{
    await getEvery();
});