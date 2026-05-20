import { siteContent, type NavigationLink, type TerminalLine } from './profile';

function linkLabel(link: NavigationLink) {
  return link.external ? `${link.label} opens external site` : link.label;
}

function LinkText({ link }: { link: NavigationLink }) {
  return (
    <>
      {link.label}
      {link.external ? <span aria-hidden="true">↗</span> : null}
    </>
  );
}

function DestinationLink({
  link,
  className,
}: {
  link: NavigationLink;
  className?: string;
}) {
  return (
    <a
      aria-label={linkLabel(link)}
      className={className}
      href={link.href}
      rel={link.external ? 'noreferrer' : undefined}
      target={link.external ? '_blank' : undefined}
    >
      <LinkText link={link} />
    </a>
  );
}

function TerminalEntry({ line }: { line: TerminalLine }) {
  if (line.kind === 'link') {
    return (
      <p className="terminal-line">
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

  return <p className="terminal-line">{line.text}</p>;
}

export default function App() {
  const { profile, links, terminal } = siteContent;

  return (
    <main className="shell" id="profile">
      <section className="identity" aria-labelledby="site-title">
        <div className="avatar" aria-hidden="true">
          <span>C</span>
        </div>
        <h1 id="site-title">{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p className="descriptor">{profile.descriptor}</p>
      </section>

      <nav className="primary-nav" aria-label="Primary destinations">
        {links.map((link) => (
          <DestinationLink key={link.label} link={link} />
        ))}
      </nav>

      <section className="terminal" aria-label="Current context" id="now">
        <p className="terminal-command">
          <span aria-hidden="true">&gt;</span>
          <span>{terminal.command}</span>
        </p>
        <div className="terminal-body">
          {terminal.lines.map((line) => (
            <TerminalEntry key={line.text} line={line} />
          ))}
        </div>
      </section>
    </main>
  );
}
