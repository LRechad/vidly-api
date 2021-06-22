const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
    min: 5,
    max: 55,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    }
});

const User = mongoose.model('User', userSchema);

const validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
}

module.exports = {
    User,
    validate: validateUser
}