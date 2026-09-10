'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export type ComponentState = 'empty' | 'loading' | 'partial' | 'complete' | 'error';

interface StateProps {
  initialState?: ComponentState;
  transitionSpeed?: 'fast' | 'normal' | 'slow';
  autoCycle?: boolean;
  className?: string;
  onStateChange?: (s: ComponentState) => void;
}

const STATES: ComponentState[] = ['empty', 'loading', 'partial', 'complete', 'error'];

export const State: React.FC<StateProps> = ({
  initialState = 'empty',
  transitionSpeed = 'normal',
  autoCycle = false,
  className = '',
  onStateChange
}) => {
  const [currentState, setCurrentState] = useState<ComponentState>(initialState);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setCurrentState(initialState);
  }, [initialState]);

  useEffect(() => {
    if (!autoCycle) return;
    
    let isSubscribed = true;
    const cycle = async () => {
      while (isSubscribed) {
        await new Promise(r => setTimeout(r, 1200));
        if (!isSubscribed) break;
        setCurrentState(prev => {
          const nextIdx = (STATES.indexOf(prev) + 1) % STATES.length;
          const nextState = STATES[nextIdx];
          if (onStateChange) onStateChange(nextState);
          return nextState;
        });
      }
    };
    cycle();
    return () => { isSubscribed = false; };
  }, [autoCycle, onStateChange]);

  const getDuration = () => {
    if (prefersReduced) return 0;
    if (transitionSpeed === 'fast') return 0.15;
    if (transitionSpeed === 'slow') return 0.5;
    return 0.3;
  };

  const variants: any = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: getDuration(), ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      transition: { duration: prefersReduced ? 0 : 0.2, ease: 'easeIn' } 
    },
    error: {
      opacity: 1,
      scale: 1,
      x: prefersReduced ? 0 : [0, -8, 8, -6, 6, -4, 4, 0],
      transition: { 
        duration: prefersReduced ? 0 : 0.4, 
        ease: 'easeInOut',
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1]
      }
    }
  };

  const renderContent = () => {
    switch(currentState) {
      case 'empty':
        return (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-black/10 rounded-xl h-48 text-center text-[var(--color-text-muted)] gap-3 bg-[var(--color-bg-base)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="text-sm font-display">No media connected</span>
          </div>
        );
      case 'loading':
        return (
          <div className="flex flex-col gap-4 p-6 border border-black/5 rounded-xl h-48 bg-[var(--color-bg-surface)]">
            <div className="h-4 w-1/3 bg-black/5 rounded animate-pulse" />
            <div className="space-y-3 mt-4">
              <div className="h-2 w-full bg-black/5 rounded animate-pulse" />
              <div className="h-2 w-5/6 bg-black/5 rounded animate-pulse" />
              <div className="h-2 w-4/6 bg-black/5 rounded animate-pulse" />
            </div>
          </div>
        );
      case 'partial':
        return (
          <div className="flex flex-col gap-4 p-6 border border-black/5 rounded-xl h-48 bg-[var(--color-bg-surface)]">
            <div className="flex justify-between items-center text-sm">
              <span className="font-display">Uploading assets...</span>
              <span className="font-mono text-[var(--color-text-muted)]">45%</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--color-bg-base)] rounded-full overflow-hidden mt-2">
              <div className="h-full w-[45%] bg-[var(--color-accent-primary)] rounded-full" />
            </div>
            <div className="text-[12px] text-[var(--color-text-muted)] mt-auto">
              2 of 5 files complete
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="flex flex-col items-center justify-center p-6 border border-[var(--color-accent-primary)]/30 rounded-xl h-48 bg-[var(--color-accent-primary)]/5 text-[var(--color-text-primary)] gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)]/20 flex items-center justify-center text-[var(--color-accent-primary)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="text-sm font-display font-medium">Processing complete</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col justify-center p-6 border border-red-500/30 rounded-xl h-48 bg-red-500/5 text-red-200 gap-3">
            <div className="flex items-center gap-2 text-red-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className="text-sm font-display font-medium leading-none mt-0.5">Connection failed</span>
            </div>
            <p className="text-sm text-red-300/70 m-0">
              The server rejected the payload. Please check your network and try again.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full max-w-[340px] relative ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentState}
          initial="initial"
          animate={currentState === 'error' && !prefersReduced ? 'error' : 'animate'}
          exit="exit"
          variants={variants}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
