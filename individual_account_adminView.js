const log = console.log;

class User {
	constructor(image, name, email, password, type){
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.reviews = [];
    }
}

class Review {
	constructor(rName, uName, rate, price, content){
        this.rName = rName;
        this.uName = uName;
        this.rate = rate;
        this.price = price;
        this.content = content;
    }
}
let maxReviews = 3
let currentPage = 1
const userImg = document.createElement('img')
userImg.src = "avatar.jpg"
userImg.alt = "avatar Picture";
const user = new User(userImg, "user", "user@mail.com", "user", "i")
const review1 = new Review("McDonald's", "user", 3, 1, "here is the review.here is the review.here is the review.here is the review.")
const review2 = new Review("Osaka Sushi", "user", 4, 2, "here is the review.here is the review.")
const review3 = new Review("Asaka Sushi", "user", 5, 3, "here is the review.")
const review4 = new Review("Bsaka Sushi", "user", 5, 3, "here is the review.")
user.reviews.push(review2)
user.reviews.push(review1)
user.reviews.push(review3)
user.reviews.push(review4)

const accountBody = document.getElementById("accountBody");
if(accountBody){
    accountBody.style.overflow = "auto";
}
const userBanButton = document.getElementById("userBanButton");
if(userBanButton){
    userBanButton.addEventListener("click", banUser);
}

const popularRestaurants = document.getElementById("popularRestaurants");
if(popularRestaurants){
    popularRestaurants.addEventListener("click", removeRestaurants);
}

const commentsMainbody = document.getElementById("commentsMainbody");
if(commentsMainbody){
    commentsMainbody.addEventListener("click", removeComments);
}

const pager = document.querySelector('#pager');
if(pager){
    pager.addEventListener('click', changePage);
}

function banUser(e){
    if (e.target.classList.contains("btn")){
        //should label the user "banned" in database
        if(userBanButton.innerText == "Ban"){
            userBanButton.innerText = "Recover";
        } else if(userBanButton.innerText == "Recover"){
            userBanButton.innerText = "Ban";
        }
        
    }
}

function removeRestaurants(e){
    //should remove restaurants in database
    if (e.target.classList.contains("remove")){
        const restaurantToRemove = e.target.parentElement.parentElement.parentElement;
		popularRestaurants.removeChild(restaurantToRemove);
        
    }
}

function removeComments(e){
    //should remove comments in database
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
		if ((currentPage * 3) < user.reviews.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
		// console.log(currentPage)
	}
}

function showPage(currentPage) {
    let restPage = user.reviews.length - currentPage * 3
	if (restPage >= 0) {
		commentsMainbody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(user.reviews[j])
		}
	} else {
		restPage = maxReviews+restPage
		commentsMainbody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addReviewToDom(user.reviews[j])
		}
	}
}

{/* <button type="button" class="btn btn-light remove">Remove</button> */}
function addReviewToDom(review) {
	const contentBoxElement = document.createElement('div')
	contentBoxElement.className = "contentBox"
	const aElement = document.createElement('a')
	aElement.className = "reviewLink"
	aElement.href = "#"
	const reviewElement = document.createElement('div')
	reviewElement.className = "storeContainer"
	const nameElement = document.createElement('p')
	nameElement.innerHTML = "<strong>Restaurant name: </strong>" + `${review.rName}`
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
	return paraElement
}