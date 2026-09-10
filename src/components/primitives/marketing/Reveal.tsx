'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface RevealProps {
  variant?: 'fade' | 'rise' | 'spring' | 'blur';
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
  className?: string;
  replayKey?: number;
  children?: React.ReactNode;
  fullHeight?: boolean;
  layout?: 'default' | 'fullscreen';
}

export const Reveal: React.FC<RevealProps> = ({
  variant = 'rise',
  delay = 0,
  stagger = false,
  staggerDelay = 100,
  className = '',
  replayKey = 0,
  fullHeight = false,
  layout = 'default',
  children
}) => {
  const prefersReduced = useReducedMotion();

  const getAnimVariants = () => {
    const baseDuration = prefersReduced ? 0 : 0.6;
    switch(variant) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: baseDuration, ease: 'easeOut' } },
          exit: { opacity: 0, transition: { duration: prefersReduced ? 0 : 0.2 } }
        };
      case 'spring':
        return {
          initial: { opacity: 0, y: 40, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20, duration: prefersReduced ? 0 : undefined } },
          exit: { opacity: 0, scale: 0.95, transition: { duration: prefersReduced ? 0 : 0.2 } }
        };
      case 'blur':
        return {
          initial: { opacity: 0, filter: 'blur(12px)' },
          animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: baseDuration, ease: 'easeOut' } },
          exit: { opacity: 0, filter: 'blur(4px)', transition: { duration: prefersReduced ? 0 : 0.2 } }
        };
      case 'rise':
      default:
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0, transition: { duration: baseDuration, ease: 'easeOut' } },
          exit: { opacity: 0, y: 10, transition: { duration: prefersReduced ? 0 : 0.2 } }
        };
    }
  };

  const animVariants = getAnimVariants();

  if (layout === 'fullscreen') {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`fullscreen-${variant}-${replayKey}`}
          className={className}
          initial={animVariants.initial}
          animate={{
            ...animVariants.animate,
            transition: {
              ...(animVariants.animate as any).transition,
              delay: prefersReduced ? 0 : delay / 1000
            }
          }}
          exit={animVariants.exit}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className={`relative flex flex-col gap-6 w-full items-center justify-center ${fullHeight ? 'h-full' : 'min-h-[400px]'} ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={`${replayKey}-${stagger}-${variant}`}
          className={`flex flex-col gap-6 w-full items-center ${fullHeight ? 'h-full' : ''}`}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {React.Children.map(children, (child, index) => {
            const itemDelay = (delay / 1000) + (stagger ? index * (staggerDelay / 1000) : 0);
            
            const itemAnimate = {
              ...animVariants.animate,
              transition: {
                ...(animVariants.animate as any).transition,
                delay: prefersReduced ? 0 : itemDelay
              }
            };

            return (
              <motion.div
                key={index}
                initial={animVariants.initial}
                animate={itemAnimate}
                exit={animVariants.exit}
                className="w-full flex justify-center"
              >
                {child}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
