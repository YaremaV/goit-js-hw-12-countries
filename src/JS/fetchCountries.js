import countriesList from '../template/template.hbs';
import API from './api-service';
import createList from '../template/createlist.hbs'

import { error } from '@pnotify/core';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';


var debounce = require('lodash.debounce');

const refs = {
    input: document.getElementById('#input'),
    countryCards: document.getElementById('#countries'),

}

refs.input.addEventListener('input', debounce(onSearch, 1000));


function onSearch(evt){
    evt.preventDefault();
    const inputValue = refs.input.value;
    console.log(inputValue)
    
    API.fetchCountries(inputValue)
        
        .then(response => {
      if (response.length === 1) {
        renderCountry(response);
        deleteError();
      } else if (response.length <= 10) {
          renderCountriesList(response);
      
        deleteError();
      } else {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      }
    })
        .catch(err => console.log(err))
        .finally(() => {
             refs.input.value = '';
        });
   
}



function renderCountry(country) {
    const markup = countriesList(country);
    refs.countryCards.innerHTML = markup;
    deleteError();
}

function renderCountriesList(country) {
  const markup = createList(country);
    refs.countryCards.innerHTML = markup;
    
  deleteError();
}

function deleteError() {
  const errorMessage = document.querySelector('.pnotify');
  if (document.body.contains(errorMessage)) {
    errorMessage.style.display = 'none';
  }
}
