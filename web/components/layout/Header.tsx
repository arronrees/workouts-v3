import ProfileMenu from './ProfileMenu';
import Navbar from './Navbar';
import { currentUser } from '@clerk/nextjs/server';

export default async function Header() {
  const user = await currentUser();

  return (
    <header className='flex items-center justify-between gap-2 bg-white border-b-[2px] border-b-slate-200 px-6 py-6'>
      {user && (
        <div className='flex items-center gap-2'>
          <Navbar />
        </div>
      )}
      <div className='flex items-center gap-4'>
        {user && (
          <div className='text-sm text-slate-600'>Hi, {user.firstName}</div>
        )}

        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}
