/**
 * Long Press Target Component
 * 
 * Provides visual feedback during long-press gestures
 * with progress indicator and haptic feedback
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { useLongPress } from '@/hooks/useLongPress';
import { cn } from '@/lib/utils';

interface LongPressTargetProps {
  children: React.ReactNode;
  onLongPress: () => void;
  className?: string;
  threshold?: number;
  disabled?: boolean;
  showProgressRing?: boolean;
}

export function LongPressTarget({
  children,
  onLongPress,
  className,
  threshold = 500,
  disabled = false,
  showProgressRing = true
}: LongPressTargetProps) {
  const longPress = useLongPress(onLongPress, {
    threshold,
    enableHaptic: true,
    onStart: () => {
      // Optional: Add additional start effects
    },
    onCancel: () => {
      // Optional: Add cancel effects  
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return longPress.cleanup;
  }, [longPress.cleanup]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const { cleanup, state, ...handlers } = longPress;

  return (
    <div
      {...handlers}
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        state.isLongPressing && "scale-[0.98]",
        className
      )}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      {children}
      
      {/* Progress Ring */}
      {showProgressRing && state.isLongPressing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
          <svg
            className="absolute inset-2 w-auto h-auto"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/30"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - state.progress / 100)}`,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 0.1s ease-out'
              }}
            />
          </svg>
          
          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={cn(
                "w-3 h-3 rounded-full bg-primary transition-all duration-200",
                state.progress > 80 && "scale-125"
              )}
              style={{
                opacity: state.progress / 100
              }}
            />
          </div>
        </div>
      )}

      {/* Ripple effect */}
      {state.isLongPressing && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-primary/20 rounded-lg animate-ping"
            style={{
              animationDuration: `${threshold}ms`,
              animationIterationCount: 1
            }}
          />
        </div>
      )}
    </div>
  );
}