const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    authorId: {type: String, required: true},
    recipePhotoUrl: {type: String, required: true},
    ingredients: {type: Array, required: true},
    youtubeLink: {type: String, required: true},
    directions: {type: String, required: true},
    createdAt: Date,
    lastEditedAt: Date,
    comments: Array,
    likes: Array,

});

mongoose.model('Recipe', RecipeSchema);
module.exports = mongoose.model('Recipe');