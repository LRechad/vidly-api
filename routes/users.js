const express = require('express');
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

    await user.save();
    
    res.send({
        '_id': user._id,
        name,
        email
    });
});

module.exports = router;