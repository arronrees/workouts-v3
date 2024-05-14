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
} from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', getUserWorkoutsController);

workoutRouter.get('/history', getWorkoutHistoryController);

workoutRouter.get('/:workoutId', getSingleWorkoutController);

workoutRouter.get('/:workoutId/history', getSingleWorkoutWithHistoryController);

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);

workoutRouter.post(
  '/record/:workoutId',
  checkRecordWorkoutObjectValid,
  recordWorkoutController
);
