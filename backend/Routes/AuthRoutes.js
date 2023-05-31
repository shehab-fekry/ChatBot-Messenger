const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Users = require('../Models/UsersM');

app.post('/signin', (req, res, next) => {
    let {email, password} = req.body;

    Users.findOne({email: email})
    .then(user => {
        let token;
        if(user) {
            token = jwt.sign({email: email}, 'very_secret_key');
            user.status = true;
            user.save();
            res.json({user, token});
        } else {
            res.json({message: 'User not found please signup first'})
        }
    })
    .catch(err => console.log(err))
});



app.post('/signup', (req, res, next) => {
    let {name, email, password, confirmPass, imagePath} = req.body;

    let user = new Users({name, email, password, imagePath: `https://robohash.org/${name}`});
    user.save()
    .then(() => {
        res.json({messsage: 'User Created Successfully'});
    })
    .catch(err => console.log(err))

});



app.post('/signout', (req, res, next) => {
    let userID = req.body.userID;
    Users.findById({_id: userID})
    .then(user => {
        user.status = false;
        user.save();
        res.json({})
    })
    .catch(err => console.log(err))
})

module.exports = app;