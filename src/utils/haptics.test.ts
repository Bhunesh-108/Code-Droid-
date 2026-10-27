import test from 'node:test';
import assert from 'node:assert/strict';
import { triggerHaptic, HapticPatterns } from './haptics';

test('triggerHaptic returns false when enabled is false', () => {
  const result = triggerHaptic(HapticPatterns.keyTap, false);
  assert.equal(result, false);
});

test('triggerHaptic gracefully handles environment without navigator.vibrate', () => {
  // In Node.js environment without navigator.vibrate, it should return false without throwing
  const result = triggerHaptic(HapticPatterns.action, true);
  assert.equal(result, false);
});

test('HapticPatterns definitions are valid numbers or arrays', () => {
  assert.equal(typeof HapticPatterns.keyTap, 'number');
  assert.equal(typeof HapticPatterns.caretNudge, 'number');
  assert.equal(typeof HapticPatterns.action, 'number');
  assert.ok(Array.isArray(HapticPatterns.successPulse));
  assert.ok(Array.isArray(HapticPatterns.warningPulse));
});
