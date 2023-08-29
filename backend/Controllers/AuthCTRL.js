const jwt = require('jsonwebtoken');
const Users = require('../Models/UsersM');

exports.signinController = (req, res, next) => {
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
}

exports.signupController = (req, res, next) => {
    let {name, email, password, confirmPass, imagePath} = req.body;

    let user = new Users({name, email, password, imagePath: `https://robohash.org/${name}`});
    user.save()
    .then(() => {
        app.get("socketService").emiter('recieve-user-creation', true);
        res.json({messsage: 'User Created Successfully'});
    })
    .catch(err => console.log(err))

}

exports.signoutController = (req, res, next) => {
    let userID = req.body.userID;
    Users.findById({_id: userID})
    .then(user => {
        user.status = false;
        user.lastContactWith = '';
        user.save();
        res.json({})
    })
    .catch(err => console.log(err))
}