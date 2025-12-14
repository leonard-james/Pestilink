'use client';

import { ReactNode } from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}
