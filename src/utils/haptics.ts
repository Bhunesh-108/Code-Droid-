/**
 * CodeDroid Haptic Vibration Utility
 * Provides tactile confirmation for mobile touch coding
 */

export function triggerHaptic(
  pattern: number | number[] = 10,
  enabled: boolean = true
): boolean {
  if (!enabled) return false;

  try {
    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator &&
      typeof navigator.vibrate === 'function'
    ) {
      return navigator.vibrate(pattern);
    }
  } catch {
    // Safe fallback if vibrate throws or is blocked by browser policy
  }

  return false;
}

// Preset haptic feedback patterns
export const HapticPatterns = {
  // Light keypress/symbol insertion (8ms)
  keyTap: 8,
  // Directional caret nudge (10ms)
  caretNudge: 10,
  // Common action (undo, redo, indent, comment) (18ms)
  action: 18,
  // Major action (commit, run, clear) ([15, 30, 20] double pulse)
  successPulse: [15, 30, 20],
  // Discard / Delete warning ([25, 20, 25])
  warningPulse: [25, 20, 25],
};
