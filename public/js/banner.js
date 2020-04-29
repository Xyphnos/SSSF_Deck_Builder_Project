'use strict';

const apiURL = 'http://localhost:3000/graphql';
const profile = `http://localhost:3000/profile/`;
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
    }
    token
  }
}
`,
    };
    const result = await fetchGraphql(query);
    const info = result.user;
    if (info) {
        logb.innerText = "Logout";
        nav.innerHTML += `<li class="navRLi"><a href="${profile + info.username}">Profile</a></li>`;
        getAll(info.username);
        return info
    }
};

checkUser();
