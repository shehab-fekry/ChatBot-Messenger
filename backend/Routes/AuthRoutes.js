const express = require('express');
const app = express();
const AuthCTRL = require('../Controllers/AuthCTRL');

app.post('/signin', AuthCTRL.signinController);

app.post('/signup', AuthCTRL.signupController);

app.post('/signout', AuthCTRL.signoutController);

module.exports = app;