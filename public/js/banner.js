'use strict';
const token = localStorage.getItem('token');
const logb = document.getElementById('logb');
const logf = document.getElementById('loginF');


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
});