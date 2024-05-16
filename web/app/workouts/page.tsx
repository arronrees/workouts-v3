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
import { Workout, WorkoutHistory } from '@/constant.types';

export default async function Workouts() {
  const { getToken, userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const workoutRes = await fetch(api('/api/workouts'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const workoutData = await workoutRes.json();

  if (!workoutRes.ok) {
    return redirect('/dashboard');
  }

  const workouts: Workout[] = workoutData.data;

  const historyRes = await fetch(api('/api/workouts/history'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const historyData = await historyRes.json();

  if (!historyRes.ok) {
    return redirect('/dashboard');
  }

  const history: WorkoutHistory[] = historyData.data;

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workouts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workouts</CardTitle>
              <CardDescription>View a list of your workouts</CardDescription>
            </div>
            <Button asChild size='sm' className='ml-auto gap-1'>
              <Link href='/workouts/create'>
                Create Workout
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
        <Card>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Recent workouts completed</CardDescription>
            </div>
            <Button asChild size='sm' variant='secondary' className='ml-auto'>
              <Link href='/workouts/history'>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
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
                            {workoutInstance.workout.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(workoutInstance.createdAt).toDateString()}
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
      </div>
    </div>
  );
}
