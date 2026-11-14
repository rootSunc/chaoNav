import type { MouseEvent } from "react";
import type { HelsinkiSolarState } from "../lib/helsinkiSolar";
import type { Theme } from "../lib/theme";
import { Glyph } from "./CardIcons";
import { SolarHorizonBar } from "./SolarHorizonBar";

export type Page = "home" | "projects" | "notes";

export type PageLinkProps = {
  href: string;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type SiteHeaderProps = {
  readonly page: Page;
  readonly mobile: boolean;
  readonly theme: Theme;
  readonly solar: HelsinkiSolarState;
  readonly onScrubMinutes: (minutes: number | null) => void;
  readonly isPlaying: boolean;
  readonly activeTrackLabel: string;
  readonly pageLink: (next: Page) => PageLinkProps;
  readonly onOpenContact: () => void;
  readonly onToggleTheme: () => void;
  readonly onTogglePlaying: () => void;
};

const LENS_META: Record<
  Page,
  { readonly label: string; readonly numeral: string; readonly icon: "profile" | "code" | "book" }
> = {
  home: { label: "Field", numeral: "00", icon: "profile" },
  projects: { label: "Systems", numeral: "I", icon: "code" },
  notes: { label: "Cadence", numeral: "II", icon: "book" },
};

export function SiteHeader({
  page,
  mobile,
  theme,
  solar,
  onScrubMinutes,
  isPlaying,
  activeTrackLabel,
  pageLink,
  onOpenContact,
  onToggleTheme,
  onTogglePlaying,
}: SiteHeaderProps) {
  return (
    <header className="workbench-masthead">
      <SolarHorizonBar solar={solar} onScrubMinutes={onScrubMinutes} />

      <div className="masthead-bar">
        <a
          {...pageLink("home")}
          className="identity-mark"
          aria-label="Chao Sun — Home"
        >
          <span className="identity-name">Chao Sun</span>
          <span className="identity-sub">workbench</span>
        </a>

        <nav aria-label="Primary destinations" className="lens-switcher">
          {(["home", "projects", "notes"] as const).map((item) => {
            const meta = LENS_META[item];
            return (
              <a
                key={item}
                {...pageLink(item)}
                aria-current={page === item ? "page" : undefined}
              >
                <Glyph className="mobile-lens-icon" name={meta.icon} />
                <span className="lens-numeral" aria-hidden="true">
                  {meta.numeral}
                </span>
                <span className="lens-label">{meta.label}</span>
              </a>
            );
          })}
          {mobile && (
            <button
              type="button"
              className="mobile-connect-trigger"
              onClick={onOpenContact}
              aria-label="Contact Chao"
            >
              <Glyph className="mobile-lens-icon" name="mail" />
              <span className="lens-label">Write</span>
            </button>
          )}
        </nav>

        <div className="masthead-controls">
          {page !== "home" && isPlaying && !mobile ? (
            <button
              type="button"
              className="masthead-audio-pill"
              data-music-control="true"
              aria-label="Pause classical music"
              onClick={onTogglePlaying}
            >
              <span className="audio-pulse-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>{activeTrackLabel}</span>
            </button>
          ) : null}

          <button
            type="button"
            className="polarity-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={
              theme === "dark"
                ? "Switch to daylight paper"
                : "Switch to northern slate"
            }
          >
            <Glyph name={theme === "dark" ? "sun" : "moon"} />
            <span className="polarity-label">
              {theme === "dark" ? "Paper" : "Slate"}
            </span>
          </button>

          {!mobile && (
            <button
              type="button"
              className="correspondence-trigger"
              onClick={onOpenContact}
            >
              <span>Correspondence</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
