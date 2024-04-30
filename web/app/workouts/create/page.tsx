import { redirect } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import CreateWorkoutForm from '@/components/blocks/workouts/create/CreateWorkoutForm';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { auth } from '@clerk/nextjs/server';

export default async function CreateWorkout() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

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
            <BreadcrumbPage>Create Workout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Create your workout</CardTitle>
          <CardDescription>
            Add your excerises and create your workout
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CreateWorkoutForm />
        </CardContent>
      </Card>
    </div>
  );
}
