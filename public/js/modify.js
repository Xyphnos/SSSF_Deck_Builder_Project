'use strict';

const apiURLu = 'http://localhost:3000/cardSearch';
const apiURLe = 'http://localhost:3000/cardSearch/entries';
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
const aLink = document.getElementsByClassName('modF');
const newName = document.getElementById('renameInput');
const entryList =[];
const sendList = [];


const fetchCard = async (search, ul, loader) => {
    try {
        loader.classList.toggle('fadeIn');
        const response = await fetch(apiURLu + '?name=' + JSON.stringify(search));
        console.log(response);
        const json = await response.json();
        console.log(json);
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
            console.log(response);
            const json = await response.json();
            sendList.push(json);
        }
        loader.classList.remove('fadeIn');
        return sendList
    } catch (e) {
        console.error('test ', e);
        return false;
    }
};

const sendEntries = async (entries, loader) => {
    try {
        const name =currentDeck().name;
        const query = {
            query: ` {
              deck(
              id: "${location[2]}"
              name: "${name}",
              cover: "${CID}"
              cards: "${entries}"
              )
              {
                id
                name
                cover
                cards{
                name
                cid
                }
                
              }
            }
            `,
        };
        loader.classList.toggle('fadeIn');
        const response = await fetchGraphql(query);
        console.log(response);
        const json = await response.json();
        console.log(json);
        loader.classList.remove('fadeIn');

    } catch (e) {
        console.error('test ', e);
        return false;
    }
};

const currentDeck = async () =>{
    const location = window.location.pathname.split('/');
    const query = {
        query: ` {
  deck(id: "${location[2]}")
  {
    id
    name
    cover
    cards{
    name
    cid
    }
    
  }
}
`,
    };
    const result = await fetchGraphql(query);
    console.log(result);
    return result
};

const currentCards = () =>{
    const currents = currentDeck().cards;
    if(currents === undefined){
        ulE.innerHTML = '';
    }
    else{
        for(let i = 0; i < currents.length; i++) {
            ulE.innerHTML += `<li><a class="modF" id="${currents[i].card.id}">${currents[i].amount} + 'x' +${currents[i].card.name}</a></li>`;
            entryList.push({id: currents.card.id, amount: currents[i].amount});
        }
    }

};
currentCards();

let picker;
let CID;

ulCa.onclick = (event) =>{
    event.target.classList.toggle('active');
    let entry = {name: event.target.innerText, id: event.target.id};
    picker = entry;
};

document.getElementById('addB').onclick = () =>{
    const no = document.getElementById('amountI');
    entryList.push({id: picker.id, amount: no.value});
    console.log(entryList);
    ulE.innerHTML += `<li><a class="modF">${picker.name}</a></li>`;
};

ulCo.onclick = (event) =>{
    event.target.classList.toggle('active');
    let entry = {name: event.target.innerText, id: event.target.id};
    picker = entry;
};

document.getElementById('addC').onclick = async () =>{
    ulCo.innerHTML = '';
    ulCo.innerHTML += `<p>your current cover card is</p>`;
    CID = await fetchCard(picker.name, ulCo, loader3);
    CID = CID[0].URL;
};

sform.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    ulCa.innerHTML = '';
    const que = input.value;
    await fetchCard(que, ulCa, loader1);
});

saveForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let name;
    if(newName.value == null){
        name = await currentDeck().name;
    }
    else{
        name = newName.value;
    }
    getEntries(entryList, loader2);
    sendEntries(ulE, loader2);
});

cform.addEventListener("submit", async (event) => {
    event.preventDefault();
    ulCo.innerHTML = '';
    const que = inputC.value;
    await fetchCard(que, ulCo, loader3);
});

