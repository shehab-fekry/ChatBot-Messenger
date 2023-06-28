const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let cors = require('cors')

const AuthRoutes = require('./Routes/AuthRoutes');
const ChatRoutes = require('./Routes/ChatRoutes');
const SocketClass = require('./SocketService/SocketService');

// integrating (express.js) and (socket.io) into server connection 
let app = express();
let server = require('http').createServer(app);

// initializing socket.io + set it in app
// so it can be used in the application routes with: app.get()
// check ChatRoutes.js line 32 
app.set("socketService", new SocketClass(server)); 
app.use(bodyParser.json());
app.use(cors());

app.use('/Auth', AuthRoutes);
app.use('/Chat', ChatRoutes);

mongoose.connect('mongodb+srv://shehab-fekry:shehab@cluster0.5vmjrx9.mongodb.net/?retryWrites=true&w=majority')
.then((res) => {
    server.listen(8000);
    console.log('Connected')
})
.catch(err => console.log(err))