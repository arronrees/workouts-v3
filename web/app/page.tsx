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

export default async function Home() {
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
            <Link href='/auth/signup'>Register Now</Link>
          </Button>
        </div>

        <p className='font-light mt-6'>
          Already have an account?{' '}
          <Link href='/auth/signin' className='font-semibold'>
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
