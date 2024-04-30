import { Router } from 'express';
import { getAllExercises } from '../controllers/exercise.controller';

export const exerciseRouter = Router();

exerciseRouter.get('/', getAllExercises);
