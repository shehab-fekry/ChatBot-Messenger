// express - validator implementation part(1)

const { body } = require('express-validator');

exports.Name = body('name')
.notEmpty()
.withMessage('name is required')
.isLength({min: 5})
.withMessage('Name at least 5 chars')                       // implementation number(2) in Signup.js page

exports.Email = body('email')
.notEmpty()
.withMessage('email is required')
.isEmail()
.withMessage('email should include @')
.isLength({min: 5})
.withMessage('email at least 5 chars')

exports.Password = body('password')
.isLength({min: 5})
.withMessage('At least 5 chars password')
.isAlphanumeric()
.withMessage('password of both chars and nums')

exports.confirmPassword = body('confirmPass')
.isLength({min: 5})
.isAlphanumeric()
.custom((value, req) => {
    return value === req.req.body.confirmPassword;
})
.withMessage('passwords must match')




