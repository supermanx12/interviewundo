import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface RecentSubmissionsProps {
  recent: RecentSubmissionItem[];
}

export function RecentSubmissions({ recent }: RecentSubmissionsProps) {
  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent Submissions</CardTitle>
          <CardDescription>Your latest submissions on problems</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No submissions yet. Start coding to build history!
          </div>
        ) : (
          recent.map((sub, idx) => {
            const statusColors = {
              ACCEPTED:
                'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10',
              WRONG_ANSWER:
                'text-destructive border-destructive/20 bg-destructive/5 dark:bg-destructive/10',
              TIME_LIMIT_EXCEEDED:
                'text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10',
              RUNTIME_ERROR:
                'text-stone-500 border-stone-500/20 bg-stone-500/5 dark:bg-stone-500/10',
              COMPILATION_ERROR:
                'text-zinc-500 border-zinc-500/20 bg-zinc-500/5 dark:bg-zinc-500/10',
              PENDING: 'text-muted-foreground border-border bg-muted/5',
              PROCESSING: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5 animate-pulse',
            };

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-border/50 hover:bg-accent/30 transition-all duration-200 group"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <Link
                    href={`/problems/${sub.problemSlug}`}
                    className="font-semibold text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                  >
                    {sub.problemTitle}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                      statusColors[sub.status as keyof typeof statusColors] || statusColors.PENDING,
                    )}
                  >
                    {sub.status.replace(/_/g, ' ')}
                  </span>
                  <DifficultyBadge difficulty={sub.difficulty} />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
