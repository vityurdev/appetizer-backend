const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    youtubeLink: String,
    directions: String
});

mongoose.model('Recipe', RecipeSchema);
module.exports = mongoose.model('Recipe');