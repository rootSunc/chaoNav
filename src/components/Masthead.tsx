import { profile, type Copy } from "../content";
import type { ThemeMode } from "../lib/theme";

type MastheadProps = {
  readonly t: Copy;
  readonly helsinkiTime: string;
  readonly mode: ThemeMode;
  readonly onCycleMode: () => void;
  readonly onToggleLang: () => void;
};

function ModeGlyph({ mode }: { readonly mode: ThemeMode }) {
  return (
    <svg viewBox="0 0 16 16" className="mode-glyph" aria-hidden="true">
      {mode === "day" && <circle cx="8" cy="8" r="4.5" fill="currentColor" />}
      {mode === "night" && (
        <path
          d="M10.6 2.2a6 6 0 1 0 3.2 9.4A5 5 0 0 1 10.6 2.2Z"
          fill="currentColor"
        />
      )}
      {mode === "sky" && (
        <>
          <path d="M3.5 10.5a4.5 4.5 0 0 1 9 0Z" fill="currentColor" />
          <path d="M1 12.5h14" stroke="currentColor" strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

export function Masthead({
  t,
  helsinkiTime,
  mode,
  onCycleMode,
  onToggleLang,
}: MastheadProps) {
  const modeName = t.theme[mode];
  return (
    <header className="masthead wrap">
      <a className="masthead-name" href="/">
        {profile.name}
      </a>

      <div className="masthead-tools">
        <span className="masthead-clock">
          {t.helsinki} <span className="mono">{helsinkiTime}</span>
        </span>
        <button
          type="button"
          className="masthead-mode"
          onClick={onCycleMode}
          aria-label={t.theme.label(modeName)}
        >
          <ModeGlyph mode={mode} />
          <span>{modeName}</span>
        </button>
        <button
          type="button"
          className="masthead-lang"
          onClick={onToggleLang}
          aria-label={t.langSwitchLabel}
          lang={t.langSwitch === "EN" ? "en" : "zh-Hans"}
        >
          {t.langSwitch}
        </button>
        <a className="masthead-mail" href={`mailto:${profile.email}`}>
          {t.email}
        </a>
      </div>
    </header>
  );
}
