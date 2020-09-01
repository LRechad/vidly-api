const express = require('express');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const router = express.Router();

// Build the Schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 55
  }
});

const Genre = mongoose.model('Genre', genreSchema);

const validateGenre = genre => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(30).required()
  })

  return schema.validate(genre);
}

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre with given id not found');

  res.send(genre);
});

router.post('/', async (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
  })

  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
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

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('Genre with given id not found');

  // Return deleted genre
  res.send(genre);
});

module.exports = router;