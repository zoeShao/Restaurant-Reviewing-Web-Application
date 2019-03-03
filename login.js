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
    if(username == 'user' && password == 'user'){
        window.location.href = "index.html";
    } else if(username == 'admin' && password == 'admin'){
        window.location.href = "individual_account_adminView_banUser.html";
    }
}