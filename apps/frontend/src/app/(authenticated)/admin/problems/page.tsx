'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useToast } from '@/providers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ListPlus,
  Loader2,
  Check,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  ArrowRight,
  PlusCircle,
  FileCode,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT';
  starterCode: string;
  solutionCode?: string | null;
  tags: string[];
  isPublished: boolean;
  solvedCount: number;
  attemptCount: number;
}

interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
  createdAt: string;
}

export default function AdminProblemsPage() {
  const { apiFetch } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const queryClient = useQueryClient();

  // ------------------------------------------------------------
  // Table Filters State
  // ------------------------------------------------------------
  const [search, setSearch] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<
    'ALL' | 'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT'
  >('ALL');
  const [difficulty, setDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setDifficulty('ALL');
    setPage(1);
  };

  // ------------------------------------------------------------
  // Fetch Problems Query
  // ------------------------------------------------------------
  const { data, isLoading } = useQuery({
    queryKey: ['adminProblems', { search: debouncedSearch, category, difficulty, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category !== 'ALL') params.set('category', category);
      if (difficulty !== 'ALL') params.set('difficulty', difficulty);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      params.set('isPublished', 'all'); // Admin needs to see all

      // Call our custom AdminProblems route
      return apiFetch<{
        data: Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/api/admin/problems?${params.toString()}`);
    },
    refetchOnWindowFocus: false,
  });

  // ------------------------------------------------------------
  // CRUD Actions & Form Dialog State
  // ------------------------------------------------------------
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [formCategory, setFormCategory] = useState<
    'JAVASCRIPT' | 'REACT' | 'NODEJS' | 'TYPESCRIPT'
  >('JAVASCRIPT');
  const [formStarterCode, setFormStarterCode] = useState('');
  const [formSolutionCode, setFormSolutionCode] = useState('');
  const [formTagsString, setFormTagsString] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(false);

  // Check if URL includes request to create automatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('create') === 'true') {
        // Clean URL to prevent recurring popup
        window.history.replaceState({}, '', window.location.pathname);
        handleOpenCreateModal();
      }
    }
  }, []);

  const handleOpenCreateModal = () => {
    setActiveProblem(null);
    setFormTitle('');
    setFormDescription('');
    setFormDifficulty('EASY');
    setFormCategory('JAVASCRIPT');
    setFormStarterCode('// Write your starter code template here\nfunction solution() {\n  \n}');
    setFormSolutionCode(
      '// Complete solution implementation for validation\nfunction solution() {\n  \n}',
    );
    setFormTagsString('');
    setFormIsPublished(false);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (problem: Problem) => {
    setActiveProblem(problem);
    setFormTitle(problem.title);
    setFormDescription(problem.description);
    setFormDifficulty(problem.difficulty);
    setFormCategory(problem.category);
    setFormStarterCode(problem.starterCode);
    setFormSolutionCode(problem.solutionCode || '');
    setFormTagsString(problem.tags.join(', '));
    setFormIsPublished(problem.isPublished);
    setIsFormOpen(true);
  };

  // Create or Update Problem mutation
  const saveProblemMutation = useMutation({
    mutationFn: async () => {
      const parsedTags = formTagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: formTitle,
        description: formDescription,
        difficulty: formDifficulty,
        category: formCategory,
        starterCode: formStarterCode,
        solutionCode: formSolutionCode || null,
        tags: parsedTags,
        isPublished: formIsPublished,
        slug: formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      };

      if (activeProblem) {
        return apiFetch<Problem>(`/api/admin/problems/${activeProblem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        return apiFetch<Problem>('/api/admin/problems', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      showSuccess(
        activeProblem ? 'Problem updated successfully!' : 'Problem created successfully!',
      );
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to save problem.');
    },
  });

  // Toggle Published direct status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      return apiFetch<Problem>(`/api/admin/problems/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished }),
      });
    },
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ['adminProblems'] });
      const previousProblems = queryClient.getQueryData(['adminProblems']);
      queryClient.setQueryData(['adminProblems'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: any) => (p.id === id ? { ...p, isPublished } : p)),
        };
      });
      return { previousProblems };
    },
    onSuccess: (_, variables) => {
      showSuccess(variables.isPublished ? 'Problem published live!' : 'Problem reverted to draft.');
    },
    onError: (err: any, _, context: any) => {
      if (context?.previousProblems) {
        queryClient.setQueryData(['adminProblems'], context.previousProblems);
      }
      showError(err.message || 'Failed to update problem status.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
    },
  });

  // Delete problem mutation
  const deleteProblemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch<{ success: boolean }>(`/api/admin/problems/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
      showSuccess('Problem deleted successfully.');
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to delete problem.');
    },
  });

  const handleDeleteProblem = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteProblem = () => {
    if (deleteTargetId) {
      deleteProblemMutation.mutate(deleteTargetId);
      setIsDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  // ------------------------------------------------------------
  // Test Cases Management State & Dialog
  // ------------------------------------------------------------
  const [isTestCasesOpen, setIsTestCasesOpen] = useState(false);
  const [testCaseProblem, setTestCaseProblem] = useState<Problem | null>(null);

  // New Test Case Form Fields
  const [tcInput, setTcInput] = useState('');
  const [tcExpectedOutput, setTcExpectedOutput] = useState('');
  const [tcIsHidden, setTcIsHidden] = useState(false);
  const [tcOrder, setTcOrder] = useState(0);

  // Fetch Test Cases for selected problem
  const { data: testCases, isLoading: isLoadingTestCases } = useQuery<TestCase[]>({
    queryKey: ['testCases', testCaseProblem?.id],
    queryFn: () => {
      if (!testCaseProblem) return [];
      return apiFetch<TestCase[]>(`/api/admin/problems/${testCaseProblem.id}/test-cases`);
    },
    enabled: !!testCaseProblem,
  });

  const handleOpenTestCases = (problem: Problem) => {
    setTestCaseProblem(problem);
    setTcInput('');
    setTcExpectedOutput('');
    setTcIsHidden(false);
    setTcOrder(0);
    setIsTestCasesOpen(true);
  };

  // Create Test Case Mutation
  const addTestCaseMutation = useMutation({
    mutationFn: async () => {
      if (!testCaseProblem) return;
      return apiFetch<TestCase>('/api/admin/test-cases', {
        method: 'POST',
        body: JSON.stringify({
          problemId: testCaseProblem.id,
          input: tcInput,
          expectedOutput: tcExpectedOutput,
          isHidden: tcIsHidden,
          order: tcOrder,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases', testCaseProblem?.id] });
      showSuccess('Test case added successfully.');
      setTcInput('');
      setTcExpectedOutput('');
      setTcIsHidden(false);
      setTcOrder(0);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to add test case.');
    },
  });

  // Delete Test Case Mutation
  const deleteTestCaseMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch<{ success: boolean }>(`/api/admin/test-cases/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases', testCaseProblem?.id] });
      showSuccess('Test case deleted successfully.');
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to delete test case.');
    },
  });

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Problem Database</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build and curate technical challenges for the platform workspace.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Problem
        </Button>
      </div>

      {/* Filter Options Card */}
      <Card className="border-border bg-card/45 backdrop-blur-sm shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75"
                size={17}
              />
              <Input
                placeholder="Search database by title, description, or slug..."
                className="pl-10 rounded-xl h-11 border-border bg-background/50 focus:border-rose-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Difficulty dropdown */}
            <div className="w-full md:w-48">
              <select
                className="w-full h-11 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium text-foreground outline-none focus:border-rose-500 transition-colors cursor-pointer"
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

            {/* Clear Button */}
            {(search || category !== 'ALL' || difficulty !== 'ALL') && (
              <Button
                variant="ghost"
                className="h-11 px-4 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground font-semibold flex items-center gap-2 hover:bg-accent/40 active:scale-95 transition-all"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                Reset
              </Button>
            )}
          </div>

          {/* Categories bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {[
              { value: 'ALL', label: 'All Subjects' },
              { value: 'JAVASCRIPT', label: 'JavaScript' },
              { value: 'REACT', label: 'React' },
              { value: 'NODEJS', label: 'Node.js' },
              { value: 'TYPESCRIPT', label: 'TypeScript' },
            ].map((cat) => {
              const isActive = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value as any);
                    setPage(1);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 border cursor-pointer select-none',
                    isActive
                      ? 'bg-rose-600 border-transparent text-white shadow-sm'
                      : 'bg-background/40 hover:bg-accent/50 text-muted-foreground border-border',
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Database Listing Table */}
      <Card className="border-border bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="animate-spin text-rose-500" size={32} />
              <p className="text-sm font-medium animate-pulse">Loading database index...</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <BookOpen size={40} className="text-muted-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground">No problems found</h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Curate new problems or change search terms to refine results.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                variant="outline"
                className="mt-4 rounded-xl border-rose-500/20 text-rose-600 hover:bg-rose-500/5 hover:text-rose-600"
              >
                Create First Problem
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-rose-500/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
                  <th className="py-4 px-6 w-24">Status</th>
                  <th className="py-4 px-6 min-w-[200px]">Problem Title</th>
                  <th className="py-4 px-6 w-28">Difficulty</th>
                  <th className="py-4 px-6 w-32">Topic</th>
                  <th className="py-4 px-6 w-28 text-center">Submissions</th>
                  <th className="py-4 px-6 w-44 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {data.data.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-accent/25 transition-colors group border-b border-border/20"
                  >
                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: problem.id,
                            isPublished: !problem.isPublished,
                          })
                        }
                        title={problem.isPublished ? 'Click to unpublish' : 'Click to publish'}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border transition-all active:scale-95',
                          problem.isPublished
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-muted/30 text-muted-foreground border-border',
                        )}
                      >
                        {problem.isPublished ? (
                          <>
                            <Eye size={12} />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-4 px-6 min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground leading-tight group-hover:text-rose-500 transition-colors">
                          {problem.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-mono tracking-tight mt-0.5">
                          slug: {problem.slug}
                        </span>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-6">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {problem.category}
                      </span>
                    </td>

                    {/* Attempts */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-foreground">
                          {problem.solvedCount}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60">
                          {problem.attemptCount} tries
                        </span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Test Cases Trigger */}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Manage Test Cases"
                          aria-label="Manage Test Cases"
                          onClick={() => handleOpenTestCases(problem)}
                          className="rounded-lg text-amber-500 hover:bg-amber-500/10 hover:text-amber-500 active:scale-95"
                        >
                          <ListPlus size={15} />
                        </Button>

                        {/* Edit Problem Trigger */}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Edit Details"
                          aria-label="Edit problem details"
                          onClick={() => handleOpenEditModal(problem)}
                          className="rounded-lg text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500 active:scale-95"
                        >
                          <Edit size={15} />
                        </Button>

                        {/* Delete Trigger */}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Delete Problem"
                          aria-label="Delete problem"
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 active:scale-95"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="py-4 px-6 border-t border-border flex items-center justify-between bg-muted/10">
            <span className="text-xs text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span> of{' '}
              <span className="font-semibold text-foreground">{data.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl h-8 text-xs font-semibold"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="rounded-xl h-8 text-xs font-semibold"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ------------------------------------------------------------
          DIALOG: CREATE / EDIT PROBLEM
          ------------------------------------------------------------ */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border rounded-2xl shadow-xl">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b border-border">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <PlusCircle className="text-rose-500" size={20} />
              {activeProblem ? 'Modify Coding Task' : 'Draft New Coding Task'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Specify complete details. Solutions and starter templates will be used for code
              execution tests.
            </DialogDescription>
          </DialogHeader>

          {/* Form Scrollport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Title & Slug preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Task Title
                </label>
                <Input
                  required
                  placeholder="e.g. Find Prime Numbers"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="rounded-xl bg-background/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Topic Subject
                </label>
                <select
                  className="w-full h-10 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium outline-none focus:border-rose-500 transition-colors"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                >
                  <option value="JAVASCRIPT">JavaScript</option>
                  <option value="REACT">React Component</option>
                  <option value="NODEJS">Node.js API</option>
                  <option value="TYPESCRIPT">TypeScript</option>
                </select>
              </div>
            </div>

            {/* Difficulty & tags & isPublished */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Difficulty Level
                </label>
                <select
                  className="w-full h-10 rounded-xl border border-border bg-background/50 px-3.5 text-sm font-medium outline-none focus:border-rose-500 transition-colors"
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as any)}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tags (comma separated)
                </label>
                <Input
                  placeholder="e.g. arrays, strings, algorithms"
                  value={formTagsString}
                  onChange={(e) => setFormTagsString(e.target.value)}
                  className="rounded-xl bg-background/50"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setFormIsPublished(!formIsPublished)}
                  className={cn(
                    'h-10 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all',
                    formIsPublished
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-muted/40 text-muted-foreground border-border',
                  )}
                >
                  {formIsPublished ? <Check size={14} /> : <X size={14} />}
                  <span>{formIsPublished ? 'Publish Live' : 'Save as Draft'}</span>
                </button>
              </div>
            </div>

            {/* Description (Markdown) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Problem Description (Markdown)
              </label>
              <textarea
                required
                rows={5}
                placeholder="Markdown description here... support paragraph explanation, code snippets, and constraints."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/50 p-3 text-sm outline-none focus:border-rose-500 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Starter code template */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <FileCode size={14} className="text-indigo-500" />
                  Starter Code Template
                </label>
              </div>
              <textarea
                required
                rows={6}
                value={formStarterCode}
                onChange={(e) => setFormStarterCode(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/50 p-3 text-xs outline-none focus:border-rose-500 transition-all font-mono leading-relaxed"
              />
            </div>

            {/* Complete Solution implementation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-500" />
                Solution Reference Code
              </label>
              <textarea
                rows={6}
                placeholder="Reference implementation code..."
                value={formSolutionCode}
                onChange={(e) => setFormSolutionCode(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/50 p-3 text-xs outline-none focus:border-rose-500 transition-all font-mono leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="p-4 shrink-0 border-t border-border bg-muted/20 flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl h-10 px-5 text-sm font-semibold active:scale-95"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={
                saveProblemMutation.isPending || !formTitle || !formDescription || !formStarterCode
              }
              onClick={() => saveProblemMutation.mutate()}
              className="rounded-xl h-10 px-6 text-sm bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 active:scale-95"
            >
              {saveProblemMutation.isPending && <Loader2 className="animate-spin" size={14} />}
              <span>{activeProblem ? 'Update Database' : 'Publish Problem'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------
          DIALOG: TEST CASES MANAGEMENT
          ------------------------------------------------------------ */}
      <Dialog open={isTestCasesOpen} onOpenChange={setIsTestCasesOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-card border-border rounded-2xl shadow-xl">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b border-border">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ListPlus className="text-amber-500" size={20} />
              Test Cases: {testCaseProblem?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add verification data to evaluate user submissions. Hidden test cases run in sandbox
              but are invisible to students.
            </DialogDescription>
          </DialogHeader>

          {/* Split container: List on top, form at the bottom */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Test Cases Table Scrollport */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingTestCases ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin text-amber-500" size={24} />
                  <p className="text-xs font-semibold animate-pulse">Loading test suite...</p>
                </div>
              ) : !testCases || testCases.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/5 flex flex-col items-center justify-center">
                  <BookOpen size={30} className="text-muted-foreground/50 mb-2" />
                  <p className="text-xs font-bold text-foreground">No test cases registered</p>
                  <p className="text-[10px] text-muted-foreground max-w-xs mt-0.5">
                    Submit inputs below to initialize code execution tests.
                  </p>
                </div>
              ) : (
                <div className="border border-border/50 rounded-xl overflow-hidden bg-background/30">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/80 bg-amber-500/5 text-[10px] font-bold text-muted-foreground uppercase select-none">
                        <th className="py-2.5 px-4 w-12 text-center">Order</th>
                        <th className="py-2.5 px-4">Standard Input</th>
                        <th className="py-2.5 px-4">Expected Output</th>
                        <th className="py-2.5 px-4 w-20 text-center">Visibility</th>
                        <th className="py-2.5 px-4 w-16 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 font-medium">
                      {testCases.map((tc) => (
                        <tr key={tc.id} className="hover:bg-accent/20 border-b border-border/10">
                          <td className="py-2.5 px-4 text-center font-bold text-muted-foreground">
                            {tc.order}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[10px] truncate max-w-[150px]">
                            {tc.input}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[10px] truncate max-w-[150px]">
                            {tc.expectedOutput}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={cn(
                                'inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border',
                                tc.isHidden
                                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                              )}
                            >
                              {tc.isHidden ? 'Hidden' : 'Visible'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label="Delete test case"
                              onClick={() => deleteTestCaseMutation.mutate(tc.id)}
                              className="text-rose-500 hover:bg-rose-500/10 rounded-md active:scale-95"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Test Case Add Form Area */}
            <div className="shrink-0 p-6 border-t border-border bg-muted/40 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <PlusCircle size={14} /> Add New Test Case
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Input Parameters
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. [1, 2], 3"
                    value={tcInput}
                    onChange={(e) => setTcInput(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 p-2 text-xs font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Expected Output
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 4"
                    value={tcExpectedOutput}
                    onChange={(e) => setTcExpectedOutput(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 p-2 text-xs font-mono outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Order & Hidden toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-6">
                  {/* Order Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Order:
                    </span>
                    <Input
                      type="number"
                      value={tcOrder}
                      onChange={(e) => setTcOrder(parseInt(e.target.value, 10) || 0)}
                      className="w-16 h-8 rounded-lg text-center bg-background"
                    />
                  </div>

                  {/* Hidden Toggle */}
                  <button
                    type="button"
                    onClick={() => setTcIsHidden(!tcIsHidden)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all active:scale-95',
                      tcIsHidden
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    )}
                  >
                    {tcIsHidden ? 'Hidden Sandbox Case' : 'Visible Demo Case'}
                  </button>
                </div>

                <Button
                  onClick={() => addTestCaseMutation.mutate()}
                  disabled={addTestCaseMutation.isPending || !tcInput || !tcExpectedOutput}
                  className="rounded-xl h-9 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {addTestCaseMutation.isPending && <Loader2 className="animate-spin" size={12} />}
                  <span>Register Case</span>
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 shrink-0 border-t border-border bg-muted/20 flex justify-end">
            <Button
              onClick={() => setIsTestCasesOpen(false)}
              className="rounded-xl h-10 px-6 font-semibold active:scale-95"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------
          DIALOG: DELETE CONFIRMATION
          ------------------------------------------------------------ */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md p-6 bg-card border-border rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-500">
              Confirm Problem Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you absolutely sure you want to delete this problem? This will permanently erase
              it, all associated test cases, and user submissions history. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="rounded-xl h-10 px-5 text-xs font-semibold active:scale-95 border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteProblem}
              className="rounded-xl h-10 px-6 text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold active:scale-95"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
