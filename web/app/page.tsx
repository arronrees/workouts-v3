import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <Card
      className='text-center flex items-center justify-center flex-col'
      style={{ minHeight: 'inherit' }}
    >
      <div className='h-96 w-full p-8 pt-6'>
        <figure className='w-full h-full overflow-hidden relative'>
          <Image
            src='/register-illustration.svg'
            className='object-contain w-full h-full'
            priority
            fill
            alt=''
          />
        </figure>
      </div>
      <CardHeader>
        <CardTitle>Let&apos;s get moving</CardTitle>
        <CardDescription className='max-w-sm mx-auto'>
          Sign up to get started tracking your workouts and reaching your goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Button asChild variant='default'>
            <Link href='/auth/sign-in'>Sign In</Link>
          </Button>
        </div>

        <p className='font-light mt-6'>
          Don&apos;t have an account?{' '}
          <Link href='/auth/sign-up' className='font-semibold'>
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
