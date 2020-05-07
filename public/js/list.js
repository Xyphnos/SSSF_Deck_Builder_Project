    'use strict';

    const apiURLu = 'https://env-4077056.jelastic.metropolia.fi/cardSearch';
    const input = document.getElementById('input');
    const search = document.getElementById('search');
    const ul = document.getElementById('cardSL');
    const form = document.getElementById('searchForm');
    const loader = document.getElementById('loader-wrapper');

    //send the searched card name to the third party API as a query
    const fetchCard = async (search) => {
        try {
            loader.classList.toggle('fadeIn');
            const response = await fetch(apiURLu + '?name=' + JSON.stringify(search));
            console.log(response);
            const json = await response.json();
            console.log(json);
            //create the elements for the card images
            for( let i = 0; i < json.length; i++) {
                let str = json[i].URL;
                str = str.replace('http', 'https');
                ul.innerHTML += `<li class="CLBG">
<a class="CL">${json[i].name}<img class="singles" src=${str}></a></li>`;
            }
            loader.classList.remove('fadeIn')

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
