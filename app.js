const express = require('express');
const app = express();
const db = require('./db');

const AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

const ProfileController = require('./controllers/ProfileController');
app.use('/api/profile', ProfileController);

const RecipeController = require('./controllers/RecipeController');
app.use('/api/recipes', RecipeController);

const FeedController = require('./controllers/FeedController');
app.use('/api', FeedController);

app.use('/uploads', express.static('uploads'));

module.exports = app;