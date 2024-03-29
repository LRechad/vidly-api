const express = require('express');
const { validate, Genre } = require('../models/genre');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre with given id not found');

  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name
  })

  await genre.save();
  res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find & update the genre
  const genre = await Genre.findByIdAndUpdate({ _id: req.params.id}, {
    $set: {
      name: req.body.name
    }
  }, { new: true });
  if (!genre) return res.status(404).send('Genre with given id not found');
  
  // Return updated genre
  res.send(genre);
});

router.delete('/:id', auth, async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('Genre with given id not found');

  // Return deleted genre
  res.send(genre);
});

module.exports = router;