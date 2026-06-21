'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  Trophy,
  Clock,
  ExternalLink,
  Code,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Cpu,
  HardDrive,
  GitCompare,
  FileCode,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

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

interface SubmissionsListResponse {
  data: SubmissionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SubmissionsPage() {
  const { apiFetch } = useAuth();

  // Navigation & Filtering State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const limit = 12;

  // Fetch submissions from the backend api
  const { data, isLoading, isError, refetch } = useQuery<SubmissionsListResponse>({
    queryKey: ['submissions', { page, limit }],
    queryFn: () =>
      apiFetch<SubmissionsListResponse>(`/api/submissions?page=${page}&limit=${limit}`),
    refetchOnWindowFocus: false,
  });

  // Client-side filtering for Search & Status (enhances UX)
  const filteredSubmissions = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((sub) => {
      const matchesSearch = sub.problem?.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data?.data, search, statusFilter]);

  // Relative Time Formatter
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'yesterday';
    return `${diffDay}d ago`;
  };

  // Status Badge Styling Helper
  const getStatusDetails = (status: string) => {
    const statusMap: Record<string, { label: string; text: string; bg: string; icon: any }> = {
      ACCEPTED: {
        label: 'Accepted',
        text: 'text-emerald-500',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        icon: CheckCircle,
      },
      WRONG_ANSWER: {
        label: 'Wrong Answer',
        text: 'text-destructive',
        bg: 'bg-destructive/10 border-destructive/20',
        icon: AlertTriangle,
      },
      TIME_LIMIT_EXCEEDED: {
        label: 'TLE',
        text: 'text-amber-500',
        bg: 'bg-amber-500/10 border-amber-500/20',
        icon: Clock,
      },
      RUNTIME_ERROR: {
        label: 'Runtime Error',
        text: 'text-stone-500',
        bg: 'bg-stone-500/10 border-stone-500/20',
        icon: HelpCircle,
      },
      COMPILATION_ERROR: {
        label: 'Compilation Error',
        text: 'text-zinc-500',
        bg: 'bg-zinc-500/10 border-zinc-500/20',
        icon: Activity,
      },
      PENDING: {
        label: 'Pending',
        text: 'text-muted-foreground',
        bg: 'bg-muted/10 border-border',
        icon: Activity,
      },
      PROCESSING: {
        label: 'Processing',
        text: 'text-indigo-500',
        bg: 'bg-indigo-500/10 border-indigo-500/20',
        icon: Activity,
      },
    };

    return (
      statusMap[status] || {
        label: status.replace(/_/g, ' '),
        text: 'text-muted-foreground',
        bg: 'bg-muted/5 border-border',
        icon: HelpCircle,
      }
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Submission History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review your past codes, execution metrics, and compare solutions.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-border bg-card/45 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardContent className="p-5 flex flex-col md:flex-row gap-3">
          {/* Search problems */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75"
              size={17}
            />
            <Input
              placeholder="Search submissions by problem title..."
              className="pl-10 rounded-xl h-11 border-border bg-background/50 focus:border-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full md:w-56">
            <select
              className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium text-foreground outline-none focus:border-ring transition-colors cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WRONG_ANSWER">Wrong Answer</option>
              <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</option>
              <option value="RUNTIME_ERROR">Runtime Error</option>
              <option value="COMPILATION_ERROR">Compilation Error</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              className="h-11 px-4 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 hover:bg-accent/40 active:scale-95 transition-all"
              onClick={handleResetFilters}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Submissions Table Grid */}
      <Card className="border-border bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
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
                    <tr
                      key={sub.id}
                      className="hover:bg-accent/25 transition-all duration-150 group"
                    >
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
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing page <span className="text-foreground font-semibold">{data.page}</span> of{' '}
              <span className="text-foreground font-semibold">{data.totalPages}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <Button
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
                    variant={isCurrent ? 'default' : 'outline'}
                    className="w-8 h-8 rounded-lg text-xs font-semibold"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
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
      </Card>

      {/* Submission Details & Comparative Diff Dialog */}
      {selectedSubmissionId && (
        <SubmissionDetailsModal
          submissionId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
          formatRelativeTime={formatRelativeTime}
          getStatusDetails={getStatusDetails}
        />
      )}
    </div>
  );
}

// ============================================================
// SubmissionDetailsModal Component
// ============================================================

interface ModalProps {
  submissionId: string;
  onClose: () => void;
  formatRelativeTime: (date: string) => string;
  getStatusDetails: (status: string) => any;
}

function SubmissionDetailsModal({
  submissionId,
  onClose,
  formatRelativeTime,
  getStatusDetails,
}: ModalProps) {
  const { apiFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<'code' | 'diff'>('code');
  const [compareWithId, setCompareWithId] = useState<string | null>(null);

  // 1. Fetch submission details
  const { data: details, isLoading } = useQuery<SubmissionItem>({
    queryKey: ['submissionDetails', submissionId],
    queryFn: () => apiFetch<SubmissionItem>(`/api/submissions/${submissionId}`),
    refetchOnWindowFocus: false,
    enabled: !!submissionId,
  });

  // 2. Fetch other submissions for the same problem (for diff/comparison)
  const { data: otherSubmissions, isLoading: isOthersLoading } = useQuery<SubmissionsListResponse>({
    queryKey: ['problemSubmissions', details?.problemId],
    queryFn: () =>
      apiFetch<SubmissionsListResponse>(
        `/api/submissions?problemId=${details?.problemId}&limit=30`,
      ),
    refetchOnWindowFocus: false,
    enabled: !!details?.problemId,
  });

  // Filter out the currently selected submission from the compare choices
  const compareSubmissions = useMemo(() => {
    if (!otherSubmissions?.data) return [];
    return otherSubmissions.data.filter((sub) => sub.id !== submissionId);
  }, [otherSubmissions?.data, submissionId]);

  // 3. Fetch details for the selected comparison submission
  const { data: compareDetails } = useQuery<SubmissionItem>({
    queryKey: ['compareDetails', compareWithId],
    queryFn: () => apiFetch<SubmissionItem>(`/api/submissions/${compareWithId}`),
    refetchOnWindowFocus: false,
    enabled: !!compareWithId,
  });

  if (isLoading || !details) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl w-full h-[600px] flex items-center justify-center p-6 bg-card border-border">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <Activity className="animate-spin text-indigo-500 w-8 h-8" />
            <p className="text-xs text-muted-foreground">Loading submission details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const statusInfo = getStatusDetails(details.status);
  const StatusIcon = statusInfo.icon;
  const runtime =
    details.result?.runtime !== undefined && details.result?.runtime !== null
      ? `${details.result.runtime} ms`
      : '--';
  const memory = details.result?.memory
    ? `${Math.round((details.result.memory / 1024 / 1024) * 100) / 100} MB`
    : '--';

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 bg-card border border-border rounded-2xl flex flex-col gap-5">
        <DialogHeader className="border-b border-border pb-4 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileCode className="text-indigo-500 w-5 h-5" />
              {details.problem?.title || 'Problem Details'}
            </DialogTitle>
            <DialogDescription className="text-xs flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground/80 mt-1">
              {details.problem?.difficulty && (
                <DifficultyBadge difficulty={details.problem.difficulty} />
              )}
              <span>•</span>
              <span>Submitted {formatRelativeTime(details.createdAt)}</span>
              <span>•</span>
              <span className="font-mono">{details.language}</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Execution Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-muted/20 border border-border/50 rounded-2xl p-4">
          {/* Status Metric */}
          <div className="flex items-center gap-3.5 px-2 py-1">
            <div className={cn('p-2 rounded-xl border shrink-0', statusInfo.bg, statusInfo.text)}>
              <StatusIcon size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Status
              </p>
              <p className={cn('text-sm font-bold', statusInfo.text)}>{statusInfo.label}</p>
            </div>
          </div>

          {/* Test cases passed */}
          <div className="flex items-center gap-3.5 px-2 py-1 border-t sm:border-t-0 sm:border-l border-border/40">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Test Cases
              </p>
              <p className="text-sm font-bold text-foreground">
                {details.result?.passedCases ?? 0} / {details.result?.totalCases ?? 0}
              </p>
            </div>
          </div>

          {/* Runtime */}
          <div className="flex items-center gap-3.5 px-2 py-1 border-t sm:border-t-0 sm:border-l border-border/40">
            <div className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Runtime
              </p>
              <p className="text-sm font-bold text-foreground">{runtime}</p>
            </div>
          </div>

          {/* Memory */}
          <div className="flex items-center gap-3.5 px-2 py-1 border-t sm:border-t-0 sm:border-l border-border/40">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl shrink-0">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Memory
              </p>
              <p className="text-sm font-bold text-foreground">{memory}</p>
            </div>
          </div>
        </div>

        {/* Console / Compilation Errors */}
        {details.result?.error && (
          <div className="bg-destructive/5 dark:bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
            <p className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Error Output
            </p>
            <pre className="text-xs text-popover-foreground/90 font-mono overflow-x-auto bg-black/10 dark:bg-black/25 p-3 rounded-xl border border-border/60 max-h-32">
              {details.result.error}
            </pre>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex items-center border-b border-border gap-3">
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              'px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-all cursor-pointer',
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            Submitted Code
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={cn(
              'px-4 py-2 text-xs font-semibold border-b-2 -mb-[2px] transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'diff'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <GitCompare size={13} />
            Compare Code (Diff)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 flex flex-col min-h-[360px]">
          {activeTab === 'code' ? (
            <div className="rounded-2xl overflow-hidden border border-border flex-1 h-[400px]">
              <Editor
                height="100%"
                language={details.language}
                theme="vs-dark"
                value={details.code}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                  fontSize: 13,
                  lineNumbers: 'on',
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              {/* Compare Selector Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/10 border border-border/60 rounded-2xl p-4.5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">
                    Select submission to compare against
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Compare details to see code optimizations or fixes
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  {isOthersLoading ? (
                    <div className="text-xs text-muted-foreground py-2">
                      Loading previous runs...
                    </div>
                  ) : compareSubmissions.length === 0 ? (
                    <div className="text-xs text-muted-foreground py-2 font-medium">
                      No other submissions found.
                    </div>
                  ) : (
                    <select
                      className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground outline-none cursor-pointer focus:border-ring"
                      value={compareWithId || ''}
                      onChange={(e) => setCompareWithId(e.target.value || null)}
                    >
                      <option value="">Choose a previous submission...</option>
                      {compareSubmissions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {getStatusDetails(sub.status).label} —{' '}
                          {new Date(sub.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Comparative Diff Editor panel */}
              <div className="rounded-2xl overflow-hidden border border-border flex-1 h-[400px]">
                {compareWithId && compareDetails ? (
                  <DiffEditor
                    height="100%"
                    original={compareDetails.code}
                    modified={details.code}
                    language={details.language}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      originalEditable: false,
                      renderSideBySide: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-black/5 dark:bg-black/20 flex flex-col items-center justify-center text-muted-foreground gap-2 p-8">
                    <GitCompare size={28} className="text-muted-foreground/50 animate-bounce" />
                    <p className="text-xs font-semibold text-foreground/80">Select a run above</p>
                    <p className="text-[10px] text-muted-foreground text-center max-w-[280px]">
                      Choose an earlier submission from the dropdown list to visualize code
                      alterations side-by-side.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4 -mx-2 -mb-2">
          <Button
            variant="outline"
            className="rounded-xl active:scale-95 font-semibold text-xs"
            onClick={onClose}
          >
            Close details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
