import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import pool from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

pool.query('SELECT NOW()').then(res => {
  console.log('DB connected:', res.rows[0]);
}).catch(err => {
  console.error('DB connection error:', err);
});

export default app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});