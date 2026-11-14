import { useEffect, useRef, useState } from "react";
import { siteContent } from "../data/siteContent";
import { Glyph } from "./CardIcons";
import { Icon } from "./Icon";

export function ConnectionBar() {
  const { email, githubUrl, linkedinUrl, coordinates, place } =
    siteContent.profile;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(copyTimer.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <section className="colophon-bar" aria-label="Colophon and correspondence">
      <div className="colophon-origin">
        <span className="colophon-mark">COLOPHON</span>
        <span>
          Set in Helsinki ({coordinates} · {place}). Built without trackers or
          external runtime bloat.
        </span>
      </div>

      <div className="colophon-links">
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <Icon id="github" />
          <span>GitHub</span>
          <Glyph name="arrow" />
        </a>
        <a href={linkedinUrl} target="_blank" rel="noreferrer">
          <Icon id="linkedin" />
          <span>LinkedIn</span>
          <Glyph name="arrow" />
        </a>
        <a href={`mailto:${email}?subject=Resume%20request`}>
          <Icon id="resume" />
          <span>Résumé</span>
          <Glyph name="arrow" />
        </a>
        <button
          type="button"
          onClick={copyEmail}
          aria-label="Copy email address"
        >
          <Glyph name={copied ? "check" : "copy"} />
          <span>{copied ? "Copied" : email}</span>
        </button>
      </div>

      <span className="copy-status" role="status">
        {copyError
          ? `Please copy: ${email}`
          : copied
            ? "Email address copied."
            : ""}
      </span>
    </section>
  );
}
