import { UserProfile } from '@clerk/nextjs';

export default async function UserProfilePage() {
  return (
    <div className='flex items-center justify-center'>
      <UserProfile path='/auth/user-profile' />
    </div>
  );
}
