const express = require('express');
const app = express();
const chatCTRL = require('../Controllers/ChatCTRL');

// get all users
app.get('/UsersList', chatCTRL.getAllUsers)

// get shared room of two users by their IDs
app.get('/Rooms/:userID/:authUserID', chatCTRL.getSharedRoom)

// adding new meassge to (room) messages array 
app.post('/newMessage', chatCTRL.addNewMessage)

module.exports = app;