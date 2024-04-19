'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function SignInForm() {
  const [state, formAction] = useFormState(signIn, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.success) {
      toast('Sign in successful.');
      redirect('/dashboard');
    }
  }, [state.success]);

  return (
    <div>
      <form className='flex flex-col gap-4' action={formAction}>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email:</Label>
          <Input id='email' name='email' type='email' required />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>Password:</Label>
          <Input id='password' name='password' type='password' required />
        </div>

        <div>
          {state.errorMessage && (
            <div className='text-red-500 mb-2'>{state.errorMessage}</div>
          )}
          <Button type='submit' disabled={pending} aria-disabled={pending}>
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
