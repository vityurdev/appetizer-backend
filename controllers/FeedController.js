const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const VerifyToken = require('./../auth/VerifyToken');

const User = require('./../models/User');
const Recipe = require('./../models/Recipe');

// get your personal feed based on your subscriptions 
router.get('/', VerifyToken, (req, res) => {
    const userId = req.userId;

    console.log("ID of current user: " + userId);

    User.findById(userId).then((user) => {
        const userFolloweeIDs = user.following;

        const iterator = userFolloweeIDs[Symbol.iterator]();

        console.log ("User.following = " + user.following);

        console.log("These are current user\'s followees\' IDs:");
        for (let followeeId of iterator) {
            console.log(followeeId);
        }



        const iArr = userFolloweeIDs[Symbol.iterator]();

        let surface = [];
        let feed = [];
    
        
        console.log("Let iteration begin!");

        for (let i = 0, p = Promise.resolve(); i < 10; i++) {
            

            
            for (let followeeID of iArr) {
                User.findById(followeeID).then((user) => {
                    let index = 0;

                    
                    while (surface.some(e => e.id === user.posts[index])) {
                        index++;
                        if (user.posts[index] === undefined) {
                            break;
                        }
                    }

                    console.log("Index: " + index);

                    let latestPostID = user.posts[index];

                    console.log("LatestPostID: " + latestPostID);
                    

                    let freshestPost = null;
                    
                    if (surface.length > 0) {
                        freshestPost = surface.reduce((prev, current) => {
                            return (prev.createdAt > current.createdAt) ? prev : current
                        });

                        surface.splice(surface.indexOf(freshestPost), 1);
                    }

                    console.log(freshestPost)
                    

                    

                    if (latestPostID !== undefined) {
                        Recipe.findById(latestPostID).then((recipe) => {
                            

                            surface.push({
                                id: latestPostID,
                                createdAt: recipe.createdAt
                            });

                            freshestPost = null;

                            if (surface.length > 0) {
                                freshestPost = surface.reduce((prev, current) => {
                                    return (prev.createdAt > current.createdAt) ? prev : current
                                });
                            }

                            feed.push(freshestPost);

                            
                        });
                    }
                });
            }

            // console.log(surface);

            /*
            let freshestPost = null;

            if (surface.length > 0) {
                freshestPost = surface.reduce((prev, current) => {
                    return (prev.createdAt > current.createdAt) ? prev : current
                });
            }
            

            feed.push(freshestPost);
            */
            

        }

        res.status(200).send(feed);
    });
})

module.exports = router;