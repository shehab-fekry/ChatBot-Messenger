const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let cors = require('cors')

const AuthRoutes = require('./Routes/AuthRoutes');
const ChatRoutes = require('./Routes/ChatRoutes');

// integrating (express.js) and (socket.io) into server connection 
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server, {cors: {origin: '*'}});
io.on('connection', socket => {
    socket.on('send-message', message => {
        // socket.emit(`${message.to}`, message)
        socket.broadcast.emit('recieve-message', message)
    })

    socket.on('send-status', status => {
        socket.broadcast.emit('recieve-status', status)
    })
})

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
