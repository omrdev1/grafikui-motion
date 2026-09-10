'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { motionTokens } from '../../../tokens/motion';

export type NudgeLevel = 1 | 2 | 3 | 4;

export interface NudgeProps {
  level?: NudgeLevel;
  title?: string;
  message?: string;
  action?: string;
  dismissible?: boolean;
  autoPlay?: boolean;
  className?: string;
  replayKey?: number;
}

export const Nudge: React.FC<NudgeProps> = ({
  level = 2,
  title = '',
  message = '',
  action = '',
  dismissible = true,
  autoPlay = true,
  className = '',
  replayKey = 0
}) => {
  const [isVisible, setIsVisible] = useState(autoPlay);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (autoPlay) {
      setIsVisible(true);
    }
  }, [level, title, message, autoPlay, replayKey]);

  const levelStyles: Record<NudgeLevel, string> = {
    1: 'bg-[var(--color-bg-surface)] border border-black/5',
    2: 'bg-[var(--color-bg-surface)] border border-black/10 shadow-lg',
    3: 'bg-[var(--color-bg-surface)] border border-[var(--color-accent-primary)]/30 shadow-xl',
    4: 'bg-[var(--color-bg-surface)] shadow-[0_0_30px_rgba(255,77,0,0.15)] animate-border-glow border-2'
  };

  const variants: Record<NudgeLevel, import('framer-motion').Variants> = {
    1: {
      initial: { opacity: 0 },
      animate: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.4, ease: 'easeOut' as const } },
      exit: { opacity: 0, transition: { duration: motionTokens.transition.duration } }
    },
    2: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0, transition: { duration: prefersReduced ? 0 : 0.4, ease: 'easeOut' as const } },
      exit: { opacity: 0, x: 20, transition: { duration: motionTokens.transition.duration } }
    },
    3: {
      initial: { opacity: 0, x: 40 },
      animate: { 
        opacity: 1, 
        x: 0, 
        scale: prefersReduced ? 1 : [1, 1, 1.02, 1], 
        transition: { 
          duration: prefersReduced ? 0 : 3.4,
          times: [0, 0.1, 0.9, 1],
          ease: 'easeOut' as const
        } 
      },
      exit: { opacity: 0, scale: 0.95, transition: { duration: motionTokens.transition.duration } }
    },
    4: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0, transition: { duration: prefersReduced ? 0 : 0.4, ease: 'easeOut' as const } },
      exit: { opacity: 0, x: 40, transition: { duration: motionTokens.transition.duration } }
    }
  };

  return (
    <div className={`relative w-full max-w-[380px] min-h-[140px] flex justify-end items-end ${className}`}>
      <AnimatePresence mode="popLayout">
        {isVisible && (
          <motion.div
            key={`${level}-${replayKey}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants[level]}
            style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
            className={`w-full p-4 rounded-xl flex gap-4 ${levelStyles[level]}`}
          >
            {level === 4 && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-ping" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-display font-medium text-[var(--color-text-primary)] m-0 mb-1 leading-snug">
                {title}
              </h4>
              <p className="text-[13px] text-[var(--color-text-muted)] m-0 leading-relaxed">
                {message}
              </p>
              {action && (
                <button className="mt-3 text-[13px] font-mono text-[var(--color-accent-primary)] hover:brightness-125 transition-colors uppercase tracking-wider">
                  {action}
                </button>
              )}
            </div>

            {dismissible && (
              <button 
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 -mt-1 -mr-1 self-start"
                aria-label="Dismiss"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
