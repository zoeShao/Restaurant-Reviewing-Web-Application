
const log = console.log;
// import {requestSearchRestaurant} from './utility.js';
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);


let maxShowingRestaurant = 2;
const popularRestaurantsElement = document.getElementById("popularRestaurants");

//initialize calls
getLogInInfo();
InitializePopularRestaurants("Downtown", maxShowingRestaurant);

/***************Get data from server***************************/
//send request to server to get log in status
function getLogInInfo(){
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
      log("sign out status")
      changeToSignOutStatus();
    } else{
      return res.json()
    }
    
  }).then((data) =>{
    if(data){
      changeToLoggedInStatus(data.name, data.profileImg)
    }
    
  }).catch(error => {log(error)})
}

//sign out user
function signOutUser(){
    log($('#sioSubmitInput').attr("value"))
    if($('#sioSubmitInput').attr("value") == "Sign Out"){
      const url = '/users/logout';
      const request = new Request(url, {
        method: 'get', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
  });
  fetch(request).then(function(res) {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            console.log('sign out')
            changeToSignOutStatus();
        } 
    }).catch((error) => {
        console.log(error)
    })
    }
}

//Get list of popular restaurant
function getListOfPopularRestaurants(location){
	const url = '/popularRestaurants';
    // The data we are going to send in our request
    let data = {
        location: location
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    return fetch(request)
}
/************************************************/


function changeToSignOutStatus(){
  const header = document.getElementById("header");
  
  //remove profile pic
    $('#portraitContainer').empty();
  
  //remove username
  //set form
  $('#loginOrUsername').attr({
    'action': '/login',
    'method': 'get'
  })
  //set submit input
  $('#louSubmitInput').attr({
    'value': "Log in",
    'class': "nav-link submitLink"
  });
  //set hidden input
  $('#louHideInput').attr({
    'value': '',
    'name': ''
  })

  //change sign out to sign up
  $('#signInOutForm').attr({
    'action': '/signUp',
    'method': 'get'
  })
  $('#sioSubmitInput').attr({
    'value': 'Sign Up',
    'class': 'nav-link submitLink'
  })
}

function changeToLoggedInStatus(userName, imgSrc){
  const header = document.getElementById("header");
  
  //add profile pic
  const img = document.createElement('img');
  img.src = "https://img.icons8.com/ios/50/000000/gender-neutral-user.png"//imgSrc;
  img.className = "float-right img-thumbnail rounded-circle";
  $("#portraitContainer").append(img);

  //add username
  $("#loginOrUsername").attr({
    'action': '',
    'method': ''
  })
  $("#louSubmitInput").attr({
    'value': userName,
    'class': "nav-link userName submitLink"
  })
  $("#louHideInput").attr({
    'name': 'name',
    'value': userName
  })
  //change sign up to sign out
  $('#signInOutForm').attr({
    'action': 'javascript:signOutUser()',
    'method': ''
  })
  $('#sioSubmitInput').attr({
    'value': 'Sign Out',
    'class': 'nav-link signOut submitLink'
  })

}

function showMarkhamRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    //change drop down button text
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Markham";
    //get data from server 
    InitializePopularRestaurants("Markham", maxShowingRestaurant)
  }
}

function showDowntownRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    const restaurants = document.getElementById("popularRestaurants");
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Downtown-Toronto";
    
    InitializePopularRestaurants("Downtown", maxShowingRestaurant)
  }
}

function InitializePopularRestaurants(location, maxShowingRestaurant){
  getListOfPopularRestaurants(location).then((res) => {
    return res.json();
  }).then((resList) => {
    for (let i = 0; i < maxShowingRestaurant && i < resList.length; i++){
      if(popularRestaurantsElement.children.length < maxShowingRestaurant){
          addPopularRestaurant();
      }
      changeRestaurant(popularRestaurantsElement.children[i], resList[i]);
    }
  }).catch(error => {log(error);});
   
}

//helper function
function changeRestaurant(restaurant, resObj){
  //change link
  const form = restaurant.children[0].children[0]
  form.action = "";
  const hiddenInput = form.children[0]
  hiddenInput.value = resObj._id;

  //change image source
  const img = form.children[1].children[0];
  img.src = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg";//resObj.picture;

  //change name
  const cardBody = form.children[2];
  const h4 = cardBody.children[0]
  const btnLink = h4.children[0];
  btnLink.innerText = resObj.name;
}

function addPopularRestaurant(){
  const colDiv = document.createElement('div');
  colDiv.className = "col-lg-5 col-md-6 mb-4 mr-5";
  const card = document.createElement('div');
  card.className = "card h-100";

  const form = document.createElement('form');
  form.method = "post";

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden"
  form.appendChild(hiddenInput);

  const link = document.createElement('button');
  link.className = "resTitleLink";
  link.type = "submit";

  const img = document.createElement('img');
  img.className = "card-img-top";
  link.appendChild(img);
  form.appendChild(link);

  const cardBody = document.createElement('div');
  cardBody.className = "card-body";

  const h4Title = document.createElement('h4');
  h4Title.className = "card-title";

  const titleLink = document.createElement('button')
  titleLink.className = "resTitleLink";
  titleLink.type = "submit";

  h4Title.appendChild(titleLink);
  cardBody.appendChild(h4Title);
  
  form.appendChild(cardBody);
  card.appendChild(form)
  colDiv.appendChild(card);
  popularRestaurantsElement.appendChild(colDiv);
}


