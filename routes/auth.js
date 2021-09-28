const express = require('express');
const Joi = require('@hapi/joi');
const { compare } = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

// Validation for authenticating users
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(data);
}

router.post('/', async (req, res) => {
    // Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check for already registered email
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password');

    // Compare plain text with hashed password
    const validPassword = await compare(req.body.password, user.password); 
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

module.exports = router;