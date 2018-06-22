const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const VerifyToken = require('./../auth/VerifyToken');

const User = require('./../models/User');
const Recipe = require('./../models/Recipe');

// get recent activity of your followees 
router.get("/", VerifyToken, (req, res) => {
    
});

module.exports = router;