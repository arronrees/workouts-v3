export type Workout = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  workoutExercises: WorkoutExercise[];
};

export type WorkoutWithHistory = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: string;
  workoutExercises: WorkoutExercise[];
  workoutInstances: WorkoutInstance[];
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
  sortOrder: number;
};

export type WorkoutInstance = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  workoutId: string;
  workoutExerciseInstances: WorkoutExerciseInstance[];
};

export type WorkoutExerciseInstance = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  userId: string;
  exerciseId: string;
  workoutId: string;
  workoutSetInstances: WorkoutSetInstance[];
  exercise: Exercise;
};

export type WorkoutSetInstance = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  reps: number;
  weight: number;
  sortOrder: number;
};

export type WorkoutHistory = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  workoutId: string;
  userId: string;
  workout: Workout;
  workoutExerciseInstances: WorkoutExerciseInstance[];
};
