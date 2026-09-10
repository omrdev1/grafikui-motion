'use client';
import { useMotionValue, animate, MotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseCountUpProps {
  from: number;
  to: number;
  duration?: number;
  easing?: 'easeOut' | 'spring' | 'bounce';
}

export function useCountUp({ from, to, duration = 600, easing = 'easeOut' }: UseCountUpProps): MotionValue<number> {
  const count = useMotionValue(from);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    let transitionParams: any = {
      duration: prefersReduced ? 0 : duration / 1000,
      ease: easing === 'bounce' ? [0.175, 0.885, 0.32, 1.275] : easing 
    };

    if (easing === 'spring') {
      transitionParams = {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: prefersReduced ? 0 : undefined,
      };
    }

    const controls = animate(count, to, transitionParams);
    return controls.stop;
  }, [to, duration, easing, count, prefersReduced]);

  return count;
}
