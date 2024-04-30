import { Router } from 'express';
import { checkCreateWorkoutObjectValid } from '../middleware/workout.middleware';
import {
  createWorkoutController,
  getUserWorkoutsController,
} from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.get('/', getUserWorkoutsController);

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);
