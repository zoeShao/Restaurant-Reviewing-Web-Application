import {getLogInInfo, signOutUser} from './navBar.js';
/* Class */
class User {
	constructor(image, name, email, password, type){
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.reviews = [];
        this.favourite = [];
    }
}

class Restaurant{
    constructor(image, name, phone, address, rate, price){
        this.image = image;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.rate = rate;
        this.price = price;
    }
}

/* Global variables */
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number

//Server part TODO: get data from the server and load them to the page

/* Examples(hardcode part) */
const storeImg1 = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg"
const storeImg2 = "http://markhamosakasushi.ca/wp-content/uploads/osaka-front.jpg"
const store1 = new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", 3, 1)
const store2 = new Restaurant(storeImg2, "Osaka Sushi", "0987654321", "5762 Hwy 7, Markham", 4, 2)
//These examples are just for test purpose (sort)
const storeImg3 = "http://4designer.t7yb.net/files/2017110610/Cartoon-Pizza-Restaurant-26180.jpg"
const storeImg4 = "http://4designer.t7yb.net/files/2017110610/Cartoon-Pizza-Restaurant-26180.jpg"
const storeImg5 = "http://4designer.t7yb.net/files/2017110610/Cartoon-Pizza-Restaurant-26180.jpg"
const store3 = new Restaurant(storeImg3, "ATest1", "1234567890", "1 (name) St, City1", 5, 3)
const store4 = new Restaurant(storeImg4, "BTest2", "0987654321", "2 (name) St, City2", 1, 3)
const store5 = new Restaurant(storeImg5, "CTest3", "1234567890", "3 (name) St, City3", 2, 1)
// create a user
const userImg = "avatar.jpg"
const user = new User(userImg, "user", "user@mail.com", "user", "i")
// Add these restaurants to the user's favourite array (does not change the DOM)
user.favourite.push(store1)
user.favourite.push(store2)
// These examples are just for test purpose (sort)
user.favourite.push(store3)
user.favourite.push(store4)
user.favourite.push(store5)

/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody')
const pager = document.querySelector('#pager')

/* Load the initial page. */ 
showPage(currentPage)

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

/* Event listeners for button submit and button click */
dropDown.addEventListener('click', sortTheItem);
pager.addEventListener('click', changePage);

/*-----------------------------------------------------------*/
/*** 
Functions that don't edit DOM themselves, but can call DOM functions 
***/
function sortTheItem(e) {
	e.preventDefault();
	if (e.target.classList.contains('dropdown-name')) {
		contentBody.innerText = ""
		sortByName(user)
		showPage(currentPage)
	} else if (e.target.classList.contains('dropdown-rate')) {
		contentBody.innerText = ""
		sortByRate(user)
		showPage(currentPage)
	} else if (e.target.classList.contains('dropdown-price')) {
		contentBody.innerText = ""
		sortByPrice(user)
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
		console.log(currentPage)

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < user.favourite.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
		console.log(currentPage)
	}
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addFavouriteToDom(restaurant) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	if (restaurant.name == "McDonald's") {
		aElement.href = "review_page.html"
	} else {
		aElement.href = "#"
	}
	const storeImgElement = document.createElement('div')
	storeImgElement.classNmae = "storeImgContainer"
	const storeImg = document.createElement('img')
	storeImg.className = "storeImg"
	storeImg.src = restaurant.image
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
function showPage(currentPage) {
	let restPage = user.favourite.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addFavouriteToDom(user.favourite[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addFavouriteToDom(user.favourite[j])
		}
	}
}

function sortByName(user) {
	user.favourite.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function sortByRate(user) {
	user.favourite.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice(user) {
	user.favourite.sort(function(a, b){
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