/**
 * Long Press Hook for Mobile Touch Interactions
 * 
 * Provides long-press detection with visual feedback and haptic support
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { useCallback, useRef, useState } from 'react';

interface LongPressOptions {
  threshold?: number; // Duration in ms (default: 500ms)
  onStart?: () => void; // Called when long-press starts
  onFinish?: () => void; // Called when long-press completes
  onCancel?: () => void; // Called when long-press is cancelled
  enableHaptic?: boolean; // Enable haptic feedback
}

interface LongPressState {
  isLongPressing: boolean;
  progress: number; // 0-100 progress percentage
}

export function useLongPress(
  onLongPress: () => void,
  options: LongPressOptions = {}
) {
  const {
    threshold = 500,
    onStart,
    onFinish,
    onCancel,
    enableHaptic = true
  } = options;

  const [state, setState] = useState<LongPressState>({
    isLongPressing: false,
    progress: 0
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout>();

  const triggerHaptic = useCallback(() => {
    if (enableHaptic && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [enableHaptic]);

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min((elapsed / threshold) * 100, 100);
    
    setState(prev => ({ ...prev, progress }));
    
    if (progress < 100) {
      progressTimerRef.current = setTimeout(updateProgress, 16); // ~60fps
    }
  }, [threshold]);

  const start = useCallback(() => {
    if (state.isLongPressing) return;

    startTimeRef.current = Date.now();
    setState({ isLongPressing: true, progress: 0 });
    onStart?.();
    triggerHaptic();

    // Start progress tracking
    updateProgress();

    // Set completion timer
    timerRef.current = setTimeout(() => {
      setState({ isLongPressing: false, progress: 100 });
      onFinish?.();
      triggerHaptic();
      onLongPress();
    }, threshold);
  }, [state.isLongPressing, onStart, triggerHaptic, updateProgress, threshold, onFinish, onLongPress]);

  const cancel = useCallback(() => {
    if (!state.isLongPressing) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    setState({ isLongPressing: false, progress: 0 });
    onCancel?.();
  }, [state.isLongPressing, onCancel]);

  const handlers = {
    // Touch events (mobile)
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      start();
    },
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onTouchCancel: cancel,

    // Mouse events (desktop fallback)
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,

    // Context menu (right-click fallback)
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      if (!state.isLongPressing) {
        onLongPress();
      }
    }
  };

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
  }, []);

  return {
    ...handlers,
    state,
    cleanup
  };
}