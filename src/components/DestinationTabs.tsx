import type { NavigationId, NavigationLink } from '../data/siteContent';
import type { CssVars } from '../lib/cssVars';
import { ExternalMark } from './ExternalMark';
import { Icon } from './Icon';

const socialDestinationIds = new Set<NavigationId>(['github', 'linkedin']);

type DestinationTabsProps = {
  readonly links: readonly NavigationLink[];
  readonly selectedLinkId: NavigationId;
  readonly onSelect: (id: NavigationId) => void;
};

function DestinationTab({
  index,
  link,
  selected,
  onSelect,
}: {
  readonly index: number;
  readonly link: NavigationLink;
  readonly selected: boolean;
  readonly onSelect: () => void;
}) {
  const showArrow = Boolean(link.external && !socialDestinationIds.has(link.id));

  return (
    <button
      aria-controls="terminal-output"
      aria-label={link.label}
      aria-selected={selected}
      className="track-tab"
      id={`tab-${link.id}`}
      onClick={onSelect}
      role="tab"
      style={{ '--item-index': index } as CssVars}
      type="button"
    >
      <span className="tab-copy">
        <span className="tab-label">
          <Icon id={link.id} />
          <span>{link.label}</span>
          <ExternalMark show={showArrow} />
        </span>
      </span>
      <span aria-hidden="true" className="tab-cue" />
    </button>
  );
}

export function DestinationTabs({ links, selectedLinkId, onSelect }: DestinationTabsProps) {
  return (
    <nav aria-label="Primary destinations" className="primary-nav">
      <div className="primary-tabs" role="tablist">
        {links.map((link, index) => (
          <DestinationTab
            index={index}
            key={link.id}
            link={link}
            onSelect={() => onSelect(link.id)}
            selected={link.id === selectedLinkId}
          />
        ))}
      </div>
    </nav>
  );
}
