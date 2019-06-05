/* jshint esversion: 8 */
import Search from './models/Search';
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

//** Global state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked object
const state = {};

// Search controller
// v    v    v
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if(query){
    // 2) New search object and add it to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);


    // 4) Search for recipes
    await state.search.getResults();

    // 5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }

});

// recipe controller
// v    v    v
const controlRecipe = () => {
  // Get ID from URL
  const id = window.location.hash.replace('#','');
  console.log(id);

  if (id) {
    // Prepare UI for changes

    // Create a new recipe object

    // Get recipe dataset

    // Calc servings and time

    // render recipe
  }


};

window.addEventListener('hashchange', controlRecipe);
