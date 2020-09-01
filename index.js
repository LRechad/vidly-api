const express = require('express');

// Routes
const genresRoutes = require('./routes/genres'); 

const app = express();

// Parse POST request
app.use(express.json());
app.use('/api/genres', genresRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}...`));