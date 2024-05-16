'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import randomstring from 'randomstring';
import { Exercise, Workout } from '@/constant.types';
import { useRouter } from 'next/navigation';
import { api } from '@/constants';
import { useAuth } from '@clerk/nextjs';

type Props = {
  workout: Workout;
};

type WorkouteSetInstance = {
  id: string;
  reps: number | null;
  weight: number | null;
};

type WorkoutExerciseInstance = {
  sets: WorkouteSetInstance[];
  sortOrder: number;
  exercise: Exercise;
  id: string;
};

type NewWorkoutInstance = {
  exercisesInstances: WorkoutExerciseInstance[];
};

export default function RecordWorkoutForm({ workout }: Props) {
  const [newWorkout, setNewWorkout] = useState<NewWorkoutInstance>({
    exercisesInstances: workout.workoutExercises.map((exercise) => ({
      exercise: exercise.exercise,
      sortOrder: exercise.sortOrder,
      id: exercise.id,
      sets: exercise.workoutSets.map((set) => ({
        id: randomstring.generate(8),
        reps: set.reps,
        weight: set.weight,
        sortOrder: set.sortOrder,
      })),
    })),
  });

  const router = useRouter();

  const { getToken } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function removeSelectedExercise(id: string, sortOrder: number) {
    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances
        .filter((exerciseInstance) => exerciseInstance.exercise?.id !== id)
        .map((exerciseInstance) =>
          exerciseInstance.sortOrder > sortOrder
            ? {
                ...exerciseInstance,
                sortOrder: exerciseInstance.sortOrder - 1,
              }
            : exerciseInstance
        ),
    }));
  }

  function reSortExercises(id: string, sortFrom: number, sortTo: number) {
    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances.map((exerciseInstance) => {
        // if already on lowest or highest position, return the same
        if (sortTo < 0 || sortTo >= prev.exercisesInstances.length) {
          return exerciseInstance;
        }

        // change the sort order of the clicked exercise instance
        if (exerciseInstance.id === id) {
          return {
            ...exerciseInstance,
            sortOrder: sortTo,
          };
        }

        // change the sort order of the exercise instance that was swapped with the clicked exercise instance
        if (exerciseInstance.sortOrder === sortTo) {
          return {
            ...exerciseInstance,
            sortOrder: sortFrom,
          };
        }

        return exerciseInstance;
      }),
    }));
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    if (newWorkout.exercisesInstances.length === 0) {
      setError('Please add at least one exercise');
      setIsLoading(false);
      return;
    }

    const res = await fetch(api(`/api/workouts/record/${workout.id}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify({
        exerciseInstances: newWorkout.exercisesInstances.map(
          (exerciseInstance) => ({
            exerciseId: exerciseInstance.exercise.id,
            workoutExerciseId: exerciseInstance.id,
            sets: exerciseInstance.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
            })),
            sortOrder: exerciseInstance.sortOrder,
          })
        ),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to record workout');
      console.log(data);
      setError('Failed to record workout');
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(false);
    router.push('/workouts');
    return;
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
      {newWorkout.exercisesInstances
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className='p-4'>
              <div className='flex gap-2 justify-between items-end'>
                <div>
                  <CardTitle className='text-sm'>
                    {exercise.exercise?.name}
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Add sets and reps
                  </CardDescription>
                </div>
                <div className='flex gap-1'>
                  {exercise.sortOrder > 0 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exercise.id,
                          exercise.sortOrder,
                          exercise.sortOrder - 1
                        );
                      }}
                    >
                      <ChevronUp className='w-3 h-3' />
                    </Button>
                  )}
                  {exercise.sortOrder !==
                    newWorkout.exercisesInstances.length - 1 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exercise.id,
                          exercise.sortOrder,
                          exercise.sortOrder + 1
                        );
                      }}
                    >
                      <ChevronDown className='w-3 h-3' />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <Sets
                sets={exercise.sets}
                setNewWorkout={setNewWorkout}
                exerciseInstance={exercise}
              />
            </CardContent>
            <CardFooter className='p-4 pt-0'>
              <Button
                variant='ghost'
                type='button'
                onClick={(e) => {
                  e.preventDefault();

                  if (exercise.exercise) {
                    removeSelectedExercise(
                      exercise.exercise.id,
                      exercise.sortOrder
                    );
                  }
                }}
                className='flex gap-2 items-center ml-auto p-2 h-auto text-xs'
              >
                Remove Exercise
                <XIcon className='w-3 h-3' />
              </Button>
            </CardFooter>
          </Card>
        ))}
      <div>
        <Button asChild variant='default'>
          <button type='submit' disabled={isLoading} aria-disabled={isLoading}>
            Finish Workout
          </button>
        </Button>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </form>
  );
}

type SetsProps = {
  sets: WorkouteSetInstance[];
  setNewWorkout: Dispatch<SetStateAction<NewWorkoutInstance>>;
  exerciseInstance: WorkoutExerciseInstance;
};

function Sets({ sets, setNewWorkout, exerciseInstance }: SetsProps) {
  function addSet(e: React.FormEvent) {
    e.preventDefault();

    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: randomstring.generate(8),
                reps: 0,
                weight: 0,
                sortOrder: exercise.sets.length + 1,
              },
            ],
          };
        }

        return exercise;
      }),
    }));
  }

  return (
    <Card className='bg-slate-50/60'>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-2'>
          {sets && sets.length > 0 ? (
            sets.map((set, index) => (
              <Set
                key={set.id}
                set={set}
                index={index}
                setNewWorkout={setNewWorkout}
                exerciseInstance={exerciseInstance}
              />
            ))
          ) : (
            <p className='font-medium text-muted-foreground'>No sets created</p>
          )}
          <Button variant='ghost' className='max-w-max' onClick={addSet}>
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type SetProps = {
  set: WorkouteSetInstance;
  index: number;
  setNewWorkout: Dispatch<SetStateAction<NewWorkoutInstance>>;
  exerciseInstance: WorkoutExerciseInstance;
};

function Set({ set, index, setNewWorkout, exerciseInstance }: SetProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const targetReps = useMemo(() => set.reps, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const targetWeight = useMemo(() => set.weight, []);

  function updateSetReps(reps: number, id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id === id) {
                return {
                  ...set,
                  reps,
                };
              }

              return set;
            }),
          };
        }

        return exercise;
      }),
    }));
  }

  function updateSetWeight(weight: number, id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id === id) {
                return {
                  ...set,
                  weight,
                };
              }

              return set;
            }),
          };
        }

        return exercise;
      }),
    }));
  }

  function removeSet(id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      exercisesInstances: prev.exercisesInstances.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: exercise.sets.filter((set) => set.id !== id),
          };
        }

        return exercise;
      }),
    }));
  }

  return (
    <div>
      <p className='font-semibold mb-1'>Set {index + 1}</p>
      <div className='flex gap-1'>
        <Input
          type='number'
          placeholder={`${targetReps}`}
          min={0}
          onChange={(e) => {
            e.preventDefault();

            if (e.target.value && parseInt(e.target.value)) {
              updateSetReps(parseInt(e.target.value), set.id);
              return;
            }

            updateSetReps(0, set.id);
          }}
          autoFocus
        />
        <Input
          type='number'
          placeholder={`${targetWeight}kg`}
          min={0}
          step={0.5}
          onChange={(e) => {
            e.preventDefault();

            if (e.target.value && parseFloat(e.target.value)) {
              updateSetWeight(parseFloat(e.target.value), set.id);
              return;
            }

            updateSetWeight(0, set.id);
          }}
        />
        <Button
          variant='ghost'
          className='max-w-max p-2'
          type='button'
          onClick={() => removeSet(set.id)}
        >
          <XIcon className='w-3 h-3' />
        </Button>
      </div>
    </div>
  );
}
