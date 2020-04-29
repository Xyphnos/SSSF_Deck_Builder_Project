'use strict';

const uName = document.getElementById('username');
const pWord = document.getElementById('password');
const form = document.getElementById('loginform');

const login = async (evt) => {
    evt.preventDefault();
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
        console.log('login query', query);
        const result = await fetchGraphql(query);
        localStorage.setItem('token', result.login.token);
        //window.location.href = 'profile.html';
        window.location.href = `${profile + uName.value}`
    }
    catch (e) {
        console.log('login', e.message);
    }
};


form.addEventListener("submit", login);