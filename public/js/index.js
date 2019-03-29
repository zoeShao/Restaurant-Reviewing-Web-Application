
const log = console.log;
// import {requestSearchRestaurant} from './utility.js';
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);

getLogInInfo();

//hardcode
const restaurants = document.getElementById("popularRestaurants");
changeRestaurant(restaurants.children[0], "review_page.html", "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg",
                "McDonald's");
document.getElementById("searchButtonLink").href = "restaurants_search_result.html";

// addPopularRestaurant();
// changeRestaurant(restaurants.children[1], "review_page.html", "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg",
//                 "McDonald's");

// addPopularRestaurant();
// changeRestaurant(restaurants.children[2], "review_page.html", "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg",
//                 "McDonald's");

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
$(document).ready(function(){
  $("#signInOut").click(function(){
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
  })
})

function changeToSignOutStatus(){
  const header = document.getElementById("header");
  
  //remove profile pic
  const profilePic = header.children[2];
  if(profilePic.children[0].children.length > 0){
    profilePic.children[0].removeChild(
      profilePic.children[0].firstElementChild);
  }
  
  //remove username
  const name = header.children[3];
  name.className = "col-md-1";
  const loginLink = document.createElement('a');
  loginLink.href = "login.html";
  loginLink.className = "nav-link";
  loginLink.innerText = "Log in";
  name.removeChild(name.firstElementChild);
  name.appendChild(loginLink);

  //change sign out to sign up
  const signUp = header.children[4];
  signUp.className = "col-md-1";
  const signUpLink = document.createElement('a');
  // signUpLink.href = "sign_up.html";
  signUpLink.className = "nav-link";
  signUpLink.innerText = "Sign up";
  signUp.removeChild(signUp.firstElementChild);
  signUp.appendChild(signUpLink);
}

function changeToLoggedInStatus(userName, imgSrc){
  const header = document.getElementById("header");
  
  //add profile pic
  const profilePic = header.children[2];
  const imgLink = document.createElement("a");
  imgLink.href = "individual_account.html";
  const img = document.createElement('img');
  img.src = imgSrc;
  imgLink.appendChild(img);
  img.className = "float-right img-thumbnail rounded-circle";
  profilePic.children[0].appendChild(imgLink);
  
  //add username
  const name = header.children[3];
  name.className = "col-md-1";
  const userLink = document.createElement('a');
  userLink.href = "individual_account.html";
  userLink.className = "userName nav-link";
  userLink.innerText = userName;
  name.removeChild(name.firstElementChild);
  name.appendChild(userLink);

  //change sign out to sign up
  const signOut = header.children[4];
  signOut.className = "col-md-1";
  const signOutLink = document.createElement('a');
  signOutLink.href = "#";
  signOutLink.className = "signOut nav-link";
  signOutLink.innerText = "Sign Out";
  signOut.removeChild(signOut.firstElementChild);
  signOut.appendChild(signOutLink);
}

//Search functions/Show restaurant Functions
// $(document).ready(function(){
//   $("#searchJapaneseResBtn").click(function(){
//     log("clickbutton")
//     requestSearchRestaurant("Japanese", "category");
//   })
// })

function showMarkhamRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    const restaurants = document.getElementById("popularRestaurants");
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Markham";
    
    for (let i = 0; i < restaurants.children.length; i++){
        const restaurant = restaurants.children[i]
        //Server part TODO: the restaurant should get from the server
        changeRestaurant(restaurant, "#", "http://markhamosakasushi.ca/wp-content/uploads/osaka-front.jpg",
                "Osaka Sushi");
    }
  }
}

function showDowntownRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    const restaurants = document.getElementById("popularRestaurants");
    const dropDownButton = document.getElementById("dropDownButton");
    dropDownButton.innerText = "Downtown-Toronto";
    
    for (let i = 0; i < restaurants.children.length; i++){
        const restaurant = restaurants.children[i]
        //Server part TODO: the restaurant should get from the server
        changeRestaurant(restaurant, "review_page.html", "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg",
                "McDonald's");
    }
  }
}

//helper function
function changeRestaurant(restaurant, link, imgSrc, resName){
  //change link
  const aElement = restaurant.children[0].children[0];
  aElement.href = link;
  //change image source
  const img = restaurant.children[0].children[0].children[0];
  img.src = imgSrc

  //change name
  const cardBody = restaurant.children[0].children[1];
  cardBody.removeChild(cardBody.children[0]);
  const h4 = document.createElement("h4");
  h4.className = "card-title";
  const name = document.createElement("a")
  name.href = link;
  name.appendChild(document.createTextNode(resName));
  h4.appendChild(name);
  cardBody.appendChild(h4);
  log(cardBody);
}

function addPopularRestaurant(){
  const colDiv = document.createElement('div');
  colDiv.className = "col-lg-5 col-md-6 mb-4 mr-5";
  const card = document.createElement('div');
  card.className = "card h-100";
  const link = document.createElement('a');
  const img = document.createElement('img');
  img.className = "card-img-top";
  link.appendChild(img);
  const cardBody = document.createElement('div');
  cardBody.className = "card-body";
  const h4Title = document.createElement('h4');
  h4Title.className = "card-title";
  h4Title.appendChild(document.createElement('a'));
  cardBody.appendChild(h4Title);
  card.appendChild(link)
  card.appendChild(cardBody);
  colDiv.appendChild(card);
  restaurants.appendChild(colDiv);
}


