const log = console.log;

const popularRestaurants = document.getElementById("popularRestaurants");
popularRestaurants.addEventListener("click", removeRestaurants);




function removeRestaurants(e){
    //should remove restaurants in database
    if (e.target.classList.contains("remove")){
        const restaurantToRemove = e.target.parentElement.parentElement.parentElement;
		popularRestaurants.removeChild(restaurantToRemove);
        
    }
}
