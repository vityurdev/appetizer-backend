const express = require('express');
const app = express();
const db = require('./db');

const AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

const ProfileController = require('./controllers/ProfileController');
app.use('/api/profile', ProfileController);

app.use(express.static('uploads'));

module.exports = app;