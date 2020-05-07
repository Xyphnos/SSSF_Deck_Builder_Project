'use strict';

const single = `https://env-4077056.jelastic.metropolia.fi/single/`;
const ul = document.getElementById('decklist');

//get all the decks from database
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
        //limit the amount of decks to 15
        if(json.length < 15){
            limit = json.length;
        }
        else{
            limit = 15;
        }
        //create elements for the decks on the home page
        for( let i = 0; i < limit; i++) {
            let str = json[i].cover;
            if(json[i].cover !== null) {
                str = str.replace('http', 'https');
            }
            ul.innerHTML += `
<li class="CLBG">
<a class="DeckName" href="${single + json[i].id}">${json[i].name}
<img src=${str}>
</a></li>`;
        }
        loader.classList.toggle('fadeOut');
    }catch(e){

    }
};


window.addEventListener('load', async (event) =>{
    await getEvery();
});