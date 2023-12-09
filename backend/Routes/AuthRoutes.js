const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const Users = require('../Models/UsersM');
let { validationResult } = require('express-validator');
const valid = require('../Validation/Validation');

// check if user exist before login
app.post('/userExist', (req, res, next) => {
    let email = req.body.email;
    Users.findOne({email: email})
    .then(user => {
        if(!!user)
        return res.json({name: user.name, imagePath: user.imagePath})
        else
        return res.json({message: 'No Such Bot Exist!'})
    })
    .catch(err => console.log(err))
})



app.post('/signin', (req, res, next) => {
    let {email, password} = req.body;
    let loginData = {};

    Users.findOne({email: email})
    .then(user => {
        let token;
        if(user) {
            token = jwt.sign({email: email}, 'very_secret_key');
            user.status = true;
            user.save()
            .then(result => {
                loginData._id = user._id;
                loginData.name = user.name;
                loginData.status = user.status;
                loginData.imagePath = user.imagePath;
                res.json({user: loginData, token});
            });
        } else {
            res.json({message: 'User not found please signup first'})
        }
    })
    .catch(err => console.log(err))
});



const validation = [valid.Name, valid.Email, valid.Password, valid.confirmPassword]

app.post('/signup', validation ,(req, res, next) => {
    let {name, email, password, confirmPass, imagePath} = req.body;

    // express-validator (2)
    let errors = validationResult(req).array();
    let errorArray=[];
    errors.forEach(err => errorArray.push(err.msg))

    if(!errors){
        let user = new Users({name, email, password, imagePath: `https://robohash.org/${name}`});
        user.save()
        .then(() => {
            app.get("socketService").emiter('recieve-user-creation', true);
            res.json({messsage: 'User Created Successfully'});
        })
        .catch(err => console.log(err))
    } 
    else
        return res.json({message: errorArray})
});




app.post('/signout', (req, res, next) => {
    let userID = req.body.userID;
    Users.findById({_id: userID})
    .then(user => {
        user.status = false;
        user.lastContactWith = '';
        user.save();
        res.json({})
    })
    .catch(err => console.log(err))
});

module.exports = app;