const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    bio: String,
    profilePhotoUrl: String,
    posts: Array,
    likes: Array,
    favorites: Array
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
