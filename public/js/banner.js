'use strict';

const apiURL = 'http://localhost:3000/graphql';
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
        console.log('json from banner fetch',json);
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
    console.log('banner result ', result);
    if (result.user) {
        console.log('asdadsadasd');
        logb.innerText = "Logout";
        nav.innerHTML += `<li class="navRLi"><a href="profile.html">Profile</a></li>`;
        getAll(result.user.username)
    }
};

checkUser();
