const loginButton = document.querySelector('#loginButton');
const loginForm = document.querySelector('#loginForm');
console.log(loginButton);
loginForm.addEventListener('submit', checkIdentity);
console.log(loginForm);

function checkIdentity(e){
    console.log("here");
    e.preventDefault();
    const username = document.querySelector('#usernameInput').value;
    const password = document.querySelector('#pwInput').value;
    //server part TODO: should check username/password with the server 
    if(username == 'user' && password == 'user'){
        window.location.href = "index_user.html";
    } else if(username == 'admin' && password == 'admin'){
        window.location.href = "individual_account_adminView_banUser.html";
    } else if(username == 'user2' && password == 'user2'){
        window.location.href = "restaurant_account.html";
    } else{
        alert("Wrong username/password");
    }
}