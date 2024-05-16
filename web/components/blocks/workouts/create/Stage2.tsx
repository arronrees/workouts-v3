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
import { Dispatch, SetStateAction } from 'react';
import randomstring from 'randomstring';
import { Exercise, NewWorkout, WorkoutExercise } from './CreateWorkoutForm';

type Props = {
  newWorkout: NewWorkout;
  setNewWorkout: Dispatch<SetStateAction<NewWorkout>>;
  allExercises: Exercise[] | null;
  setAvailableExercises: Dispatch<SetStateAction<Exercise[] | null>>;
};

export default function Stage2({
  newWorkout,
  setNewWorkout,
  allExercises,
  setAvailableExercises,
}: Props) {
  function removeSelectedExercise(id: string, sortOrder: number) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises
        .filter((exerciseInstance) => exerciseInstance.exercise.id !== id)
        .map((exerciseInstance) =>
          exerciseInstance.sortOrder > sortOrder
            ? { ...exerciseInstance, sortOrder: exerciseInstance.sortOrder - 1 }
            : exerciseInstance
        ),
    }));
  }

  function reSortAvailableExercises(id: string) {
    if (allExercises) {
      setAvailableExercises(
        allExercises.filter((exercise) => {
          const isSelected = newWorkout.exercises.some(
            (selected) => selected.exercise.id === exercise.id
          );

          if (isSelected && exercise.id === id) {
            return true;
          }

          return !isSelected;
        })
      );
    }
  }

  function reSortExercises(id: string, sortFrom: number, sortTo: number) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exerciseInstance) => {
        // if already on lowest or highest position, return the same
        if (sortTo < 0 || sortTo >= prev.exercises.length) {
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

  return (
    <div className='flex flex-col gap-4'>
      {newWorkout.exercises
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((exerciseInstance) => (
          <Card key={exerciseInstance.id}>
            <CardHeader className='p-4'>
              <div className='flex gap-2 justify-between items-end'>
                <div>
                  <CardTitle className='text-sm'>
                    {exerciseInstance.exercise.name}
                  </CardTitle>
                  <CardDescription className='text-xs'>
                    Add sets and reps
                  </CardDescription>
                </div>
                <div className='flex gap-1'>
                  {exerciseInstance.sortOrder > 0 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exerciseInstance.id,
                          exerciseInstance.sortOrder,
                          exerciseInstance.sortOrder - 1
                        );
                      }}
                    >
                      <ChevronUp className='w-3 h-3' />
                    </Button>
                  )}
                  {exerciseInstance.sortOrder !==
                    newWorkout.exercises.length - 1 && (
                    <Button
                      variant='outline'
                      className='max-w-max h-max p-2'
                      type='button'
                      onClick={() => {
                        reSortExercises(
                          exerciseInstance.id,
                          exerciseInstance.sortOrder,
                          exerciseInstance.sortOrder + 1
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
                setNewWorkout={setNewWorkout}
                exerciseInstance={exerciseInstance}
              />
            </CardContent>
            <CardFooter className='p-4 pt-0'>
              <Button
                variant='ghost'
                type='button'
                onClick={(e) => {
                  e.preventDefault();

                  removeSelectedExercise(
                    exerciseInstance.exercise.id,
                    exerciseInstance.sortOrder
                  );
                  reSortAvailableExercises(exerciseInstance.exercise.id);
                }}
                className='flex gap-2 items-center ml-auto p-2 h-auto text-xs'
              >
                Remove Exercise
                <XIcon className='w-3 h-3' />
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}

type SetsProps = {
  setNewWorkout: Dispatch<SetStateAction<NewWorkout>>;
  exerciseInstance: WorkoutExercise;
};

function Sets({ setNewWorkout, exerciseInstance }: SetsProps) {
  function addSet(e: React.FormEvent) {
    e.preventDefault();

    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: randomstring.generate(8),
                reps: null,
                weight: null,
              },
            ],
          };
        }

        return exercise;
      }),
    }));
  }

  function updateSetReps(reps: number, id: string) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
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
      exercises: prev.exercises.map((exercise) => {
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
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id === exerciseInstance.id) {
          return {
            ...exercise,
            sets: exercise.sets.filter((set) => {
              console.log(set.id, id);
              return set.id !== id;
            }),
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
          {exerciseInstance.sets && exerciseInstance.sets.length > 0 ? (
            exerciseInstance.sets.map((set, index) => (
              <div key={set.id}>
                <p className='font-semibold mb-1'>Set {index + 1}</p>
                <div className='flex gap-1'>
                  <Input
                    type='number'
                    placeholder='Reps'
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
                    placeholder='Weight (kg)'
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
