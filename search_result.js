/* Class */

// class User {
// 	constructor(image, name, email, password, type){
//         this.image = image;
//         this.name = name;
//         this.email = email;
//         this.password = password;
//         this.type = type;
//         this.reviews = [];
//         this.favourite = [];
//     }
// }

class Restaurant{
    constructor(image, name, phone, address, page, rate, price){
        this.image = image;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.page = page;
        this.rate = rate;
        this.price = price;
        
    }
}

/* Global variables */
let maxReviews = 3 // max Contents one page can show
let currentPage = 1 // current page number
let currentPageRestaurants = [];

/* Examples(hardcode part) */
const storeImg1 = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg"
const store1 = new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", "review_page.html", 3, 1)


// create a currentPageRestaurants
const userImg = "avatar.jpg"
// Add these restaurants to the user's favourite array (does not change the DOM)
currentPageRestaurants.push(store1)


/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody')
const pager = document.querySelector('#pager')
const chineseLink = document.querySelector("#chineseLink");
const fastfoodLink = document.querySelector("#fastFoodLink");
const japaneseLink = document.querySelector("#japaneseLink");
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
markhamLink.addEventListener('click', showMarkhamRes);
downtownLink.addEventListener('click', showDowntownRes);

/*-----------------------------------------------------------*/
/*** 
Button event listeners functions
***/
function showChineseRes(e){
    if(e.target.classList.contains("foodCatLink")){
        const chineseRes = []
        //make server call to get all the Chinese restaurants in the array
        showRestaurants(chineseRes);
    }
}

function showFastFoodRes(e){
    if(e.target.classList.contains("foodCatLink")){
        const fastFoodRes = []
        //make server call to get all the fast food restaurants in the array
        fastFoodRes.push(new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", "review_page.html", 3, 1))
        showRestaurants(fastFoodRes);
    }
}

function showJapaneseRes(e){
    if(e.target.classList.contains("foodCatLink")){
        const japaneseRes = []
        //make server call to get all the Japanese food restaurants in the array
        const storeImg2 = "http://markhamosakasushi.ca/wp-content/uploads/osaka-front.jpg"
        japaneseRes.push(new Restaurant(storeImg2, "Osaka Sushi", "0987654321", "5762 Hwy 7, Markham", "#", 4, 2))
        showRestaurants(japaneseRes);
    }
}

function showMarkhamRes(e){
    if(e.target.classList.contains("foodCatLink")){
        const markhamRes = []
        //make server call to get all the Markham restaurants in the array
        const storeImg2 = "http://markhamosakasushi.ca/wp-content/uploads/osaka-front.jpg"
        markhamRes.push(new Restaurant(storeImg2, "Osaka Sushi", "0987654321", "5762 Hwy 7, Markham", "review_page.html", 4, 2))
        showRestaurants(markhamRes);
    }
}

function showDowntownRes(e){
    if(e.target.classList.contains("foodCatLink")){
        const downtownRes = []
        //make server call to get all the downtown Toronto restaurants in the array
        downtownRes.push(new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", "#", 3, 1))
        showRestaurants(downtownRes);
    }
}

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
		if ((currentPage * 3) < currentPageRestaurants.length) {
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
	aElement.href = restaurant.page;
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

function showRestaurants(restaurants){
    clearPage();
    for(let i = 0; i < restaurants.length; i++){
        currentPageRestaurants.push(restaurants[i]);
    }
    if(currentPageRestaurants.length > 0){
        showPage(currentPage);
    }
    
}

function clearPage(){
    currentPageRestaurants = [];
    const mainBody = document.getElementById("mainBody");
    while (mainBody.firstChild) {
        mainBody.removeChild(mainBody.firstChild);
    }
}

function showPage(currentPage) {
	let restPage = currentPageRestaurants.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addFavouriteToDom(currentPageRestaurants[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addFavouriteToDom(currentPageRestaurants[j])
		}
	}
}

function sortByName() {
	currentPageRestaurants.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function sortByRate() {
	currentPageRestaurants.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice() {
	currentPageRestaurants.sort(function(a, b){
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