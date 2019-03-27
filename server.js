const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const session = require('express-session')
const hbs = require('hbs')
const { mongoose } = require('./back-end/db/mongoose')

const {User, Restaurant, Review} = require('./back-end/model')

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
// app.set('view engine', 'hbs')

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))

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
		res.sendFile(__dirname + '/public/login.html')
	})

app.get('/', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/index.html')
		// res.render('index.hbs', {
		// 	name: req.session.name
		// })
	} else {
		res.redirect('/login')
	}
})


app.post('/users/login', function(req, res){

    const name = req.body.name;
    const password = req.body.password;
    
    User.findByNamePassword(name, password).then((user) => {
		if(!user) {
			res.redirect('/login')
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			console.log("hererfe")
			req.session.user = user._id;
			req.session.name = user.name
			res.redirect('/')
			// res.send(user)
		}
	}).catch((error) => {
		res.status(400).redirect('/login')
	})
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


app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 