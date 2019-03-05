const log = console.log;

const restaurantSignUp = document.querySelector("#restaurantSignUp");
//hide restaurant sign up info at page load
restaurantSignUp.style.display = "none";

const radioButton = document.querySelector("#ownerRadioButton")
radioButton.addEventListener("change", showOwnerSignUpInfo);

const userRadioButton = document.querySelector("#userRadioButton")
userRadioButton.addEventListener("change", showUserSignUpInfo);

const signUpButton = document.querySelector("#signUpButton")
signUpButton.addEventListener("click", signUp);

const signUpButtonForm = document.querySelector("#signUpButtonForm")

$("#imgChooser").change(function() {readImage(this);});

function showOwnerSignUpInfo(e){
    if (e.target.classList.contains("form-check-input")){

       //Server part TODO: change to restaurant user mode
    }
}

function showUserSignUpInfo(e){
    if (e.target.classList.contains("form-check-input")){
        //Server part TODO: change to restaurant user mode
        
    }
}

function signUp(e){
    if (e.target.classList.contains("login_btn")){
        
        if (!radioButton.checked && !userRadioButton.checked){
            alert("Please to choose your account type.")
        }
        //Server part TODO: upload the information of new user to the server 
    }
}

function readImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      const img = document.createElement("img");
      reader.onload = function(e) {
        img.src = e.target.result;
        img.width = 100;
        img.height = 100;
      }
  
      reader.readAsDataURL(input.files[0]);
      $("#imgChooserBreak").after(img);
    }
  }
  
  