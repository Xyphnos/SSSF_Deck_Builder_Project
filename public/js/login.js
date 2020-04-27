'use strict';

const apiURL = 'http://localhost:3000/auth/login';
const uName = document.getElementById('username');
const pWord = document.getElementById('password');
const form = document.getElementById('loginform');

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
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = uName.value;
    const pwd = pWord.value;
    loginUser(user, pwd)
});