import Link from 'next/link';
import SignInForm from '@/components/blocks/auth/SignInForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function SignIn() {
  return (
    <Card className='max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Keep on moving</CardTitle>
        <CardDescription>
          Sign in to keep on reaching your goals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignInForm />
      </CardContent>

      <CardFooter className='border-t p-6'>
        <div className='flex flex-wrap gap-4 items-center justify-between w-full'>
          <p className='font-light text-xs'>
            Don&apos;t have an account?{' '}
            <Link href='/auth/signup' className='font-semibold'>
              Sign Up
            </Link>
          </p>
          <p>
            <Link
              href='/auth/forgot-password'
              className='block font-medium text-slate-400 text-xs hover:text-slate-500 focus:text-slate-500'
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
