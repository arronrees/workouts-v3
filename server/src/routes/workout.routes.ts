import { Router } from 'express';
import { checkCreateWorkoutObjectValid } from '../middleware/workout.middleware';
import { createWorkoutController } from '../controllers/workout.controller';

export const workoutRouter = Router();

workoutRouter.post('/', checkCreateWorkoutObjectValid, createWorkoutController);
