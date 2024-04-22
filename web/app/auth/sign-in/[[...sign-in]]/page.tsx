import { SignIn } from '@clerk/nextjs';

export default async function SignInPage() {
  return (
    <div className='flex items-center justify-center'>
      <SignIn path='/auth/sign-in' />
    </div>
  );
}
