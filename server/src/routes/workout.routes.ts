import { Router } from 'express';
import {
  checkCreateWorkoutObjectValid,
  checkRecordWorkoutObjectValid,
} from '../middleware/workout.middleware';
import {
  createWorkoutController,
  getSingleWorkoutController,
  getSingleWorkoutWithHistoryController,
  getUserWorkoutsController,
  recordWorkoutController,
  getWorkoutHistoryController,
  getSingleInstanceController,
} from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', getUserWorkoutsController);

workoutRouter.get('/history', getWorkoutHistoryController);

workoutRouter.get('/:workoutId', getSingleWorkoutController);

workoutRouter.get('/:workoutId/history', getSingleWorkoutWithHistoryController);

workoutRouter.get(
  '/:workoutId/history/:instanceId',
  getSingleInstanceController
);

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);

workoutRouter.post(
  '/record/:workoutId',
  checkRecordWorkoutObjectValid,
  recordWorkoutController
);
