import {getLogInInfo, signOutUser} from './navBar.js';

/* Global variables */
let maxReviews = 4 // max Contents one page can show
let currentPage = 1 // current page number
let reviewLst = [];
let favouriteLst = []
let store = null
let userName = ""
let rid = ""

/* Select all DOM form elements you'll need. */ 
const reviewForm = document.querySelector('#reviewForm')
const reviewPart = document.querySelector('#reviewPart')
const pager = document.querySelector('#pager')
const bookmark = document.querySelector('#bookmark')

const restaurantInfoHeader = document.querySelector('#restaurantHeader')
const restaurantInfoBody = document.querySelector('#restaurantInfo')
const infoBody = document.querySelector('#info')

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

/* Event listeners for button submit and button click */
reviewForm.addEventListener('submit', addNewReview);
pager.addEventListener('click', changePage);
reviewForm.addEventListener('keydown', modifyButton);
bookmark.addEventListener('click', changeBookmark);

/* Load the initial page. */ 
getRestaurant()
/*-----------------------------------------------------------*/
/*** 
Functions can call DOM functions 
***/
//helper function to form a form data by user's input

function modifyButton(e) {
    e.target.parentElement.nextElementSibling.className = "float-right btn btn-info"
}

function addNewReview(e) {
    e.preventDefault();

    if (e.target.lastElementChild.innerText === 'Submit') {
        const url = '/addReview/' + store._id
        const content = document.querySelector('#FormControlTextarea1').value;
        if (content) {
            if (!userName) {
                alert('Fail to submit review, please log in first');
            } else {
                var data = JSON.stringify({
                "rate": document.querySelector('#FormControlSelect2').value,
                "price": document.querySelector('#FormControlSelect1').value,
                "content": document.querySelector('#FormControlTextarea1').value
                });
                $.ajax({
                    url: url,
                    method: 'post',
                    processData: false,
                    contentType: "application/json",
                    data: data
                }).done((res) =>{
                    getRestaurant()
                    e.target.lastElementChild.innerText = 'Resubmit'
                    // getRestaurant();
                }).fail((error) =>{
                    alert('fail to add review');
                })
            }
        } else {
            e.target.lastElementChild.className = "float-right btn btn-info disabled"
        }
    } else {
        const url = '/editReview/' + store._id + '/' + rid
        const content = document.querySelector('#FormControlTextarea1').value;
        if (content) {
            var data = JSON.stringify({
            "rate": document.querySelector('#FormControlSelect2').value,
            "price": document.querySelector('#FormControlSelect1').value,
            "content": document.querySelector('#FormControlTextarea1').value
            });
            $.ajax({
                url: url,
                method: 'patch',
                processData: false,
                contentType: "application/json",
                data: data
            }).done((res) =>{
                getRestaurant()
                e.target.lastElementChild.innerText = 'Resubmit'
                // getRestaurant();
            }).fail((error) =>{
                alert('Fail to resubmit review');
            })
        } else {
            e.target.lastElementChild.className = "float-right btn btn-info disabled"
        }
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
        if ((currentPage * maxReviews) < reviewLst.length) {
            currentPage = currentPage + 1
        }
        showPage(currentPage)       
    }
}

function changeBookmark(e) {
    e.preventDefault();
    if (e.target.classList.contains('notbookmarked')) {
        e.target.parentElement.innerHTML = "<i class=\"bookmarked fas fa-bookmark\"></i>"
        // code below requires server call
        const url = '/addMyfavourites/' + store._id
            $.ajax({
                url: url,
                method: 'post',
                processData: false,
                contentType: "application/json",
            }).done((res) =>{
            }).fail((error) =>{
                alert('fail to add to favourite');
            })
    } else if (e.target.classList.contains('bookmarked')) {
        e.target.parentElement.innerHTML = "<i class=\"notbookmarked far fa-bookmark\"></i>"
        // code below requires server call
        // user.favourite.splice(user.favourite.indexOf(store), 1)
        const url = '/delMyfavourites/' + store._id
            $.ajax({
                url: url,
                method: 'delete',
                processData: false,
                contentType: "application/json",
            }).done((res) =>{
            }).fail((error) =>{
                alert('fail to delete a restaurant in favourite');
            })
    }
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addReviewToDom(review) {
    const contentBoxElement = document.createElement('div')
    contentBoxElement.className = "contentBox"
    const userImgElement = document.createElement('div')
    userImgElement.classNmae = "userImgContainer"
    const userImg = document.createElement('img')
    userImg.className = "userImg img-thumbnail rounded-circle"
    // img.src = "/readImg/" + getUserImage(review.userID)
    const url = '/getUserImg/' + review.userID;
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.userImg){
            userImg.src = "/readImg/" + res.userImg
            userImg.alt = "avatar Picture"
            userImgElement.appendChild(userImg)
            contentBoxElement.appendChild(userImgElement)
            const contentElement = document.createElement('div')
            contentElement.className = "storeContainer"
            const rateElement = addRateToDom(review.rate)
            const priceElement = addPriceToDom(review.price)
            const content = document.createElement('p')
            content.innerHTML = "<strong>"+`${review.userName}`+":\" </strong>" + `${review.content}` +  "<strong>\"</strong>"
            contentElement.appendChild(rateElement)
            contentElement.appendChild(priceElement)
            contentElement.appendChild(content)
            contentBoxElement.appendChild(contentElement)
            reviewPart.appendChild(contentBoxElement)
        } else{
            userImg.src = "https://finanzmesse.ch/userdata/uploads/referenten/avatar.jpg"
            userImg.alt = "avatar Picture"
            userImgElement.appendChild(userImg)
            contentBoxElement.appendChild(userImgElement)
            const contentElement = document.createElement('div')
            contentElement.className = "storeContainer"
            const rateElement = addRateToDom(review.rate)
            const priceElement = addPriceToDom(review.price)
            const content = document.createElement('p')
            content.innerHTML = "<strong>"+`${review.userName}`+":\" </strong>" + `${review.content}` +  "<strong>\"</strong>"
            contentElement.appendChild(rateElement)
            contentElement.appendChild(priceElement)
            contentElement.appendChild(content)
            contentBoxElement.appendChild(contentElement)
            reviewPart.appendChild(contentBoxElement)
        }
    }).fail((error) =>{
        alert("cannot get user image");
    })
}

function addRestaurantToDom(store) {
    // restaurant info header
    const restaurantHeader = document.createElement('div')
    restaurantHeader.className = "col-md-10"
    const restaurantPara = document.createElement('p')
    restaurantPara.className = "storeName text-dark"
    const strongElement = document.createElement('strong')
    strongElement.innerText = store.name
    restaurantPara.appendChild(strongElement)
    restaurantHeader.appendChild(restaurantPara)
    restaurantInfoHeader.insertBefore(restaurantHeader, restaurantInfoHeader.firstChild)
    // bookmark
    const aElement = document.createElement('a')
    aElement.className = "bookmarkIcon"
    aElement.href = "#"
    const iconElement = document.createElement('i')
    iconElement.className = "notbookmarked far fa-bookmark"
    aElement.appendChild(iconElement)
    bookmark.appendChild(aElement)
    // restaurant picture body
    const restaurantImg = document.createElement('div')
    restaurantImg.className = "col-md-3"
    const divElement = document.createElement('div')
    divElement.className = "RestaurantImgContainer"
    const storeImg = document.createElement('img')
    storeImg.className = "resImg"
    const url = '/readImg/';
    storeImg.src = url + store.picture;
    // storeImg.src = store.image
    storeImg.alt = "Store Picture";
    divElement.appendChild(storeImg)
    restaurantImg.appendChild(divElement)
    restaurantInfoBody.insertBefore(restaurantImg, restaurantInfoBody.firstChild)
}

function addRestaurantInfoToDom(store) {
    // restaurant info body
    infoBody.innerText = ""
    const restaurantInfoPart = document.createElement('div')
    restaurantInfoPart.className = "col-md-7"
    const addressElement = document.createElement('p')
    addressElement.innerHTML = "<strong>Restaurant address: </strong>" + `${store.address}`
    const telElement = document.createElement('p')
    telElement.innerHTML = "<strong>Restaurant tel: </strong>" + `${store.phone}`
    const rateElement = addRateToDom(store.rate)
    const priceElement = addPriceToDom(store.price)
    infoBody.appendChild(addressElement)
    infoBody.appendChild(telElement)
    infoBody.appendChild(rateElement)
    infoBody.appendChild(priceElement)
    infoBody.appendChild(restaurantInfoPart)
}

/*-----------------------------------------------------------*/
/*** helper functions ***/
function showPage(currentPage) {
    let restPage = reviewLst.length - currentPage * 4
    if (restPage >= 0) {
        reviewPart.innerText = ""
        for (let i = 0; i < maxReviews; i++) {
            let j = ((currentPage-1)*4) + i
            addReviewToDom(reviewLst[j])
        }
    } else {
        restPage = maxReviews + restPage
        reviewPart.innerText = ""
        for (let i = 0; i < restPage; i++) {
            let j = ((currentPage-1)*4) + i
            addReviewToDom(reviewLst[j])
        }
    }
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

//get the restaurant info and then display 
function getRestaurant(){
    const url = '/restaurantInfo';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res){
            store = res.restaurant;
            getLogInStatus(store)
            if (!restaurantInfoHeader.firstElementChild.innerText) {
                addRestaurantToDom(store)
                initMap(store.address)
            }
            getReviews()
        }
        else{
            alert("cannot get restaurant");
        }
    }).fail((error) =>{
        alert("cannot get restaurant");
    })
}

//get all the reviews of the restaurant
function getReviews(){
    const url = '/getResReview';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.reviews){
            reviewLst = res.reviews
            addRestaurantInfoToDom(store)
            for (let i = 0; i < reviewLst.length; i++) {
                if (reviewLst[i].userName === userName) {
                    document.querySelector('#submitBtn').innerText = 'Resubmit'
                    rid = reviewLst[i]._id
                }
            }
            showPage(currentPage);
        }
        else{
            alert("cannot get reviews");
        }
    }).fail((error) =>{
        alert("cannot get reviews");
    })
}

//get all the reviews of the restaurant
function getLogInStatus(store){
    const url = '/getLogInInfo';
    const request = new Request(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });
    fetch(request).then((res) => {
      if(res.status == 204){
        bookmark.innerText = ""
      } else{
        return res.json()
      }
    }).then((data) =>{
        if(data){
            userName = data.name
            getFavourite(store)
        }
      
    }).catch(error => {alert("Can't get log in status")})
}

//get all restaurants for this user and then display 
function getFavourite(store){
    const url = '/getMyfavourites';
    $.ajax({
        url: url,
        method:'get'
    }).done((res) =>{
        if(res.restaurants){
            favouriteLst = res.restaurants;
            for (let i = 0; i < favouriteLst.length; i++) {
                if (favouriteLst[i]._id === store._id) {
                    bookmark.firstElementChild.innerHTML = "<i class=\"bookmarked fas fa-bookmark\"></i>"
                } 
            }
        }
        else{
            alert("cannot get restaurants");
        }
    }).fail((error) =>{
        alert("cannot get restaurants");
    })
}

function initMap(address) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
        }

        // console.log(latitude);
        // console.log(longitude);

        var myLatLng = {lat: latitude, lng: longitude};

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: myLatLng
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Here is the restaurant!'
        });
    });
}


/*** Search function */
$('#searchBtn').click(function(){
    const link = "/searchRestaurants/resName/" + $("#searchInput").val() + "/reviewPage";
    $("#searchBar").attr({
      'action': link
    })
  })
  /****                 */