'use strict';

const form = document.getElementById('loginform');
const form2 = document.getElementById('registerform');

//send the login query
const login = async (evt) => {
    evt.preventDefault();
    const uName = document.getElementById('username');
    const pWord = document.getElementById('password');
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
        window.location.href = `${profile + uName.value}`
    }
    catch (e) {
        console.log('login', e.message);
    }
};

//register a user
const register = async (evt) => {
    evt.preventDefault();
    const nUser = document.getElementById('usernameR');
    const nPwd = document.getElementById('passwordR');
    const cPwd = document.getElementById('passwordRS');
    const email = document.getElementById('email');
    const warn = document.getElementById('matchWarning');
    //check that passwords match
    const pwdCheck = () =>{
        if(nPwd.value === cPwd.value){
            return nPwd
        }
        else{
            warn.innerText = 'Passwords do not match!'
        }
    };
    const query = {
        query: `mutation{
  registerUser( username: "${nUser.value}", password: "${pwdCheck().value}" email: "${email.value}",) {
    id
    username
    token
  }
}
`,
    };
    try {
        const result = await fetchGraphql(query);
        console.log(result);
        localStorage.setItem('token', result.registerUser.token);
        //redirect user to their profile
        window.location.href = `${profile + nUser.value}`
    }
    catch (e) {
        console.log('login', e.message);
    }
};


form.addEventListener("submit", login);
form2.addEventListener("submit", register);