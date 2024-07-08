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
  res: Response<JsonApiResponse>,
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
          userId: user.id,
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
          userId: user.id,
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

export async function getFavouriteExercises(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const favouriteExercises = await prismaDB.workoutExercise.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: { workoutSetInstances: true },
        },
        exercise: true,
      },
      orderBy: {
        workoutSetInstances: {
          _count: 'desc',
        },
      },
      take: 6,
    });

    return res.status(200).json({ success: true, data: favouriteExercises });
  } catch (err) {
    next(err);
  }
}

export async function getSingleWorkoutExercise(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { workoutExerciseId } = req.params;

    const { userId } = req.auth;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const workoutExercise = await prismaDB.workoutExercise.findUnique({
      where: { id: workoutExerciseId, userId: user.id },
      include: {
        exercise: true,
        workoutExerciseInstances: {
          include: {
            workoutInstance: {
              select: {
                workout: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            workoutSetInstances: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: workoutExercise });
  } catch (err) {
    next(err);
  }
}
