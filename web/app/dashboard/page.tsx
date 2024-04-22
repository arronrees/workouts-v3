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
import { api } from '@/constants';
import { auth } from '@clerk/nextjs/server';

export default async function Dashboard() {
  const { getToken } = auth();

  const res = await fetch(api('/'), {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });

  const data = await res.json();

  console.log(data);

  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
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
          <CardContent></CardContent>
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
          <CardContent></CardContent>
        </Card>
        <Card className='xl:order-1'>
          <CardHeader>
            <CardTitle>Favourite Exercises</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-6'></CardContent>
        </Card>
      </div>
    </div>
  );
}
