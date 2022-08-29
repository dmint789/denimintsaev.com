import express from 'express';
import mongoose, { CallbackWithoutResult } from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Handles json data
app.use(express.urlencoded({ extended: true })); // Handles url encoded data
//app.use(express.static('uploads')); // Taken from the tutorial

let dbURI = '';
if (process.env.NODE_ENV !== 'production') {
  dbURI = 'mongodb://mongoadmindev:mongoadmindev1234@localhost:27017';
}

// Routes
app.use('/api/posts', require('./routes/api/posts'));

// Database
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  autoIndex: false,
  poolSize: 50,
  retryWrites: false,
  socketTimeoutMS: 30000,
  //useFindAndModify: true,
  //useCreateIndex: true,
  //dbName: 'denimintsaev',
};

mongoose
  .connect(dbURI, options)
  .then(() => console.log('Connected to the DB'))
  .catch((err: any) => console.log(err));

app.listen(5000, () => console.log(`Server is listening on port 5000`));

export default app;
