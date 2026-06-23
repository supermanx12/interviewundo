'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { BookOpen, History, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useToast } from '@/providers';

interface ProblemDescriptionPanelProps {
  description: string;
  slug: string;
  code: string;
}

export function ProblemDescriptionPanel({ description, slug, code }: ProblemDescriptionPanelProps) {
  const { apiFetch } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // AI Hint State
  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [remainingHints, setRemainingHints] = useState<number | null>(null);

  const handleFetchHint = async () => {
    setIsHintLoading(true);
    setHintError(null);
    try {
      const response = await apiFetch<{ hint: string; remainingHints: number }>(
        `/api/problems/${slug}/hint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        },
      );
      setHint(response.hint);
      setRemainingHints(response.remainingHints);
      showSuccess('AI Hint generated!');
    } catch (err: any) {
      const msg = err.message || 'Failed to generate hint';
      setHintError(msg);
      showError(msg);
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20 shrink-0 text-xs font-semibold text-muted-foreground select-none">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} />
          Problem Description
        </div>
        <Link
          href="/submissions"
          className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1 active:scale-95 transition-all"
        >
          <History size={12} />
          Submissions History
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none scrollbar-thin">
        <ReactMarkdown>{description}</ReactMarkdown>

        {/* AI Hint Section */}
        <div className="mt-8 pt-6 border-t border-border/60 not-prose">
          <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl border border-indigo-500/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <h4 className="text-sm font-bold text-foreground">AI Conceptual Hints</h4>
              </div>
              {remainingHints !== null && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {remainingHints} / 3 remaining today
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Stuck on this problem? Ask Grok for a high-level conceptual hint. Grok will analyze
              your current code and guide you without giving away the solution.
            </p>

            {hint && (
              <div className="bg-card/40 border border-indigo-500/20 rounded-xl p-4 text-xs text-foreground leading-relaxed shadow-sm relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="absolute top-0 right-0 -mr-2 -mt-2 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <span className="inline-block text-[9px] font-bold text-indigo-400 tracking-wider uppercase mb-1.5">
                  Grok's Hint
                </span>
                <p className="font-medium text-foreground/90">{hint}</p>
              </div>
            )}

            {hintError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3.5 text-xs font-semibold leading-relaxed flex items-center gap-2">
                <span>{hintError}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                onClick={handleFetchHint}
                disabled={isHintLoading || (remainingHints !== null && remainingHints <= 0)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                {isHintLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating Hint...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Get AI Hint
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
