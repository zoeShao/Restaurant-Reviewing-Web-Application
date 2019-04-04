
const log = console.log;
import {getLogInInfo, signOutUser} from './navBar.js';
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);


let maxShowingRestaurant = 2;
let maxPromotingRestaurant = 3;
const popularRestaurantsElement = document.getElementById("popularRestaurants");
const newRestaurantsElement = document.querySelectorAll('.promoteImg')

//initialize calls

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;
/*                               */

// InitializePopularRestaurants("Downtown-Toronto", maxShowingRestaurant);
addSlideShow() 
/***************Get data from server***************************/
//Get list of popular restaurant
function getListOfNewRestaurants(location){
  const url = '/newRestaurants';
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    return fetch(request)
}

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
    
    InitializePopularRestaurants("Downtown-Toronto", maxShowingRestaurant)
  }
}

function InitializePopularRestaurants(location, maxShowingRestaurant){
  getListOfPopularRestaurants(location).then((res) => {
    return res.json();
  }).then((resList) => {
    clearAllPopularRestaurants();
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
  form.action = "/resReviews/" + resObj._id;


  //change image source
  const img = form.children[0].children[0];
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
  img.className = "card-img-top img-fluid";
  img.style.height = "300px";
  img.style.width = "350px";
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

function clearAllPopularRestaurants(){
  while (popularRestaurantsElement.firstChild) {
    popularRestaurantsElement.removeChild(popularRestaurantsElement.firstChild);
  }
}

function addSlideShow() {
  getListOfNewRestaurants("Downtown-Toronto").then((res) => {
    return res.json();
  }).then((resList) => {
    const promoteLst = ["https://ffc.com/wp-content/uploads/2018/03/Welcome-New-Staff-FFC-Chicago-1030x687.jpg",
    "https://www.phillymag.com/wp-content/uploads/sites/3/2015/02/BestNewRestaurantLogo.jpg",
     "https://ffc.com/wp-content/uploads/2018/03/Welcome-New-Staff-FFC-Chicago-1030x687.jpg"]
    for (let i = 0; i < maxPromotingRestaurant; i++){
      if(i < resList.length){
          const aElement = document.createElement('a')
          aElement.href = "/resReviews/" + resList[i]._id
          const img = document.createElement('img');
          img.className = "slideImage"
          img.src = "/readImg/" + resList[i].picture;
          img.alt="Promote Picture"
          aElement.appendChild(img)
          newRestaurantsElement[i].appendChild(aElement)
          log(resList[i])
      } else {
          const img = document.createElement('img');
          img.className = "slideImage"
          img.src = promoteLst[i]
          img.alt="Promote Picture"
          newRestaurantsElement[i].appendChild(img)
          log(i)
      }
      
    }
  }).then((resList) => {
    InitializePopularRestaurants("Downtown-Toronto", maxShowingRestaurant);
  }).catch(error => {log(error);});
}

