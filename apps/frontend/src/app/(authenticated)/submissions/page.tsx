'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, AlertTriangle, Clock, HelpCircle, Activity } from 'lucide-react';
import { SubmissionsTable } from './SubmissionsTable';
import { SubmissionDetailsModal } from './SubmissionDetailsModal';

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
              aria-label="Filter by status"
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
        <SubmissionsTable
          isLoading={isLoading}
          isError={isError}
          filteredSubmissions={filteredSubmissions}
          totalPages={data?.totalPages ?? 0}
          currentPage={page}
          setPage={setPage}
          handleResetFilters={handleResetFilters}
          setSelectedSubmissionId={setSelectedSubmissionId}
          formatRelativeTime={formatRelativeTime}
          getStatusDetails={getStatusDetails}
        />
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
