const log = console.log;

const userBanButton = document.getElementById("userBanButton");
userBanButton.addEventListener("click", banUser);




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
