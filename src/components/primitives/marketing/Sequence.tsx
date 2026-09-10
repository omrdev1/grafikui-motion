'use client';
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SequenceProps {
  children: React.ReactNode;
  /** The destination animation properties (gsap.to) */
  animate?: gsap.TweenVars;
  /** The starting animation properties (gsap.from) */
  initial?: gsap.TweenVars;
  /** Configuration for ScrollTrigger. Set to true for default, or pass an object. */
  scrollTrigger?: boolean | ScrollTrigger.Vars;
  /** Pass a number or stagger object to stagger immediate children instead of the container */
  staggerChildren?: number | gsap.StaggerVars;
  className?: string;
  style?: React.CSSProperties;
  /** The HTML tag to render. Defaults to 'div'. */
  as?: React.ElementType;
}

/**
 * @grafikui/motion - Sequence Primitive
 * A standardized GSAP wrapper for complex timeline and scroll-triggered animations.
 * Provides flawless cleanup and zero memory leaks via gsap.context().
 */
export const Sequence: React.FC<SequenceProps> = ({
  children,
  animate = { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  initial = { opacity: 0, y: 24 },
  scrollTrigger = true,
  staggerChildren,
  className = '',
  style,
  as: Component = 'div',
}) => {
  const elRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!elRef.current) return;

    if (prefersReduced) {
      gsap.set(staggerChildren !== undefined ? elRef.current.children : elRef.current, animate);
      return;
    }

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = { ...animate };
      
      if (scrollTrigger) {
        vars.scrollTrigger = typeof scrollTrigger === 'boolean' 
          ? { trigger: elRef.current, start: 'top 80%' } 
          : { trigger: elRef.current, ...scrollTrigger };
      }

      if (staggerChildren !== undefined) {
        vars.stagger = staggerChildren;
        gsap.fromTo(elRef.current!.children, initial, vars);
      } else {
        gsap.fromTo(elRef.current, initial, vars);
      }
    }, elRef);

    return () => ctx.revert();
  }, [animate, initial, scrollTrigger]);

  const Comp = Component as any;

  return (
    <Comp ref={elRef} className={className} style={style}>
      {children}
    </Comp>
  );
};

/**
 * A custom hook to safely execute bespoke GSAP timelines (like Hero headers)
 * with automatic cleanup.
 */
export function useSequence(callback: (context: gsap.Context) => void, dependencies: React.DependencyList = []) {
  useLayoutEffect(() => {
    const ctx = gsap.context((context) => {
      callback(context);
    });
    return () => ctx.revert();
  }, dependencies);
}
