import React from 'react';
import Link from 'next/link';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Activity, ExternalLink } from 'lucide-react';

interface SubmissionResult {
  id: string;
  submissionId: string;
  runtime?: number | null;
  memory?: number | null;
  passedCases: number;
  totalCases: number;
  error?: string | null;
  output?: string | null;
  createdAt: string;
}

interface SubmissionItem {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: string;
  createdAt: string;
  problem?: {
    title: string;
    slug: string;
    difficulty: string;
    description: string;
  };
  result?: SubmissionResult | null;
}

interface SubmissionsTableProps {
  isLoading: boolean;
  isError: boolean;
  filteredSubmissions: SubmissionItem[];
  totalPages: number;
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  handleResetFilters: () => void;
  setSelectedSubmissionId: (id: string) => void;
  formatRelativeTime: (date: string) => string;
  getStatusDetails: (status: string) => any;
}

export function SubmissionsTable({
  isLoading,
  isError,
  filteredSubmissions,
  totalPages,
  currentPage,
  setPage,
  handleResetFilters,
  setSelectedSubmissionId,
  formatRelativeTime,
  getStatusDetails,
}: SubmissionsTableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
              <th className="py-4 px-6 min-w-[200px]">Problem</th>
              <th className="py-4 px-6 w-32">Status</th>
              <th className="py-4 px-6 w-36">Passed Cases</th>
              <th className="py-4 px-6 w-28">Language</th>
              <th className="py-4 px-6 w-28">Runtime</th>
              <th className="py-4 px-6 w-32">Submitted</th>
              <th className="py-4 px-6 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              // Table skeleton loading shimmer rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4.5 px-6 space-y-1">
                    <div className="w-[160px] h-4 bg-muted rounded-md" />
                    <div className="w-[60px] h-3 bg-muted rounded-md opacity-60" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[90px] h-5 bg-muted rounded-full" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[60px] h-4 bg-muted rounded-md" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[80px] h-4 bg-muted rounded-md" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[45px] h-4 bg-muted rounded-md" />
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="w-[70px] h-4 bg-muted rounded-md" />
                  </td>
                  <td className="py-4.5 px-6 text-right">
                    <div className="w-[80px] h-8 bg-muted rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-rose-500 font-semibold">
                  Failed to fetch submission history. Please try reloading.
                </td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-muted/50 text-muted-foreground/60">
                      <Activity size={28} />
                    </div>
                    <p className="font-semibold text-foreground text-sm">No Submissions Found</p>
                    <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-normal">
                      No submissions match your queries. Try clearing filters or changing search
                      keywords.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl mt-1.5 active:scale-95"
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => {
                const statusInfo = getStatusDetails(sub.status);
                const Icon = statusInfo.icon;
                const passed = sub.result?.passedCases ?? 0;
                const total = sub.result?.totalCases ?? 0;
                const runtime =
                  sub.result?.runtime !== undefined && sub.result?.runtime !== null
                    ? `${sub.result.runtime} ms`
                    : '--';

                return (
                  <tr key={sub.id} className="hover:bg-accent/25 transition-all duration-150 group">
                    {/* Problem details */}
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/problems/${sub.problem?.slug}`}
                          className="font-semibold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors flex items-center gap-1.5"
                        >
                          {sub.problem?.title || 'Unknown Problem'}
                          <ExternalLink
                            size={11}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </Link>
                        {sub.problem?.difficulty && (
                          <div className="pt-0.5">
                            <DifficultyBadge difficulty={sub.problem.difficulty} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4.5 px-6">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border',
                          statusInfo.bg,
                          statusInfo.text,
                        )}
                      >
                        <Icon size={12} className="stroke-[2.5]" />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Cases */}
                    <td className="py-4.5 px-6 font-medium text-foreground text-xs">
                      {sub.status === 'ACCEPTED' ? (
                        <span className="text-emerald-500 font-semibold">
                          {total} / {total}
                        </span>
                      ) : sub.status === 'COMPILATION_ERROR' ? (
                        <span className="text-muted-foreground/60">-</span>
                      ) : (
                        <span>
                          {passed} / {total}
                        </span>
                      )}
                    </td>

                    {/* Language */}
                    <td className="py-4.5 px-6 text-xs text-muted-foreground font-mono">
                      {sub.language}
                    </td>

                    {/* Runtime */}
                    <td className="py-4.5 px-6 text-xs text-muted-foreground">{runtime}</td>

                    {/* Time */}
                    <td className="py-4.5 px-6 text-xs text-muted-foreground/80">
                      {formatRelativeTime(sub.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-bold border-border/80 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all active:scale-95"
                        onClick={() => setSelectedSubmissionId(sub.id)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Panel */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/10 text-xs">
          <span className="text-muted-foreground font-medium">
            Showing page <span className="text-foreground font-semibold">{currentPage}</span> of{' '}
            <span className="text-foreground font-semibold">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={14} />
            </Button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isCurrent = currentPage === pageNumber;
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
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
