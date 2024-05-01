export type Workout = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  user: string;
  workoutExercises: WorkoutExercise[];
};

export type Exercise = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  muscleGroup: string;
  equipment: string;
};

export type WorkoutExercise = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  userId: string;
  exerciseId: string;
  workoutId: string;
  workoutSets: WorkoutSet[];
  exercise: Exercise;
};

export type WorkoutSet = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  reps: number;
  weight: number;
};
