export const ENTRY_GATE_STORAGE_KEY = 'chao-entry-seen';

export function hasSeenEntryGate(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    return window.sessionStorage.getItem(ENTRY_GATE_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function markEntryGateSeen(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(ENTRY_GATE_STORAGE_KEY, '1');
  } catch {
    // Ignore quota / private-mode failures; gate may reappear once.
  }
}
