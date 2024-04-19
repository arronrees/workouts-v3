import { CircleUser, LogOut, Settings, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, UserProfile } from '@/constants.types';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function ProfileMenu({
  user,
}: {
  user: User | null;
  profile: UserProfile;
}) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <CircleUser className='w-5 h-5 stroke-2' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/profile' className='cursor-pointer'>
              <UserIcon className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/profile/preferences' className='cursor-pointer'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Preferences</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form
            className='w-full'
            action={async () => {
              'use server';
              await logout();
              redirect('/');
            }}
            method='post'
          >
            <button
              type='submit'
              className='flex items-center w-full cursor-pointer'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
