'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dispatch, SetStateAction, useState } from 'react';
import { muscleGroups } from '@/constants';
import randomstring from 'randomstring';
import { Exercise, NewWorkout } from './CreateWorkoutForm';

type Props = {
  availableExercises: Exercise[];
  setAvailableExercises: Dispatch<SetStateAction<Exercise[] | null>>;
  setNewWorkout: Dispatch<SetStateAction<NewWorkout>>;
};

export function ExerciseCombobox({
  availableExercises,
  setAvailableExercises,
  setNewWorkout,
}: Props) {
  const [open, setOpen] = useState(false);

  function addExercise(exercise: Exercise) {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: randomstring.generate(),
          sets: [],
          exercise,
          sortOrder: (() => {
            if (prev.exercises && prev.exercises.length > 0) {
              return prev.exercises[prev.exercises.length - 1].sortOrder + 1;
            }

            return 0;
          })(),
        },
      ],
    }));
  }

  function removeFromExerciseList(id: string) {
    setAvailableExercises(
      availableExercises.filter((exercise) => exercise.id !== id)
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          Select exercises...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search exercises...' />
          <CommandEmpty>No exercises found.</CommandEmpty>
          <CommandList>
            {muscleGroups.map((group) => (
              <CommandGroup heading={group} key={group}>
                {availableExercises &&
                  availableExercises
                    .filter((exercise) => exercise.muscleGroup === group)
                    .map((exercise) => (
                      <CommandItem
                        key={exercise.id}
                        value={exercise.name}
                        onSelect={() => {
                          addExercise(exercise);
                          removeFromExerciseList(exercise.id);
                        }}
                      >
                        {exercise.name}
                      </CommandItem>
                    ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
