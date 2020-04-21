    'use strict';

    const apiURL = 'http://localhost:3000/get';
    const input = document.getElementById('input');
    const search = document.getElementById('search');
    const ul = document.querySelector('ul');
    const form = document.querySelector('form');

    const fetchCard = async (element) => {
        try {
            const response = await fetch(apiURL);
            const json = await response.json();
            console.log(json);
            element.src = json;
        } catch (e) {
            console.error('test ', e);
            return false;
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        ul.innerHTML = `<li><img id="card"></li>`;
        const image = document.getElementById('card');
        fetchCard(image);
    });
