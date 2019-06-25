/* jshint esversion: 8*/
import {elements} from './base';

export const toggleLikeBtn = isLiked =>{
  const iconString = isLiked ? 'icon-heart': 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
  // icons.svg#icon-heart-outlined --- not Liked
  // icons.svg#icon-heart --- Liked
};

export const toggleLikeMenu = numlikes =>{
  elements.likesMeun.style.visibility = numlikes > 0 ? 'visible' :  'hidden';
};
