'use client';
import React, { useState, useEffect } from 'react';
import { useTransform, useMotionValueEvent } from 'framer-motion';
import { useCountUp } from '../../../hooks/useCountUp';

interface CountProps {
  value: number;
  format?: 'integer' | 'percentage' | 'currency' | 'score';
  easing?: 'easeOut' | 'spring' | 'bounce';
  duration?: number;
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

export const Count: React.FC<CountProps> = ({
  value,
  format = 'integer',
  easing = 'easeOut',
  duration = 600,
  prefix = '',
  suffix = '',
  size = 'lg',
  className = ''
}) => {
  const rawCount = useCountUp({
    from: 0,
    to: value,
    duration,
    easing
  });

  const formattedValue = useTransform(rawCount, (latest: number) => {
    let num = latest;
    
    if (format === 'integer' || format === 'score' || format === 'percentage') {
      num = Math.round(latest);
    }

    if (format === 'currency') {
      return `${prefix}${num.toFixed(2)}${suffix}`;
    }
    if (format === 'percentage') {
      return `${prefix}${num}%${suffix}`;
    }
    if (format === 'score') {
      return `${prefix}${num.toLocaleString()}${suffix}`;
    }
    
    return `${prefix}${num}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState<string>('');
  
  useEffect(() => {
    // initialize on first format
    setDisplayValue(formattedValue.get() as string);
  }, []);

  useMotionValueEvent(formattedValue, "change", (latest) => setDisplayValue(latest as string));

  const sizeClasses = {
    none: '',
    sm: 'text-4xl md:text-5xl',
    md: 'text-6xl md:text-8xl',
    lg: 'text-6xl sm:text-7xl md:text-[160px] tracking-tighter leading-none whitespace-nowrap'
  };

  // Pre-calculate the final placeholder text so the DOM width locks perfectly.
  let placeholder = `${value}`;
  if (format === 'integer' || format === 'score') placeholder = `${value.toLocaleString()}`;
  if (format === 'percentage') placeholder = `${value}%`;
  if (format === 'currency') placeholder = `${value.toFixed(2)}`;
  placeholder = `${prefix}${placeholder}${suffix}`;

  return (
    <span className={`relative inline-flex items-center justify-center font-display font-medium text-[var(--color-text-primary)] tabular-nums ${sizeClasses[size] || ''} ${className}`}>
      {/* Invisible placeholder of the FINAL value locks the DOM width to its max extent instantly */}
      <span style={{ visibility: 'hidden' }} className="pointer-events-none select-none">{placeholder}</span>
      <span className="absolute inset-0 flex items-center justify-center">{displayValue}</span>
    </span>
  );
};
