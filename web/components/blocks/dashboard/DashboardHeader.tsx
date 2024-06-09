import ClientLogger from '@/components/ClientLogger';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WorkoutSetInstance } from '@/constant.types';
import { api } from '@/constants';
import { auth } from '@clerk/nextjs/server';
import { Dumbbell, Weight } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardHeader() {
  const { userId, getToken } = auth();

  if (!userId) {
    redirect('/');
  }
  const res = await fetch(api('/api/workouts/sets'), {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return redirect('/dashboard');
  }

  const sets: WorkoutSetInstance[] = data.data;

  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
      <ClientLogger item={sets} />
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Volume Lifted
          </CardTitle>
          <Weight className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {new Intl.NumberFormat('en-gb', {}).format(
              sets.reduce((acc: number, curr: any) => {
                return acc + (curr.reps ?? 1) * (curr.weight ?? 0);
              }, 0)
            )}
            kg
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Sets Performed</CardTitle>
          <Dumbbell className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {new Intl.NumberFormat('en-gb', {}).format(sets.length)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
