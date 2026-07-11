import type { KeyboardEvent } from 'react';
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

function getNextTabIndex(
  currentIndex: number,
  direction: 1 | -1,
  total: number,
): number {
  return (currentIndex + direction + total) % total;
}

function DestinationTab({
  index,
  link,
  selected,
  onSelect,
  onKeyDown,
}: {
  readonly index: number;
  readonly link: NavigationLink;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
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
      onKeyDown={onKeyDown}
      role="tab"
      style={{ '--item-index': index } as CssVars}
      tabIndex={selected ? 0 : -1}
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
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forwardKeys = ['ArrowRight', 'ArrowDown'];
    const backwardKeys = ['ArrowLeft', 'ArrowUp'];
    const homeEndKeys = ['Home', 'End'];

    if (
      !forwardKeys.includes(event.key) &&
      !backwardKeys.includes(event.key) &&
      !homeEndKeys.includes(event.key)
    ) {
      return;
    }

    event.preventDefault();

    let nextIndex = index;

    if (forwardKeys.includes(event.key)) {
      nextIndex = getNextTabIndex(index, 1, links.length);
    } else if (backwardKeys.includes(event.key)) {
      nextIndex = getNextTabIndex(index, -1, links.length);
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else {
      nextIndex = links.length - 1;
    }

    const nextLink = links[nextIndex];
    onSelect(nextLink.id);
    document.getElementById(`tab-${nextLink.id}`)?.focus();
  };

  return (
    <nav aria-label="Primary destinations" className="primary-nav">
      <div aria-orientation="horizontal" className="primary-tabs" role="tablist">
        {links.map((link, index) => (
          <DestinationTab
            index={index}
            key={link.id}
            link={link}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onSelect={() => onSelect(link.id)}
            selected={link.id === selectedLinkId}
          />
        ))}
      </div>
    </nav>
  );
}
