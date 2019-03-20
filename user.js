const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    accountType: String 
}); 
const User = mongoose.model('user', userSchema);

model.exports = User;