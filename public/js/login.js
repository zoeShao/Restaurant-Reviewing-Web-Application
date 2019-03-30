const loginButton = document.querySelector('#loginButton');
const loginForm = document.querySelector('#loginForm');
console.log(loginButton);
loginForm.addEventListener('submit', checkIdentity);
console.log(loginForm);

//server part
// const express = require('express');
// const app = express();
// const router = express.Router();
// const {userSchema} = require('./user');
// const bodyParser = require('body-parser')
// const port = process.env.PORT || 3000
// app.use(bodyParser.json())

// app.get('/', function(req, res){
//     res.send("test get");
// })

// app.post('/login', function(req, res){
//     log(req.body);
//     const username = req.body.username;
//     const password = req.body.password;
    
    
//     User.findone({name: username}, function(err, user){
//         if(err){
//             console.log(err)
//             return res.status(500).send();
//         }

//         if(!user){
//             return res.status(404).send();
//         }

//         user.comparePassword(password, function(err, isMatch){
//             if(isMatch && isMatch == true){
//                 req,session.user = user; 
//                 return res.status(200).send();
//             } else{
//                 return res.status(401).send();
//             }
//         })
        
//     })
// })

// function checkIdentity(e){
//     console.log("here");
//     e.preventDefault();
//     const username = document.querySelector('#usernameInput').value;
//     const password = document.querySelector('#pwInput').value;
//     //server part TODO: should check username/password with the server 
//     if(username == 'user' && password == 'user'){
//         window.location.href = "index_user.html";
//     } else if(username == 'admin' && password == 'admin'){
//         window.location.href = "individual_account_adminView_banUser.html";
//     } else if(username == 'user2' && password == 'user2'){
//         window.location.href = "restaurant_account.html";
//     } else{
//         alert("Wrong username/password");
//     }
// }