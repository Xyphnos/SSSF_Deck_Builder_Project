 'use strict';
    const apiURL = 'http://localhost:3000/get';
    const input = document.getElementById('input');
    const search = document.getElementById('search');
    const ul = document.querySelector('ul');
    const form = document.querySelector('form');

 const lotus = fetch(apiURL)
     .then(response => response.json())
     .then(data => {
         console.log(data);
         return data;
     });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        ul.innerHTML = `<li><img id="card"></li>`;
        document.getElementById('card').src = lotus;
    });
