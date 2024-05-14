import { Request, Response, NextFunction } from 'express';
import {
  createWorkoutModel,
  recordWorkoutModel,
} from '../models/workout.model';
import { z } from 'zod';

export async function checkCreateWorkoutObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    createWorkoutModel.parse(req.body);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      next(err);
    }
  }
}

export async function checkRecordWorkoutObjectValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    recordWorkoutModel.parse(req.body);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      next(err);
    }
  }
}
