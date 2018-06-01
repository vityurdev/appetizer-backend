const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const User = require('./../models/User');
const Recipe = require('./../models/Recipe');


const VerifyToken = require('./../auth/VerifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

//POST recipe
router.post('/recipes', VerifyToken, upload.single('recipePhoto'), (req, res) => {
    Recipe.create({
        title: req.body.title,
        authorId: req.userId,
        recipePhotoUrl: req.file.path,
        ingredients: req.body.ingredients.split(", "),
        youtubeLink: req.body.youtubeLink,
        directions: req.body.directions,
    }, (err, recipe) => {
        if (err) 
            return res.status(500).send("Internal server error while posting a recipe");
        if (!recipe)
            return res.status(404).send("Posting a recipe: recipe not found");
        
        res.status(200).send(recipe);
    });
});

module.exports = router;