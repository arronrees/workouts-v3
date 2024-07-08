import { Router } from 'express';
import {
  getAllExercises,
  getUserExercises,
  getSingleWorkoutExercise,
  getFavouriteExercises,
} from '../controllers/exercise.controller';

export const exerciseRouter = Router();

exerciseRouter.get('/', getAllExercises);

exerciseRouter.get('/user', getUserExercises);

exerciseRouter.get('/favourites', getFavouriteExercises);

exerciseRouter.get('/:workoutExerciseId', getSingleWorkoutExercise);
