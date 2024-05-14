import { redirect } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { auth } from '@clerk/nextjs/server';
import { api } from '@/constants';
import { Workout } from '@/constant.types';
import RecordWorkoutForm from '@/components/blocks/workouts/record/RecordWorkoutForm';

export default async function RecordWorkout({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    return redirect('/workouts');
  }

  const { getToken } = auth();

  const res = await fetch(api(`/api/workouts/${params.id}`), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.data) {
    return redirect('/dashboard');
  }

  const workout: Workout = data.data?.workout;

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6 max-w-lg mx-auto'>
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
            <BreadcrumbLink href={`/workouts/${workout.id}`}>
              {workout.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Record Workout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className='max-w-lg mx-auto'>
        <CardHeader>
          <CardTitle>Record your workout</CardTitle>
          <CardDescription>
            Record your workout to track your progress
          </CardDescription>
        </CardHeader>

        <CardContent>
          {workout && <RecordWorkoutForm workout={workout} />}
        </CardContent>
      </Card>
    </div>
  );
}
