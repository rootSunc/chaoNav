import { useState } from "react";
import { profile, type Copy } from "../content";
import type { MusicTrack } from "../data/musicLibrary";
import type { useMusicPlayer } from "../hooks/useMusicPlayer";
import type { LiveSources } from "../hooks/useLiveSources";
import type { HelsinkiSolarState } from "../lib/helsinkiSolar";
import { FitName } from "./FitName";
import { describeProvenance, type Provenance } from "./Sourced";
import { formatAqi, formatDaylight, formatWeather } from "./specimens/Signals";

type ClosingProps = {
  readonly t: Copy;
  readonly live: LiveSources;
  readonly solar: HelsinkiSolarState;
  readonly player: ReturnType<typeof useMusicPlayer>;
  readonly track: MusicTrack;
};

export function Closing({ t, live, solar, player, track }: ClosingProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const count = (value: number | null) =>
    value === null ? "—" : value.toLocaleString("en-US");

  const ledger: readonly {
    readonly label: string;
    readonly value: string;
    readonly provenance: Provenance;
  }[] = [
    {
      label: t.ledger.rows.cneStars,
      value: count(live.cneStars.value),
      provenance: live.cneStars,
    },
    {
      label: t.ledger.rows.arkiStars,
      value: count(live.arkiStars.value),
      provenance: live.arkiStars,
    },
    {
      label: t.ledger.rows.weather,
      value: live.weather.value ? formatWeather(live.weather.value, t) : "—",
      provenance: live.weather,
    },
    {
      label: t.ledger.rows.air,
      value: live.aqi.value !== null ? formatAqi(live.aqi.value, t) : "—",
      provenance: live.aqi,
    },
    {
      label: t.ledger.rows.daylight,
      value: formatDaylight(solar),
      provenance: { state: "computed", source: "", at: null },
    },
  ];

  return (
    <section className="closing wrap" aria-labelledby="closing-title">
      <header className="chapter-meta">
        <h2 id="closing-title" className="chapter-kind">
          {t.closing.title}
        </h2>
        <p className="chapter-facts">
          <button type="button" className="text-button" onClick={copyEmail}>
            <span aria-live="polite">
              {copied ? t.copied : t.closing.copyEmail}
            </span>
          </button>
        </p>
      </header>

      <FitName as="p" text={profile.email} href={`mailto:${profile.email}`} />

      <div className="closing-grid">
        <div className="closing-contact">
          <p className="chapter-pitch">{t.closing.open}</p>
          <p className="closing-note">{t.closing.body}</p>
          <p className="chapter-links">
            <a className="out-link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="out-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </div>

        <div className="closing-music" data-music-control="true">
          <h3 className="small-title">{t.music.title}</h3>
          <div className="player" data-playing={player.isPlaying ? "true" : undefined}>
            <button
              type="button"
              className="player-toggle"
              onClick={player.togglePlaying}
              aria-label={player.isPlaying ? t.music.pause : t.music.play}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                {player.isPlaying ? (
                  <path d="M5 3.5h3.4v13H5zM11.6 3.5H15v13h-3.4z" fill="currentColor" />
                ) : (
                  <path d="M5.5 3 16.5 10 5.5 17Z" fill="currentColor" />
                )}
              </svg>
            </button>
            <p className="player-track">
              <strong>{track.composer}</strong>
              <span>{track.title}</span>
            </p>
            <button
              type="button"
              className="text-button"
              onClick={() => player.selectRelativeTrack(1)}
            >
              {t.music.next}
            </button>
            <span className="player-line" aria-hidden="true">
              <span ref={player.progressBarRef} />
            </span>
          </div>
        </div>

        <div className="closing-ledger">
          <h3 className="small-title">{t.ledger.title}</h3>
          <table className="ledger">
            <tbody>
              {ledger.map((row) => (
                <tr key={row.label} data-state={row.provenance.state}>
                  <th scope="row">{row.label}</th>
                  <td>{row.value}</td>
                  <td className="mono">{describeProvenance(row.provenance, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
