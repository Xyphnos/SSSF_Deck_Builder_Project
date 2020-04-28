'use strict';

const uName = document.getElementById('username');
const pWord = document.getElementById('password');
const form = document.getElementById('loginform');

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
        window.location.href = 'profile.html';
    }
    catch (e) {
        console.log('login', e.message);
    }
};


form.addEventListener("submit", login);