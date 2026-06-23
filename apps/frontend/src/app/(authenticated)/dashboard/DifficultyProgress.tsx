import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifficultyBreakdown {
  solved: number;
  total: number;
}

interface DifficultyProgressProps {
  difficultyBreakdown: {
    EASY: DifficultyBreakdown;
    MEDIUM: DifficultyBreakdown;
    HARD: DifficultyBreakdown;
  };
}

export function DifficultyProgress({ difficultyBreakdown }: DifficultyProgressProps) {
  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" /> Difficulty Progress
        </CardTitle>
        <CardDescription>Breakdown of solved problems by difficulty level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
          const breakdown = difficultyBreakdown[diff];
          const solved = breakdown?.solved || 0;
          const total = breakdown?.total || 0;
          const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

          const colorMap = {
            EASY: 'bg-emerald-500',
            MEDIUM: 'bg-amber-500',
            HARD: 'bg-destructive',
          };

          const textMap = {
            EASY: 'text-emerald-500',
            MEDIUM: 'text-amber-500',
            HARD: 'text-destructive',
          };

          return (
            <div key={diff} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn('font-semibold text-xs uppercase tracking-wider', textMap[diff])}
                >
                  {diff}
                </span>
                <span className="font-semibold text-muted-foreground">
                  {solved}{' '}
                  <span className="text-xs text-muted-foreground/50">/ {total} solved</span>
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', colorMap[diff])}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
