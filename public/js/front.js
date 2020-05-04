'use strict';

const single = `http://localhost:3000/single/`;
const ul = document.getElementById('decklist');

const getEvery = async () =>{
    try{
        const query = {
            query: `{
        decks{
            id
            name
            cover
            cards{
            card{
                id
                name
                }
                amount
            }
            user
        }
   }
   `,
        };
        const result = await fetchGraphql(query);
        const json = await result.decks;
        console.log(json);
        let limit;
        if(json.length < 15){
            limit = json.length;
        }
        else{
            limit = 15;
        }
        for( let i = 0; i < limit; i++) {
            ul.innerHTML += `<li class="CLBG"><a class="DeckName" href="${single + json[i].id}">${json[i].name}<img src=${json[i].cover}></a></li>`;
        }
        loader.classList.toggle('fadeOut');
    }catch(e){

    }
};


window.addEventListener('load', async (event) =>{
    await getEvery();
});