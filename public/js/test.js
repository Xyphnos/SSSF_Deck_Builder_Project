    'use strict';

    const apiURL = 'http://localhost:3000/cardSearch';
    const input = document.getElementById('input');
    const search = document.getElementById('search');
    const ul = document.querySelector('ul');
    const form = document.querySelector('form');

    const fetchCard = async (search) => {
        try {
            const response = await fetch(apiURL + '?name=' + JSON.stringify(search));
            console.log(response);
            const json = await response.json();
            console.log(json);
            for( let i = 0; i < json.length; i++) {
                ul.innerHTML += `<li><img src=${json[i]}></li>`;
            }


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
