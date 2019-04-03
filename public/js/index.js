
const log = console.log;
import {getLogInInfo, signOutUser} from './navBar.js';
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);


let maxShowingRestaurant = 2;
const popularRestaurantsElement = document.getElementById("popularRestaurants");

//initialize calls

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;
/*                               */

InitializePopularRestaurants("Downtown", maxShowingRestaurant);

/***************Get data from server***************************/


//Get list of popular restaurant
function getListOfPopularRestaurants(location){
	const url = '/popularRestaurants';
    // The data we are going to send in our request
    let data = {
        location: location
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    return fetch(request)
}
/************************************************/




function showMarkhamRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    //change drop down button text
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Markham";
    //get data from server 
    InitializePopularRestaurants("Markham", maxShowingRestaurant)
  }
}

function showDowntownRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Downtown-Toronto";
    
    InitializePopularRestaurants("Downtown", maxShowingRestaurant)
  }
}

function InitializePopularRestaurants(location, maxShowingRestaurant){
  getListOfPopularRestaurants(location).then((res) => {
    return res.json();
  }).then((resList) => {
    for (let i = 0; i < maxShowingRestaurant && i < resList.length; i++){
      if(popularRestaurantsElement.children.length < maxShowingRestaurant){
          addPopularRestaurant();
      }
      changeRestaurant(popularRestaurantsElement.children[i], resList[i]);
    }
  }).catch(error => {log(error);});
   
}

//helper function
function changeRestaurant(restaurant, resObj){
  //change link
  const form = restaurant.children[0].children[0]
  //TODO: fill up get link to restaurant
  form.action = "";


  //change image source
  const img = form.children[0].children[0];
  //TODO: change image source
  img.src = "/readImg/" + resObj.picture;

  //change name
  const cardBody = form.children[1];
  const h4 = cardBody.children[0]
  const btnLink = h4.children[0];
  btnLink.innerText = resObj.name;
}

function addPopularRestaurant(){
  const colDiv = document.createElement('div');
  colDiv.className = "col-lg-5 col-md-6 mb-4 mr-5";
  const card = document.createElement('div');
  card.className = "card h-100";

  const form = document.createElement('form');
  form.method = "get";

  const link = document.createElement('button');
  link.className = "resTitleLink";
  link.type = "submit";

  const img = document.createElement('img');
  img.className = "card-img-top";
  link.appendChild(img);
  form.appendChild(link);

  const cardBody = document.createElement('div');
  cardBody.className = "card-body";

  const h4Title = document.createElement('h4');
  h4Title.className = "card-title";

  const titleLink = document.createElement('button')
  titleLink.className = "resTitleLink";
  titleLink.type = "submit";

  h4Title.appendChild(titleLink);
  cardBody.appendChild(h4Title);
  
  form.appendChild(cardBody);
  card.appendChild(form)
  colDiv.appendChild(card);
  popularRestaurantsElement.appendChild(colDiv);
}


