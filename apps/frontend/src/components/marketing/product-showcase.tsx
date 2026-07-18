'use client';

import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Play, CheckCircle2 } from 'lucide-react';
import { SHOWCASE_PROBLEMS, type ShowcaseProblem } from './showcase-problems';
import { highlightCodesBatch } from '@/lib/shiki-highlighter';

type SubmissionPhase = 'HIDDEN' | 'RUNNING' | 'RESULT';

export function ProductShowcase() {
  const [problems, setProblems] = useState<ShowcaseProblem[]>(SHOWCASE_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<SubmissionPhase>('HIDDEN');

  const sectionRef = useRef<HTMLElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const typedRef = useRef<Typed | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isIntersecting, setIsIntersecting] = useState(true);
  const isIntersectingRef = useRef(true);
  const typingPhaseRef = useRef<'TYPING' | 'PAUSED' | 'ERASING'>('PAUSED');

  const triggerRunCycle = () => {
    if (phase === 'RUNNING') return;

    const currentProblem = problems[currentIndex];
    const targetHtml = currentProblem.highlightedHtml || currentProblem.code;

    if (typedRef.current) {
      typedRef.current.destroy();
      typedRef.current = null;
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = targetHtml;
    }
    typingPhaseRef.current = 'PAUSED';

    if (tlRef.current) {
      tlRef.current.seek('runStart');
      tlRef.current.play();
    }
  };

  // Pre-highlight Shiki tokens on mount
  useEffect(() => {
    let isMounted = true;
    highlightCodesBatch(SHOWCASE_PROBLEMS.map((p) => p.code))
      .then((htmls) => {
        if (!isMounted) return;
        setProblems((prev) =>
          prev.map((p, idx) => ({
            ...p,
            highlightedHtml: htmls[idx],
          })),
        );
      })
      .catch((err) => {
        console.error('Shiki highlight failed:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // IntersectionObserver for pausing/resuming animation when scrolled out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    isIntersectingRef.current = isIntersecting;
    if (isIntersecting) {
      if (tlRef.current && tlRef.current.paused()) {
        tlRef.current.resume();
      }
      if (typedRef.current && typingPhaseRef.current !== 'PAUSED') {
        typedRef.current.start();
      }
    } else {
      if (tlRef.current && !tlRef.current.paused()) {
        tlRef.current.pause();
      }
      if (typedRef.current && typingPhaseRef.current !== 'PAUSED') {
        typedRef.current.stop();
      }
    }
  }, [isIntersecting]);

  // Master GSAP + Typed.js cycle
  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous instances
    if (typedRef.current) {
      typedRef.current.destroy();
      typedRef.current = null;
    }
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const currentProblem = problems[currentIndex];
    const targetHtml = currentProblem.highlightedHtml || currentProblem.code;

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Phase 1: Typing
    tl.call(() => {
      if (!editorRef.current) return;
      if (typedRef.current) typedRef.current.destroy();

      typingPhaseRef.current = 'TYPING';
      typedRef.current = new Typed(editorRef.current, {
        strings: [targetHtml, ''],
        typeSpeed: 38,
        backSpeed: 16,
        contentType: 'html',
        showCursor: true,
        cursorChar: '▋',
        onStringTyped: (pos, self) => {
          if (pos === 0) {
            typingPhaseRef.current = 'PAUSED';
            self.stop();
            tlRef.current?.resume();
          }
        },
        onComplete: (self) => {
          typingPhaseRef.current = 'PAUSED';
          tlRef.current?.resume();
        },
      });

      if (!isIntersectingRef.current) {
        typedRef.current.stop();
        tl.pause();
      }
    });

    tl.addPause('typingDone');

    // Phase 2: Pause after typing completes
    tl.to({}, { duration: 0.8 });

    // Phase 3: Show "Running..."
    tl.addLabel('runStart');
    tl.call(() => setPhase('RUNNING'));
    tl.to({}, { duration: 1.2 });

    // Phase 4: Show result
    tl.call(() => setPhase('RESULT'));
    tl.to({}, { duration: 2.5 });

    // Phase 5: Erase code
    tl.addLabel('eraseStart');
    tl.call(() => {
      if (!editorRef.current) return;
      typingPhaseRef.current = 'ERASING';

      if (!typedRef.current) {
        const currentProblem = problems[currentIndex];
        const targetHtml = currentProblem.highlightedHtml || currentProblem.code;
        typedRef.current = new Typed(editorRef.current, {
          strings: [targetHtml, ''],
          typeSpeed: 0,
          backSpeed: 16,
          contentType: 'html',
          showCursor: true,
          cursorChar: '▋',
          onComplete: () => {
            typingPhaseRef.current = 'PAUSED';
            tlRef.current?.resume();
          },
        });
        typedRef.current.start();
      } else {
        typedRef.current.start();
      }

      if (!isIntersectingRef.current && typedRef.current) {
        typedRef.current.stop();
      }
    });

    tl.addPause('erasingDone');

    // Phase 6: Transition to next problem
    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      setPhase('HIDDEN');
      setCurrentIndex((prev) => (prev + 1) % problems.length);
    });

    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
        typedRef.current = null;
      }
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [currentIndex, problems]);

  const currentProblem = problems[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-[1200px] mx-auto px-6 relative mt-8 mb-24 z-10"
    >
      {/* Product Mockup Container */}
      <div className="relative rounded-[16px] bg-[#191919] border border-white/5 overflow-hidden shadow-[0_0_44px_rgba(0,0,0,0.8)] h-[500px] sm:h-[580px] md:h-[640px] lg:h-auto lg:aspect-video flex flex-col">
        {/* Top bar */}
        <div className="h-12 border-b border-[#525252]/30 flex items-center px-4 gap-4 bg-[#131313]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProblem.breadcrumb}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#191919] text-[#868f97] text-xs font-medium px-6 py-1.5 rounded-full border border-white/5"
              >
                {currentProblem.breadcrumb}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="w-16 hidden md:block" />
        </div>

        {/* Main Workspace layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-[#525252]/30 bg-[#131313] p-4 hidden md:flex flex-col gap-1">
            <div className="text-[#868f97] text-xs font-semibold mb-2 uppercase tracking-wider">
              Menu
            </div>
            {['Dashboard', 'Problems', 'Submissions', 'Progress', 'Analytics', 'Settings'].map(
              (item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-[10px] text-sm font-medium ${
                    i === 1
                      ? 'bg-[#191919] text-white border border-white/5'
                      : 'text-[#868f97] hover:text-[#cccccc]'
                  }`}
                >
                  {item}
                </div>
              ),
            )}

            <div className="mt-auto">
              <div className="flex items-center gap-3 p-2 bg-[#0b0b0b] rounded-[10px] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#479ffa] to-[#191919]" />
                <div>
                  <div className="text-white text-xs font-medium">Dev User</div>
                  <div className="text-[#868f97] text-[10px]">dev@example.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Area */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-[#525252]/30 bg-[#191919]">
            <div className="p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProblem.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl text-white font-bold tracking-tight">
                      {currentProblem.title}
                    </h2>
                    <motion.span
                      key={`${currentProblem.title}-badge`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        currentProblem.difficulty === 'Easy'
                          ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20'
                          : currentProblem.difficulty === 'Medium'
                            ? 'bg-[#e5a158]/10 text-[#e5a158] border-[#e5a158]/20'
                            : 'bg-[#f85149]/10 text-[#f85149] border-[#f85149]/20'
                      }`}
                    >
                      {currentProblem.difficulty}
                    </motion.span>
                  </div>
                  <p className="text-[#cccccc] text-sm mb-8">{currentProblem.description}</p>

                  <div className="text-white text-sm font-semibold mb-3">Example</div>
                  <div className="bg-[#0b0b0b] border border-white/5 rounded-[10px] p-4 mb-6">
                    <div className="text-[#868f97] text-xs mb-2">Input</div>
                    <code className="text-[#479ffa] font-mono text-sm">
                      {currentProblem.example.input}
                    </code>
                    <div className="text-[#868f97] text-xs mt-4 mb-2">Output</div>
                    <code className="text-[#479ffa] font-mono text-sm">
                      {currentProblem.example.output}
                    </code>
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {phase !== 'HIDDEN' && (
                  <motion.div
                    key="submission-result-section"
                    initial={{ opacity: 0, height: 0, y: 12 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 12 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden mt-6"
                  >
                    <div className="text-white text-sm font-semibold mb-3">Submission Result</div>
                    <div className="min-h-[92px] flex items-center">
                      <AnimatePresence mode="wait">
                        {phase === 'RUNNING' && (
                          <motion.div
                            key="running"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="w-full bg-[#479ffa]/5 border border-[#479ffa]/20 rounded-[10px] p-4 flex items-center gap-3"
                          >
                            <Loader2 className="w-5 h-5 text-[#479ffa] animate-spin shrink-0" />
                            <div>
                              <div className="text-[#479ffa] font-medium text-sm">
                                Running test cases...
                              </div>
                              <div className="text-[#868f97] text-xs mt-0.5">
                                Executing against 42 test cases in sandbox
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {phase === 'RESULT' && (
                          <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="w-full bg-[#4ebe96]/5 border border-[#4ebe96]/20 rounded-[10px] p-4 flex flex-col gap-4 result-glow"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#4ebe96] shadow-[0_0_8px_#4ebe96]" />
                              <span className="text-[#4ebe96] font-medium text-sm">Accepted</span>
                            </div>
                            <div className="flex gap-8 text-sm">
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                              >
                                <div className="text-[#868f97] text-xs">Runtime</div>
                                <div className="text-white font-mono mt-1">
                                  {currentProblem.result.runtime}
                                </div>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.2 }}
                              >
                                <div className="text-[#868f97] text-xs">Memory</div>
                                <div className="text-white font-mono mt-1">
                                  {currentProblem.result.memory}
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Action Bar (< lg) */}
            <div className="lg:hidden h-14 border-t border-[#525252]/30 bg-[#131313] px-4 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={triggerRunCycle}
                disabled={phase === 'RUNNING'}
                className="px-3.5 py-1.5 rounded-[8px] bg-[#191919] hover:bg-[#252525] active:scale-95 text-[#cccccc] hover:text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {phase === 'RUNNING' ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#479ffa] animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#479ffa] fill-[#479ffa]/20" />
                )}
                Run Code
              </button>
              <button
                type="button"
                onClick={triggerRunCycle}
                disabled={phase === 'RUNNING'}
                className="px-4 py-1.5 rounded-[8px] bg-[#4ebe96]/15 hover:bg-[#4ebe96]/25 active:scale-95 text-[#4ebe96] hover:text-white text-xs font-semibold border border-[#4ebe96]/30 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(78,190,150,0.15)] cursor-pointer"
              >
                {phase === 'RUNNING' ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#4ebe96] animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 hidden lg:flex flex-col min-w-0 bg-[#0b0b0b] relative">
            <div className="h-10 border-b border-[#525252]/30 flex items-center px-4 justify-between bg-[#131313]">
              <div className="text-[#868f97] text-xs font-mono">solution.js</div>
              <div className="text-[#479ffa] text-xs font-mono">JavaScript</div>
            </div>
            <div className="p-4 font-mono text-sm leading-loose overflow-hidden flex-1 relative">
              <div ref={editorRef} className="showcase-editor text-sm font-mono overflow-hidden" />
            </div>

            {/* Code Editor Bottom Action Bar (>= lg) */}
            <div className="h-14 border-t border-[#525252]/30 bg-[#131313] px-4 flex items-center justify-between shrink-0 z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={
                    phase === 'RESULT'
                      ? { scale: [1, 1.06, 1], borderColor: 'rgba(78, 190, 150, 0.4)' }
                      : { scale: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }
                  }
                  transition={{ duration: 0.4 }}
                  className="px-3 py-1.5 bg-[#0b0b0b] border rounded-full flex items-center gap-2 shadow-inner"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ebe96] shadow-[0_0_8px_#4ebe96] animate-pulse" />
                  <span className="text-[#cccccc] text-xs font-mono">Node.js 22</span>
                </motion.div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={triggerRunCycle}
                  disabled={phase === 'RUNNING'}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#191919] hover:bg-[#252525] active:scale-95 text-[#cccccc] hover:text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  {phase === 'RUNNING' ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#479ffa] animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-[#479ffa] fill-[#479ffa]/20" />
                  )}
                  Run Code
                </button>
                <button
                  type="button"
                  onClick={triggerRunCycle}
                  disabled={phase === 'RUNNING'}
                  className="px-4 py-1.5 rounded-[8px] bg-[#4ebe96]/15 hover:bg-[#4ebe96]/25 active:scale-95 text-[#4ebe96] hover:text-white text-xs font-semibold border border-[#4ebe96]/30 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(78,190,150,0.15)] cursor-pointer"
                >
                  {phase === 'RUNNING' ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#4ebe96] animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
