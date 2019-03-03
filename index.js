
const log = console.log;
document.getElementById("dropdownMarkham").addEventListener("click", showMarkhamRestaurants);

function showMarkhamRestaurants(e) {
  if (e.target.classList.contains("dropdown-item")){
    const restaurants = document.getElementById("popularRestaurants");

    //   <div class="col-lg-5 col-md-6 mb-4 mr-5">
    //   <div class="card h-100">
    //     <a href="#"><img class="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg"></a>
    //     <div class="card-body">
    //       <h4 class="card-title">
    //         <a href="#">McDonald's</a>
    //       </h4>
    //     </div>
    //     <!-- <div class="card-footer">
    //       <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
    //     </div> -->
    //   </div>
    // </div>
      const dropDownButton = document.getElementById("dropDownButton");
      log(dropDownButton);
      dropDownButton.innerText = "Markham";
      
      for (let i = 0; i < restaurants.children.length; i++){
          const restaurant = restaurants.children[i]
          
          //change link
          const link = restaurant.children[0].children[0];
        //   link.herf = 
          log(link);
          //change image source
          const img = restaurant.children[0].children[0].children[0];
          img.src = "http://markhamosakasushi.ca/wp-content/uploads/osaka-front.jpg"
    
          //change name
          const cardBody = restaurant.children[0].children[1];
          cardBody.removeChild(cardBody.children[0]);
          const h4 = document.createElement("h4");
          h4.className = "card-title";
          const name = document.createElement("a")
          name.href = "#";
          name.appendChild(document.createTextNode("Osaka Sushi"));
          h4.appendChild(name);
          cardBody.appendChild(h4);
          log(cardBody);
      }
  }
 



}