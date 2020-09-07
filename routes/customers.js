const express = require('express');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const router = express.Router();

// Mongoose schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    }
});

const Customer = mongoose.model('Customer', customerSchema);

// Joi validation
const validateCustomer = customer => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(55).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(55).required()
    });

    return schema.validate(customer);
}

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({ name: 1});
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Customer with given id not found');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }
    }, 
    {
        new: true,
        omitUndefined: true,
        runValidators: true
    });

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Customer with given id not found');

    res.send(customer);
});

module.exports = router;