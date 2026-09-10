'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface ArcProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  easing?: 'easeOut' | 'spring' | 'linear';
  duration?: number;
  completionBehaviour?: 'none' | 'pulse' | 'glow';
  className?: string;
}

export const Arc: React.FC<ArcProps> = ({
  value,
  size = 200,
  strokeWidth = 12,
  color = 'var(--color-accent-primary)',
  showLabel = true,
  easing = 'easeOut',
  duration = 600,
  completionBehaviour = 'pulse',
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const pathLength = 2 * Math.PI * radius;
  
  const animatedValue = useMotionValue(0);
  const motionRounded = useTransform(animatedValue, Math.round);
  const dashoffset = useTransform(animatedValue, (v: number) => pathLength - (v / 100) * pathLength);
  
  const [isComplete, setIsComplete] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);

  useMotionValueEvent(motionRounded, "change", (latest) => setDisplayPercent(latest));

  useEffect(() => {
    let transitionParams: any = {
      duration: prefersReducedMotion ? 0 : duration / 1000,
    };
    
    if (easing === 'spring') {
      transitionParams = {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: prefersReducedMotion ? 0 : undefined,
      };
    } else {
      transitionParams.ease = easing;
    }

    const controls = animate(animatedValue, value, {
      ...transitionParams,
      onComplete: () => {
        if (value === 100) setIsComplete(true);
      }
    });
    
    if (value < 100) setIsComplete(false);

    return controls.stop;
  }, [value, duration, easing, animatedValue, prefersReducedMotion]);

  const pulseVariant = {
    complete: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    incomplete: { scale: 1 }
  };

  const glowVariant = {
    complete: {
      filter: `drop-shadow(0px 0px 12px ${color})`,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    incomplete: {
      filter: `drop-shadow(0px 0px 0px transparent)`,
      transition: { duration: 0.2 }
    }
  };

  let activeVariant: any = {};
  if (completionBehaviour === 'pulse') activeVariant = pulseVariant;
  if (completionBehaviour === 'glow') activeVariant = glowVariant;

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={`Progress: ${value}%`}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        initial="incomplete"
        animate={isComplete && !prefersReducedMotion ? "complete" : "incomplete"}
        variants={completionBehaviour !== 'none' ? activeVariant : undefined}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${pathLength} ${pathLength}`}
          style={{ strokeDashoffset: dashoffset }}
        />
      </motion.svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center font-ui text-4xl text-[var(--color-text-primary)] tracking-tighter">
          <span>{displayPercent}</span>
          <span className="text-sm text-[var(--color-text-muted)] mt-1">%</span>
        </div>
      )}
    </div>
  );
};
