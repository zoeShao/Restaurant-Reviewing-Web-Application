const log = console.log;

import {getLogInInfo, signOutUser} from './navBar.js';

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;
/*                               */

let maxReviews = 3
let currentPage = 1
let restaurantsList = []
let usersList = []
let reviewsList = []


const restaurantsBody = document.getElementById("restaurantsBody");
if(restaurantsBody){
    restaurantsBody.style.overflow = "auto";
}

const popularRestaurants = document.getElementById("popularRestaurants");
if(popularRestaurants){
	popularRestaurants.addEventListener("click", removeRestaurants);
	InitializeAdminRestaurants();

    
}

const commentsMainbody = document.getElementById("commentsMainbody");
if(commentsMainbody){
		commentsMainbody.addEventListener("click", removeComments);
		InitializeAdminReviews();
}

const banMainbody = document.getElementById("banMainbody");
const banBody = document.getElementById("banBody");
if(banBody){
	banBody.style.overflow = "auto";
}
if(banMainbody){
	banMainbody.addEventListener("click", banUser);
	InitializeAdminBanUsers();
}

const pager = document.querySelector('#pager');
if(pager){
    pager.addEventListener('click', changePage);
}

/*  get data from server */

//restaurant part
function getListOfRestaurants(){
	const url = '/admin/getAllRestaurants';
    // The data we are going to send in our request
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get', 
    });
    return fetch(request)
}

function InitializeAdminRestaurants(){
	getListOfRestaurants().then((res) => {
	  return res.json();
	}).then((resList) => {
	  for (let i = 0; i < resList.length; i++){
		addRestaurant()
		changeRestaurant(popularRestaurants.children[i], resList[i]);
	  }
	  restaurantsList = resList;
	  log(restaurantsList)
	}).catch(error => {log(error);});
}

function removeRestaurantFromServer(resObj){
	const data = {
		'restaurantToDelete': resObj
	}
	$.ajax({
		type: 'DELETE',
		url: 'removeRes/' + resObj._id,
		success: function(data, textStatus){
			alert('Remove the restaurant successfully!')
		},
		fail: function(xhr, textStatus, errorThrown){
			alert('Failed to remove the restaurant!');
		 } 
	})
}

function removeRestaurants(e){
	//server part TODO: should remove restaurants in database
	if (e.target.classList.contains("remove")){
		const restaurantToRemove = e.target.parentElement.parentElement.parentElement;
		const resAddress = e.target.parentElement.children[1].innerText;
		log(resAddress)
		let i = 0;
		let originalLength = restaurantsList.length;
		for(i = 0; i < restaurantsList.length; i++){
			if (restaurantsList[i].address == resAddress){
				log(restaurantsList[i])
				removeRestaurantFromServer(restaurantsList[i]);
				popularRestaurants.removeChild(restaurantToRemove);
				restaurantsList.splice(i, 1);
				log(restaurantsList)
				break;
			}
		}
		//cannot find the restaurant
		if(i == originalLength){
			alert("fail to find the restaurant!");
		}
	} 
}

//User part
function getListOfUsers(){
	const url = '/admin/getAllUsers';
    // The data we are going to send in our request
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get', 
    });
    return fetch(request)
}

function InitializeAdminBanUsers(){
	getListOfUsers().then((res) => {
	  return res.json();
	}).then((returnUserList) => {
	  for (let i = 0; i < returnUserList.length; i++){
		loadUsers(returnUserList[i]);
	  }
	  usersList = returnUserList;
	}).catch(error => {log(error);});
}

function banOrRecoverUser(userObj){
	const data = {
		'userToModify': userObj
	}
	log(userObj);
	$.ajax({
		"type": 'POST',
		"url": '/admin/banOrRecoverUser',
		"headers": {
			"Content-Type": "application/json",
		  },
		"processData": false,
		"data": JSON.stringify(data),
		success: function(data, textStatus){
			alert('Operation successful!')
		},
		fail: function(xhr, textStatus, errorThrown){
			alert('Fail to execute this operation!');
		 } 
	})
}

function banUser(e){
    if (e.target.classList.contains("btn")){
		//server part TODO: should label the user "banned" in database
		const userBanButton = e.target;
		const userName = userBanButton.parentElement.children[0].children[1].
		children[0].children[1].innerText;
		for(let i = 0; i < usersList.length; i++){
			if (usersList[i].name == userName){
				log(usersList[i])
				banOrRecoverUser(usersList[i]);
				break;
			}
		}
        if(userBanButton.innerText == "Ban"){
			userBanButton.innerText = "Recover";
			
        } else if(userBanButton.innerText == "Recover"){
            userBanButton.innerText = "Ban";
        }
        
    }
}

/*                             */

/*       admin comments part       */
function getListOfComments(){
	const url = '/getResReview';
    // The data we are going to send in our request
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'get', 
    });
    return fetch(request)
}

function InitializeAdminReviews(){
	getListOfComments().then((reviews) => {
	  return reviews.json();
	}).then((revList) => {
		reviewsList = revList.reviews;
		showPage(currentPage);
	  log(reviewsList)
	}).catch(error => {log(error);});
}

function removeComments(e){
    //server part TODO: should remove comments in database
    if (e.target.classList.contains("remove")){
        const commentToRemove = e.target.parentElement;
				commentsMainbody.removeChild(commentToRemove);
        
    }
}

function changePage(e) {
    e.preventDefault();
	if (e.target.classList.contains('previous')) {
		if (currentPage > 1) {
			currentPage = currentPage - 1
			showPage(currentPage)
		}
		// console.log(currentPage)

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < reviewsList.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
		// console.log(currentPage)
	}
}

function showPage(currentPage) {
    let restPage = reviewsList.length - currentPage * 3
	if (restPage >= 0) {
		commentsMainbody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(reviewsList[j])
		}
	} else {
		restPage = maxReviews+restPage
		commentsMainbody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(reviewsList[j])
		}
	}
}


function addReviewToDom(review) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = "#"
	const reviewElement = document.createElement('div')
	reviewElement.className = "storeContainer"
	const rateElement = addRateToDom(review.rate)
	const priceElement = addPriceToDom(review.price)
	const contentElement = document.createElement('p')
	contentElement.innerHTML = "<strong>Review: </strong>" + `${review.content}`
	reviewElement.appendChild(rateElement)
	reviewElement.appendChild(priceElement)
	reviewElement.appendChild(contentElement)
	aElement.appendChild(reviewElement)
    contentBoxElement.appendChild(aElement)
    //make remove button
    const button = document.createElement('button')
    button.type = "button";
    button.className = "btn btn-light remove";
    button.innerText = "Remove";
    contentBoxElement.appendChild(button);
    contentBoxElement.style.maxHeight = "250px";
    log(contentBoxElement);
	commentsMainbody.appendChild(contentBoxElement)
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
	return paraElement;
}

function loadUsers(userObj){
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	//make link
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = "#"
	//make username and email
	const reviewElement = document.createElement('div')
	reviewElement.className = "storeContainer"
	const nameElement = document.createElement('p')
	nameElement.innerHTML = "<strong>Username: </strong>" + `<span>${userObj.name}</span>`
	const contentElement = document.createElement('p')
	contentElement.innerHTML = "<strong>User email: </strong>" + `${userObj.email}`
	//make img
	const profilePicDiv = document.createElement('div');
	const profilePic = document.createElement('img');
	profilePic.src = "https://img.icons8.com/ios/50/000000/gender-neutral-user.png", "https://img.icons8.com/ios/50/000000/gender-neutral-user.png"//userObj.profilePic;
	profilePic.className = "rounded-circle";
	profilePicDiv.className = "float-left mr-3 portraitContainer";

	profilePicDiv.appendChild(profilePic); 
	aElement.appendChild(profilePicDiv);
	reviewElement.appendChild(nameElement);
	reviewElement.appendChild(contentElement);
	aElement.appendChild(reviewElement)
    contentBoxElement.appendChild(aElement)
    //make remove button
    const button = document.createElement('button')
    button.type = "button";
	button.className = "btn btn-dark remove";
	button.style.float = "right";
	if(userObj.banned){
		button.innerText = "Recover";
	} else{
		button.innerText = "Ban";
	}
    contentBoxElement.appendChild(button);
    contentBoxElement.style.minHeight = "150px";
    log(contentBoxElement);
	banMainbody.appendChild(contentBoxElement)
}

/* helper functions for restaurant page */
function changeRestaurant(restaurant, resObj){
	//change image source
	const img = restaurant.children[0].children[0];
	img.style.objectFit = "fill";
	img.src = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg";//resObj.picture;
  
	//change restaurant name
	const cardBody = restaurant.children[0].children[1];
	log(cardBody)
	const h4 = cardBody.children[0]
	const name = document.createElement("p")
	name.className = "text-primary"
	name.appendChild(document.createTextNode(resObj.name));
	h4.appendChild(name);

	//change address
	const addressSpan = cardBody.children[1];
	addressSpan.appendChild(document.createTextNode(resObj.address));

	//change show comments link
	const showCommentLink = cardBody.children[4];
	showCommentLink.href = '/resReviews/' + resObj._id;

  }
  
  function addRestaurant(){
	const colDiv = document.createElement('div');
	colDiv.className = "col-3 mb-4 mr-5";
	const card = document.createElement('div');
	card.className = "card h-100";
	const img = document.createElement('img');
	img.className = "card-img-top";
	const cardBody = document.createElement('div');
	cardBody.className = "card-body";
	const h4Title = document.createElement('h4');
	h4Title.className = "card-title";
	// address
	const addressSpan = document.createElement("span");

	//remove button
	const removeButton = document.createElement('button');
	removeButton.type = "button";
	removeButton.className = "btn btn-dark remove";
	removeButton.appendChild(document.createTextNode("Remove"));

	//show comments
	const showCommentLink = document.createElement('a');
	const showCommentBtn = document.createElement('button');
	showCommentBtn.type = "button";
	showCommentBtn.className = "btn btn-dark ml-3 showComments";
	showCommentBtn.appendChild(document.createTextNode("show comments"));
	showCommentLink.appendChild(showCommentBtn);
	h4Title.appendChild(document.createElement('a'));

	cardBody.appendChild(h4Title);
	cardBody.appendChild(addressSpan);
	cardBody.appendChild(document.createElement("br"));
	cardBody.appendChild(removeButton);
	cardBody.appendChild(showCommentLink);
	card.appendChild(img)
	card.appendChild(cardBody);
	colDiv.appendChild(card);
	popularRestaurants.appendChild(colDiv);
  }

  /*                      */