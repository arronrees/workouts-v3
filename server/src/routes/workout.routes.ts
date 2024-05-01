import { Router } from 'express';
import { checkCreateWorkoutObjectValid } from '../middleware/workout.middleware';
import {
  createWorkoutController,
  getSingleWorkoutController,
  getUserWorkoutsController,
} from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', getUserWorkoutsController);

workoutRouter.get('/:id', getSingleWorkoutController);

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);
