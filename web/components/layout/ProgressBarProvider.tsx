'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React from 'react';

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgressBar
        height='4px'
        color='#475569'
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
}
