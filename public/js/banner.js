'use strict';

const apiURL = 'https://env-4077056.jelastic.metropolia.fi/graphql';
const profile = `https://env-4077056.jelastic.metropolia.fi/profile/`;
const token = localStorage.getItem('token');
const logb = document.getElementById('logB');
const nav = document.getElementById('navbar');

const fetchGraphql = async (query) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(query),
    };
    try {
        const response = await fetch(apiURL, options);
        const json = await response.json();
        return json.data;
    }
    catch (e) {
        console.log(e);
        return false;
    }
};

const checkUser = async () => {
    const query = {
        query: ` {
  user 
  {
    id
    username
    decks {
    id
    name
    cover
    cards{
    card{
    name
    }
    }
    }
    token
  }
}
`,
    };
    try {
        const result = await fetchGraphql(query);
        const info = result.user;
        return info
    }catch(e){
        console.log(e)
    }
};

const checkState = async() =>{
    let ifCheck = await checkUser();
    if(ifCheck){
        logb.href = '#';
        logb.innerText = 'Logout';
        logb.id = 'logOut';
        nav.innerHTML += `<li class="navRLi"><a href="${profile + ifCheck.username}">Profile</a></li>`;
        const logOut = document.getElementById('logOut');
        logOut.addEventListener('click', (event) =>{
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'https://env-4077056.jelastic.metropolia.fi/public/html/index.html';
        });
    }
};

checkState();