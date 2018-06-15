const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const VerifyToken = require('./../auth/VerifyToken');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

const User = require('./../models/User');

// get current authorized user (own profile info)
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) 
            return res.status(500).send('Internal server error while getting authorized profile info.');
        
        if (!user) 
            return res.status(404).send('No authorized user profile found');

        delete user['password'];
        
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

// update user profile info
router.patch('/', VerifyToken, upload.single('profilePhoto'), (req, res) => {
    console.log(req.body);

    let patch = new Object(req.body);
    Object.assign(patch, req.file && { profilePhotoUrl: req.file.path });

    User.findByIdAndUpdate(req.userId, patch, { new: true }, (err, user) => {
        if (err)
            return res.status(500).send('Internal server error while patching profile info.');

        if (!user)
            return res.status(404).send('Patching: No user profile found');

        delete user["password"];

        res.status(200).send(user);
    })
});

// delete current authorized user info
router.delete('/', VerifyToken, (req, res) => {
    User.findByIdAndRemove(req.userId, {password: 0}, (err, user) => {
        if (err)
            return res.status(500).send('Internal server error while deleting profile info.');

        if (!user)
            return res.status(404).send('Deleting: No user profile found');

        res.status(200).send({success: true});
    });
});

router.post('/:id/follow', VerifyToken, (req, res, next) => {
    let profileId = req.userId;

    User.findById(profileId).then((user) => {
        if (!user) 
            return res.sendStatus(404);

        return user.follow(req.params.id).then(() => {
            return res.status(200).send({
                action: "subscribe",
                status: "success",
                follower: user,
                followee: req.params.id
            });
        })
    }).catch(next)
});

router.delete('/:id/follow', VerifyToken, function(req, res, next){
    let profileId = req.userId;
  
    User.findById(profileId).then(function(user){
      if (!user) { return res.sendStatus(404); }
  
      return user.unfollow(req.params.id).then(function(){
        return res.status(200).send({
            action: "unsubscribe",
            status: "success",
            unfollower: user,
            unfollowee: req.params.id
        });
      });
    }).catch(next);
  });

module.exports = router;