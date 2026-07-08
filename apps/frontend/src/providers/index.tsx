'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { SocketProvider } from './SocketProvider';
import { KeepAliveProvider } from './KeepAliveProvider';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <SocketProvider>
                <KeepAliveProvider>{children}</KeepAliveProvider>
              </SocketProvider>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export { useAuth } from './AuthProvider';
export { useSocket } from './SocketProvider';
export { useToast } from './ToastProvider';
