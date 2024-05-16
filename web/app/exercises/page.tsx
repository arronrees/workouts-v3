import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/constants';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type WorkoutExercise = {
  id: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  userId: string;
  workoutId: string;
  exerciseId: string;
  exercise: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    muscleGroup: string;
    equipment: string;
  };
  workoutSetInstances: {
    id: string;
    createdAt: string;
    updatedAt: string;
    reps: number;
    weight: number;
    userId: string;
    sortOrder: number;
    workoutExerciseInstanceId: string;
    workoutExerciseId: string;
  }[];
};

type WeekExercise = {
  id: string;
  createdAt: string;
  updatedAt: string;
  exerciseId: string;
  workoutExerciseId: string;
  workoutInstanceId: string;
  userId: string;
  sortOrder: number;
  workoutSetInstances: {
    id: string;
    createdAt: string;
    updatedAt: string;
    reps: number;
    weight: number;
    userId: string;
    sortOrder: number;
    workoutExerciseInstanceId: string;
    workoutExerciseId: string;
  }[];
};

export default async function Exercises() {
  const { getToken, userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const exercisesRes = await fetch(api('/api/exercises/user'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const exercisesData = await exercisesRes.json();

  const exercises: WorkoutExercise[] = exercisesData.data?.exercises;
  const currentWeekExercises: WeekExercise[] =
    exercisesData.data?.currentWeekExercises;
  const previousWeekExercises: WeekExercise[] =
    exercisesData.data?.previousWeekExercises;

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Exercises</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <Card>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>
                Here shows the progress of all the exercises you have performed
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight this week</TableHead>
                  <TableHead>% vs previous week</TableHead>
                  <TableHead>PB</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises &&
                  exercises.map((exercise) => {
                    const thisWeekWeight: number =
                      currentWeekExercises
                        ?.find((e) => e.workoutExerciseId === exercise.id)
                        ?.workoutSetInstances.reduce((acc, curr) => {
                          return acc + (curr.weight ?? 0) * (curr.reps ?? 0);
                        }, 0) ?? 0;

                    const lastWeekWeight: number =
                      previousWeekExercises
                        ?.find((e) => e.workoutExerciseId === exercise.id)
                        ?.workoutSetInstances.reduce((acc, curr) => {
                          return acc + (curr.weight ?? 0) * (curr.reps ?? 0);
                        }, 0) ?? 0;

                    const percentageChange: number =
                      ((thisWeekWeight - lastWeekWeight) / lastWeekWeight) *
                      100;

                    const percentageToDisplay: string | number =
                      percentageChange === 0
                        ? 0
                        : parseInt(percentageChange.toString())
                        ? percentageChange.toFixed(2)
                        : '';

                    const percentageClass: string =
                      percentageChange === 0
                        ? 'text-orange-500'
                        : percentageChange > 0
                        ? 'text-green-500'
                        : 'text-red-500';

                    return (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <span className='font-medium'>
                            {exercise.exercise.name}
                          </span>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {thisWeekWeight}kg
                          <span className='text-muted-foreground text-xs ml-2'>
                            ({lastWeekWeight}kg)
                          </span>
                        </TableCell>
                        <TableCell className={percentageClass}>
                          {percentageToDisplay || percentageToDisplay === 0
                            ? percentageToDisplay + '%'
                            : ''}
                        </TableCell>
                        <TableCell>
                          <span className='font-medium'>
                            {exercise.workoutSetInstances[0]?.weight}kg
                          </span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end'>
                            <Button
                              variant='outline'
                              className='block ml-auto'
                              asChild
                            >
                              <Link href={`/exercises/${exercise.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
