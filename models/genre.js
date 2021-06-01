const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

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
    name: Joi.string().min(5).max(55).required()
  });

  return schema.validate(genre);
}

module.exports = {
    Genre,
    validate: validateGenre,
    genreSchema
}
