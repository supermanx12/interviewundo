'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      toast(message, 'success', duration);
    },
    [toast],
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      toast(message, 'error', duration);
    },
    [toast],
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      toast(message, 'info', duration);
    },
    [toast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      toast(message, 'warning', duration);
    },
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Toast Portlet Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================================
// Inner Toast Item Component with auto-close timers
// ============================================================

const toastConfigs = {
  success: {
    border: 'border-emerald-500/30 dark:border-emerald-500/20',
    bg: 'bg-emerald-500/10 dark:bg-emerald-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  error: {
    border: 'border-rose-500/30 dark:border-rose-500/20',
    bg: 'bg-rose-500/10 dark:bg-rose-950/20',
    text: 'text-rose-600 dark:text-rose-400',
    icon: AlertCircle,
  },
  warning: {
    border: 'border-amber-500/30 dark:border-amber-500/20',
    bg: 'bg-amber-500/10 dark:bg-amber-950/20',
    text: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
  },
  info: {
    border: 'border-indigo-500/30 dark:border-indigo-500/20',
    bg: 'bg-indigo-500/10 dark:bg-indigo-950/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    icon: Info,
  },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 200); // Wait for fade-out animation
  }, [toast.id, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, handleClose]);

  const config = toastConfigs[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 p-4 rounded-2xl border bg-card/70 backdrop-blur-md shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0',
        config.border,
        config.bg,
        isExiting
          ? 'animate-out fade-out-0 slide-out-to-right-10'
          : 'animate-in fade-in-0 slide-in-from-bottom-5',
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.text)} />
        <p className="text-xs font-semibold text-foreground/90 leading-normal">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        className="text-muted-foreground/60 hover:text-foreground hover:bg-muted p-1 rounded-lg shrink-0 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
