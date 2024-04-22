import { SignUp } from '@clerk/nextjs';

export default async function SignUpPage() {
  return (
    <div className='flex items-center justify-center'>
      <SignUp />
    </div>
  );
}
