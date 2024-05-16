import { Router } from 'express';
import {
  getAllExercises,
  getUserExercises,
  getSingleWorkoutExercise,
} from '../controllers/exercise.controller';

export const exerciseRouter = Router();

exerciseRouter.get('/', getAllExercises);

exerciseRouter.get('/user', getUserExercises);

exerciseRouter.get('/:workoutExerciseId', getSingleWorkoutExercise);
