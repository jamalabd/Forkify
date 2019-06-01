/* jshint esversion: 8 */
import axios from 'axios';
import {elements} from '../views/base';

export default class Search {
  constructor(query){
    this.query = query;
  }

  async getResults(){
    const key = 'ddbb4e58a7173fa9f3de0953a889aa29';
    try{
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result);
    } catch(err){
        alert(error);
    }

  }
}
