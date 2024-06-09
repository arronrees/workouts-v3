import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { __in_production } from './constants';
import { webhookController } from './controllers/webhook.controller';
import bodyParser from 'body-parser';
import { ClerkExpressRequireAuth, StrictAuthProp } from '@clerk/clerk-sdk-node';
import { exerciseRouter } from './routes/exercise.router';
import { workoutRouter } from './routes/workout.routes';

export const prismaDB = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'));

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  webhookController
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(
  '*',
  ClerkExpressRequireAuth({}),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }
);

// routes
// these routes are proteched by clerk middleware above
app.use('/api/exercises', exerciseRouter);
app.use('/api/workouts', workoutRouter);

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

prismaDB.$connect().then(() => {
  app.listen(4000, () => {
    console.log('Server running on port 4000');
  });
});
