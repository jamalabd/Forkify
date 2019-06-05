/* jshint esversion: 8 */
import axios from 'axios';
import {key} from '../config';
import {elements} from '../views/base';

export default class Search {
  constructor(query){
    this.query = query;
  }

  async getResults(){
    try{
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result);
    } catch(err){
        alert(error);
    }

  }
}
