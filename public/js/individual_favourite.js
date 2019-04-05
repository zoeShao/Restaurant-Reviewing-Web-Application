import {getLogInInfo, signOutUser} from './navBar.js';


/* Global variables */
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number
let favouriteLst = [];


/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody')
const pager = document.querySelector('#pager')

/* Load the initial page. */ 
// showPage(currentPage)

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

/* Event listeners for button submit and button click */
dropDown.addEventListener('click', sortTheItem);
pager.addEventListener('click', changePage);

getFavourite()
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
		console.log(currentPage)

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < favouriteLst.length) {
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
	aElement.href = "/resReviews/" + restaurant._id
	// aElement.href = "/restaurant_review?res_id=" + `${restaurant._id}`
	const url = '/readImg/';
	const storeImgElement = document.createElement('div')
	storeImgElement.classNmae = "storeImgContainer"
	const storeImg = document.createElement('img')
	storeImg.className = "storeImg"
	storeImg.src = url + restaurant.picture;
	// storeImg.src = restaurant.image
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
	let restPage = favouriteLst.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			addFavouriteToDom(favouriteLst[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			addFavouriteToDom(favouriteLst[j])
		}
	}
}

function sortByName() {
	favouriteLst.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function sortByRate() {
	favouriteLst.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice() {
	favouriteLst.sort(function(a, b){
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


//get all restaurants for this user and then display 
function getFavourite(){
    const url = '/getMyfavourites';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.restaurants){
        	console.log(res.restaurants)
            favouriteLst = res.restaurants;
            showPage(currentPage);
            if (favouriteLst.length === 0) {
            	const contentBoxElement = document.createElement('div')
            	contentBoxElement.className = "bodyInitial"
            	const contentElement = document.createElement('p')
            	contentElement.className = "emptyReview"
            	contentElement.innerHTML = "<strong>(You have not bookmarked any restaurant yet.)</strong>"
            	contentBoxElement.appendChild(contentElement)
            	contentBody.appendChild(contentBoxElement)
            	console.log(contentBody)
            }
        }
        else{
            alert("cannot get restaurants");
        }
    }).fail((error) =>{
        alert("cannot get restaurants");
        console.log(error);
    })
}