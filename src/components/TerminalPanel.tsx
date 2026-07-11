import { useEffect, useRef, useState } from 'react';
import type { NavigationLink, TerminalAction, TerminalLine } from '../data/siteContent';
import type { CssVars } from '../lib/cssVars';
import { parseTerminalText } from '../lib/terminal';
import { ExternalMark } from './ExternalMark';

function TerminalLineContent({ text }: { readonly text: string }) {
  const parsedText = parseTerminalText(text);

  if (!parsedText) {
    return <span className="terminal-line-content">{text}</span>;
  }

  return (
    <span aria-label={text} className="terminal-line-content terminal-line-content-structured">
      <span className="terminal-line-key">{parsedText.key}</span>
      <span className="terminal-line-value">{parsedText.value}</span>
    </span>
  );
}

function TerminalEntry({ line, index }: { readonly line: TerminalLine; readonly index: number }) {
  const style = { '--line-index': index } as CssVars;

  if (line.kind === 'link') {
    return (
      <p className="terminal-line" style={style}>
        <span aria-hidden="true" className="terminal-line-prefix">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="terminal-line-content">
          <a
            aria-label={line.external ? `${line.label} opens external site` : line.label}
            href={line.href}
            rel={line.external ? 'noreferrer' : undefined}
            target={line.external ? '_blank' : undefined}
          >
            <TerminalLineContent text={line.text} />
          </a>
        </span>
      </p>
    );
  }

  return (
    <p className="terminal-line" style={style}>
      <span aria-hidden="true" className="terminal-line-prefix">
        {String(index + 1).padStart(2, '0')}
      </span>
      <TerminalLineContent text={line.text} />
    </p>
  );
}

function TerminalActionLink({ action }: { readonly action: TerminalAction }) {
  const socialAction =
    action.label.toLowerCase().includes('github') ||
    action.label.toLowerCase().includes('linkedin');

  return (
    <a
      aria-label={action.external ? `${action.label} opens external site` : action.label}
      className="terminal-action"
      href={action.href}
      rel={action.external ? 'noreferrer' : undefined}
      target={action.external ? '_blank' : undefined}
    >
      <span>{action.label}</span>
      <ExternalMark show={Boolean(action.external && !socialAction)} />
    </a>
  );
}

export function TerminalPanel({ activeLink }: { readonly activeLink: NavigationLink }) {
  const isFirstRender = useRef(true);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsSwapping(true);
    const timer = window.setTimeout(() => setIsSwapping(false), 420);

    return () => window.clearTimeout(timer);
  }, [activeLink.id]);

  return (
    <section
      aria-label="Terminal output"
      aria-live="polite"
      className={`terminal${isSwapping ? ' is-swapping' : ''}`}
      id="terminal-output"
      role="region"
    >
      <div className="terminal-chrome">
        <span aria-hidden="true" className="chrome-lights">
          <span />
          <span />
          <span />
        </span>
        <p className="terminal-path">session://chao/{activeLink.id}</p>
        <p className="terminal-link-state">linked to {activeLink.label}</p>
      </div>
      <div className={`terminal-content${isSwapping ? ' is-swapping' : ''}`} key={activeLink.id}>
        <p className="terminal-command">
          <span aria-hidden="true" className="terminal-prompt">
            chao@nav:{activeLink.id}$
          </span>
          <span className="command-text">{activeLink.command}</span>
        </p>
        <div className="terminal-body">
          <dl aria-label="Session details" className="terminal-meta">
            <div className="terminal-meta-card">
              <dt>state</dt>
              <dd>
                <span aria-hidden="true" className="terminal-status-dot" />
                ready
              </dd>
            </div>
            <div className="terminal-meta-card">
              <dt>route</dt>
              <dd>
                <span className="terminal-route-value">/{activeLink.id}</span>
              </dd>
            </div>
          </dl>
          {activeLink.lines.map((line, index) => (
            <TerminalEntry index={index} key={line.text} line={line} />
          ))}
          {activeLink.actions.length > 0 ? (
            <div
              className="terminal-actions"
              style={{ '--line-index': activeLink.lines.length } as CssVars}
            >
              {activeLink.actions.map((action) => (
                <TerminalActionLink action={action} key={action.href} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
