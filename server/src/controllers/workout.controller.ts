import { NextFunction, Request, Response } from 'express';
import {
  CreateWorkoutModel,
  RecordWorkoutModel,
} from '../models/workout.model';
import { prismaDB } from '..';
import { JsonApiResponse } from '../constant.types';

export async function getUserWorkoutsController(
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

export async function getSingleWorkoutController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { workoutId } = req.params;

    if (!workoutId) {
      return res
        .status(400)
        .json({ success: false, error: 'Workout ID is required' });
    }

    const { userId } = req.auth;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const workout = await prismaDB.workout.findUnique({
      where: { id: workoutId },
      include: {
        workoutExercises: {
          orderBy: { sortOrder: 'asc' },
          include: {
            workoutSets: {
              orderBy: { sortOrder: 'asc' },
            },
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      return res
        .status(404)
        .json({ success: false, error: 'Workout not found' });
    }

    return res.status(200).json({ success: true, data: { workout } });
  } catch (err) {
    next(err);
  }
}

export async function getSingleWorkoutWithHistoryController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { workoutId } = req.params;

    if (!workoutId) {
      return res
        .status(400)
        .json({ success: false, error: 'Workout ID is required' });
    }

    const { userId } = req.auth;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const workout = await prismaDB.workout.findUnique({
      where: { id: workoutId },
      include: {
        workoutExercises: {
          orderBy: { sortOrder: 'asc' },
          include: {
            workoutSets: {
              orderBy: { sortOrder: 'asc' },
            },
            exercise: true,
          },
        },
        workoutInstances: {
          include: {
            workoutExerciseInstances: {
              include: {
                workoutSetInstances: true,
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return res
        .status(404)
        .json({ success: false, error: 'Workout not found' });
    }

    return res.status(200).json({ success: true, data: { workout } });
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
              create: exercise.sets.map((set, index) => ({
                reps: set.reps ?? 0,
                weight: set.weight ?? 0,
                sortOrder: index + 1,
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

export async function recordWorkoutController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { userId } = req.auth;
    const { workoutId } = req.params;

    if (!workoutId) {
      return res
        .status(400)
        .json({ success: false, error: 'Workout ID is required' });
    }

    const { body: workout }: { body: RecordWorkoutModel } = req;

    const user = await prismaDB.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const foundWorkout = await prismaDB.workout.findUnique({
      where: {
        id: workoutId,
      },
    });

    if (!foundWorkout) {
      return res
        .status(404)
        .json({ success: false, error: 'Workout not found' });
    }

    const workoutRecord = await prismaDB.workoutInstance.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        workout: {
          connect: {
            id: workoutId,
          },
        },
        workoutExerciseInstances: {
          create: workout.exerciseInstances.map((exerciseInstance) => ({
            exercise: {
              connect: {
                id: exerciseInstance.exerciseId,
              },
            },
            workoutExercise: {
              connect: {
                id: exerciseInstance.workoutExerciseId,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
            sortOrder: exerciseInstance.sortOrder,
            workoutSetInstances: {
              create: exerciseInstance.sets.map((set, index) => ({
                reps: set.reps ?? 0,
                weight: set.weight ?? 0,
                sortOrder: index + 1,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
                workoutExercise: {
                  connect: {
                    id: exerciseInstance.workoutExerciseId,
                  },
                },
              })),
            },
          })),
        },
      },
    });

    if (!workoutRecord) {
      return res
        .status(500)
        .json({ success: false, error: 'Failed to record workout' });
    }

    return res.status(200).json({ success: true, data: workoutRecord });
  } catch (err) {
    next(err);
  }
}
