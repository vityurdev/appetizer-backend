const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const VerifyToken = require('./../auth/VerifyToken')

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const User = require('./../models/User');


// get current authorized user (own profile info)
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) 
            return res.status(500).send('Internal server error while getting authorized profile info.');
        
        if (!user) 
            return res.status(404).send('No authorized user profile found');
        
        res.status(200).send(user);
    });
});

// get user profile info
router.get('/:id', (req, res) => {
    User.findById(req.params.id, {password: 0}, (err, user) => {
        if (err)
            return res.status(500).send('Internal server error while getting profile info.');

        if (!user)
            return res.status(404).send('No user profile found');

        res.status(200).send(user);
    });
});

router.patch(':id', VerifyToken, upload.single('profile_photo'), (req, res) => {

});

module.exports = router;