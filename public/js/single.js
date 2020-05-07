'use strict';

const modify = `https://env-4077056.jelastic.metropolia.fi/modify/`;
const editButton = document.getElementById('goEdit');
const deleteButton = document.getElementById('delD');
const ul = document.getElementById('cardGrid');
const DeckName = document.getElementById('DeckName');
const coverImage = document.getElementById('coverD');
const colors = document.getElementById('colors');
const cmc = document.getElementById('cmc');

//get the deck that user is currently in
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

//delete the current deck, only works if the user.deck.id and deck.user.id match
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

//get the cards of current deck
const getCards = async () =>{
    const check =  await currentDeck();
    try{
        const json = await check.deck.cards;
        for( let i = 0; i < json.length; i++) {
            let str = json[i].card.imageUrl;
            if(json[i].card.imageUrl !== null) {
                str = str.replace('http', 'https');
            }
            ul.innerHTML += `<li class="CLBG">
<a class="CL">${json[i].amount}x ${json[i].card.name}
<img class="singles" src=${str}>
</a>
</li>`;
        }
    }catch(e){
        console.error('getAll error ', e)
    }
};

//calculates the average mana cost of the nonland cards and gets all the colors from cards
const CMCC = async () =>{
  const current = await currentDeck();
  const clist = current.deck.cards;
  let TF = true;
  let cmcArray = [];
  let colorArray = [];
  let nonland = 0;
    //repeat for the amount unique of cards
  for(let i = 0; i < clist.length; i++){
      let types = clist[i].card.types;
      //check if the card is a land or not
      for(let i = 0; i < types.length; i++){
          if(types[i] === "Land"){
              TF = false
          }
      }
      //if not land get the cards amount, mana cost, color, and add the card amount to the amount of nonlands
      if(TF === true){
          cmcArray.push({cmc: clist[i].card.cmc, amount: clist[i].amount});
          colorArray.push(clist[i].card.colors);
          nonland += clist[i].amount;
      }
  }
    //count the average cost
  const avgCMC = () =>{
      let added = 0;
      let multi = 0;
      //for amount of unique nonlands
      for(let i = 0; i < cmcArray.length; i++){
          //add the mana cost multiplied by the cards amount to the variable to be counted later
          multi += cmcArray[i].cmc * cmcArray[i].amount;
          console.log(multi);
      }
      return multi / nonland
  };
  const colors = () =>{
      let list = [];
      //for amount of nonlands
      for(let i = 0; i < colorArray.length; i++){
          //for amount of colors in card
          for(let o = 0; o < colorArray[i].length; o++){
              //check if color is already in the list of colors
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
    let secure = deck.deck.cover;
    if(secure !== null) {
        secure = secure.replace('http', 'https');
    }
    DeckName.innerText = deck.deck.name;
    coverImage.src = secure;
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