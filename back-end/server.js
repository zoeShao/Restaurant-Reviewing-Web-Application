const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')

// const model = require('./model')
// const {User} = model.User
// const {Restaurant} = model.Restaurant
// const {Review} = model.Review
const {User, Restaurant, Review} = require('./model')

// express
const app = express();
app.use(bodyParser.json())

// app.post('/signUp', (req, res) => {

//     const saveUser = new User({
// 		name: req.body.username,
// 		password: req.body.password,
// 		email: req.body.email,
// 		accountType: req.body.type
// 	})
// 	console.log(saveUser)
//     saveUser.save().then((result) => {res.send(result);}
// 	), (error) => {res.status(400).send(error)} //status 400 for invalid request
// })

// app.post('/login', function(req, res){

//     const name = req.body.name;
//     const password = req.body.password;
    
//     console.log(name);
//     User.findOne({name: name}, function(err, user){
//         if(err){
//             console.log(err)
//             return res.status(500).send();
//         }

//         if(!user){
//             return res.status(404).send();
//         }

//         user.comparePassword(password, function(err, isMatch){
//             if(isMatch && isMatch == true){
//                 // req.session.user = user; 
//                 return res.status(200).send();
//             } else{
//                 return res.status(401).send();
//             }
//         })
        
//     })
// })

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 