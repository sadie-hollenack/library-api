import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authorRoutes from './routes/authorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();
app.use(cors());

app.use(morgan('tiny'));

app.use(express.json());
app.use('/libapi/users', userRoutes);
app.use('/libapi/authors', authorRoutes);
app.use('/libapi/books', bookRoutes);
app.use('/libapi/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    console.log(err.stack);
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

export default app;
