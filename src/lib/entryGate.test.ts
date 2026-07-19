import { afterEach, describe, expect, it } from 'vitest';
import { ENTRY_GATE_STORAGE_KEY, hasSeenEntryGate, markEntryGateSeen } from './entryGate';

describe('entryGate storage', () => {
  afterEach(() => {
    sessionStorage.removeItem(ENTRY_GATE_STORAGE_KEY);
  });

  it('starts unseen and marks the session after enter', () => {
    expect(hasSeenEntryGate()).toBe(false);
    markEntryGateSeen();
    expect(hasSeenEntryGate()).toBe(true);
    expect(sessionStorage.getItem(ENTRY_GATE_STORAGE_KEY)).toBe('1');
  });
});
