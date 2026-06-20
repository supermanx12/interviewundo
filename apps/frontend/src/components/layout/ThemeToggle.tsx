'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 transition-all hover:bg-accent active:scale-95"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Toggle Theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-violet-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
