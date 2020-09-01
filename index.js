const express = require('express');
const mongoose = require('mongoose');

// Routes
const genresRoutes = require('./routes/genres');

const app = express();

mongoose.connect('mongodb://localhost/vidly', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB ...', err));

// Parse POST request
app.use(express.json());
app.use('/api/genres', genresRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`));