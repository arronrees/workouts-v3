import { getSession } from '@/lib/auth';
import ProfileMenu from './ProfileMenu';
import Navbar from './Navbar';

export default async function Header() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <header className='flex items-center justify-between gap-2 bg-white border-b-[2px] border-b-slate-200 px-6 py-6'>
      {user && (
        <div className='flex items-center gap-2'>
          <Navbar />
        </div>
      )}
      <div className='flex items-center gap-4'>
        {user && <div className='text-sm text-slate-600'>Hi, {user.name}</div>}

        {user && <ProfileMenu user={user} profile={user.profile} />}
      </div>
    </header>
  );
}
