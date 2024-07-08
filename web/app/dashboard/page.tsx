import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FavouriteExercise, Workout, WorkoutHistory } from '@/constant.types';
import { api } from '@/constants';
import DashboardHeader from '@/components/blocks/dashboard/DashboardHeader';

export default async function Dashboard() {
  const { userId, getToken } = auth();

  if (!userId) {
    redirect('/');
  }

  const workoutRes = await fetch(api('/api/workouts'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const workoutData = await workoutRes.json();

  let workouts: Workout[] | null = null;

  if (workoutRes.ok) {
    workouts = workoutData.data;
  }

  const historyRes = await fetch(api('/api/workouts/history'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const historyData = await historyRes.json();

  let history: WorkoutHistory[] | null = null;

  if (historyRes.ok) {
    history = historyData.data;
  }

  const favouritesRes = await fetch(api('/api/exercises/favourites'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const favouritesData = await favouritesRes.json();

  let favourites: FavouriteExercise[] | null = null;

  if (favouritesRes) {
    favourites = favouritesData.data;
  }

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <DashboardHeader />
      <div className='grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>My Workouts</CardTitle>
              <CardDescription>List of created workouts</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts'>
                Workouts
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>No. of Exercises</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts &&
                  workouts.map((workout: Workout) => (
                    <TableRow key={workout.id}>
                      <TableCell>
                        <div className='font-medium'>{workout.name}</div>
                      </TableCell>
                      <TableCell>{workout.workoutExercises.length}</TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end'>
                          <Button asChild variant='outline'>
                            <Link
                              href={`/workouts/${workout.id}`}
                              className='flex gap-1'
                            >
                              View
                              <ArrowRight className='h-3 w-3' />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className='xl:col-span-2 xl:order-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Recent workouts completed</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts/history'>
                History
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history &&
                  history.map((workoutInstance) => (
                    <TableRow key={workoutInstance.id}>
                      <TableCell>
                        <div>
                          <span className='font-medium'>
                            {new Date(workoutInstance.createdAt).toDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {workoutInstance.workoutExerciseInstances.reduce(
                          (acc: number, curr) => {
                            let val = 0;

                            curr.workoutSetInstances.forEach((set) => {
                              val += (set.weight ?? 0) * (set.reps ?? 1);
                            });

                            return acc + val;
                          },
                          0
                        )}
                        kg
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end'>
                          <Button
                            variant='outline'
                            className='block ml-auto'
                            asChild
                          >
                            <Link
                              href={`/workouts/${workoutInstance.workoutId}/history/${workoutInstance.id}`}
                            >
                              View
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className='xl:order-1'>
          <CardHeader>
            <CardTitle>Favourite Exercises</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sets Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favourites &&
                  favourites.map((workoutExercise) => (
                    <TableRow key={workoutExercise.id}>
                      <TableCell>
                        <Link
                          href={`/exercises/${workoutExercise.exercise.id}`}
                        >
                          <div className='font-medium'>
                            {workoutExercise.exercise.name}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {workoutExercise._count.workoutSetInstances}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
