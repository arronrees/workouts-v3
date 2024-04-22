import { UserProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function UserProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  return (
    <div className='flex items-center justify-center'>
      <UserProfile path='/auth/user-profile' />
    </div>
  );
}
