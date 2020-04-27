    'use strict';

    const apiURL = 'http://localhost:3000/cardSearch';
    const input = document.getElementById('input');
    const search = document.getElementById('search');
    const ul = document.querySelector('ul');
    const form = document.getElementById('searchForm');
    const loader = document.getElementById('loader-wrapper');
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

    const fetchCard = async (search) => {
        try {
            loader.classList.toggle('fadeIn');
            const response = await fetch(apiURL + '?name=' + JSON.stringify(search));
            console.log(response);
            const json = await response.json();
            console.log(json);
            for( let i = 0; i < json.length; i++) {
                ul.innerHTML += `<li><p>${json[i].name}</p><img src=${json[i].URL}></li>`;
            }
            loader.classList.toggle('fadeOut');

        } catch (e) {
            console.error('test ', e);
            return false;
        }
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        ul.innerHTML = '';
        const que = input.value;
        fetchCard(que);
    });
