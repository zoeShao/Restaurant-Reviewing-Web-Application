
const log = console.log;
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);
document.getElementById("dropdownToronto").addEventListener("click", showDowntownRestaurants);

//server part
// const express = require('express');
// const router = express.Router();
// const User = require('user');

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

//server 

// router.get('/', function(req, res){
//   if(!req.session.user){ //user or User?
//     return res.status(401).send();
//   }

//   return res.status(200).send("logged In");
// })


// router.get('/', function(req, res){
//   req.session.destroy();

//   return res.status(200).send();
// })
