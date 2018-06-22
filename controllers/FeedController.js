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
router.get('/', VerifyToken, async (req, res) => {
    const userId = req.userId;

    const qtyOfPostsLoaded = +req.headers["qtyofpostsloaded"];
    const newestPostId = req.headers["newestpostid"];

    console.log("qtyOfPostsLoaded: " + qtyOfPostsLoaded);
    console.log("newestpostid: " + newestPostId);

    /*
    let lastPostReached = lastPostLoadedGiven && false;
    let newestPostReached = newestPostLoadedGiven && false;
    */

    User.findById(userId).then(async (user) => {
        const userFolloweeIDs = user.following;
        
        let feed = [];

        let i = 0;

        if (qtyOfPostsLoaded) {
            
            console.log("In qtyofPostLoaded");
            while (i < 5 + qtyOfPostsLoaded) {
                let surface = [];
                
                for await (let followeeId of userFolloweeIDs) {
                    let user = await User.findById(followeeId);

                    let index = 0;
                    
                    while (user.posts[index] && feed.some(e => e.id.toString() == user.posts[index].toString())) {
                        index++;
                    }

                    let latestPostId = user.posts[index];

                    if (latestPostId !== undefined) {
                        let recipe = await Recipe.findById(latestPostId);
                        let author = await User.findById(recipe.authorId);
                        

                        surface.push({
                            id: latestPostId,
                            title: recipe.title,
                            authorUsername: author.username,
                            createdAt: recipe.createdAt,
                            lastEditedAt: recipe.lastEditedAt,
                            recipePhotoUrl: recipe.recipePhotoUrl,
                            youtubeLink: recipe.youtubeLink,
                            directions: recipe.directions,
                            ingredients: recipe.ingredients,
                            comments: recipe.comments,
                            likes: recipe.likes

                        });
                    }   
                }

                if (surface.length > 0) {
                    let freshestPost = surface.reduce((prev, current) => {
                        return prev.createdAt > current.createdAt ? prev : current;
                    });
                    
                    feed.push(freshestPost);
                } 
                
                i++;
            }





        } else if (newestPostId) {
            console.log("IN newestpost");
            let freshestPost = { 
                id: undefined,
                createdAt: undefined
            }

            while (!freshestPost.id || freshestPost.id && freshestPost.id.toString() != newestPostId.toString()) {
                let surface = [];
                
                for await (let followeeId of userFolloweeIDs) {
                    let user = await User.findById(followeeId);

                    let index = 0;
                    
                    while (user.posts[index] && feed.some(e => e.id.toString() == user.posts[index].toString())) {
                        index++;
                    }

                    let latestPostId = user.posts[index];

                    if (latestPostId !== undefined) {
                        let recipe = await Recipe.findById(latestPostId);
                        let author = await User.findById(recipe.authorId);

                        surface.push({
                            id: latestPostId,
                            title: recipe.title,
                            authorUsername: author.username,
                            createdAt: recipe.createdAt,
                            lastEditedAt: recipe.lastEditedAt,
                            recipePhotoUrl: recipe.recipePhotoUrl,
                            youtubeLink: recipe.youtubeLink,
                            directions: recipe.directions,
                            ingredients: recipe.ingredients,
                            comments: recipe.comments,
                            likes: recipe.likes
                        });
                    }   
                }

                if (surface.length > 0) {
                    freshestPost = surface.reduce((prev, current) => {
                        return prev.createdAt > current.createdAt ? prev : current;
                    });
                    
                    feed.push(freshestPost);
                }
            }



            
        } else {
            console.log("in no headers");
            while (i < 5) {
                let surface = [];
                
                for await (let followeeId of userFolloweeIDs) {
                    let user = await User.findById(followeeId);

                    let index = 0;
                    
                    while (user.posts[index] && feed.some(e => e.id.toString() == user.posts[index].toString())) {
                        index++;
                    }

                    let latestPostId = user.posts[index];

                    if (latestPostId !== undefined) {
                        let recipe = await Recipe.findById(latestPostId);
                        let author = await User.findById(recipe.authorId);

                        surface.push({
                            id: latestPostId,
                            title: recipe.title,
                            authorUsername: author.username,
                            createdAt: recipe.createdAt,
                            lastEditedAt: recipe.lastEditedAt,
                            recipePhotoUrl: recipe.recipePhotoUrl,
                            youtubeLink: recipe.youtubeLink,
                            directions: recipe.directions,
                            ingredients: recipe.ingredients,
                            comments: recipe.comments,
                            likes: recipe.likes
                        });
                    }   
                }

                if (surface.length > 0) {
                    let freshestPost = surface.reduce((prev, current) => {
                        return prev.createdAt > current.createdAt ? prev : current;
                    });
                    
                    feed.push(freshestPost);
                } 
                
                i++;
            }
        }

        if (newestPostId) {
            feed.pop();
        }


        if (qtyOfPostsLoaded) 
            feed.splice(0, qtyOfPostsLoaded);
        
        res.status(200).send(feed);

        feed = [];
    });
})

module.exports = router;