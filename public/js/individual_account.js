import {getLogInInfo, signOutUser} from './navBar.js';

/* Global variables */
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number
let reviewLst = []
let store = null


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
pager.addEventListener('click', changePage)

getReviews()
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

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < reviewLst.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
	}
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addReviewToDom(review) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = "/resReviews/" + review.resID
	const reviewElement = document.createElement('div')
	reviewElement.className = "storeContainer"
	const nameElement = document.createElement('p')
	// nameElement.innerHTML = "<strong>Restaurant name: </strong>" 
	const url = '/restaurants/' + review.resID;
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.restaurant){
        	nameElement.innerHTML = "<strong>Restaurant name: </strong>" + `${review.resName}` + " <strong>(Address: </strong>" + `${res.restaurant.address}` + "<strong>)</strong>"
			const rateElement = addRateToDom(review.rate)
			const priceElement = addPriceToDom(review.price)
			const contentElement = document.createElement('p')
			contentElement.innerHTML = "<strong>Review: </strong>" + `${review.content}`
			reviewElement.appendChild(nameElement)
			reviewElement.appendChild(rateElement)
			reviewElement.appendChild(priceElement)
			reviewElement.appendChild(contentElement)
			aElement.appendChild(reviewElement)
			contentBoxElement.appendChild(aElement)
			contentBody.appendChild(contentBoxElement)
        }
        else{
            alert("cannot get restaurant");
        }
    }).fail((error) =>{
        alert("cannot get restaurant");
        console.log(error);
    })
}

/*-----------------------------------------------------------*/
/*** helper functions ***/
function showPage(currentPage) {
	let restPage = reviewLst.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(reviewLst[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(reviewLst[j])
		}
	}
}

function sortByName(user) {
	reviewLst.sort(function(a, b){
    if(a.rName < b.rName) { return -1; }
    if(a.rName > b.rName) { return 1; }
    return 0;
	})
}

function sortByRate(user) {
	reviewLst.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice(user) {
	reviewLst.sort(function(a, b){
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
function getReviews(){
    const url = '/getIndReviews';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.reviews){
        	console.log(res.reviews)
            reviewLst = res.reviews;
            showPage(currentPage);
            if (reviewLst.length === 0) {
            	const contentBoxElement = document.createElement('div')
            	contentBoxElement.className = "bodyInitial"
            	const contentElement = document.createElement('p')
            	contentElement.className = "emptyReview"
            	contentElement.innerHTML = "<strong>(You have not written any review yet.)</strong>"
            	contentBoxElement.appendChild(contentElement)
            	contentBody.appendChild(contentBoxElement)
            	// console.log(contentBody)
            }
        }
        else{
            alert("cannot get reviews");
        }
    }).fail((error) =>{
        alert("cannot get reviews");
        console.log(error);
    })
}