const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();

// DATA
const genres = [
  { id: 1, name: 'fiction' },
  { id: 2, name: 'action' },
  { id: 3, name: 'drama' },
  { id: 4, name: 'comedy' }
]

const validateGenre = genre => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(30).required()
  })

  return schema.validate(genre);
}

router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.filter(genre => genre.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send('Genre with given id not found');
  }

  res.send(genre);
});

router.post('/', (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }

  genres.push(genre);
  res.send(genre);
});

router.put('/:id', (req, res) => {
  // Find the genre
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send('Genre with given id not found');
  }
  
  // Validation
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Return updated genre
  genre.name = req.body.name;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  // Find the index of the genre
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send('Genre with given id not found');
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = router;