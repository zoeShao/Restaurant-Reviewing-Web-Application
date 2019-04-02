/* Global variables */
import {getLogInInfo, signOutUser} from './navBar.js';
let reviewLst = [];
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number

/* Examples(hardcode part) */


/* Full patrons entries element */
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody')
const pager = document.querySelector('#pager')
/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

getReviews()

/* Event listeners for button submit and button click */
dropDown.addEventListener('click', sortTheItem);
pager.addEventListener('click', changePage)

/*-----------------------------------------------------------*/
/*** 
Functions that don't edit DOM themselves, but can call DOM functions 
***/
// event handler function for sort 
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
	} 
}

// event handler function for change page
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
// show the content box for current page
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

// add the given review to the main body
function addReviewToDom(review) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = "#"
	const reviewElement = document.createElement('div')
	reviewElement.className = "storeContainer"
	const rateElement = addRateToDom(review.rate)
	const uNameElement = addUNameToDom(review.userName)
	const contentElement = document.createElement('p')
	contentElement.innerHTML = "<strong>Review: </strong>" + `${review.content}`
	reviewElement.appendChild(rateElement)
	reviewElement.appendChild(uNameElement)
	reviewElement.appendChild(contentElement)
	aElement.appendChild(reviewElement)
	contentBoxElement.appendChild(aElement)
	contentBody.appendChild(contentBoxElement)
}

//add the rate star to the DOM by given rate score
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

// add user name to DOM
function addUNameToDom(name) {
	const paraElement = document.createElement('p')
	paraElement.innerHTML = '<strong>From user: </strong>' + name
	return paraElement
}

/*-----------------------------------------------------------*/
/*** helper functions ***/
// sort function by name
function sortByName() {
	reviewLst.sort(function(a, b){
    if(a.rName < b.rName) { return -1; }
    if(a.rName > b.rName) { return 1; }
    return 0;
	})
}
// sort function by rate
function sortByRate() {
	reviewLst.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

// get reviews fro mserver
function getReviews(){
	const url = '/getResReview';
	$.ajax({
		url: url,
		method: 'get'
	}).done((res) =>{
		if(res.reviews){
			reviewLst = res.reviews;
			showPage(currentPage)
		}
	}).fail((error) =>{
		alert("cannot get reviews");
        console.log(error);
	})
}