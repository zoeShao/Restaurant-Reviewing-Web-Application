const log = console.log;
const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const Grid = require('gridfs-stream')
const session = require('express-session')
const hbs = require('hbs')
const multer = require('multer')
const {mongoose, storage} = require('./back-end/db/mongoose')

const {User, Restaurant, Review} = require('./back-end/model')

const conn = mongoose.connection;
let gfs;
conn.once('open', () =>{
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('images');
})

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

//root route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

//routes for log in and sign up
app.route('/signUp')
	.get((req, res) => {
		res.sendFile(__dirname + '/public/sign_up.html')
	})


app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/login.html')
	})

app.route('/myRes')
	.get((req, res) => {
		res.sendFile(__dirname + '/public/restaurant_myRes.html')
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
					req.session.accountType = user.accountType;
					res.redirect('/')
					// res.send(user)
				}
			}).catch((error) => {
				res.status(400).redirect('/login')
			})
		}
})

app.post('/users/signUp', (req, res) => {

	const saveUser = new User({
	name: req.body.name,
	password: req.body.password,
	email: req.body.email,
	accountType: req.body.type
})
	saveUser.save().then((user) => {
		req.session.user = user._id;
		req.session.name = user.name;
		res.redirect('/');
	}
), (error) => {res.status(400).send(error)}
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

app.post('/popularRestaurants', (req, res) =>{
	const location = req.body.location;

	Restaurant.find({location: location}).sort({rate: 1}).then((result) =>{
		res.send(result);
	}).catch((error) => res.status(400).send(error))

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
app.post('/addRestaurants', [authenticate, upload.single('resImg')], (req, res) =>{
	const restaurant = new Restaurant({
		owner: req.user._id,
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

//get all restaurants

app.get('/getMyRestaurants', authenticate, (req, res) =>{
	Restaurant.find({owner: req.user._id}).sort({_id: -1}).then((restaurants) => {
		res.send({restaurants})
	}, (error) =>{
		res.status(450).send(error)
	})
})

//read one image by name
app.get('/readImg/:filename', (req, res) =>{
	gfs.files.findOne({filename: req.params.filename}, (err, file) =>{
		if( !file || file.length === 0 ){
			res.status(404).send()
		}
		const readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	})
})

app.delete('/removeRes/:id', (req, res) =>{
	const id = req.params.id

	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}

	Restaurant.findByIdAndRemove(id).then((restaurant) =>{
			if(!restaurant){
				res.status(404).send()
			}
			else{
				gfs.remove({filename: restaurant.picture, root: 'images'}, (err, GridFSBucket) =>{
					if(err){
						res.status(404).send()
					}else{
						res.send()
					}
				})
			}
	})
})

//Codes for search result
//search type can only be: "resName", "location", "category"
app.post('/searchRestaurants', (req, res) => { 
	const content = req.body.content;
	const searchType = req.body.searchType;
	const from = req.body.from;
	log("content: "+ content);
	log("search type: "+ searchType);
	log("from: "+ from);
	if(searchType == "resName"){
		Restaurant.find({name: content.trim()}).then((result) =>
		{
			req.session.searchingRes = result;
			//promise has delay, so we can only put this comment code here
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	} else if(searchType == "location"){
		Restaurant.find({location: content.trim()}).then((result) =>
		{
			req.session.searchingRes = result;
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	}else if(searchType == "category"){
		Restaurant.find({category: content.trim()}).then((result) =>
		{
			log("result" + result);
			req.session.searchingRes = result;
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	} else{
		res.status(400).send("invalid search type!");
	}
	
})

app.get('/openSearchResult', (req, res) => {
	// check if we have active session cookie
		log("before redirect");
		res.sendFile(__dirname + '/public/restaurants_search_result.html')
})

app.get('/getRestaurants', (req, res) => {
	log("Searching res session: "+ req.session.searchingRes)
	if(req.session.searchingRes){
		res.send({res: req.session.searchingRes});
	}
})

/*       codes for admin page   */
app.route('/adminBanUsers')
	.get((req, res) => {
		// if(req.session.accountType == 'a'){
			res.sendFile(__dirname + '/public/individual_account_adminView_banUser.html')
		// } else{
		// 	res.status(400).send("Normal users are not authorized to go to admin page")
		// }
		
	})

app.route('/adminRestaurants')
	.get((req, res) => {
		// if(req.session.accountType == 'a'){
			res.sendFile(__dirname + '/public/individual_account_adminView_restaurants.html')
		// } else{
		// 	res.status(400).send("Normal users are not authorized to go to admin page")
		// }
		
	})

app.post('/admin/removeRes', (req, res) => {
	const rest = req.body.restaurantToDelete;

	Restaurant.findOneAndDelete({_id: rest._id}).then((result) => {
		res.send();
	}).catch(error => {
		res.status(400).send(error);
	})
})

app.get('/admin/getAllUsers', (req, res) => {
	User.find({accountType: {$not: {$eq: 'a'}}}).then((result) => {
		res.send(result);
	}).catch(error => res.status(400).send(error));
})

app.get('/admin/getAllRestaurants', (req, res) => {
	Restaurant.find().then((result) => {
		res.send(result);
	}).catch(error => res.status(400).send(error));
})

app.post('/admin/banOrRecoverUser', (req, res) => {
	const user = req.body.userToModify;
	
	User.findByIdAndUpdate(user._id, 
		{ $set: {
		banned: !user.banned
	}}, {new: true}
		).then((result) => {
		res.send()
	}).catch(error => {log(error)});
})
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 