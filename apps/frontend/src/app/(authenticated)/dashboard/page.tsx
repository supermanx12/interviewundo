'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Code, Sparkles, Trophy, Activity, Flame, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Problem } from '@interviewprep/shared-types';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { DifficultyProgress } from './DifficultyProgress';
import { RecentSubmissions } from './RecentSubmissions';
import { ActivityHeatmap } from './ActivityHeatmap';

// ============================================================
// Types
// ============================================================

interface DifficultyBreakdown {
  solved: number;
  total: number;
}

interface DashboardStats {
  totalSolved: number;
  totalProblems: number;
  successRate: number;
  streak: number;
  difficultyBreakdown: {
    EASY: DifficultyBreakdown;
    MEDIUM: DifficultyBreakdown;
    HARD: DifficultyBreakdown;
  };
}

interface CategoryProgressItem {
  category: string;
  solved: number;
  total: number;
  percentage: number;
}

interface ActivityHeatmapItem {
  date: string;
  count: number;
}

interface RecentSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface DashboardSummaryData {
  stats: DashboardStats;
  progress: CategoryProgressItem[];
  activity: ActivityHeatmapItem[];
  recent: RecentSubmissionItem[];
}

export default function DashboardPage() {
  const { apiFetch, user } = useAuth();

  // Fetch consolidated dashboard summary data
  const { data, isLoading, error } = useQuery<DashboardSummaryData>({
    queryKey: ['dashboardSummary'],
    queryFn: () => apiFetch<DashboardSummaryData>('/api/dashboard/summary'),
    refetchOnWindowFocus: false,
  });

  // Fetch Daily Challenge problem
  const { data: dailyChallenge, isLoading: isDailyLoading } = useQuery<{
    success: boolean;
    data: Problem;
  }>({
    queryKey: ['dailyChallenge'],
    queryFn: () => apiFetch<{ success: boolean; data: Problem }>('/api/problems/daily'),
    refetchOnWindowFocus: false,
  });

  // Format Recharts data
  const rechartsData = useMemo(() => {
    if (!data?.progress) return [];
    return data.progress.map((item) => ({
      name: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
      solved: item.solved,
      total: item.total,
      percentage: item.percentage,
      rawName: item.category,
    }));
  }, [data?.progress]);

  // Render Skeleton Loader
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Failed to load dashboard statistics.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, recent } = data;

  const statsGridData = [
    {
      label: 'Problems Solved',
      value: `${stats.totalSolved} / ${stats.totalProblems}`,
      description: `${stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0}% complete`,
      icon: Code,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      description: 'Accepted vs total submissions',
      icon: Trophy,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      label: 'Active Streak',
      value: `${stats.streak} ${stats.streak === 1 ? 'Day' : 'Days'}`,
      description: 'Keep the flame alive!',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10 animate-pulse',
    },
    {
      label: 'Total Submissions',
      value: `${stats.totalSolved > 0 ? 'Active' : 'Get Started'}`,
      description: 'Submit solutions to build stats',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Sparkles width={12} height={12} className="animate-spin" />
            Interview Prep Dashboard Active
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, {user?.name || 'Developer'}!
          </h2>
          <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
            Enhance your problem-solving capabilities, master JavaScript/React, and ace your
            technical interviews with real-time feedback.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/problems"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2',
              )}
            >
              <PlayCircle size={16} />
              Start Solving
            </Link>
          </div>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      {isDailyLoading ? (
        <div className="w-full bg-card/30 border border-border backdrop-blur-sm rounded-3xl p-6 md:p-8 animate-pulse space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-32 bg-muted rounded-full" />
              <div className="h-7 w-1/3 bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
            <div className="h-10 w-32 bg-muted rounded-xl" />
          </div>
        </div>
      ) : dailyChallenge?.data ? (
        <div className="w-full relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-indigo-500/10 backdrop-blur-md shadow-lg shadow-orange-500/5 transition-all duration-300 hover:border-orange-500/30 group">
          {/* Decorative glowing blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 dark:text-orange-400 text-xs font-bold tracking-wider uppercase border border-orange-500/30">
                  <Flame size={12} className="animate-pulse fill-orange-500" />
                  Daily Challenge
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <DifficultyBadge difficulty={dailyChallenge.data.difficulty} />
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-md">
                  {dailyChallenge.data.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {dailyChallenge.data.title}
                </h3>
                <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
                  {dailyChallenge.data.description.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="font-semibold text-foreground">
                    {dailyChallenge.data.solvedCount}
                  </span>{' '}
                  Solved
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={14} className="text-indigo-500" />
                  <span className="font-semibold text-foreground">
                    {dailyChallenge.data.attemptCount > 0
                      ? Math.round(
                          (dailyChallenge.data.solvedCount / dailyChallenge.data.attemptCount) *
                            100,
                        )
                      : 0}
                    %
                  </span>{' '}
                  Acceptance Rate
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <Link
                href={`/problems/${dailyChallenge.data.slug}`}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'default' }),
                  'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-md shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-2 border-0',
                )}
              >
                Solve Challenge
                <PlayCircle size={18} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsGridData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="border-border bg-card/40 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground/80">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Stats Breakdown & Category Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Difficulty breakdown */}
          <DifficultyProgress difficultyBreakdown={stats.difficultyBreakdown} />

          {/* Category progress bar chart (Recharts) */}
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Category Progress
              </CardTitle>
              <CardDescription>Completion percentages across technical subjects</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rechartsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover text-popover-foreground p-3 rounded-xl border border-border shadow-lg text-xs space-y-1">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-muted-foreground">
                              Solved:{' '}
                              <span className="font-semibold text-foreground">
                                {data.solved} / {data.total}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Completion:{' '}
                              <span className="font-semibold text-indigo-500">
                                {data.percentage}%
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={16}>
                    {rechartsData.map((entry, index) => {
                      const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Heatmap Calendar & Recent Submissions */}
        <div className="space-y-6">
          {/* Submission Heatmap */}
          <ActivityHeatmap activity={data.activity} />

          {/* Recent Submissions */}
          <RecentSubmissions recent={recent} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Skeleton Loader Component
// ============================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-44 bg-muted/40 rounded-3xl" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-muted/20 rounded-2xl" />
          <div className="h-80 bg-muted/20 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-muted/20 rounded-2xl" />
          <div className="h-[320px] bg-muted/20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
