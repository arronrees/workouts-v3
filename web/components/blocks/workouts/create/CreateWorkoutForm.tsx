'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/constants';
import { useAuth } from '@clerk/nextjs';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import { useRouter } from 'next/navigation';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
};

export type WorkoutExerciseSet = {
  id: string;
  reps: number | null;
  weight: number | null;
};

export type WorkoutExercise = {
  id: string;
  sets: WorkoutExerciseSet[];
  sortOrder: number;
  exercise: Exercise;
};

export type NewWorkout = {
  name: string;
  exercises: WorkoutExercise[];
};

export default function CreateWorkoutForm() {
  const { getToken, userId } = useAuth();

  const router = useRouter();

  const [formStage, setFormStage] = useState<number>(1);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [allExercises, setAllExercises] = useState<Exercise[] | null>(null);
  const [availableExercises, setAvailableExercises] = useState<
    Exercise[] | null
  >(null);

  const [newWorkout, setNewWorkout] = useState<NewWorkout>({
    name: '',
    exercises: [],
  });

  useEffect(() => {
    async function fetchExercises() {
      setError(null);

      const res = await fetch(api('/api/exercises'), {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to Fetch');
        setError('Failed to fetch exercises');
        return;
      }

      if (data.data) {
        setAvailableExercises(data.data);
        setAllExercises(data.data);
      }
    }

    fetchExercises();
  }, [getToken, userId]);

  function handleStage2Change(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);

    if (!newWorkout.name) {
      setError('Please give your workout a name');
      return;
    }

    if (newWorkout.exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    setFormStage(2);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    if (!newWorkout.name) {
      setError('Please give your workout a name');
      setIsLoading(false);
      return;
    }

    if (newWorkout.exercises.length === 0) {
      setError('Please add at least one exercise');
      setIsLoading(false);
      return;
    }

    const res = await fetch(api('/api/workouts'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(newWorkout),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to create workout');
      console.log(data);
      setError('Failed to create workout');
      setIsLoading(false);
      return;
    }

    router.push('/workouts');
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
      {formStage === 1 && (
        <Stage1
          allExercises={allExercises}
          availableExercises={availableExercises}
          setAvailableExercises={setAvailableExercises}
          setNewWorkout={setNewWorkout}
          newWorkout={newWorkout}
        />
      )}
      {formStage === 2 && (
        <Stage2
          newWorkout={newWorkout}
          setNewWorkout={setNewWorkout}
          allExercises={allExercises}
          setAvailableExercises={setAvailableExercises}
        />
      )}

      <div className='flex gap-2'>
        {formStage === 1 && (
          <Button asChild variant='secondary'>
            <button type='button' onClick={handleStage2Change}>
              Continue
            </button>
          </Button>
        )}
        {formStage === 2 && (
          <Button asChild variant='default'>
            <button
              type='submit'
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              Create Workout
            </button>
          </Button>
        )}
        {formStage === 2 && (
          <Button asChild variant='ghost' className='ml-auto'>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                setFormStage(formStage - 1);
              }}
            >
              Back
            </button>
          </Button>
        )}
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </form>
  );
}
