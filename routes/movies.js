const express = require('express');
const { validate, Movie } = require('../models/movie');
const  { Genre } = require('../models/genre');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 });

    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie with given id not found');

    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    // Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Search for genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Invalid Genre');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    //Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Search for genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    // Find & update the movie
    const movie = await Movie.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre.id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });
    if (!movie) return res.status(404).send('Movie with given id not found!');
    
    // Return updated movie
    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('Movie with given id not found');

    // Return deleted movie
    res.send(movie);
});

module.exports = router;