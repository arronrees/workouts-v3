import { NextFunction, Request, Response } from 'express';
import { CreateWorkoutModel } from '../models/workout.model';
import { prismaDB } from '..';
import { JsonApiResponse } from '../constant.types';

export async function getUserWorkoutsController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorised' });
    }

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const workouts = await prismaDB.workout.findMany({
      where: { userId: user.id },
      include: {
        workoutExercises: {
          include: {
            workoutSets: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: workouts });
  } catch (err) {
    next(err);
  }
}

export async function createWorkoutController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorised' });
    }

    const { body: workout }: { body: CreateWorkoutModel } = req;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const newWorkout = await prismaDB.workout.create({
      data: {
        name: workout.name,
        user: {
          connect: {
            id: user.id,
          },
        },
        workoutExercises: {
          create: workout.exercises.map((exercise) => ({
            sortOrder: exercise.sortOrder,
            exercise: {
              connect: {
                id: exercise.exercise.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
            workoutSets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps ?? 0,
                weight: set.weight ?? 0,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              })),
            },
          })),
        },
      },
    });

    if (!newWorkout) {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to create workout' });
    }

    return res.status(200).json({ success: true, data: newWorkout });
  } catch (err) {
    next(err);
  }
}
