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

export async function getUserExercises(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const exercises = await prismaDB.workoutExercise.findMany({
      where: {
        userId: user.id,
        workoutExerciseInstances: { some: {} },
      },
      include: {
        exercise: true,
        workoutSetInstances: {
          orderBy: {
            weight: 'desc',
          },
          take: 1,
        },
      },
    });

    const currentWeekStart = new Date();
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date();
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const currentWeekExercises =
      await prismaDB.workoutExerciseInstance.findMany({
        where: {
          createdAt: {
            gte: currentWeekStart,
            lt: currentWeekEnd,
          },
        },
        include: {
          workoutSetInstances: true,
        },
      });

    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    previousWeekStart.setHours(0, 0, 0, 0);

    const previousWeekEnd = new Date(currentWeekEnd);
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 1);
    previousWeekEnd.setHours(23, 59, 59, 999);

    const previousWeekExercises =
      await prismaDB.workoutExerciseInstance.findMany({
        where: {
          createdAt: {
            gte: previousWeekStart,
            lt: previousWeekEnd,
          },
        },
        include: {
          workoutSetInstances: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: { exercises, previousWeekExercises, currentWeekExercises },
    });
  } catch (err) {
    next(err);
  }
}
