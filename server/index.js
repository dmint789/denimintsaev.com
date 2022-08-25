const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
//Temporary
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

// Routes
app.use('/api/posts', require('./routes/api/posts'));

// Database
mongoose
  .connect('mongodb://localhost:27017/denimintsaev', {
    dbName: 'denimintsaev',
    useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: true,
    //useCreateIndex: true,
  })
  .then(() => console.log('Connected to the DB'))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
