'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReactWorkspaceEditorPanelProps {
  files: Record<string, string>;
  activeFile: string;
  setActiveFile: (filename: string) => void;
  editorTheme: 'vs-dark' | 'light';
  fontSize: number;
  handleFileChange: (value: string | undefined) => void;
}

export function ReactWorkspaceEditorPanel({
  files,
  activeFile,
  setActiveFile,
  editorTheme,
  fontSize,
  handleFileChange,
}: ReactWorkspaceEditorPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
      {/* File Tabs Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] shrink-0 select-none overflow-x-auto scrollbar-none">
        <div className="flex">
          {Object.keys(files).map((filename) => (
            <button
              type="button"
              key={filename}
              onClick={() => setActiveFile(filename)}
              className={cn(
                'px-4 py-2 border-r border-zinc-800 text-xs font-medium font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer border-none',
                activeFile === filename
                  ? 'bg-[#1e1e1e] text-zinc-200 border-t-2 border-t-indigo-500 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
              )}
            >
              <FileCode
                size={13}
                className={activeFile === filename ? 'text-indigo-400' : 'text-zinc-600'}
              />
              {filename}
            </button>
          ))}
        </div>
        <div className="px-4 text-[9px] font-mono font-extrabold text-zinc-600 uppercase tracking-widest">
          Editor
        </div>
      </div>

      {/* Editor view */}
      <div className="flex-1 min-h-0 bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={activeFile.endsWith('.css') ? 'css' : 'javascript'}
          theme={editorTheme}
          value={files[activeFile]}
          onChange={handleFileChange}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
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
  );
}
