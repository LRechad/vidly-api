const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

// Routes
const genresRoutes = require('./routes/genres');
const customersRoutes = require('./routes/customers');
const moviesRoutes = require('./routes/movies');
const rentalsRoutes = require('./routes/rentals');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost/vidly', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    retryWrites: false
}).then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB ...', err));

// Parse POST request
app.use(express.json());
app.use('/api/genres', genresRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`));