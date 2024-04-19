'use client';

import Link from 'next/link';
import { Weight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/shadcn/utils';

export default function Navbar() {
  return (
    <nav>
      <ul className='gap-2 text-sm font-medium flex items-center md:gap-4 lg:gap-6'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <Weight className='h-6 w-6' />
        </Link>

        <NavLink
          href='/dashboard'
          text='Dashboard'
          className='hidden sm:block'
        />
        <NavLink href='/workouts' text='Workouts' className='hidden sm:block' />
        <NavLink
          href='/exercises'
          text='Exercises'
          className='hidden sm:block'
        />
      </ul>
    </nav>
  );
}

function NavLink({
  href,
  text,
  className = '',
}: {
  href: string;
  text: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        `${
          pathname === href ? 'text-foreground' : 'text-muted-foreground'
        } transition-colors hover:text-foreground`,
        className
      )}
      href={href}
    >
      {text}
    </Link>
  );
}
