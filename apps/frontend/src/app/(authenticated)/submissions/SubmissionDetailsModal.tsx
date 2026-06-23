import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Editor, { DiffEditor } from '@monaco-editor/react';
import {
  Activity,
  Trophy,
  Cpu,
  HardDrive,
  AlertTriangle,
  GitCompare,
  FileCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ModalProps {
  submissionId: string;
  onClose: () => void;
  formatRelativeTime: (date: string) => string;
  getStatusDetails: (status: string) => any;
}

export function SubmissionDetailsModal({
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
            type="button"
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
            type="button"
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
            type="button"
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
