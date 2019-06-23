/* jshint esversion: 8 */
import axios from 'axios';
import {key} from '../config';

export default class Recipe {
  constructor(id){
    this.id =id;
  }

  async getRecipe(){
    try{
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error){
      console.log(error);
      alert('something went wrong!');
    }
  }


  calcTime(){
    // Asuming we need at lest 15min for every 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng/3);
    this.time = periods * 15;
  }

  calcServings(){
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // 1) uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i)=>{
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });


      // 2) remove parenthases
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


      // 3) parse ingredients into count, unit and ingrediant
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng;
        if(unitIndex > -1){
          // there is a unit


          const arrCount = arrIng.slice(0,unitIndex);
          let count;
          if (arrCount.length ===1) {
            count = eval(arrIng[0].replace('-','+'));
          }else {
            count = eval(arrIng.sclice(0, unitIndex).join('+'));
          }

          objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          };



        } else if (parseInt(unitsShort[0],10)) {
          // there is no unit but first elemet is number
          objIng = {
            count: parseInt(unitsShort[0],10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ')
          };
        }else if (unitIndex === -1) {
          // there is no unit and no number
          objIng = {
            count: 1,
            unit: '',
            ingredient
          };
        }




      return objIng;
    });

    this.ingredients = newIngredients;

  }
  updateServings(type){
    // servings
    const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;

    // ingrediants

    this.ingredients.forEach(el =>{
      ing.count *= (ing.count/newServings);
    });
    this.servings = newServings;
  }
}
