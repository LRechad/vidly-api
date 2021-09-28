const express = require('express');
const jwt = require('jsonwebtoken');
const { genSalt, hash } = require('bcrypt');
const { User, validate } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    // Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check for already registered email
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.');

    const { name, email, password } = req.body;
    user = new User({
        name,
        email,
        password
    });

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    await user.save();
    
    // Generating a token during registration
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
        '_id': user._id,
        name,
        email
    });
});

module.exports = router;