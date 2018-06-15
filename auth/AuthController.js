const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const VerifyToken = require('./VerifyToken');

router.post('/register', (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password);

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        bio: null,
        profilePhotoUrl: null
    }, (err, user) => {
        if (err)
            return res.status(500).send("There was an error while registering the user.");

        // creating token 
        var token = jwt.sign({ id: user._id}, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token })
    });
});

router.post('/login', (req, res) => {
    console.log(req.body);

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err)
            return res.status(500).send('There was an error while performing login.');
        
        if (!user)
            return res.status(404).send('No user found.');

        var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ auth: null, token: null });
        }

        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token});
    });
});

/*
router.get('/feed', VerifyToken, (req, res) => {
    console.log(req);

    User.findById(req.userId, {password: 0}, (err, user) => {

        if (err)
            return res.status(500).send('Internal server error while loading feed');

        if (!user)
            return res.status(404).send('/feed: No user found');

        res.status(200).send({message: `Custom content for ${user.name}`}); 
    })
})
*/


module.exports = router;