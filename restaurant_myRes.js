/* Class */
class User {
	constructor(image, name, email, password, type){
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.res = [];
    }
}

class Restaurant{
    constructor(image, name, phone, address, rate, price, location, category){
        this.image = image;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.rate = rate;
        this.price = price;
        this.location = location;
        this.category = category;
    }
}

/* Global variables */
let maxReviews = 3; // max Contents one page can show
let currentPage = 1; // current page number
let editing = false; // flag for check whether we are in editing page or not

/* Examples(hardcode part) */
const storeImg1 = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg"
const store1 = new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", 3, 1,'DownTown', 'Fast Food')

// These examples are just for test purpose (sort)
const storeImgSort = 'http://4designer.t7yb.net/files/2017110610/Cartoon-Pizza-Restaurant-26180.jpg'
const store3 = new Restaurant(storeImgSort, "ATest1", "1234567890", "1 (name) St, City1", 5, 3, 'Markham', 'Chinese')
const store4 = new Restaurant(storeImgSort, "BTest2", "0987654321", "2 (name) St, City2", 1, 3, 'Markham', 'Chinese')
const store5 = new Restaurant(storeImgSort, "CTest3", "1234567890", "3 (name) St, City3", 2, 1,'DownTown', 'Japanese')
// create a user
// get user information and list of restaurant from server for phase2
const userImg = "avatar.jpg"
const user = new User(userImg, "user2", "user2@mail.com", "user2", "i");
// Add these restaurants to the user's favourite array (does not change the DOM)
user.res.push(store1)
// These examples are just for test purpose (sort)
user.res.push(store3)
user.res.push(store4)
user.res.push(store5)
/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody');
const pager = document.querySelector('#pager')
/* Event listeners for button submit and button click */
dropDown.addEventListener('click', changeMain);
pager.addEventListener('click', changePage);
contentBody.addEventListener('click', editRes);
/* Load the initial page. */ 
showPage(currentPage);

/*-----------------------------------------------------------*/
/*** 
Functions that hold the event of review page from DOM
***/
// eventholder function for upper deopdown part
function changeMain(e){
    e.preventDefault();
    // part for add new restaurant event
    if(e.target.innerText === 'add new'){
        contentBody.innerText = "";
        addNewResBox();
        // add listener for editing page
        const newResForm = document.querySelector('#newResForm');
        newResForm.addEventListener('submit', addNewRes);
        editingSetting();
    }
    // part for sort event
    else if(e.target.classList.contains('dropdown-name')){
        contentBody.innerText = ""
        sortByName(user)
		showPage(currentPage)
    }
}

// eventholder function for change page event
function changePage(e) {
	e.preventDefault();
	if (e.target.classList.contains('previous')) {
		if (currentPage > 1) {
			currentPage = currentPage - 1
			showPage(currentPage)
		}

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < user.res.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
	}
}

// eventholder function for restaurant content part
function editRes(e){
    // search the restaurant index in list of user
    if(e.target.classList.contains('btn') && !(editing)){
        let index = null;
        const address = e.target.parentElement.firstElementChild.childNodes[1].lastElementChild.lastElementChild.innerText;
        for(let i = 0; i < user.res.length; i++){
            if(user.res[i].address === address){
                index = i;
                break;
            }
        }
        // editing restaurant event
        if(e.target.innerText === 'Edit'){ 
            contentBody.innerText = "";
            addNewResBox();
            const newResForm = document.querySelector('#newResForm');
            newResForm.addEventListener('submit', addEditRes(index));
            editingSetting()
        }
        // delete restaurant event
        else if(e.target.innerText === 'Delete'){
            user.res.splice(index, 1);
            // sent the delete information to server
            showPage(currentPage);
        }
    }
}
/*-----------------------------------------------------------*/
/*** 
Functions that hold the event of editing page from DOM
***/
// event holder function that hold the submit event for adding restaurant
// create a new restaurant and back to review page
function addNewRes(e){
    e.preventDefault();
    const newRes = buildNewRes(0, 0);
    user.res.unshift(newRes);
    dropDown.style.visibility = 'visible';
    pager.style.visibility = 'visible';
    editing = false;
    showPage(currentPage);
    // sent the new restaurant to server
}

// event holder function that hold the submit event for editing restaurant
// edit restaurant and back to review page
function addEditRes(index){
    return function(e){
        e.preventDefault();
        const editRes = buildNewRes(user.res[index].rate, user.res[index].price);
        user.res[index] = editRes;
        dropDown.style.visibility = 'visible';
        pager.style.visibility = 'visible';
        editing = false;
        showPage(currentPage);
        // sent the changed restaurant to server
    }
}

// event holder function that hold the reset event
// cancel the editing and back to the review page
function backToLst(e){
    e.preventDefault();
    dropDown.style.visibility = 'visible';
    pager.style.visibility = 'visible';
    editing = false;
    showPage(currentPage);
}

// event holder function for dropdown at editing page
function changeDrop(e){
    const chooseText = e.target.innerText;
    e.target.parentElement.parentElement.childNodes[1].innerText = chooseText;
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
//function for building the huge div for adding or editing restaurant and than add to main body
function addNewResBox(){
    //build main div
    const newBoxDiv = document.createElement('div');
    newBoxDiv.id = 'newResBox';
    const newCloDiv = document.createElement('div');
    newCloDiv.className = "col-md-8";
    const newForm = document.createElement('form');
    newForm.id = 'newResForm';
    //build main title
    const newH2 = document.createElement('h2');
    newH2.appendChild(document.createTextNode('Editing your restaurant'));
    // part for image input div
    const imgDiv = document.createElement('div');
    imgDiv.className = "form-group";
    const imgLabel = document.createElement('label');
    imgLabel.for = "newRestaurantImg";
    imgLabel.appendChild(document.createTextNode('Restaurant Image:'));
    const imgInput =  document.createElement('input');
    imgInput.id = 'newRestaurantImg';
    imgInput.name = 'newStoreImg';
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.required = "";
    imgDiv.appendChild(imgLabel);
    imgDiv.appendChild(imgInput);
    // part for image preview div
    const newImgDiv = document.createElement('div');
    newImgDiv.className = 'storeImgContainer';
    const newImg = document.createElement('img');
    newImg.id = 'newPreview';
    newImg.src = "#";
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);
    // part for input of name, phone and address div
    const newNameDiv = createInputForm('newRestaurantName', 'Restaurant name:', "Restaurant name");
    const newPhoneDiv = createInputForm('newRestaurantPhone', 'Telephone:', 'Restaurant phone number');
    const newAddrDiv = createInputForm('newRestaurantAddr', 'Restaurant address:', 'Restaurant address');
    // part for dropdown div of restaurant location
    const newLocaDiv = document.createElement('div');
    newLocaDiv.className = 'form-group';
    const locaLabel = document.createElement('label');
    locaLabel.appendChild(document.createTextNode('Choose Location:'));
    newLocaDiv.appendChild(locaLabel);
    newLocaDiv.innerHTML += '<button id="newResLocBtn" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Downtown-Toronto</button>'
    const newDropDiv = document.createElement('div');
    newDropDiv.id = "newRestaurantLoca";
    newDropDiv.className = 'dropdown-menu';
    newDropDiv.innerHTML += '<a class="dropdown-item" href="#">Downtown-Toronto</a>';
    newDropDiv.innerHTML += '<a class="dropdown-item" href="#">Markham</a>';
    newLocaDiv.appendChild(newDropDiv);
    // part for dropdown div of restaurant category
    const newCateDiv = document.createElement('div');
    newCateDiv.className = 'form-group';
    const cateLabel = document.createElement('label');
    cateLabel.appendChild(document.createTextNode('Choose Category:'));
    newCateDiv.appendChild(cateLabel);
    newCateDiv.innerHTML += '<button id="newResCateBtn" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Fast Food</button>'
    const newDropDiv2 = document.createElement('div');
    newDropDiv2.id = "newRestaurantCate";
    newDropDiv2.className = 'dropdown-menu';
    newDropDiv2.innerHTML += '<a class="dropdown-item" href="#">Fast Food</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item" href="#">Chinese</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item" href="#">Japanese</a>';
    newCateDiv.appendChild(newDropDiv2);
    // part for sumbit button div
    const newBtnDiv = document.createElement('div');
    newBtnDiv.className = 'form-group';
    const newBtnInput = document.createElement('input');
    newBtnInput.id = 'newResBtn';
    newBtnInput.type = 'submit';
    newBtnInput.value = 'Save';
    newBtnInput.className = 'btn float-right btn-primary'
    newBtnDiv.appendChild(newBtnInput);
    // part for cancel button div
    const newBtnDiv2 = document.createElement('div');
    newBtnDiv2.className = 'form-group';
    const newBtnInput2 = document.createElement('input');
    newBtnInput2.id = 'newResCancel';
    newBtnInput2.type = 'reset';
    newBtnInput2.value = 'Cancel';
    newBtnInput2.className = 'btn float-right btn-secondary'
    newBtnDiv2.appendChild(newBtnInput2);
    // append all part to the main div
    newForm.appendChild(newH2);
    newForm.appendChild(imgDiv);
    newForm.appendChild(newImgDiv);
    newForm.appendChild(newNameDiv);
    newForm.appendChild(newPhoneDiv);
    newForm.appendChild(newAddrDiv);
    newForm.appendChild(newLocaDiv);
    newForm.appendChild(newCateDiv);
    newForm.appendChild(newBtnDiv);
    newForm.appendChild(newBtnDiv2);
    newCloDiv.appendChild(newForm);
    newBoxDiv.appendChild(newCloDiv);
    // add to the DOM
    contentBody.appendChild(newBoxDiv);
}

//add the given restaurant to the main content body
function addNewResToDom(newRes){
    //build main div
    const newDiv = document.createElement('div');
    newDiv.className = "contentBox p-3"
    const newA = document.createElement('a');
    newA.className = "reviewLink";
    newA.style = "display:block";
    newA.href = "#";
    // part for image div
    const newImgDiv = document.createElement('div');
    newImgDiv.className = 'storeImgContainer';
    const newImg = document.createElement('img');
    newImg.className = 'storeImg';
    newImg.src = newRes.image;
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);
    // part for info div
    const newInfoDiv = document.createElement('div');
    newInfoDiv.className = 'storeInfoContainer';
    // name
    const newNameP = document.createElement('p');
    const newNameS = document.createElement('strong');
    const newNameS2 = document.createElement('span');
    newNameS.appendChild(document.createTextNode('Restaurant name: '));
    newNameS2.appendChild(document.createTextNode(newRes.name));
    newNameP.appendChild(newNameS);
    newNameP.appendChild(newNameS2);
    // phone
    const newPhoneP = document.createElement('p');
    const newPhoneS = document.createElement('strong');
    const newPhoneS2 = document.createElement('span');
    newPhoneS.appendChild(document.createTextNode('Telephone: '));
    newPhoneS2.appendChild(document.createTextNode(newRes.phone));
    newPhoneP.appendChild(newPhoneS);
    newPhoneP.appendChild(newPhoneS2);
    // address
    const newAddrP = document.createElement('p');
    const newAddrS = document.createElement('strong');
    const newAddrS2 = document.createElement('span');
    newAddrS.appendChild(document.createTextNode('Restaurant address: '));
    newAddrS2.appendChild(document.createTextNode(newRes.address));
    newAddrP.appendChild(newAddrS);
    newAddrP.appendChild(newAddrS2);
    // add to the info div
    newInfoDiv.appendChild(newNameP);
    newInfoDiv.appendChild(newPhoneP);
    newInfoDiv.appendChild(newAddrP);
    newA.appendChild(newImgDiv);
    newA.appendChild(newInfoDiv);
    // part for edit button
    const newBtn = document.createElement('button');
    newBtn.className = 'btn btn-light float-right';
    newBtn.type = 'button';
    newBtn.appendChild(document.createTextNode('Edit'));
    // part for delete button
    const newBtn2 = document.createElement('button');
    newBtn2.className = 'btn btn-danger float-right';
    newBtn2.type = 'button';
    newBtn2.appendChild(document.createTextNode('Delete'));
    // add to the main div
    newDiv.appendChild(newA);
    newDiv.appendChild(newBtn2);
    newDiv.appendChild(newBtn);
    // add to DOM
    contentBody.appendChild(newDiv);
}

//function to show the content of current page
function showPage(currentPage) {
	let restPage = user.res.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addNewResToDom(user.res[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addNewResToDom(user.res[j])
		}
    }
}
/*-----------------------------------------------------------*/
/*** helper functions ***/
// do some setting when change from review page to edit page
function editingSetting(){
    editing = true;
    // add listener
    const newResForm = document.querySelector('#newResForm');
    newResForm.addEventListener('reset', backToLst);
    const imgInput = document.querySelector('#newRestaurantImg');
    const imgView = document.querySelector('#newPreview');
    imgInput.onchange = function(){
    if(this.files && this.files[0]){
        imgView.src = URL.createObjectURL(this.files[0]);
        }
    };
    const locaDrop = document.querySelector('#newRestaurantLoca');
    locaDrop.addEventListener('click', changeDrop);
    const cateDrop = document.querySelector('#newRestaurantCate');
    cateDrop.addEventListener('click', changeDrop);
    // hide button
    dropDown.style.visibility = 'hidden';
    pager.style.visibility = 'hidden';
}

// sort function by name
function sortByName(user) {
	user.res.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

// create a new input div by given information
function createInputForm(id, labelText, holderText){
    const newDiv = document.createElement('div');
    newDiv.className = 'form-group';
    const newLabel = document.createElement('label');
    newLabel.for = id;
    newLabel.appendChild(document.createTextNode(labelText));
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'form-control';
    newInput.id = id;
    newInput.placeholder = holderText;

    newDiv.appendChild(newLabel);
    newDiv.appendChild(newInput);
    return newDiv;
}

// build a new restaurant class by given rate and price
function buildNewRes(rate, price){
    const files = document.querySelector('#newRestaurantImg').files[0];
    const newResImg = URL.createObjectURL(files);
    const newResName = document.querySelector('#newRestaurantName').value;
    const newResPhone = document.querySelector('#newRestaurantPhone').value;
    const newResAddr = document.querySelector('#newRestaurantAddr').value;
    const newResLocal = document.querySelector('#newResLocBtn').innerText;
    const newResCate = document.querySelector('#newResCateBtn').innerText;

    const newRes = new Restaurant(newResImg, newResName, newResPhone, newResAddr, rate, price, newResLocal, newResCate);
    return newRes;
}

