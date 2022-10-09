import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import PostsRouter from './routes/posts';
import { getCollectiveClicks, incrementButtonClicks } from './routes/other';

import Random from './models/random';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Handles json data
app.use(express.urlencoded({ extended: true })); // Handles url encoded data

// Static files (path is relative to the directory from which the node process is launched)
app.use('/api/static', express.static('assets/public'));

// Routes
app.get('/api/get_collective_clicks', getCollectiveClicks);
app.post('/api/increment_counter', incrementButtonClicks);
app.use('/api/posts', PostsRouter);

// Database
const dbURI = process.env.MONGODB_URI || 'mongodb://mongoadmindev:mongoadmindev123@localhost:27017/admin';

const options = {
  dbName: 'denimintsaev',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 40000,
  //autoIndex: false,
  //poolSize: 50,
  //retryWrites: false,
  //useFindAndModify: true,
  //useCreateIndex: true,
};

mongoose
  .connect(dbURI, options)
  .then(() => console.log('Connected to the DB'))
  .catch((err) => console.log(err));

// DB initialization
Random.find()
  .then((results) => {
    console.log('Results', results);

    if (results.length === 0) {
      Random.create({}, (err: any) => console.log(err));
    }
  })
  .catch((err: any) => console.log(err));

// Start server
const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

export default app;
