import {getLogInInfo, signOutUser} from './navBar.js';
/* Global variables */
const log = console.log;
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number
let allRestaurantsData = [];

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;
/* 														*/

// call get data function 
getRestaurantDataFromServer();

/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody')
const pager = document.querySelector('#pager')
const chineseLink = document.querySelector("#chineseLink");
const fastfoodLink = document.querySelector("#fastFoodLink");
const japaneseLink = document.querySelector("#japaneseLink");
const koreanLink = document.querySelector("#koreanLink");
const americanLink = document.querySelector("#americanLink");
const markhamLink = document.querySelector("#markhamLink");
const downtownLink = document.querySelector("#downtownLink");

/* Load the initial page. */ 
showPage(currentPage)

/* Event listeners for button submit and button click */
dropDown.addEventListener('click', sortTheItem);
pager.addEventListener('click', changePage);
chineseLink.addEventListener('click', showChineseRes);
fastfoodLink.addEventListener('click', showFastFoodRes);
japaneseLink.addEventListener('click', showJapaneseRes);
koreanLink.addEventListener('click', showKoreanRes);
americanLink.addEventListener('click', showAmericanRes);
markhamLink.addEventListener('click', showMarkhamRes);
downtownLink.addEventListener('click', showDowntownRes);




/*-----------------------------------------------------------*/
/*** 
Get data from server
***/

function getRestaurantDataFromServer(){
  const url = '/getRestaurants';
  const request = new Request(url, {
    method: 'get',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });
  fetch(request).then((res) => {
    if(res.status == 204){
    } else{
      return res.json()
    }
    
  }).then((restaurants) =>{
    if(restaurants){
	  allRestaurantsData = restaurants.res;
	  showRestaurants(allRestaurantsData);
    }
    
  }).catch(error => {alert("Fail to show restaurants on page")})
}

function sendOutSearchRequest(content, searchType){
	const url = '/searchRestaurants/' + searchType + "/" + content + "/search_page";
  
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get'
    });
    fetch(request).then((res) => {
		if(res.status == 204){
		} else{
		  return res.json()
		}
		
	  }).then((restaurants) =>{
		if(restaurants){
		  allRestaurantsData = restaurants.res;
		  showRestaurants(allRestaurantsData);
		}
		
	}).catch(error => {alert("Fail to send search request!")})
}
/*-----------------------------------------------------------*/
/*** 
Button event listeners functions
***/
function pressButtonState(pressedLink){
	chineseLink.style.textDecoration = "";
	fastfoodLink.style.textDecoration = "";
	japaneseLink.style.textDecoration = "";
	koreanLink.style.textDecoration = "";
	americanLink.style.textDecoration = "";
	markhamLink.style.textDecoration = "";
	downtownLink.style.textDecoration = "";
	pressedLink.style.textDecoration = "underline"
}

function showChineseRes(e){
    if(e.target.classList.contains("foodCatLink")){
				pressButtonState(chineseLink);
        sendOutSearchRequest("Chinese", "category");
    }
}

function showFastFoodRes(e){
    if(e.target.classList.contains("foodCatLink")){
				pressButtonState(fastfoodLink);
        sendOutSearchRequest("Fast Food", "category");
    }
}

function showJapaneseRes(e){
    if(e.target.classList.contains("foodCatLink")){
			pressButtonState(japaneseLink);
			sendOutSearchRequest("Japanese", "category");
    }
}
function showKoreanRes(e){
    if(e.target.classList.contains("foodCatLink")){
			pressButtonState(koreanLink);
			sendOutSearchRequest("Korean", "category");
    }
}
function showAmericanRes(e){
    if(e.target.classList.contains("foodCatLink")){
			pressButtonState(americanLink);
			sendOutSearchRequest("American", "category");
    }
}

function showMarkhamRes(e){
    if(e.target.classList.contains("foodCatLink")){
			pressButtonState(markhamLink);
			sendOutSearchRequest("Markham", "location");
    }
}

function showDowntownRes(e){
    if(e.target.classList.contains("foodCatLink")){
			pressButtonState(downtownLink);
			sendOutSearchRequest("Downtown-Toronto", "location");
    }
}
//search bar
$("#searchBtn").click(
	function(){
		sendOutSearchRequest($("#searchInput").val(), "resName");
	}
)

/*-----------------------------------------------------------*/
/*** 
Functions that don't edit DOM themselves, but can call DOM functions 
***/
function sortTheItem(e) {
	e.preventDefault();
	if (e.target.classList.contains('dropdown-name')) {
		contentBody.innerText = ""
		sortByName()
		showPage(currentPage)
	} else if (e.target.classList.contains('dropdown-rate')) {
		contentBody.innerText = ""
		sortByRate()
		showPage(currentPage)
	} else if (e.target.classList.contains('dropdown-price')) {
		contentBody.innerText = ""
		sortByPrice()
		showPage(currentPage)
	}
}

function changePage(e) {
	e.preventDefault();
	if (e.target.classList.contains('previous')) {
		if (currentPage > 1) {
			currentPage = currentPage - 1
			showPage(currentPage)
		}

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < allRestaurantsData.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
	}
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addFavouriteToDom(restaurant) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = '/resReviews/' + restaurant._id;
	const storeImgElement = document.createElement('div')
	storeImgElement.classNmae = "storeImgContainer"
	const storeImg = document.createElement('img')
	storeImg.className = "storeImg"
	storeImg.src = '/readImg/'+ restaurant.picture;
	storeImg.alt = "Store Picture";
	storeImgElement.appendChild(storeImg)
	aElement.appendChild(storeImgElement)
	const favouriteElement = document.createElement('div')
	favouriteElement.className = "storeInfoContainer"
	const nameElement = document.createElement('p')
	nameElement.innerHTML = "<strong>Restaurant name: </strong>" + `${restaurant.name}`
    const rateElement = addRateToDom(restaurant.rate)
	const priceElement = addPriceToDom(restaurant.price)
	const addressElement = document.createElement('p')
	addressElement.innerHTML = "<strong>Restaurant address: </strong>" + `${restaurant.address}`
	favouriteElement.appendChild(nameElement)
	favouriteElement.appendChild(rateElement)
	favouriteElement.appendChild(priceElement)
	favouriteElement.appendChild(addressElement)
	aElement.appendChild(favouriteElement)
	contentBoxElement.appendChild(aElement)
	contentBody.appendChild(contentBoxElement)
}

/*-----------------------------------------------------------*/
/*** helper functions ***/

function showEmptyResult(){
	const div = document.createElement('div');
	div.className = "alert alert-danger";
	div.appendChild(document.createTextNode("Sorry, we can't find any results"));
	const mainBody = document.getElementById("mainBody");
	mainBody.appendChild(div);
}

function showRestaurants(restaurants){
    clearPage();
    for(let i = 0; i < restaurants.length; i++){
        allRestaurantsData.push(restaurants[i]);
    }
    if(allRestaurantsData.length > 0){
        showPage(currentPage);
    } else{
			showEmptyResult();
		}
    
}

function clearPage(){
    allRestaurantsData = [];
    const mainBody = document.getElementById("mainBody");
    while (mainBody.firstChild) {
        mainBody.removeChild(mainBody.firstChild);
    }
}

function showPage(currentPage) {
	let restPage = allRestaurantsData.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			addFavouriteToDom(allRestaurantsData[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			addFavouriteToDom(allRestaurantsData[j])
		}
	}
}

function sortByName() {
	allRestaurantsData.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function sortByRate() {
	allRestaurantsData.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice() {
	allRestaurantsData.sort(function(a, b){
    if(a.price < b.price) { return -1; }
    if(a.price > b.price) { return 1; }
    return 0;
	})
}

function addRateToDom(rate) {
	const paraElement = document.createElement('p')
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
	let priceRate = ''
	for (let i = 0; i < rate; i++) {
		priceRate = priceRate + '$'
	}
	paraElement.innerHTML = '<strong>Price: </strong>' + priceRate
	return paraElement
}