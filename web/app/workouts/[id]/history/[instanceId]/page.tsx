import Link from 'next/link';
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
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { api } from '@/constants';
import { auth } from '@clerk/nextjs/server';
import { WorkoutInstance } from '@/constant.types';

export default async function WorkoutInstancePage({
  params,
}: {
  params: { id: string; instanceId: string };
}) {
  if (!params.id || !params.instanceId) {
    return redirect('/workouts');
  }

  const { userId, getToken } = auth();

  if (!userId) {
    return redirect('/');
  }

  const res = await fetch(
    api(`/api/workouts/${params.id}/history/${params.instanceId}`),
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.data) {
    return redirect('/dashboard');
  }

  const workoutInstance: WorkoutInstance = data.data;

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/workouts'>Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/workouts/${workoutInstance.workoutId}`}>
              {workoutInstance.workout.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Workout History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='xl:col-span-2'>
        <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
          <div className='grid gap-2'>
            <CardTitle>{workoutInstance.workout.name}</CardTitle>
            <CardDescription>View the workout details</CardDescription>
          </div>
          <Button asChild size='sm' variant='secondary'>
            <Link href={`/workouts/${workoutInstance.workoutId}`}>
              Back To Workout
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Set</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workoutInstance.workoutExerciseInstances.map((exercise) => (
                <Fragment key={exercise.id}>
                  {exercise.workoutSetInstances.map((set, index) => (
                    <TableRow
                      key={set.id}
                      className={
                        index === exercise.workoutSetInstances.length - 1
                          ? 'border-b-4 border-slate-200'
                          : 'border-slate-100'
                      }
                    >
                      <TableCell className='font-medium'>
                        {index === 0 && exercise.exercise?.name}
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{set.reps}</TableCell>
                      <TableCell className='font-medium'>
                        {set.weight}kg
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
