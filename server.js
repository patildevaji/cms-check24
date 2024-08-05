const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend'))); 

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

module.exports = app;  
