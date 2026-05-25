import { useState, type CSSProperties, type PointerEvent } from 'react';
import {
  siteContent,
  type NavigationLink,
  type TerminalAction,
  type TerminalLine,
} from './profile';

function LinkText({ link }: { link: NavigationLink }) {
  return (
    <>
      {link.label}
      {link.external ? (
        <span className="external-mark" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </>
  );
}

function DestinationTab({
  index,
  link,
  selected,
  onSelect,
}: {
  index: number;
  link: NavigationLink;
  selected: boolean;
  onSelect: () => void;
}) {
  const style = { '--item-index': index } as CSSProperties;

  return (
    <button
      aria-controls="terminal-output"
      aria-label={link.label}
      aria-selected={selected}
      className="nav-tab"
      data-command={link.command}
      id={`tab-${link.id}`}
      onClick={onSelect}
      role="tab"
      style={style}
      type="button"
    >
      <span className="tab-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="tab-copy">
        <span className="tab-label">
          <LinkText link={link} />
        </span>
        <span className="tab-command" aria-hidden="true">
          {link.command}
        </span>
      </span>
      <span className="tab-cue" aria-hidden="true" />
    </button>
  );
}

function TerminalEntry({ line, index }: { line: TerminalLine; index: number }) {
  const style = { '--line-index': index } as CSSProperties;

  if (line.kind === 'link') {
    return (
      <p className="terminal-line" style={style}>
        <a
          aria-label={line.external ? `${line.label} opens external site` : line.label}
          href={line.href}
          rel={line.external ? 'noreferrer' : undefined}
          target={line.external ? '_blank' : undefined}
        >
          {line.text}
        </a>
      </p>
    );
  }

  return (
    <p className="terminal-line" style={style}>
      {line.text}
    </p>
  );
}

function TerminalActionLink({ action }: { action: TerminalAction }) {
  return (
    <a
      aria-label={action.external ? `${action.label} opens external site` : action.label}
      className="terminal-action"
      href={action.href}
      rel={action.external ? 'noreferrer' : undefined}
      target={action.external ? '_blank' : undefined}
    >
      <span>{action.label}</span>
      {action.external ? (
        <span className="external-mark" aria-hidden="true">
          ↗
        </span>
      ) : null}
    </a>
  );
}

export default function App() {
  const { profile, links, initialLinkId } = siteContent;
  const [selectedLinkId, setSelectedLinkId] = useState(initialLinkId);
  const activeLink = links.find((link) => link.id === selectedLinkId) ?? links[0];
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.id === activeLink.id),
  );
  const emailLink = links.find((link) => link.id === 'email') ?? links[0];
  const projectsLink = links.find((link) => link.id === 'projects') ?? links[0];

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  }

  return (
    <main className="experience-shell" id="profile" onPointerMove={handlePointerMove}>
      <div className="ambient-scene" aria-hidden="true">
        <span className="ambient-grid" />
        <span className="ambient-sweep" />
        <span className="ambient-pointer" />
      </div>

      <header className="site-header" aria-label="Site header">
        <a className="wordmark" href="#profile" aria-label="Chao home">
          Chao
        </a>
        <span className="header-status">Personal navigator</span>
        <a className="header-contact" href={emailLink.href}>
          Contact
        </a>
      </header>

      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal index</p>
          <h1 id="site-title">{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="descriptor">{profile.descriptor}</p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="hero-action hero-action-primary" href={emailLink.href}>
              Email
            </a>
            <button
              className="hero-action hero-action-secondary"
              onClick={() => setSelectedLinkId(projectsLink.id)}
              type="button"
            >
              Projects
            </button>
          </div>
        </div>

        <div
          className="signal-panel"
          style={{ '--active-index': activeIndex } as CSSProperties}
          aria-hidden="true"
        >
          <div className="signal-header">
            <span />
            <span />
            <span />
          </div>
          <div className="signal-map">
            {links.map((link, index) => (
              <span
                className={link.id === activeLink.id ? 'signal-row is-active' : 'signal-row'}
                key={link.id}
                style={{ '--item-index': index } as CSSProperties}
              >
                <span />
                <span />
              </span>
            ))}
            <span className="signal-cursor" />
          </div>
          <p className="signal-readout">{activeLink.command}</p>
        </div>
      </section>

      <section className="workspace" aria-label="Navigation workspace">
        <nav className="primary-nav" aria-label="Primary destinations">
          <div className="primary-tabs" role="tablist">
            {links.map((link, index) => (
              <DestinationTab
                index={index}
                key={link.id}
                link={link}
                onSelect={() => setSelectedLinkId(link.id)}
                selected={link.id === activeLink.id}
              />
            ))}
          </div>
        </nav>

        <section
          aria-label="Terminal output"
          aria-live="polite"
          className="terminal"
          id="terminal-output"
          role="region"
        >
          <div className="terminal-chrome">
            <p className="terminal-path">session://chao/{activeLink.id}</p>
            <p className="terminal-link-state">linked to {activeLink.label}</p>
          </div>
          <div className="terminal-content" key={activeLink.id}>
            <p className="terminal-command">
              <span aria-hidden="true">&gt;</span>
              <span className="command-text">{activeLink.command}</span>
            </p>
            <div className="terminal-body">
              <p className="terminal-target">target: {activeLink.target}</p>
              {activeLink.lines.map((line, index) => (
                <TerminalEntry key={line.text} line={line} index={index} />
              ))}
              {activeLink.actions.length > 0 ? (
                <div
                  className="terminal-actions"
                  style={{ '--line-index': activeLink.lines.length } as CSSProperties}
                >
                  {activeLink.actions.map((action) => (
                    <TerminalActionLink action={action} key={action.href} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
