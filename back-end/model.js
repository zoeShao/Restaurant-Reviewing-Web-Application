const mongoose = require('mongoose');
// const uniqueVali = require('mongoose-unique-validator');
const validator = require('validator')

const bcrypt = require('bcryptjs'),
  SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Not a valid email address'
    }
  },
  accountType: { // can only be 'u' - user, 'o' - Restaurant owner, 'a' - 'admin'
    type: String,
    enum: ['u', 'o', 'a'],
    required: true
  },
  banned: {
    type: Boolean,
    default: false
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
});

const resSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    trim: true
  },
  address: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    trim: true
  },
  rate: {
    type: Number,
    required: false,
    default: 0
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  }
});

const reviewSchema = new mongoose.Schema({
  resID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  resName: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: false,
    default: 0
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  content: {
    type: String,
    required: true,
    minLength: 1
  }
});

//run before save
userSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next();
  }
})

//run before findOneAndUpdate
userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.$set) {
    const user = this._update.$set
    if (user.password) {
      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(user.password, salt, (error, hash) => {
          user.password = hash
          next()
        })
      })
    } else {
      next();
    }
  }
  else {
    next();
  }
})

// Our user finding function by name and password
userSchema.statics.findByNamePassword = function (name, password) {
  const User = this

  return User.findOne({ name: name }).then((user) => {
    if (!user) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          resolve(null);
        }
      })
    })
  })
}


const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', resSchema);
const Review = mongoose.model('Reviews', reviewSchema);

module.exports = { User, Restaurant, Review }