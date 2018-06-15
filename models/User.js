const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    bio: String,
    profilePhotoUrl: String,
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
    likes: Array,
    favorites: Array
});

UserSchema.methods.follow = function(id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
        
        let User = mongoose.model('User', UserSchema);
        User.findById(id).then((user) => {
            user.followers.push(this._id);
            return user.save();
        });
    }
    return this.save();
}

UserSchema.methods.unfollow = function(id)  {
    this.following.remove(id);

    let User = mongoose.model('User', UserSchema);
    User.findById(id).then((user) => {
        let index = user.followers.indexOf(this._id);
        if (index > -1) {
            user.followers.splice(index, 1);
        }
        
        return user.save();
    })

    return this.save();
}

UserSchema.methods.isFollowing = function(id) {
    return this.following.some(function(followId) {
        return followId.toString() === id.toString();
    })
}

UserSchema.methods.toProfileJSONFor = function(user) {
    return {
        username: this.username,
        bio: this.bio,
        profilePhotoUrl: this.profilePhotoUrl || "https://d30y9cdsu7xlg0.cloudfront.net/png/630729-200.png",
        following: user ? user.isFollowing(this._id) : false
    }
}

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
