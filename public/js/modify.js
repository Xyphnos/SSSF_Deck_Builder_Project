'use strict';

const apiURLu = 'http://localhost:3000/cardSearch';
const input = document.getElementById('input');
const inputC = document.getElementById('inputC');
const search = document.getElementById('search');
const ulCa = document.getElementById('cardL');
const ulCo = document.getElementById('coverL');
const sform = document.getElementById('searchForm');
const cform = document.getElementById('searchCover');
const loader1 = document.getElementById('loader-wrapper1');
const loader2 = document.getElementById('loader-wrapper2');


const fetchCard = async (search, ul, loader) => {
    try {
        loader.classList.toggle('fadeIn');
        const response = await fetch(apiURLu + '?name=' + JSON.stringify(search));
        console.log(response);
        const json = await response.json();
        console.log(json);
        for( let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li><a class="modEntry">${json[i].name}</a></li>`;
        }
        loader.classList.toggle('fadeOut');

    } catch (e) {
        console.error('test ', e);
        return false;
    }
};


sform.addEventListener("submit", async (event) => {
    event.preventDefault();
    ulCa.innerHTML = '';
    const que = input.value;
    fetchCard(que, ulCa, loader1);
});
cform.addEventListener("submit", async (event) => {
    event.preventDefault();
    ulCo.innerHTML = '';
    const que = inputC.value;
    fetchCard(que, ulCo, loader2);
});