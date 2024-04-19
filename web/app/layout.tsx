import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ProgressBarProvider from '@/components/layout/ProgressBarProvider';
import React from 'react';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workout Planner',
  description: 'Workout Planner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ProgressBarProvider>
          <div className='p-6 text-sm bg-slate-50 min-h-screen'>
            <main>{children}</main>
          </div>
          <Toaster richColors position='bottom-right' pauseWhenPageIsHidden />
        </ProgressBarProvider>
      </body>
    </html>
  );
}
