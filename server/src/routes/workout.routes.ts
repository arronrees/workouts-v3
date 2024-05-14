import { Router } from 'express';
import {
  checkCreateWorkoutObjectValid,
  checkRecordWorkoutObjectValid,
} from '../middleware/workout.middleware';
import {
  createWorkoutController,
  getSingleWorkoutController,
  getUserWorkoutsController,
  recordWorkoutController,
} from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', getUserWorkoutsController);

workoutRouter.get('/:workoutId', getSingleWorkoutController);

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);

workoutRouter.post(
  '/record/:workoutId',
  checkRecordWorkoutObjectValid,
  recordWorkoutController
);
