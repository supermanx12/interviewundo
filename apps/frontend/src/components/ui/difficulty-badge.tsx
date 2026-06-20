import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | string;

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const normDiff = difficulty.toUpperCase();

  const config = {
    EASY: {
      label: 'Easy',
      classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    MEDIUM: {
      label: 'Medium',
      classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    HARD: {
      label: 'Hard',
      classes: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  }[normDiff] || {
    label: difficulty,
    classes: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300',
        config.classes,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
