'use client';

import React from 'react';
import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { SocketProvider } from './SocketProvider';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <SocketProvider>{children}</SocketProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export { useAuth } from './AuthProvider';
export { useSocket } from './SocketProvider';
export { useToast } from './ToastProvider';
