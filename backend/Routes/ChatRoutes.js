const express = require('express');
const app = express();

const Users = require('../Models/UsersM');
const Rooms = require('../Models/RoomsM');

// get all users
app.get('/UsersList', (req, res, next) => {
    Users.find().populate('rooms')
    .then(users => {
        if(users){
            res.json({users});
        } else {
            res.json({message: 'No users found'});
        }
    })
    .catch(err => console.log(err))
})



const createNewRoom = (users, filter) => {
    let newRoom = new Rooms({creators: filter, messages: []});
    users[0].rooms.push(newRoom._id);
    users[1].rooms.push(newRoom._id);
    users[0].save();
    users[1].save();
    newRoom.save()
    .then(result => {
        console.log()
        app.get("socketService").emiter('recieve-room-creation', {to: filter[0], from: filter[1]});
    })
    .catch(err => console.log(err)); 
    return newRoom;
}

// get shared room of two users by their IDs
app.get('/Rooms/:userID/:authUserID', (req, res, next) => {
    let userID = req.params.userID;
    let authUserID = req.params.authUserID;
    let filter = [userID, authUserID];
    let filterReverse = [...filter].reverse();
    let data = {};

    Users.find({_id: {$in: filter}})
    .then(users => {
        data.user = users[0]._id.toString() === authUserID ? users[1] : users[0];

        // if user has rooms
        if(users[0].rooms.length !== 0){
            Rooms.findOne({$or: [{creators: filter}, {creators: filterReverse}]})
            .then(room => {
                // if the room not among them
                if(!room) {
                    data.room = createNewRoom(users, filter);
                    return res.json({...data});
                } else {
                    data.room = room;
                    return res.json({...data});
                }
            })
            .catch(err => console.log(err))
        } else {
            data.room = createNewRoom(users, filter)
            return res.json({...data})
        }
    })
    .catch(err => console.log(err))
})




// adding new meassge to (room) messages array 
app.post('/newMessage', (req, res, next) => {
    let message = req.body;
    // save the message to the room
    Rooms.findOne({_id: message.room})
    .then(room => {
        room.messages.push(message);
        room.lastMessage = message;
        room.save()
        .then(r => {
            return res.json({message: 'added successfully'})
        })
    })
    .catch(err => console.log(err))
})

module.exports = app;