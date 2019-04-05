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
mongoose.set('useFindAndModify', false);
// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))


// set the view library
app.set('view engine', 'hbs')

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
		expires: 600000000000,
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

const generalPagesAuthenticate = (req, res, next) => {
    if(req.session.accountType === 'a' || req.session.accountType === 'o'){
        res.status(400).send("Administrator or restaurant owner cannot do this operation!");
    } else{
        next();
    }
}

const userPagesAuthenticate = (req, res, next) => {
	if(req.session.user){
		User.findById(req.session.user).then((user) =>{
			if((!user) || user.accountType !== "u" || user.banned){
				if(user.banned){
					res.status(400).send("You have been banned!")
				}
				else{
					res.status(400).send("Only valid user account can do this operation!")
				}
			}else{
				req.user = user
				next()
			}
		})
	} else{
		res.redirect('/login')
	}
}

const adminPagesAuthenticate = (req, res, next) => {
	if(req.session.user){
		User.findById(req.session.user).then((user) =>{
			if((!user) || user.accountType !== "a"){
				res.status(400).send("You have to be an administrator to do this operation!")
			}else{
				req.user = user
				next()
			}
		})
	} else{
		res.redirect('/login')
	}
}

const authenticate = (req, res, next) =>{
	if(req.session.user){
		User.findById(req.session.user).then((user) =>{
			if((!user) || user.banned){
				res.status(400).send("Invalid User")
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

//root route
app.get('/', generalPagesAuthenticate, (req, res) => {
	if(req.session.accountType){
		if(req.session.accountType !== 'u'){
				res.redirect('/users/logout')
			}else{
				res.sendFile(__dirname + '/public/index.html')
			}
	} else{
		res.sendFile(__dirname + '/public/index.html')
	}
})

//routes for log in and sign up
app.route('/signUp')
	.get((req, res) => {
		if(req.session.failToSignUp){
			if(req.session.failToSignUp === "duplicatedKeys"){
				req.session.failToSignUp = "";
				res.render('sign_up.hbs', {error: 'Sorry, this username/email is taken.'})
			} else if(req.session.failToSignUp === "notValidInfo"){
				req.session.failToSignUp = "";
				res.render('sign_up.hbs', {error: 'Invalid email/username/password, please check again'})
			} else if(req.session.failToSignUp === "unknownReasons"){
				req.session.failToSignUp = "";
				res.render('sign_up.hbs', {error: 'Sorry, fail to sign up for unknown reasons, please change your info and try again.'})
			}
		} else{
			req.session.failToSignUp = "";
			res.sendFile(__dirname + '/public/sign_up.html')
		}
		
	})

app.route('/login')
	.get(sessionChecker, (req, res) => {
		if(req.session.failToLogin === "wrongCredential"){
			req.session.failToLogin = null;
			res.render('login.hbs', {error: 'Username/Password incorrect.'})
		} else if (req.session.failToLogin === "banned"){
            req.session.failToLogin = null;
			res.render('login.hbs', {error: 'Sorry, your account is banned by the administrator.'})
        } else{
			req.session.failToLogin = null;
			res.sendFile(__dirname + '/public/login.html')
		}
		
	})

// GET all restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(500).send(error) // 400 for bad request
	})
})

// GET one restaurant via id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Otherwise, findById
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			/// sometimes wrap returned object in another object   
			res.send({restaurant})
		}
	}).catch((error) => {
		res.status(400).send()
	})
})

// rpute for jump to main account page of restaurant owner
app.route('/restaurant_review')
	.get((req, res) => {
		res.sendFile(__dirname + '/public/review_page.html')
	})

// route for jump to main account page of restaurant owner
app.route('/myRes')
	.get(authenticate, (req, res) => {
		if(req.user.accountType !== 'o'){
			res.status(400).send("Only restaurant owner can enter!")
		}
		res.sendFile(__dirname + '/public/restaurant_myRes.html')
	})

// route for jump to account setting page of restaurant owner
app.route('/resAccountSet')
	.get(authenticate, (req, res) => {
		if(req.user.accountType !== 'o'){
			res.status(400).send("Only restaurant owner can enter!")
		}
		res.sendFile(__dirname + '/public/restaurant_setting.html')
})

// route for jump to restaurant reviews page of restaurant owner
app.route('/resReviews')
	.get(authenticate, (req, res) => {
		if(req.user.accountType !== 'o'){
			res.status(400).send("Only restaurant owner can enter!")
		}
		res.sendFile(__dirname + '/public/restaurant_reviews.html')
	})

// route for jump to main page of individual account 
app.route('/individual_account')
	.get(userPagesAuthenticate, (req, res) => {
		res.sendFile(__dirname + '/public/individual_account.html')
	})

// rpute for jump to main account page of individual favourite
app.route('/individual_favourite')
	.get(userPagesAuthenticate, (req, res) => {
		res.sendFile(__dirname + '/public/individual_favourite.html')
	})

// rpute for jump to main account page of individual setting
app.route('/individual_setting')
	.get(userPagesAuthenticate, (req, res) => {
		res.sendFile(__dirname + '/public/individual_setting.html')
	})

// get the restaurant id and then redirect to the review page for different user
app.get('/resReviews/:id', (req, res) =>{
	const id = req.params.id
	req.session.resReviewId = id
	if(req.session.accountType == 'a'){
		res.redirect('/adminResReviews');
	} else if (req.session.accountType == 'o'){
		res.redirect('/resReviews')
	} else {
		res.redirect('/restaurant_review')
	}
})

//get the restaurant info 
app.get('/restaurantInfo', (req, res) =>{
	const id = req.session.resReviewId
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}
	// Otherwise, findById
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			/// sometimes wrap returned object in another object   
			res.send({restaurant})
		}
	}).catch((error) => {
		res.status(400).send()
	})
})


// get log in info by Nav Bar
app.get('/getLogInInfo', (req, res) => {
	if (req.session.user){
		User.findById(req.session.user).then((user) => {
			res.send({"name": user.name, 'email': user.email, "profileImg": user.profilePicture, "accountType":user.accountType});
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

// login a user
app.post('/users/login', function(req, res){
    const name = req.body.name;
		const password = req.body.password;
		
		if(req.session.user){
			res.redirect('/');
		}else{
			User.findByNamePassword(name, password).then((user) => {
				if(!user) {
					req.session.failToLogin = "wrongCredential";
					res.redirect('/login')
				} else if(user.banned === true){
                    req.session.failToLogin = "banned";
					res.redirect('/login')
                } else {
					// Add the user to the session cookie that we will
					// send to the client
					req.session.user = user._id;
					req.session.name = user.name
					req.session.accountType = user.accountType;
					if(req.session.accountType === 'o'){
						res.redirect('/myRes');
					} else if (req.session.accountType === 'a'){
						res.redirect('/adminBanUsers');
					} else if (req.session.accountType === 'u'){
						res.redirect('/');
					}else{
						res.status(400).send();
					}
				}
			}).catch((error) => {
				res.status(400).redirect('/login')
			})
		}
})

//sign Up a user
app.post('/users/signUp', (req, res) => {
	if(req.body.type === 'a'){
		res.status(400).send('Cannot regist an admin');
	}
	const saveUser = new User({
	name: req.body.name,
	password: req.body.password,
	email: req.body.email,
	accountType: req.body.type
})
	saveUser.save().then((user) => {
		req.session.user = user._id;
		req.session.name = user.name;
		req.session.accountType = user.accountType;
		if(req.session.accountType === 'o'){
			res.redirect('/myRes');
		} else if (req.session.accountType === 'u'){
			res.redirect('/');
		}else{
			res.status(400).send();
		}
	}
).catch((error) => {
	//duplicate key error
	if(error.code == 11000 && error.name == "MongoError"){
		req.session.failToSignUp = "duplicatedKeys";
	} else if(error.errors.password || error.errors.email){
		req.session.failToSignUp = "notValidInfo";
	} else{
		//should not happen
		req.session.failToSignUp = "unknownReasons";
	}
	res.redirect('/signUp');
	})
})

// logout user
app.get('/users/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

//get most popular restaurant given a location
app.get('/popularRestaurants/:location', generalPagesAuthenticate, (req, res) =>{
	const location = req.params.location;
  
	Restaurant.find({location: location}).sort({rate: -1}).then((result) =>{
		res.send(result);
	}).catch((error) => res.send([]))

})

app.get('/newRestaurants', generalPagesAuthenticate, (req, res) =>{
	Restaurant.find().sort({_id: -1}).limit(3).then((result) =>{
		res.send(result);
	}).catch((error) => res.status(400).send(error))

})

//post for create new restaurant
app.post('/addRestaurants', [authenticate, upload.single('resImg')], (req, res) =>{
	if(req.user.accountType !== 'o'){
		res.status(400).send("Only restaurant owner can do this!")
	}
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
		if(error.message.includes('Path `name` is required.')){
			res.status(400).send('Restaurant name is required')
		}
		else if(error.message.includes('Path `phone` is required.')){
			res.status(400).send('Restaurant phone is required')
		}
		else if(error.message.includes('is shorter than the minimum allowed length')){
			res.status(400).send('Restaurant phone has to have length 10')
		}
		else if(error.message.includes(' Path `address` is required.')){
			res.status(400).send('Restaurant address is required')
		}
		else{
			res.status(600).send(error)
		}
	})
})

//add the restaurant to the user's favourites
app.post('/addMyfavourites/:id', userPagesAuthenticate, (req, res) =>{
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}
	// $new: true gives back the new document
	User.findByIdAndUpdate(req.user._id, {$push: {favourites: id}}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({restaurant: id, user: user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

//remove the restaurant from favouyrite
app.delete('/delMyfavourites/:id', userPagesAuthenticate, (req, res) =>{
	const id = req.params.id
	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}
	User.findByIdAndUpdate(req.user._id, {$pull: {favourites: id}}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({restaurant: id, user: user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

//get all favourite restaurants for this user's id
app.get('/getMyfavourites', userPagesAuthenticate, (req, res) =>{
		/// sometimes wrap returned object in another object
		Restaurant.find({_id: req.user.favourites}).sort({_id: -1}).then((restaurants) => {
			res.send({restaurants})
		},(error) =>{
			res.status(450).send(error)
	})   		
})


//get all restaurants for this user's id
app.get('/getMyRestaurants', authenticate, (req, res) =>{
	if(req.user.accountType !== 'o'){
		res.status(400).send("Only restaurant owner can do this!")
	}
	Restaurant.find({owner: req.user._id}).sort({_id: -1}).then((restaurants) => {
		res.send({restaurants})
	},(error) =>{
		res.status(450).send(error)
	})
})

//read one image by name
app.get('/readImg/:filename', (req, res) =>{
	if(req.params.filename === undefined){
		res.status(400).send()
	}
	gfs.files.findOne({filename: req.params.filename}, (err, file) =>{
		if( !file || file.length === 0 ){
			res.status(404).send()
		}
		const readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	})
})

//delete one restaurant by id and also delete it's picture and reviews
app.delete('/removeRes/:id', authenticate, (req, res) =>{
	const id = req.params.id
	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}
	if(req.user.accountType === 'u'){
		res.status(400).send('user cannot remove restaurant')
	}
	Restaurant.findOneAndDelete({_id: id}).then((restaurant) =>{
			if(!restaurant){
				res.status(404).send()
			}
			else{
				gfs.remove({filename: restaurant.picture, root: 'images'}, (err, GridFSBucket) =>{
					if(err){
						res.status(404).send()
					}else{
						Review.remove({resID: id}).then((result) =>{
							res.send(result)
						}, (error) =>{
							res.status(400).send(error)
						})
					}
				})
			}
	}, (error) =>{
		res.status(400).send(error)
	})
})

//edit user information for current user
app.patch('/editUserInfo', [authenticate, upload.single('userImg')], (req, res) =>{
	const id = req.user._id;
	if(req.user.accountType === 'a'){
		res.status(400).send()
	}
	let change;
	if(req.body.password && req.body.password !== ""){
		change = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		}
	}
	else{
		change = {
			name: req.body.name,
			email: req.body.email,
		}
	}
	if(req.file){
		change.profilePicture = req.file.filename
		User.findOneAndUpdate({_id: id}, {$set: change}).then((user) =>{
			if(user.profilePicture !== ""){
				gfs.remove({filename: user.profilePicture, root: 'images'}, (err, GridFSBucket) =>{
					if(err){
						res.status(404).send(err)
					}else{
						res.send()
					}
				})
			}
			res.send()
		}, (error) =>{
			if(error.message.includes('users index: email_1')){
				res.status(400).send('this email has been used')
			}
			else if(error.message.includes('users index: name_1')){
				res.status(400).send('this username has been used')
			}
			else{
				res.status(600).send(error)
			}
		})
	}
	else{
		User.findOneAndUpdate({_id: id}, {$set: change}).then((user) =>{
			res.send()
		}, (error) =>{
			if(error.message.includes('users index: email_1')){
				res.status(400).send('this email has been used')
			}
			else if(error.message.includes('users index: name_1')){
				res.status(400).send('this username has been used')
			}
			else{
				res.status(600).send(error)
			}
		})
	}
})

//edit the restaurant information
app.patch('/editRes/:id', [authenticate, upload.single('resImg')], (req, res) =>{
	const id = req.params.id
	if(req.user.accountType !== 'o'){
		res.status(400).send()
	}
	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}
	if(req.file){
		Restaurant.findOneAndUpdate({_id: id}, {$set: {
			picture: req.file.filename,
			name: req.body.name,
			phone: req.body.phone,
			address: req.body.address,
			location: req.body.location,
			category: req.body.category
		}}).then((restaurant) =>{
			if(!restaurant){
				res.status(404).send()
			}
			else{
				gfs.remove({filename: restaurant.picture, root: 'images'}, (err, GridFSBucket) =>{
					if(err){
						res.status(404).send(err)
					}else{
						res.send()
					}
				})
			}
		}, (error) =>{
			if(error.message.includes('duplicate key error')){
				res.status(400).send('this address is already existed')
			}
			else{
				res.status(600).send(error)
			}
		})
	}
	else{
		Restaurant.findOneAndUpdate({_id: id}, {$set: {
			name: req.body.name,
			phone: req.body.phone,
			address: req.body.address,
			location: req.body.location,
			category: req.body.category
		}}).then((restaurant) =>{
			if(!restaurant){
				res.status(404).send();
			}
			else{
				res.send();
			}
		}, (error) =>{
			if(error.message.includes('duplicate key error')){
				res.status(400).send('this address is already existed')
			}
			else{
				res.status(600).send(error)
			}
		})
	}
})

//get all reviews for one user
app.get('/getIndReviews', userPagesAuthenticate, (req, res) =>{
	const id = req.user._id
	Review.find({userID: id}).then((reviews) =>{
		res.send({reviews})
	}, (error) =>{
		res.status(450).send(error)
	})
})

//get all reviews for one restaurant
app.get('/getResReview', (req, res) =>{
	const id = req.session.resReviewId
	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}
	Review.find({resID: id}).sort({_id: -1}).then((reviews) =>{
		res.send({reviews})
	}, (error) =>{
		res.status(450).send(error)
	})
})

//edit the review
app.patch('/editReview/:resId/:rid', userPagesAuthenticate, (req, res) =>{
	const id = req.params.rid

	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}

	Review.findOneAndUpdate({_id: id}, {$set: {
			resID: req.params.resId,
			userID: req.user._id,
			userName: req.user.name,
			rate: req.body.rate,
			price: req.body.price,
			content: req.body.content
		}}, {new: true}).then((result) => {
			if(!result){
				res.status(404).send();
			}
			else{
				const ObjectId = mongoose.Types.ObjectId
				Review.aggregate([
					{ $match: {"resID": ObjectId(req.params.resId)}},
					{$group: {
						_id: null, 
						rate: {$avg: "$rate"}, 
						price: {$avg: "$price"}}}]).then((average) =>{
							const aveRate = average[0].rate
							const avePrice = average[0].price
							Restaurant.findOneAndUpdate({_id: req.params.resId},
								{$set: {
									rate: aveRate,
									price: avePrice
								}}).then((update) =>{
									res.send(result)
								})
						}, (error) =>{
							res.status(400).send(error);
						})
			}
		})
})

// add a new review to a retaurant
app.post('/addReview/:resId', userPagesAuthenticate, (req, res) =>{
	Restaurant.findById(req.params.resId).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			/// sometimes wrap returned object in another object   
			const review = new Review({
				resID: req.params.resId,
				userID: req.user._id,
				userName: req.user.name,
				resName: restaurant.name,
				rate: req.body.rate,
				price: req.body.price,
				content: req.body.content
			})
			review.save().then((result) =>{
				const ObjectId = mongoose.Types.ObjectId
				// req.session.userReviewId = result._id
				Review.aggregate([
					{ $match: {"resID": ObjectId(req.params.resId)}},
					{$group: {
						_id: null, 
						rate: {$avg: "$rate"}, 
						price: {$avg: "$price"}}}]).then((average) =>{
							const aveRate = average[0].rate
							const avePrice = average[0].price
							Restaurant.findOneAndUpdate({_id: req.params.resId},
								{$set: {
									rate: aveRate,
									price: avePrice
								}}).then((update) =>{
									res.send(result)
								})
						}, (error) =>{
							res.status(400).send(error);
						})
			})
		}
	}).catch((error) => {
		res.status(400).send()
	})
})

app.get('/getUserImg/:id', (req, res) => {
	// Add code here
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	// Otherwise, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			/// sometimes wrap returned object in another object
			const userImg = user.profilePicture
			res.send({userImg})
		}
	}).catch((error) => {
		res.status(400).send()
	})
})

//Codes for search result
//search type can only be: "resName", "location", "category"
app.get('/searchRestaurants/:searchType/:content/:from', generalPagesAuthenticate, (req, res) => { 
	const content = req.params.content;
	const searchType = req.params.searchType;
	const from = req.params.from;
	if(searchType == "resName"){
		Restaurant.find({name: {$regex: new RegExp(content.trim(), "i") }}).then((result) =>
		{
			req.session.searchingRes = result;
			//promise has delay, so we can only put this comment code here
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
				//delete session after using it
				req.session.searchingRes = null;
				req.session.from = null;
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	} else if(searchType == "location"){
		Restaurant.find({location: {$regex: new RegExp(content.trim(), "i")}}).then((result) =>
		{
			req.session.searchingRes = result;
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
				req.session.searchingRes = null;
				req.session.from = null;
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	}else if(searchType == "category"){
		Restaurant.find({category: {$regex: new RegExp(content.trim(), "i")}}).then((result) =>
		{
			req.session.searchingRes = result;
			if(from == "search_page"){
				res.send({res: req.session.searchingRes});
				req.session.searchingRes = null;
				req.session.from = null;
			} else{
				res.redirect('/openSearchResult');
			}
		}).catch((error) => res.status(400).send(error))
	} else{
		res.status(400).send("invalid search type!");
	}
	
})

app.get('/openSearchResult', generalPagesAuthenticate, (req, res) => {
	// check if we have active session cookie
		res.sendFile(__dirname + '/public/restaurants_search_result.html')
})

app.get('/getRestaurants', generalPagesAuthenticate, (req, res) => {
	if(req.session.searchingRes){
		res.send({res: req.session.searchingRes});
		req.session.searchingRes = null;
	}
})

/*       codes for admin page   */
app.route('/adminResReviews')
.get(adminPagesAuthenticate, (req, res) => {
	res.sendFile(__dirname + '/public/individual_account_adminView_comments.html')
})

app.route('/adminBanUsers')
	.get(adminPagesAuthenticate, (req, res) => {
		res.sendFile(__dirname + '/public/individual_account_adminView_banUser.html')
	})

app.route('/adminRestaurants')
	.get(adminPagesAuthenticate, (req, res) => {
		res.sendFile(__dirname + '/public/individual_account_adminView_restaurants.html')
	})

app.get('/admin/getAllUsers', adminPagesAuthenticate, (req, res) => {
	User.find({accountType: {$not: {$eq: 'a'}}}).then((result) => {
		res.send(result);
	}).catch(error => res.status(400).send(error));
})

app.get('/admin/getAllRestaurants', adminPagesAuthenticate, (req, res) => {
	Restaurant.find().then((result) => {
		res.send(result);
	}).catch(error => res.status(400).send(error));
})

app.patch('/admin/banOrRecoverUser', adminPagesAuthenticate, (req, res) => {
	const user = req.body.userToModify;
	
	User.findByIdAndUpdate(user._id, 
		{ $set: {
		banned: !user.banned
	}}, {new: true}
		).then((result) => {
		res.send()
	}).catch(error => {res.status(400).send(error)});
})

//delete a restaurant review given its id
app.delete('/admin/removeReview/:id/:resId', adminPagesAuthenticate, (req, res) =>{
	const id = req.params.id
	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}
	Review.findOneAndDelete({_id: id}).then((review) =>{
		//calculate the average of price and rate after update
		const ObjectId = mongoose.Types.ObjectId
		Review.aggregate([
			{ $match: {"resID": ObjectId(req.params.resId)}},
			{$group: {
				_id: null, 
				rate: {$avg: "$rate"}, 
				price: {$avg: "$price"}}}]).then((average) =>{
                    const aveRate = 0;
                    const avePrice = 0;
                    if (average.length > 0){
                        aveRate = average[0].rate
					    avePrice = average[0].price
                    }
					Restaurant.findOneAndUpdate({_id: req.params.resId},
						{$set: {
							rate: aveRate,
							price: avePrice
						}}).then((update) =>{
							res.send(review)
						})
				}, (error) =>{
					res.status(400).send(error);
				})
		
	}, (error) =>{
		res.status(400).send(error)
	})
})


app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
}) 