'use strict';

const apiURLu = 'http://localhost:3000/cardSearch';
const apiURLe = 'http://localhost:3000/cardSearch/entries';
const single = `http://localhost:3000/single/`;
const input = document.getElementById('input');
const inputC = document.getElementById('inputC');
const search = document.getElementById('search');
const ulCa = document.getElementById('cardL');
const ulCo = document.getElementById('coverL');
const ulE = document.getElementById('info');
const sform = document.getElementById('searchForm');
const cform = document.getElementById('searchCover');
const saveForm =document.getElementById('saveDeck');
const loader1 = document.getElementById('loader-wrapper1');
const loader2 = document.getElementById('loader-wrapper2');
const loader3 = document.getElementById('loader-wrapper3');
const cardAmount = document.getElementById('amountI');
const newName = document.getElementById('renameInput');
const entryList =[];
const sendList = [];

const fetchCard = async (search, ul, loader) => {
    try {
        loader.classList.toggle('fadeIn');
        const response = await fetch(apiURLu + '?name=' + JSON.stringify(search));
        const json = await response.json();
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li><a class="modF" id="${json[i].id}">${json[i].name}</a></li>`;
        }
        loader.classList.remove('fadeIn');
        return json
    } catch (e) {
        console.error('test ', e);
        return false;
    }
};

const getEntries = async (list, loader) =>{
    try {
        loader.classList.toggle('fadeIn');
        for(let i = 0; i < list.length; i++) {
            const response = await fetch(apiURLe + '?id=' + JSON.stringify(list[i]));
            const json = await response.json();
            sendList.push({card: json[0], amount: list[i].amount});
        }
        loader.classList.remove('fadeIn');

        return sendList
    } catch (e) {
        console.error('test ', e);
        return false;
    }
};

const sendEntries = async (name, entries, loader) => {
    if(CID === undefined){
        CID = await currentDeck();
        CID = CID.deck.cover;
    }
    try {
        const Cuser = await checkUser();
        let a;
        const list =[];
        for(let i = 0; i < entries.length; i++) {
            const pwr = () =>{
                if(entries[i].card.power === undefined){
                    return ''
                } else{
                    return entries[i].card.power}};
            const tgh = () =>{
              if(entries[i].card.toughness === undefined){
                  return ''
              } else{
                  return entries[i].card.toughness}};
            a = {
                name: entries[i].card.name,
                cmc: entries[i].card.cmc,
                colors: entries[i].card.colors,
                types: entries[i].card.types,
                subtypes: entries[i].card.subtypes,
                power: pwr(),
                toughness: tgh(),
                imageUrl: entries[i].card.imageUrl,
                cid: entries[i].card.cid
            };

            list.push({card: a, amount: entries[i].amount});
        }
        console.log('list', list);
        const location = window.location.pathname.split('/');

        const variables = {
            id: location[2],
            name: name,
            cover: CID,
            cards: list,
            user: Cuser.id
        };
        console.log('variables', variables);
        const query = {
            query: ` mutation ( $id: ID!, $name: String!, $cover: String!, $cards: [modifyCards!]!, $user: ID!)
            {
              modifyDeck(
              id: $id,
              name: $name,
              cover: $cover,
              cards: $cards
              user: $user
              )
              {
                id
                name
                cover
                cards{
                card{
                  name
                }
                  amount
                } 
              }
            } 
            `,
            variables: JSON.stringify(variables)
        };
            loader.classList.toggle('fadeIn');
            const response = await fetchGraphql(query);
            console.log(response);

        loader.classList.remove('fadeIn');

    } catch (e) {
        console.error('test ', e);
        return false;
    }
};

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
            id
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


const currentCards = async() =>{
    const temp = await currentDeck();
    const currents = temp.deck.cards;
    if(currents === undefined){
        ulE.innerHTML = '';
    }
    else{
        for(let i = 0; i < currents.length; i++) {
            ulE.innerHTML += `<li><a class="modF" id="${currents[i].card.id}">${currents[i].amount}x ${currents[i].card.name}</a></li>`;
            sendList.push({card: currents[i].card, amount: currents[i].amount});
        }
    }

};

window.addEventListener('load', async (event) =>{
    await currentCards();
});

let picker1;
let picker2;
let picker3;
let CID;

ulCa.onclick = (event) =>{
    event.target.classList.toggle('active');
    let entry = {name: event.target.innerText, id: event.target.id};
    picker1 = entry;
};

document.getElementById('addB').onclick = () =>{
    entryList.push({id: picker1.id, amount: parseInt(cardAmount.value)});
    ulE.innerHTML += `<li><a id="${picker1.id}" class="modF">${cardAmount.value}x ${picker1.name}</a></li>`;
};

ulCo.onclick = (event) =>{
    event.target.classList.toggle('active');
    let entry = {name: event.target.innerText, id: event.target.id};
    picker2 = entry;
};

document.getElementById('addC').onclick = async () =>{
    ulCo.innerHTML = '';
    ulCo.innerHTML += `<p>your current cover card is</p>`;
    CID = await fetchCard(picker2.name, ulCo, loader3);
    CID = CID[0].URL;
};

ulE.onclick = (event) =>{
    event.target.classList.toggle('hide');
    let entry = {id: event.target.id};
    for(let i = 0; i < sendList.length; i++){
        if(sendList[i].card.id === entry.id){
            sendList.splice(i, 1);
        }
    }
    for(let i = 0; i < entryList.length; i++){
        console.log(entryList[0].id, entry.id);
        if(entryList[i].id === entry.id){
            entryList.splice(i, 1);
        }
    }

};



sform.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    ulCa.innerHTML = '';
    const que = input.value;
    await fetchCard(que, ulCa, loader1);
});

saveForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = window.location.pathname.split('/');
    let name;
    if(newName.value === ''){
        name = await currentDeck();
        name = name.deck.name;
    }
    else{
        name = newName.value;
    }
    console.log(name);
    await getEntries(entryList, loader2);
    await sendEntries(name, sendList, loader2);
    window.location = window.location.href = single + `${location[2]}`
});

cform.addEventListener("submit", async (event) => {
    event.preventDefault();
    ulCo.innerHTML = '';
    const que = inputC.value;
    await fetchCard(que, ulCo, loader3);
});

