const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

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

module.exports = {
    Customer,
    validate: validateCustomer
}