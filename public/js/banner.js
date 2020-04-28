'use strict';

const apiURLu = 'http://localhost:3000/graphql';
const token = localStorage.getItem('token');
const logb = document.getElementById('logb');
const logf = document.getElementById('loginF');

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
        const response = await fetch(apiURLu, options);
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
        logf.action = "profile.html";
        logb.innerText = "Profile";
        logb.onclick = "window.location.href = 'profile.html';";
    }
};

checkUser();

/*
const checkT = () =>{
    if(token !== null){
        logf.action = "profile.html";
        logb.innerText = "Profile";
        logb.onclick = "window.location.href = 'profile.html';";
    }
};

window.addEventListener('load', async (event) =>{
    console.log(token);
    checkT()
});*/