/* jshint esversion: 8 */
import Search from './models/Search';
import Recipe from './models/recipe';
import List from './models/list';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    }catch (error) {
      alert(':( somethings not right');
      clearLoader();
    }

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
const controlRecipe = async () => {
  // Get ID from URL
  const id = window.location.hash.replace('#','');

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight Selected Search Itoms
    if(state.search) searchView.highlightSelected(id);

    // Create a new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe dataset and parse ingrediants
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Calc servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch (error) {
      console.log(error);
      alert('error somethings not right :(');
    }
  }


};


['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


// list contoller
const controlList = () =>{
  // creat a new list is there is not one
  if (!state.list) state.list = new List();

  // add each ingredient to the new list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// handle deleting and updating list items
elements.shopping.addEventListener('click', e =>{
  　const id = e.target.closest('.shopping__item').dataset.itemid;
  // delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')){
    // delete from state
    state.list.deletItem(id);

    // delete from UI
    listView.deletItem(id);

    // handle count update
  }else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});



// likes controller
const controllike = () =>{
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // user has not yet liked current recipe
  if(!state.likes.isLiked(currentID)){

    // add likes to state data
    const newLike = state.likes.addLikes(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // toggle the likes button
    likesView.toggleLikeBtn(true);

    // Add likes to the UI list
    likesView.renderLike(newLike);

  // user has liked current recipe
  } else {

    // remove likes from state data
    state.likes.deleteLike(currentID);

    // toggle the likes button
    likesView.toggleLikeBtn(false);


    // Remove likes from the UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes one page load
window.addEventListener('load', ()=>{
  state.likes = new Likes();
  // restore likes
  state.likes.readStorage();
  // toggle like menu
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // render existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrese button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }

  }else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add ingredients to shopping list
    controlList();
  }else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // likes controller
    controllike();
  }
});
