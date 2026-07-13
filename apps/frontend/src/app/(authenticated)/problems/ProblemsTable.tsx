'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { InfiniteData } from '@tanstack/react-query';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  solvedCount: number;
  attemptCount: number;
  tags?: string[];
}

interface ProblemsTableProps {
  isLoading: boolean;
  isError: boolean;
  data?: InfiniteData<{
    data: Problem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  handleReset: () => void;
}

export function ProblemsTable({
  isLoading,
  isError,
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  handleReset,
}: ProblemsTableProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the loaded pages of problems into a single array
  const problems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
              <th className="py-4 px-6 min-w-[240px]">Problem Title</th>
              <th className="py-4 px-6 w-32">Difficulty</th>
              <th className="py-4 px-6 w-40">Topic Category</th>
              <th className="py-4 px-6 w-36">Acceptance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              // Shimmer Loader Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4.5 px-6 space-y-2">
                    <div className="w-[180px] h-4 bg-muted rounded-md" />
                    <div className="w-[100px] h-3 bg-muted rounded-md opacity-60" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[70px] h-5 bg-muted rounded-full" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[90px] h-4 bg-muted rounded-md" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[50px] h-4 bg-muted rounded-md" />
                  </td>
                </tr>
              ))
            ) : isError ? (
              // Fetch failure row
              <tr>
                <td colSpan={4} className="py-12 text-center text-rose-500 font-semibold">
                  Failed to retrieve coding problems. Please try refreshing.
                </td>
              </tr>
            ) : problems.length === 0 ? (
              // Empty search result screen
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/60">
                      <BookOpen size={28} />
                    </div>
                    <p className="font-semibold text-foreground text-sm">No Challenges Found</p>
                    <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-normal">
                      No problems match your current search queries. Try clearing filters or
                      altering search keywords.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl mt-1.5 active:scale-95"
                      onClick={handleReset}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              // Active listing rows
              problems.map((prob) => {
                // Compute acceptance rate
                const rate =
                  prob.attemptCount > 0
                    ? Math.round((prob.solvedCount / prob.attemptCount) * 100)
                    : 100;

                // Simple mockup status checking (solvedCount > 0 indicates solved)
                const isSolved = prob.solvedCount > 0;

                return (
                  <tr
                    key={prob.id}
                    className="hover:bg-accent/30 transition-all duration-150 group"
                  >
                    {/* Title & Slug link */}
                    <td className="py-4.5 px-6 font-semibold text-foreground">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          {isSolved && (
                            <CheckCircle className="text-emerald-500 shrink-0" size={16} />
                          )}
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {prob.title}
                          </Link>
                        </div>
                        {prob.tags && prob.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {prob.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 capitalize"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Difficulty badge */}
                    <td className="py-4.5 px-6">
                      <DifficultyBadge difficulty={prob.difficulty} />
                    </td>

                    {/* Category */}
                    <td className="py-4.5 px-6 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                      {prob.category.toLowerCase().replace('_', ' ')}
                    </td>

                    {/* Acceptance rate */}
                    <td className="py-4.5 px-6 text-xs font-semibold text-foreground">
                      {rate}%{' '}
                      <span className="text-[10px] text-muted-foreground/60 font-medium">
                        ({prob.solvedCount}/{prob.attemptCount})
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite Scroll Sentinel / Footer Panel */}
      {!isLoading && !isError && (
        <div
          ref={observerRef}
          className="py-6 flex justify-center items-center text-xs text-muted-foreground select-none border-t border-border/80 bg-muted/10"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>Loading more challenges...</span>
            </div>
          ) : hasNextPage ? (
            <span>Scroll down to load more</span>
          ) : problems.length > 0 ? (
            <span>You have viewed all challenges</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
