import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, Terminal, Sparkles, Loader2, Play, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProblemEditorPanelProps {
  code: string;
  setCode: (val: string) => void;
  editorConfig: { language: string; filename: string };
  editorTheme: 'vs-dark' | 'light';
  fontSize: number;
  consoleTab: 'testcases' | 'result';
  setConsoleTab: (tab: 'testcases' | 'result') => void;
  isRunning: boolean;
  isSubmitting: boolean;
  consoleOutput: {
    status: string;
    stdout?: string;
    stderr?: string;
    passed?: boolean;
    error?: string;
  } | null;
  handleRunCode: () => void;
  handleSubmitCode: () => void;
  category: string;
}

export function ProblemEditorPanel({
  code,
  setCode,
  editorConfig,
  editorTheme,
  fontSize,
  consoleTab,
  setConsoleTab,
  isRunning,
  isSubmitting,
  consoleOutput,
  handleRunCode,
  handleSubmitCode,
  category,
}: ProblemEditorPanelProps) {
  // Timer Local States
  const [timerTime, setTimerTime] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPausePlay = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimerRunning(true);
    } else if (timerRunning) {
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    setTimerTime(0);
    setTimerRunning(false);
    setTimerStarted(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
      {/* Top Panel: Monaco Editor */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-[#181818] shrink-0 text-xs font-semibold text-zinc-400 select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-zinc-300">
              <FileCode size={13} className="text-zinc-400" />
              {editorConfig.filename}
            </div>

            {/* Timer Capsule UI */}
            <div className="flex items-center gap-2.5 bg-[#252526] border border-zinc-800/80 px-3 py-1 rounded-lg text-zinc-300 font-mono text-[10px]">
              <span className="text-emerald-400 font-bold tracking-tight select-none w-10 text-center">
                {formatTime(timerTime)}
              </span>
              <span className="w-px h-3 bg-zinc-800" />
              <button
                type="button"
                onClick={handleStartPausePlay}
                className={cn(
                  'font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer',
                  !timerStarted
                    ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'
                    : timerRunning
                      ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10'
                      : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10',
                )}
              >
                {!timerStarted ? 'Start' : timerRunning ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-[#2a2a2a]/60 border border-zinc-800/80 px-2.5 py-1 rounded text-zinc-400 font-mono text-[9px] select-none uppercase tracking-wider font-extrabold">
            {category}
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={editorConfig.language}
            theme={editorTheme}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: fontSize,
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              automaticLayout: true,
              fontFamily:
                'Fira Code, JetBrains Mono, source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
              fontLigatures: true,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      </div>

      {/* Bottom Panel: Tabbed Console/Output */}
      <div className="h-60 border-t border-border flex flex-col bg-[#151515] shrink-0 min-h-0">
        {/* Console Header */}
        <div className="flex items-center justify-between border-b border-border bg-[#111111] px-6 py-2 shrink-0 select-none">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setConsoleTab('testcases')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
                consoleTab === 'testcases'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Terminal size={12} />
              Test Cases
            </button>
            <button
              type="button"
              onClick={() => setConsoleTab('result')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
                consoleTab === 'result'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              <Sparkles size={12} />
              Result
            </button>
          </div>

          {/* Console Execution Controls */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="h-8.5 px-3 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold active:scale-95 transition-all"
            >
              {isRunning ? (
                <Loader2 size={13} className="animate-spin mr-1" />
              ) : (
                <Play size={12} className="mr-1.5 fill-current" />
              )}
              Run Code
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitCode}
              disabled={isRunning || isSubmitting}
              className="h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold active:scale-95 shadow-sm shadow-emerald-600/10 hover:shadow-emerald-500/20 border-transparent transition-all"
            >
              {isSubmitting ? (
                <Loader2 size={13} className="animate-spin mr-1" />
              ) : (
                <Send size={12} className="mr-1.5" />
              )}
              Submit
            </Button>
          </div>
        </div>

        {/* Console Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 font-mono text-xs text-zinc-300 leading-normal scrollbar-thin">
          {consoleTab === 'testcases' ? (
            <div className="space-y-4">
              <div>
                <div className="text-zinc-500 font-bold mb-1 text-[10px] uppercase select-none">
                  Test Case Example
                </div>
                <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300">
                  Input: nums = [2, 7, 11, 15], target = 9
                </pre>
              </div>
              <div>
                <div className="text-zinc-500 font-bold mb-1 text-[10px] uppercase select-none">
                  Expected Output
                </div>
                <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300">
                  [0, 1]
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              {isRunning ? (
                <div className="flex items-center justify-center gap-2 text-zinc-400 py-6 select-none animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  Executing code against test cases...
                </div>
              ) : isSubmitting ? (
                <div className="flex items-center justify-center gap-2 text-zinc-400 py-6 select-none animate-pulse">
                  <Loader2 size={14} className="animate-spin text-emerald-500" />
                  Submitting solution to judge queue...
                </div>
              ) : consoleOutput ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 select-none">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase',
                        consoleOutput.status === 'Accepted' ||
                          consoleOutput.status === 'Finished' ||
                          consoleOutput.status === 'SUCCESS' ||
                          consoleOutput.status === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                      )}
                    >
                      {consoleOutput.status}
                    </span>
                  </div>
                  <pre className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {consoleOutput.stdout}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-10 select-none">
                  Run or Submit code to inspect runtime execution results.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
