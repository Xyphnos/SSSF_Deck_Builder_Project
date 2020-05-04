'use strict';

const modify = `http://localhost:3000/modify/`;
const editButton = document.getElementById('goEdit');
const deleteButton = document.getElementById('delD');
const ul = document.getElementById('cardGrid');
const DeckName = document.getElementById('DeckName');
const coverImage = document.getElementById('coverD');


const currentDeck = async () => {
    const location = window.location.pathname.split('/');
    const query = {
        query: `{
  deck(id: "${location[2]}"){
    id
    name
    cover
    cards{
        card{
            name
            cmc
            colors
            types
            subtypes
            power
            toughness
            imageUrl
            cid
        }
        amount
    }
    
  }
}
`,
    };
    try {
        const result = await fetchGraphql(query);
        return result
    }
    catch(e){
        console.log(e);
    }
};

const deleteDeck = async (user) =>{
    const location = window.location.pathname.split('/');
    const query = {
        query: ` mutation {
  deleteDeck(id: "${location[2]}", user: "${user}")
  {
  id
  }
}
`,
    };
    const result = await fetchGraphql(query);
    return result
};

const getCards = async () =>{
    const check =  await currentDeck();
    try{
        const json = await check.deck.cards;
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li class="CLBG"><a class="CL">${json[i].amount}x ${json[i].card.name}<img src=${json[i].card.imageUrl}></a></li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};

window.addEventListener('load', async (event) =>{
    const deck = await currentDeck();
    DeckName.innerText = deck.deck.name;
    coverImage.src = deck.deck.cover;
    await getCards();
});

editButton.addEventListener('click', (event) =>{
    event.preventDefault();
    const location = window.location.pathname.split('/');
    window.location = window.location.href = modify + `${location[2]}`
});
deleteButton.addEventListener('click', async (event) =>{
    event.preventDefault();
    let conf = confirm('Are you sure you want to delete this deck?');
    if(conf === true) {
        const check = await checkUser();
        await deleteDeck(check.id);
        window.location = window.location.href = profile + `${check.username}`;
    }
});