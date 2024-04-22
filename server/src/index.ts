import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { __in_production } from './constants';

export const prismaDB = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', async (req: Request, res: Response) => {
  res.send('home');
});

// routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = null;
  res.locals.userToken = null;

  next();
});

// 404 handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: '404 - Route not found' });
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('--- error handler');
  console.error(err);

  res
    .status(500)
    .json({ error: __in_production ? '500 - Server error' : err.message });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
