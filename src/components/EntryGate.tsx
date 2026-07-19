import { useEffect, useId, useRef } from 'react';

export type EntryGateProps = {
  readonly active: boolean;
  readonly onEnterWithAudio: () => void;
  readonly onEnterSilent: () => void;
};

export function EntryGate({ active, onEnterWithAudio, onEnterSilent }: EntryGateProps) {
  const titleId = useId();
  const primaryRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    primaryRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEnterSilent();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onEnterSilent]);

  return (
    <div
      aria-hidden={!active}
      aria-labelledby={titleId}
      aria-modal="true"
      className={`entry-gate${active ? '' : ' is-closing'}`}
      ref={dialogRef}
      role="dialog"
    >
      <div aria-hidden="true" className="entry-gate-mark">
        <svg fill="none" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36 8 L58 20 L58 44 L36 56 L14 44 L14 20 Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path
            d="M36 18 L50 26 L50 42 L36 50 L22 42 L22 26 Z"
            opacity="0.55"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1"
          />
          <path d="M36 28 V44 M28 36 H44" opacity="0.85" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </div>

      <p className="entry-gate-eyebrow">Personal navigation</p>
      <h2 className="entry-gate-title" id={titleId}>
        Chao
      </h2>

      <button
        className="entry-gate-cta entry-gate-cta-primary"
        onClick={onEnterWithAudio}
        ref={primaryRef}
        type="button"
      >
        Enter with audio
      </button>

      <button className="entry-gate-cta entry-gate-cta-ghost" onClick={onEnterSilent} type="button">
        Enter without audio
      </button>

      <p className="entry-gate-note">
        This experience includes sound. Enable audio for the intended atmosphere.
      </p>
    </div>
  );
}
