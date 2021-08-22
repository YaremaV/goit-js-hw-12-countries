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

let inputValue = '';

refs.input.addEventListener('input', debounce(onSearch, 1000));


function onSearch(evt){
    evt.preventDefault();
  inputValue = evt.target.value;
  let newInputValue = inputValue.trim();

  if (!newInputValue) {
   refs.countryCards.innerHTML = '';
    return;
  }
  console.log(inputValue)
  
  // if (inputValue === '') {
  //   try {
  //      renderCountriesList().reset
  //   console.log('Пустая строка ввода')
  //   } catch {
  //     alert('Incorrect input! Please try again')
  //    }
  // }
    
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
        .catch(err => alert('Incorrect input! Please try again'))
        // .finally(() => {
        //      refs.input.value = '';
        // });
   
}



function renderCountry(country) {
    const markupList = countriesList(country);
    refs.countryCards.innerHTML = markupList;
    deleteError();
}

function renderCountriesList(country) {
  const markup = createList(country);
  refs.countryCards.innerHTML = markup;
  if (refs.input.value === '') {
    renderCountriesList.reset()
  }
    
  deleteError();
}

function deleteError() {
  const errorMessage = document.querySelector('.pnotify');
  if (document.body.contains(errorMessage)) {
    errorMessage.style.display = 'none';
  }
}

