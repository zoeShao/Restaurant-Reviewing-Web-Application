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
    if(username == 'user1' && password == 'user1'){
        alert("log in succesfully!");
    }
}