import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { auth } from '@clerk/nextjs/server';
import { WorkoutWithHistory } from '@/constant.types';
import { api } from '@/constants';

export default async function SingleWorkout({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return redirect('/workouts');
  }

  const { getToken } = auth();

  const res = await fetch(api(`/api/workouts/${params.id}/history`), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.data) {
    return redirect('/dashboard');
  }

  const workout: WorkoutWithHistory = data.data?.workout;

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
            <BreadcrumbPage>{workout.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
            <div className='grid gap-2'>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>View the workout details</CardDescription>
            </div>
            <Button asChild size='sm' className='gap-1 max-w-max'>
              <Link href={`/workouts/${workout.id}/record`}>
                Record Workout
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Sets</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workout.workoutExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      <p>{exercise.exercise?.name}</p>
                      <div className='flex gap-2 text-muted-foreground'>
                        <span>{exercise.exercise?.equipment}</span>
                        <span className='flex items-center justify-center'>
                          <span className='bg-slate-300 w-[3px] h-[3px] rounded-full'></span>
                        </span>
                        <span>{exercise.exercise?.muscleGroup}</span>
                      </div>
                    </TableCell>
                    <TableCell>{exercise.workoutSets.length}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className='block ml-auto'
                          >
                            View Sets
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{exercise.exercise?.name}</DialogTitle>
                            <DialogDescription>
                              <span className='flex gap-2 text-muted-foreground mb-2'>
                                <span>{exercise.exercise?.equipment}</span>
                                <span className='flex items-center justify-center'>
                                  <span className='bg-slate-300 w-[3px] h-[3px] rounded-full'></span>
                                </span>
                                <span>{exercise.exercise?.muscleGroup}</span>
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className='flex flex-col gap-4'>
                            {exercise.workoutSets.map((set, index) => (
                              <div key={set.id}>
                                <h3 className='font-semibold text-sm'>
                                  Set {index + 1}
                                </h3>
                                <div className='flex gap-1'>
                                  <div className='flex-1'>
                                    <span className='text-muted-foreground font-medium text-xs'>
                                      Reps
                                    </span>
                                    <Input disabled value={set.reps || 0} />
                                  </div>
                                  <div className='flex-1'>
                                    <span className='text-muted-foreground font-medium text-xs'>
                                      Weight
                                    </span>
                                    <Input disabled value={set.weight || 0} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <DialogFooter className='sm:justify-start'>
                            <DialogClose asChild>
                              <Button type='button' variant='secondary'>
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-col gap-1 xs:flex-row xs:items-end xs:justify-between'>
            <div className='grid gap-2'>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>This workout&apos;s history</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='grid gap-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight Lifted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workout.workoutInstances &&
                  workout.workoutInstances.map((workoutInstance) => (
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
      </div>
    </div>
  );
}
