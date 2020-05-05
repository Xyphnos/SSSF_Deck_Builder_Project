'use strict';

const modify = `https://env-4077056.jelastic.metropolia.fi/modify/`;
const editButton = document.getElementById('goEdit');
const deleteButton = document.getElementById('delD');
const ul = document.getElementById('cardGrid');
const DeckName = document.getElementById('DeckName');
const coverImage = document.getElementById('coverD');
const colors = document.getElementById('colors');
const cmc = document.getElementById('cmc');


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
            ul.innerHTML += `<li class="CLBG">
<a class="CL">${json[i].amount}x ${json[i].card.name}
<img class="singles" src=${json[i].card.imageUrl}>
</a>
</li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};


const CMCC = async () =>{
  const current = await currentDeck();
  const clist = current.deck.cards;
  let TF = true;
  let cmcArray = [];
  let colorArray = [];
  let nonland = 0;
  for(let i = 0; i < clist.length; i++){
      let types = clist[i].card.types;
      for(let i = 0; i < types.length; i++){
          if(types[i] === "Land"){
              TF = false
          }
      }
      if(TF === true){
          cmcArray.push({cmc: clist[i].card.cmc, amount: clist[i].amount});
          colorArray.push(clist[i].card.colors);
          nonland += clist[i].amount;
      }
  }
  const avgCMC = () =>{
      let added = 0;
      let multi = 0;
      for(let i = 0; i < cmcArray.length; i++){
          multi += cmcArray[i].cmc * cmcArray[i].amount;
          console.log(multi);
      }
      return multi / nonland
  };
  const colors = () =>{
      let list = [];
      for(let i = 0; i < colorArray.length; i++){
          for(let o = 0; o < colorArray[i].length; o++){
          if(list.includes(colorArray[i][o]) === false){
              list.push(colorArray[i][o])
          }
          }
      }
      return list
  };
  return {cmc: avgCMC(), colors: colors()}
};

window.addEventListener('load', async (event) =>{
    const deck = await currentDeck();
    const cmcc = await CMCC();
    DeckName.innerText = deck.deck.name;
    coverImage.src = deck.deck.cover;
    await getCards();
    colors.innerText = 'Deck colors :' + cmcc.colors;
    cmc.innerText = 'Average mana cost :' + cmcc.cmc;
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