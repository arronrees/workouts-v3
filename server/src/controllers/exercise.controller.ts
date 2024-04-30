import { Request, Response, NextFunction } from 'express';
import { prismaDB } from '..';
import { JsonApiResponse } from '../constant.types';

export async function getAllExercises(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const exercises = await prismaDB.exercise.findMany();

    return res.status(200).json({ success: true, data: exercises });
  } catch (err) {
    next(err);
  }
}
