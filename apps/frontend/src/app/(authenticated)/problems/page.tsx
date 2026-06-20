'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Code2,
} from 'lucide-react';

export default function ProblemsPage() {
  const { apiFetch } = useAuth();

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<'ALL' | 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT'>('ALL');
  const [difficulty, setDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input to avoid hitting database on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch problems using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['problems', { search: debouncedSearch, category, difficulty, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category !== 'ALL') params.set('category', category);
      if (difficulty !== 'ALL') params.set('difficulty', difficulty);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      return apiFetch<{
        data: Array<{
          id: string;
          title: string;
          slug: string;
          difficulty: string;
          category: string;
          solvedCount: number;
          attemptCount: number;
        }>;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/api/problems?${params.toString()}`);
    },
  });

  const handleReset = () => {
    setSearch('');
    setCategory('ALL');
    setDifficulty('ALL');
    setPage(1);
  };

  const categories = [
    { value: 'ALL', label: 'All Topics' },
    { value: 'JAVASCRIPT', label: 'JavaScript' },
    { value: 'REACT', label: 'React' },
    { value: 'NODEJS', label: 'Node.js' },
    { value: 'TYPESCRIPT', label: 'TypeScript' },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Title section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Coding Challenges</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sharpen your coding skills with interactive challenges.
        </p>
      </div>

      {/* Filter Options Bar */}
      <Card className="border-border bg-card/45 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75" size={17} />
              <Input
                placeholder="Search challenges by title or description..."
                className="pl-10 rounded-xl h-11 border-border bg-background/50 focus:border-ring"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Difficulty Filter */}
            <div className="w-full md:w-48">
              <select
                className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium text-foreground outline-none focus:border-ring transition-colors cursor-pointer"
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as any);
                  setPage(1);
                }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Reset Button */}
            {(search || category !== 'ALL' || difficulty !== 'ALL') && (
              <Button
                variant="ghost"
                className="h-11 px-4 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 hover:bg-accent/40 active:scale-95 transition-all"
                onClick={handleReset}
              >
                <RotateCcw size={14} />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Topic Chips Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setPage(1);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 border cursor-pointer select-none',
                    isActive
                      ? 'bg-primary text-primary-foreground border-transparent shadow-sm'
                      : 'bg-background/40 hover:bg-accent/50 text-muted-foreground border-border'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Problems Table Container */}
      <Card className="border-border bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
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
                        No problems match your current search queries. Try clearing filters or altering search keywords.
                      </p>
                      <Button
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

                  // Simple mockup status checking (e.g. solvedCount > 0 indicates solved for demo mockup)
                  const isSolved = prob.solvedCount > 0;

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-accent/30 transition-all duration-150 group"
                    >
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
                        {rate}% <span className="text-[10px] text-muted-foreground/60 font-medium">({prob.solvedCount}/{prob.attemptCount})</span>
                      </td>

                      {/* Action solve link */}
                      <td className="py-4.5 px-6 text-right">
                        <Link
                          href={`/problems/${prob.slug}`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            "h-8 rounded-lg text-xs font-bold border-border/80 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all active:scale-95 inline-flex items-center justify-center"
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
        </div>

        {/* Pagination Panel */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium select-none">
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
    </div>
  );
}
