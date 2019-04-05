
const log = console.log;
import {getLogInInfo, signOutUser} from './navBar.js';
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);


let maxShowingRestaurant = 4;
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
	const url = '/popularRestaurants/' + location;
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get', 
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
    if (resList.length > 0){
      clearAllPopularRestaurants();
      for (let i = 0; i < maxShowingRestaurant && i < resList.length; i++){
        if(popularRestaurantsElement.children.length < maxShowingRestaurant){
            addPopularRestaurant();
        }
        changeRestaurant(popularRestaurantsElement.children[i], resList[i]);
      }
    }
  }).catch(error => {alert("Fail to get popular data from the server!");}
  )}

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
  let rate = addRateToDom(resObj.rate)
  let price = addPriceToDom(resObj.price)
  cardBody.children[1].appendChild(rate)
  cardBody.children[2].appendChild(price)
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
  // img.style.height = "300px";
  img.style.height = "200px";
  img.style.width = "350px";
  link.appendChild(img);
  form.appendChild(link);

  const cardBody = document.createElement('div');
  cardBody.className = "card-body";

  const h4Title = document.createElement('h4');
  h4Title.className = "card-title";
  const rate = document.createElement('div');
  const price = document.createElement("div");

  const titleLink = document.createElement('button')
  titleLink.className = "resTitleLink";
  titleLink.type = "submit";

  h4Title.appendChild(titleLink);
  cardBody.appendChild(h4Title);
  cardBody.appendChild(rate);
  cardBody.appendChild(price);

  
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

function addRateToDom(rate) {
  const paraElement = document.createElement('p')
  paraElement.className = "homeList"
  const strongElement = document.createElement('strong')
  strongElement.innerText = "Rate: "
  paraElement.appendChild(strongElement)
  const linkElement = document.createElement('link')
  linkElement.rel = "stylesheet"
  linkElement.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  paraElement.appendChild(linkElement)
  for (let i = 0; i < rate; i++) {
    const spanElement = document.createElement('span')
    spanElement.className = "fa fa-star checked"
    paraElement.appendChild(spanElement)
  }
  for (let i = rate; i < 5; i++) {
    const spanElement = document.createElement('span')
    spanElement.className = "fa fa-star"
    paraElement.appendChild(spanElement)
  }
  return paraElement
}

function addPriceToDom(rate) {
  const paraElement = document.createElement('p')
  paraElement.className = "homeList"
  let priceRate = ''
  for (let i = 0; i < rate; i++) {
    priceRate = priceRate + '$'
  }
  paraElement.innerHTML = '<strong>Price: </strong>' + priceRate
  return paraElement
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
      } else {
          const img = document.createElement('img');
          img.className = "slideImage"
          img.src = promoteLst[i]
          img.alt="Promote Picture"
          newRestaurantsElement[i].appendChild(img)
      }
      
    }
  }).then((resList) => {
    InitializePopularRestaurants("Downtown-Toronto", maxShowingRestaurant);
  }).catch(error => {alert("Fail to add restaurant to carousel!");});
}

/*** Search function */
$('#searchButtonLink').click(function(){
  const link = "/searchRestaurants/resName/" + $("#searchInput").val() + "/homePage";
  $("#searchBar").attr({
    'action': link
  })
})


/****                 */