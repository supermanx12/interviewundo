import React from 'react';
import Link from 'next/link';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  solvedCount: number;
  attemptCount: number;
}

interface ProblemsTableProps {
  isLoading: boolean;
  isError: boolean;
  data?: {
    data: Problem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => void;
}

export function ProblemsTable({
  isLoading,
  isError,
  data,
  page,
  setPage,
  handleReset,
}: ProblemsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
            <th className="py-4 px-6 w-16">Status</th>
            <th className="py-4 px-6 min-w-[240px]">Problem Title</th>
            <th className="py-4 px-6 w-32">Difficulty</th>
            <th className="py-4 px-6 w-40">Topic Category</th>
            <th className="py-4 px-6 w-36">Acceptance</th>
            <th className="py-4 px-6 w-28 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {isLoading ? (
            // Shimmer Loader Rows
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-4.5 px-6">
                  <div className="w-5 h-5 rounded-full bg-muted" />
                </td>
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
                <td className="py-4.5 px-6">
                  <div className="w-[80px] h-8 bg-muted rounded-lg ml-auto" />
                </td>
              </tr>
            ))
          ) : isError ? (
            // Fetch failure row
            <tr>
              <td colSpan={6} className="py-12 text-center text-rose-500 font-semibold">
                Failed to retrieve coding problems. Please try refreshing.
              </td>
            </tr>
          ) : !data || data.data.length === 0 ? (
            // Empty search result screen
            <tr>
              <td colSpan={6} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/60">
                    <BookOpen size={28} />
                  </div>
                  <p className="font-semibold text-foreground text-sm">No Challenges Found</p>
                  <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-normal">
                    No problems match your current search queries. Try clearing filters or altering
                    search keywords.
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
            data.data.map((prob) => {
              // Compute acceptance rate
              const rate =
                prob.attemptCount > 0
                  ? Math.round((prob.solvedCount / prob.attemptCount) * 100)
                  : 100;

              // Simple mockup status checking (solvedCount > 0 indicates solved)
              const isSolved = prob.solvedCount > 0;

              return (
                <tr key={prob.id} className="hover:bg-accent/30 transition-all duration-150 group">
                  {/* Status indicator */}
                  <td className="py-4.5 px-6">
                    {isSolved ? (
                      <CheckCircle className="text-emerald-500 fill-current shrink-0" size={17} />
                    ) : (
                      <HelpCircle className="text-muted-foreground/40 shrink-0" size={17} />
                    )}
                  </td>

                  {/* Title & Slug link */}
                  <td className="py-4.5 px-6 font-semibold text-foreground">
                    <Link
                      href={`/problems/${prob.slug}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {prob.title}
                    </Link>
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

                  {/* Action solve link */}
                  <td className="py-4.5 px-6 text-right">
                    <Link
                      href={`/problems/${prob.slug}`}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'h-8 rounded-lg text-xs font-bold border-border/80 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all active:scale-95 inline-flex items-center justify-center',
                      )}
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Panel */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/10 text-xs">
          <span className="text-muted-foreground font-medium select-none">
            Showing page <span className="text-foreground font-semibold">{data.page}</span> of{' '}
            <span className="text-foreground font-semibold">{data.totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={14} />
            </Button>

            {Array.from({ length: data.totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isCurrent = page === pageNumber;
              return (
                <Button
                  key={pageNumber}
                  type="button"
                  variant={isCurrent ? 'default' : 'outline'}
                  className="w-8 h-8 rounded-lg text-xs font-semibold"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg"
              disabled={page === data.totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
