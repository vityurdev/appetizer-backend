const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: String,
    authorId: String,
    recipePhotoUrl: String,
    ingredients: Array,
    youtubeLink: String,
    directions: String,
    createdAt: Date,
    lastEditedAt: Date,
    comments: Array,
    likes: Array,

});

mongoose.model('Recipe', RecipeSchema);
module.exports = mongoose.model('Recipe');