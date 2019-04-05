/* Class */
import {getLogInInfo, signOutUser} from './navBar.js';
let resLst = [];
/* Global variables */
let maxReviews = 3; // max Contents one page can show
let currentPage = 1; // current page number
let editing = false; // flag for check whether we are in editing page or not

/* Examples(hardcode part) */
// These examples are just for test purpose (sort)

// create a user

// Add these restaurants to the user's favourite array (does not change the DOM)
// These examples are just for test purpose (sort)
/* Select all DOM form elements you'll need. */ 
const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody');
const pager = document.querySelector('#pager')
const accountBody = document.querySelector('#accountBody');
/* Event listeners for button submit and button click */
dropDown.addEventListener('click', changeMain);
pager.addEventListener('click', changePage);

/* Load the initial page. */ 
contentBody.addEventListener('click', editRes);

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

getRestaurant();
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
        addNewResBox(-1);
        // add listener for editing page
        const newResForm = document.querySelector('#newResForm');
        newResForm.addEventListener('submit', addNewRes);
        var mainBody = document.getElementById('newResBox')
        var input = document.getElementById('newRestaurantAddr');
        // var autocomplete = new google.maps.places.Autocomplete(input);

        // var prefix = 'ON, ';
        // $(input).on('input',function(){
        //     var str = input.value;
        //     if(str.indexOf(prefix) == 0) {
        //         // string already started with prefix
        //         return;
        //     } else {
        //         if (prefix.indexOf(str) >= 0) {
        //             // string is part of prefix
        //             input.value = prefix;
        //         } else {
        //             input.value = prefix+str;
        //         }
        //     }
        // });
        // autocomplete.setComponentRestrictions({'country': ['ca']});
        var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(43.5920, -79.5257),
        new google.maps.LatLng(43.9410, -79.2460));
        var options = {
          bounds: defaultBounds,
        }

        var autocomplete = new google.maps.places.Autocomplete(input, options);
        // autocompleteFragment.setBoundsBias(new LatLngBounds(southwestLatLng, northeastLatLng))
        function init() {
            var autocomplete = new google.maps.places.Autocomplete(input);
        }
        google.maps.event.addDomListener(mainBody, 'load', init);
        editingSetting();
    }
    // part for sort event
    else if(e.target.classList.contains('dropdown-name')){
        contentBody.innerText = ""
        sortByName()
		showPage(currentPage)
    }
    else if(e.target.classList.contains('dropdown-rate')){
        contentBody.innerText = ""
        sortByRate()
		showPage(currentPage)
    }
    else if(e.target.classList.contains('dropdown-price')){
        contentBody.innerText = ""
        sortByPrice()
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
		if ((currentPage * 3) < resLst.length) {
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
        const address = e.target.parentElement.firstElementChild.childNodes[1].childNodes[2].lastElementChild.innerText;
        for(let i = 0; i < resLst.length; i++){
            if(resLst[i].address === address){
                index = i;
                break;
            }
        }
        const id = resLst[index]._id; 
        // editing restaurant event
        if(e.target.innerText === 'Edit'){ 
            contentBody.innerText = "";
            addNewResBox(index);
            const newResForm = document.querySelector('#newResForm');
            newResForm.addEventListener('submit', addEditRes(index));
            var mainBody = document.getElementById('newResBox')
            var input = document.getElementById('newRestaurantAddr');
            // var autocomplete = new google.maps.places.Autocomplete(input);
            var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(43.5920, -79.5257),
            new google.maps.LatLng(43.9410, -79.2460));
            var options = {
              bounds: defaultBounds,
            }
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            function init() {
                var autocomplete = new google.maps.places.Autocomplete(input);
            }
            google.maps.event.addDomListener(mainBody, 'load', init);
            editingSetting()
        }
        // delete restaurant event
        else if(e.target.innerText === 'Delete'){
            const url = '/removeRes/';
            $.ajax({
                url: url + id,
                method:'delete'
            }).done((res) =>{
                console.log('delete success');
                getRestaurant();
            }).fail((error) => {
                alert('fail to delete');
                console.log(error);
            })
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
    const url = '/addRestaurants'
    const form = formData();
  
    $.ajax({
        url: url,
        method: 'post',
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form
    }).done((res) =>{
        console.log('add restaurant');
        dropDown.style.visibility = 'visible';
        pager.style.visibility = 'visible';
        editing = false;
        getRestaurant();
    }).fail((error) =>{
        if(error.status === 500){
            alert('restaurant image is required')
        }
        else if (error.status === 400){
            alert(error.responseText);
        }
        else{
            alert('failed to add restaurant')
        }
        console.log(error);
    })
   
}

// event holder function that hold the submit event for editing restaurant
// edit restaurant and back to review page
function addEditRes(index){
    return function(e){
        e.preventDefault();
        const id = resLst[index]._id;
        const url = '/editRes/' + id;
        const form = formData();
        $.ajax({
            url: url,
            method: 'patch',
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form
        }).done((res) =>{
            console.log('edit restaurant');
            dropDown.style.visibility = 'visible';
            pager.style.visibility = 'visible';
            editing = false;
            getRestaurant();
        }).fail((error) =>{
            if(error.status === 400){
                alert(error.responseText);
            }
            else{
                alert('fail to edit restaurant');
            }
            console.log(error);
        })
    }
}

//helper function to form a form data by user's input
function formData(){
    const form = new FormData();
    form.append("resImg", document.querySelector('#newRestaurantImg').files[0]);
    form.append("name", document.querySelector('#newRestaurantName').value);
    form.append("phone", document.querySelector('#newRestaurantPhone').value);
    form.append("address", document.querySelector('#newRestaurantAddr').value);
    form.append("location", document.querySelector('#newResLocBtn').innerText);
    form.append("category", document.querySelector('#newResCateBtn').innerText);
    return form;
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
function addNewResBox(index){
    let url, name, phone, address, location, category;
    if(index == -1){
        url = '#';
        name = '';
        phone = '';
        address = '';
        location = 'Downtown-Toronto';
        category = 'Fast Food';
    }else{
        const curRes = resLst[index];
        url = '/readImg/' + curRes.picture;
        name = curRes.name;
        phone = curRes.phone;
        address = curRes.address;
        location = curRes.location;
        category = curRes.category;
    }
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
    imgInput.name = 'resImg';
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
    newImg.src = url;
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);
    // part for input of name, phone and address div
    const newNameDiv = createInputForm('newRestaurantName', 'Restaurant name:', name);
    const newPhoneDiv = createInputForm('newRestaurantPhone', 'Telephone:', phone);
    const newAddrDiv = createInputForm('newRestaurantAddr', 'Restaurant address:', address);
    // part for dropdown div of restaurant location
    const newLocaDiv = document.createElement('div');
    newLocaDiv.className = 'form-group';
    const locaLabel = document.createElement('label');
    locaLabel.appendChild(document.createTextNode('Choose Location:'));
    newLocaDiv.appendChild(locaLabel);
    newLocaDiv.innerHTML += '<button id="newResLocBtn" name="location" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+location+ '</button>'
    const newDropDiv = document.createElement('div');
    newDropDiv.id = "newRestaurantLoca";
    newDropDiv.className = 'dropdown-menu';
    newDropDiv.innerHTML += '<a class="dropdown-item">Downtown-Toronto</a>';
    newDropDiv.innerHTML += '<a class="dropdown-item">Markham</a>';
    newLocaDiv.appendChild(newDropDiv);
    // part for dropdown div of restaurant category
    const newCateDiv = document.createElement('div');
    newCateDiv.className = 'form-group';
    const cateLabel = document.createElement('label');
    cateLabel.appendChild(document.createTextNode('Choose Category:'));
    newCateDiv.appendChild(cateLabel);
    newCateDiv.innerHTML += '<button id="newResCateBtn" name="category" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+category+'</button>'
    const newDropDiv2 = document.createElement('div');
    newDropDiv2.id = "newRestaurantCate";
    newDropDiv2.className = 'dropdown-menu';
    newDropDiv2.innerHTML += '<a class="dropdown-item">Fast Food</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item">Chinese</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item">Japanese</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item">Korean</a>';
    newDropDiv2.innerHTML += '<a class="dropdown-item">American</a>';
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
    // const newAdd = document.createElement('div');
    // newAdd.className = "form-group"
    // const newInput = document.createElement('input');
    // newInput.type = 'text';
    // newInput.className = 'form-control';
    // newInput.id = "locationName";
    // newInput.value = "Restaurant address";
    // newAdd.appendChild(newInput);
    // newBoxDiv.appendChild(newAdd);

    // add to the DOM
    contentBody.appendChild(newBoxDiv);
}

//add the given restaurant to the main content body
function addNewResToDom(newRes){
    //build main div
    const newDiv = document.createElement('div');
    newDiv.className = "contentBox p-3";
    newDiv.position = 'absolute';
    const newA = document.createElement('a');
    newA.className = "reviewLink";
    newA.style = "display:block";
    newA.href = "/resReviews/" + newRes._id;
    // part for image div
    const url = '/readImg/';
    //change to server image request
    const newImgDiv = document.createElement('div');
    newImgDiv.className = 'storeImgContainer';
    const newImg = document.createElement('img');
    newImg.className = 'storeImg';
    newImg.src = url + newRes.picture;
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
    // rate 
    const rateP = addRateToDom(Math.round(newRes.rate));
    // price 
    const priceP = addPriceToDom(Math.round(newRes.price));
    // add to the info div
    newInfoDiv.appendChild(newNameP);
    newInfoDiv.appendChild(newPhoneP);
    newInfoDiv.appendChild(newAddrP);
    newInfoDiv.appendChild(rateP);
    newInfoDiv.appendChild(priceP);
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
	let restPage = resLst.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			addNewResToDom(resLst[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			addNewResToDom(resLst[j])
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
function sortByName() {
	resLst.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function sortByRate() {
	resLst.sort(function(a, b){
    if(a.rate < b.rate) { return 1; }
    if(a.rate > b.rate) { return -1; }
    return 0;
	})
}

function sortByPrice() {
	resLst.sort(function(a, b){
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
    newInput.value = holderText;

    newDiv.appendChild(newLabel);
    newDiv.appendChild(newInput);
    return newDiv;
}

//get all restaurants for this user and then display 
function getRestaurant(){
    const url = '/getMyRestaurants';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.restaurants){
            resLst = res.restaurants;
            showPage(currentPage);
            if (resLst.length === 0) {
                const contentBoxElement = document.createElement('div')
                contentBoxElement.className = "bodyInitial"
                const contentElement = document.createElement('p')
                contentElement.className = "emptyReview"
                contentElement.innerHTML = "<strong>(You have not add any restaurant yet. You can add your restaurants by clicking \"add new\".)</strong>"
                contentBoxElement.appendChild(contentElement)
                contentBody.appendChild(contentBoxElement)
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