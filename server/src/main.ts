import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import PostsRouter from './routes/posts';
import { getCollectiveClicks, incrementButtonClicks } from './routes/other';
import Random from './models/random';

const app = express();

// Middleware

if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: ['https://denimintsaev.com', 'https://www.denimintsaev.com'] }));
} else {
  app.use(cors());
}

app.use(express.json()); // Handles json data
app.use(express.urlencoded({ extended: true })); // Handles url encoded data

// Static files (path is relative to the directory from which the node process is launched)
app.use('/api', express.static('public'));

// Routes
app.get('/api/get_collective_clicks', getCollectiveClicks);
app.post('/api/increment_counter', incrementButtonClicks);
app.use('/api/posts', PostsRouter);

// Database
const dbURI =
  process.env.MONGODB_URI || 'mongodb://mongoadmindev:mongoadmindev123@localhost:27017/admin';

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
    if (results.length === 0) {
      console.log('There are no results, initializing DB');
      Random.create({}, (err: any) => console.log(err));
    } else {
      console.log('Results', results);
    }
  })
  .catch((err: any) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// export default app;
