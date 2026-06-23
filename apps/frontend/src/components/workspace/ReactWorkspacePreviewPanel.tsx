'use client';

import React from 'react';
import { Eye, Terminal, Sparkles, Loader2, Play, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

interface ReactWorkspacePreviewPanelProps {
  previewSrcdoc: string;
  consoleLogs: ConsoleLog[];
  setConsoleLogs: React.Dispatch<React.SetStateAction<ConsoleLog[]>>;
  rightTab: 'preview' | 'console' | 'result';
  setRightTab: (tab: 'preview' | 'console' | 'result') => void;
  isRunning: boolean;
  isSubmitting: boolean;
  consoleOutput: {
    status: string;
    stdout?: string;
    passed?: boolean;
    error?: string;
  } | null;
  handleRunCode: () => void;
  handleSubmitCode: () => void;
}

export function ReactWorkspacePreviewPanel({
  previewSrcdoc,
  consoleLogs,
  setConsoleLogs,
  rightTab,
  setRightTab,
  isRunning,
  isSubmitting,
  consoleOutput,
  handleRunCode,
  handleSubmitCode,
}: ReactWorkspacePreviewPanelProps) {
  return (
    <div className="w-full h-full flex flex-col bg-[#121212] overflow-hidden">
      {/* Header tabs for Right Panel */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] shrink-0 select-none">
        <div className="flex">
          <button
            type="button"
            onClick={() => setRightTab('preview')}
            className={cn(
              'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
              rightTab === 'preview'
                ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <Eye size={13} />
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setRightTab('console')}
            className={cn(
              'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
              rightTab === 'console'
                ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <Terminal size={13} />
            Console logs
            {consoleLogs.length > 0 && (
              <span className="ml-1 bg-amber-500/20 text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                {consoleLogs.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setRightTab('result')}
            className={cn(
              'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none',
              rightTab === 'result'
                ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <Sparkles size={13} />
            Sandbox Result
          </button>
        </div>
        {rightTab === 'console' && consoleLogs.length > 0 && (
          <button
            type="button"
            onClick={() => setConsoleLogs([])}
            className="px-3 text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer active:scale-95 transition-all border-none bg-transparent"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right tab content */}
      <div className="flex-1 relative overflow-hidden min-h-0 bg-[#121212]">
        {rightTab === 'preview' && (
          <div className="w-full h-full bg-[#121212] flex flex-col">
            {previewSrcdoc ? (
              <iframe
                title="Live Preview Sandbox"
                srcDoc={previewSrcdoc}
                sandbox="allow-scripts"
                className="w-full h-full bg-[#121212] border-0"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2 select-none">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">Loading Live Sandbox...</span>
              </div>
            )}
          </div>
        )}

        {rightTab === 'console' && (
          <div className="w-full h-full overflow-y-auto px-5 py-4 font-mono text-[11px] space-y-2.5 scrollbar-thin bg-[#151515]">
            {consoleLogs.length === 0 ? (
              <div className="text-zinc-600 text-center py-10 select-none">
                No console messages. Call console.log() in your code to view logs.
              </div>
            ) : (
              consoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    'pb-1.5 border-b border-zinc-900/60 leading-relaxed flex items-start gap-2',
                    log.level === 'error' && 'text-rose-400',
                    log.level === 'warn' && 'text-amber-400',
                    log.level === 'info' && 'text-cyan-400',
                    log.level === 'log' && 'text-zinc-300',
                  )}
                >
                  <span className="opacity-45 text-[9px] shrink-0 font-sans mt-0.5 select-none">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span className="font-extrabold uppercase text-[8px] tracking-wider px-1.5 rounded shrink-0 select-none bg-zinc-900 border border-zinc-800">
                    {log.level}
                  </span>
                  <pre className="whitespace-pre-wrap word-break-all font-mono">{log.message}</pre>
                </div>
              ))
            )}
          </div>
        )}

        {rightTab === 'result' && (
          <div className="w-full h-full overflow-y-auto px-6 py-5 font-mono text-xs text-zinc-300 leading-normal scrollbar-thin bg-[#151515]">
            {isRunning ? (
              <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span>Executing code against JSDOM test cases...</span>
              </div>
            ) : isSubmitting ? (
              <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span>Submitting solution to judge worker queue...</span>
              </div>
            ) : consoleOutput ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 select-none">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border',
                      consoleOutput.status === 'Accepted' ||
                        consoleOutput.status === 'Finished' ||
                        consoleOutput.status === 'ACCEPTED' ||
                        consoleOutput.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    )}
                  >
                    {consoleOutput.status}
                  </span>
                </div>
                <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {consoleOutput.stdout}
                </pre>
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-10 select-none">
                Run or Submit code to inspect sandbox test case execution results.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Console Execution Controls footer in panel 3 */}
      <div className="border-t border-zinc-800 bg-[#151515] px-6 py-3 flex items-center justify-between shrink-0 select-none">
        <div className="text-[10px] font-mono text-zinc-500">Ctrl+Enter to Run Code</div>
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
    </div>
  );
}
