'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

const initialState = {
  errorMessage: null,
  success: false,
};

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.success) {
      toast('Account created successfully.');
      redirect('/dashboard');
    }
  }, [state.success]);

  return (
    <div>
      <form className='flex flex-col gap-4' action={formAction}>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='name'>Name:</Label>
          <Input id='name' name='name' type='text' required />
        </div>

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
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
