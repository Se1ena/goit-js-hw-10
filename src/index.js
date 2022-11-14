import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  if (!countryName) {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(addMarkUp)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function addMarkUp(data) {
  if (data.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.length >= 2 && data.length < 10) {
    refs.info.innerHTML = '';
    refs.list.innerHTML = data
      .map(item => {
        return `<li><img src=${item.flags.svg} width = 50px, height = 40px></img><span>${item.name.official}</span></li>`;
      })
      .join('');
    return;
  }
  refs.list.innerHTML = '';
  const country = data[0];
  refs.info.innerHTML = `<div class = 'one-card'><img src=${
    country.flags.svg
  } width = 50px, height = 40px></img><span class = 'name'>${
    country.name.official
  }</span></div>
    <p>Capital: <span class = 'text'>${country.capital}</span></p>
    <p>Population: <span class = 'text'>${country.population}</span></p>
    <p>Languages: <span class = 'text'>${Object.values(
      country.languages
    )}</span></p>
      `;
}

