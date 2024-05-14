import { z } from 'zod';

export const createWorkoutModel = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, 'Name is required'),
    exercises: z.array(
      z.object({
        id: z.string({
          required_error: 'Exercise ID is required',
          invalid_type_error: 'Exercise ID must be a string',
        }),
        exercise: z.object({
          id: z.string({
            required_error: 'Exercise ID is required',
            invalid_type_error: 'Exercise ID must be a string',
          }),
          name: z.string({
            required_error: 'Exercise name is required',
            invalid_type_error: 'Exercise name must be a string',
          }),
        }),
        sets: z.array(
          z.object({
            id: z.string({
              required_error: 'Set ID is required',
              invalid_type_error: 'Set ID must be a string',
            }),
            reps: z
              .number({
                required_error: 'Reps is required',
                invalid_type_error: 'Reps must be a number',
              })
              .nullable(),
            weight: z
              .number({
                required_error: 'Weight is required',
                invalid_type_error: 'Weight must be a number',
              })
              .nullable(),
          })
        ),
        sortOrder: z.number({
          required_error: 'Sort order is required',
          invalid_type_error: 'Sort order must be a number',
        }),
      })
    ),
  })
  .strict();

export type CreateWorkoutModel = z.infer<typeof createWorkoutModel>;

export const recordWorkoutModel = z
  .object({
    exerciseInstances: z.array(
      z.object({
        exerciseId: z.string({
          required_error: 'Exercise ID is required',
          invalid_type_error: 'Exercise ID must be a string',
        }),
        workoutExerciseId: z.string({
          required_error: 'Workout Exercise ID is required',
          invalid_type_error: 'Workout Exercise ID must be a string',
        }),
        sets: z.array(
          z.object({
            reps: z
              .number({
                required_error: 'Reps is required',
                invalid_type_error: 'Reps must be a number',
              })
              .nullable(),
            weight: z
              .number({
                required_error: 'Weight is required',
                invalid_type_error: 'Weight must be a number',
              })
              .nullable(),
          })
        ),
        sortOrder: z.number({
          required_error: 'Sort order is required',
          invalid_type_error: 'Sort order must be a number',
        }),
      })
    ),
  })
  .strict();

export type RecordWorkoutModel = z.infer<typeof recordWorkoutModel>;
