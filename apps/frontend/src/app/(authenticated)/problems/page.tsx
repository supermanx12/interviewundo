'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, RotateCcw } from 'lucide-react';
import { ProblemsTable } from './ProblemsTable';

const categories = [
  { value: 'ALL', label: 'All Topics' },
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'REACT', label: 'React' },
  { value: 'NODEJS', label: 'Node.js' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'SQL', label: 'SQL' },
  { value: 'MONGODB', label: 'MongoDB' },
] as const;

const conceptTags = [
  { value: 'ALL', label: 'All Concepts' },
  { value: 'arrays', label: 'Arrays' },
  { value: 'strings', label: 'Strings' },
  { value: 'objects', label: 'Objects' },
  { value: 'loops', label: 'Loops' },
  { value: 'functions', label: 'Functions' },
] as const;

export default function ProblemsPage() {
  const { apiFetch } = useAuth();

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<
    'ALL' | 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT' | 'SQL' | 'MONGODB'
  >('ALL');
  const [tag, setTag] = useState<string>('ALL');
  const [difficulty, setDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const limit = 15;

  // Debounce search input to avoid hitting database on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch problems using React Query Infinite Query
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['problems', { search: debouncedSearch, category, tag, difficulty }],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category !== 'ALL') params.set('category', category);
        if (tag !== 'ALL') params.set('tag', tag);
        if (difficulty !== 'ALL') params.set('difficulty', difficulty);
        params.set('page', pageParam.toString());
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
            tags?: string[];
          }>;
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>(`/api/problems?${params.toString()}`);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
      },
      staleTime: 5 * 60 * 1000,
    });

  const handleReset = () => {
    setSearch('');
    setCategory('ALL');
    setTag('ALL');
    setDifficulty('ALL');
  };

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
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75"
                size={17}
              />
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
                aria-label="Filter by difficulty"
                className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium text-foreground outline-none focus:border-ring transition-colors cursor-pointer"
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as any);
                }}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Reset Button */}
            {(search || category !== 'ALL' || tag !== 'ALL' || difficulty !== 'ALL') && (
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

          <div className="space-y-3">
            {/* Topic Chips Navigation */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 px-1">
                Categories
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {categories.map((cat) => {
                  const isActive = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setCategory(cat.value);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 border cursor-pointer select-none',
                        isActive
                          ? 'bg-primary text-primary-foreground border-transparent shadow-sm'
                          : 'bg-background/40 hover:bg-accent/50 text-muted-foreground border-border',
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Concept Tag Chips Navigation */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 px-1">
                Concepts
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {conceptTags.map((t) => {
                  const isActive = tag === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        setTag(t.value);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 border cursor-pointer select-none',
                        isActive
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-transparent shadow-sm'
                          : 'bg-background/40 hover:bg-accent/50 text-muted-foreground border-border',
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Problems Table Container */}
      <Card className="border-border bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <ProblemsTable
          isLoading={isLoading}
          isError={isError}
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          handleReset={handleReset}
        />
      </Card>
    </div>
  );
}
