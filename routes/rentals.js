const express = require('express');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with given ID was not found');

    res.send(rental);
});

router.post('/', async (req, res) => {
    // Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Search for customer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    // Search for movie
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    // Check for movie stock
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const rental = new Rental({
        customer: {
            _id: customer.id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        await rental.save();
 
        // Update movie stock
        movie.numberInStock--;
        movie.save();
 
        await session.commitTransaction();
        session.endSession();
 
        res.send(rental);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
 
        res.status(500).send(err.message);
    }
});

module.exports = router;