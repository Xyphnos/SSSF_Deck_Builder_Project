'use strict';

const apiURL = 'http://localhost:3000/graphql';
const uName = document.getElementById('username');
const pWord = document.getElementById('password');
const form = document.getElementById('loginform');

/*
const fetchStuff = async (query) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify(query)
        };
        const response = await fetch(apiURL, options);
        const json = await response.json();
        return json
    }
    catch(e){
        console.error('fetch error', e);
    }
};

const loginUser = async (username, password) => {
    console.log('asd');
    const query = {
        username: `${username}`,
        password: `${password}`,
    };
    try{
        const result = await fetchStuff(query);
        localStorage.setItem('token', result.token);
    }catch(e){

    }
};*/


const login = async (evt) => {
    evt.preventDefault();
     //console.log(form.elements);
    const query = {
        query: `{
  login(username: "${uName.value}", password: "${pWord.value}") {
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
    try {
        const result = await fetchGraphql(query);
        localStorage.setItem('token', result.login.token);
    }
    catch (e) {
        console.log('login', e.message);
    }

};


form.addEventListener("submit", login);