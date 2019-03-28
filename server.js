const log = console.log;
const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const session = require('express-session')
const hbs = require('hbs')
const multer = require('multer')
const {mongoose, storage} = require('./back-end/db/mongoose')

const {User, Restaurant, Review} = require('./back-end/model')

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
// app.set('view engine', 'hbs')

const upload = multer({storage})

// static file directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/img", express.static(__dirname + '/public/img'))
// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('/')
	} else {
		next();
	}
}

app.post('/signUp', (req, res) => {

    const saveUser = new User({
		name: req.body.username,
		password: req.body.password,
		email: req.body.email,
		accountType: req.body.type
	})
    saveUser.save().then((result) => {res.send(saveUser);}
	), (error) => {res.status(400).send(error)}
})

// route for login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		console.log("going login.html")
		res.sendfile(__dirname + '/public/login.html')
	})

// get log in info by Nav Bar
app.get('/getLogInInfo', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			res.send({"name": user.name, "profileImg": user.profilePicture});
		}).catch((error) => {
			log(error)
			res.redirect('/login')
		})
	} else{
		log("signed out status")
		//respond with no content, implying the user hasn't logged in
		res.status(204).send();
	}
})

app.get('/', (req, res) => {
	// check if we have active session cookie
	//if (req.session.user) {
		res.sendFile(__dirname + '/public/index.html')
		// res.render('index.hbs', {
		// 	name: req.session.name
		// })
	//} 
	// else {
	// 	res.redirect('/login')
	// }
})


app.post('/users/login', function(req, res){

    const name = req.body.name;
		const password = req.body.password;
		
		if(req.session.user){
			log("already logged in")
			res.redirect('/');
		}else{
			User.findByNamePassword(name, password).then((user) => {
				if(!user) {
					console.log("password not correct")
					console.log(name);
					console.log(password)
					res.redirect('/login')
				} else {
					// Add the user to the session cookie that we will
					// send to the client
					console.log("password correct")
					req.session.user = user._id;
					req.session.name = user.name
					res.redirect('/')
					// res.send(user)
				}
			}).catch((error) => {
				res.status(400).redirect('/login')
			})
		}
    
    
})

app.get('/users/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

const authenticate = (req, res, next) =>{
	if(req.session.user){
		User.findById(req.session.user).then((user) =>{
			if((!user) || user.banned){
				return Promise.reject()
			}else{
				req.user = user
				next()
			}
		})
	}
	else{
		res.redirect('/login')
	}
}

//post for create new restaurant
app.post('/restaurants', upload.single('resImg'), (req, res) =>{
	const restaurant = new Restaurant({
		// owner: req.user._id,
		picture: req.file.filename,
		name: req.body.name,
		phone: req.body.phone,
		address: req.body.address,
		location: req.body.location,
		category: req.body.category
	})
	restaurant.save().then((result) =>{
		res.send(result)
	},(error) =>{
		res.status(400).send(error)
	})
})

app.get('/restaurants', authenticate, (req, res) =>{
	Restaurant.find({
		owner: req.user._id
	}).then((restaurants) => {
		res.send({restaurants})
	}, (error) =>{
		res.status(450).send(error)
	})
})

app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 