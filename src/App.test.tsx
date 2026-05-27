import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';
import App from './App';
import { siteContent } from './profile';

beforeAll(() => {
  Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('personal card navigation page', () => {
  it('renders the configured developer identity', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: siteContent.profile.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteContent.profile.role)).toBeInTheDocument();
    expect(screen.getByText(siteContent.profile.descriptor)).toBeInTheDocument();
  });

  it('renders the agreed primary navigation tabs', () => {
    render(<App />);

    const navigation = screen.getByRole('navigation', {
      name: /primary destinations/i,
    });

    for (const label of [
      'Blog',
      'Profile',
      'Projects',
      'GitHub',
      'LinkedIn',
      'Resume',
    ]) {
      expect(within(navigation).getByRole('tab', { name: new RegExp(label) }))
        .toBeInTheDocument();
    }
  });

  it('starts with the default profile command selected', () => {
    render(<App />);

    const terminal = screen.getByRole('region', { name: /terminal output/i });
    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    expect(screen.getByRole('tab', { name: /Profile/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(player).getByText(/cue \/ fight song \/ profile/i)).toBeInTheDocument();
    expect(within(terminal).getByText('open profile')).toBeInTheDocument();
  });

  it('uses the record itself for playback and updates the playing track from tabs', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });
    const recordButton = within(player).getByRole('button', {
      name: /play fight song chorus/i,
    });

    expect(recordButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(recordButton);

    expect(
      within(player).getByRole('button', { name: /pause fight song chorus/i }),
    ).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(within(player).getByText(/play \/ fight song \/ projects/i)).toBeInTheDocument();
  });

  it('switches tracks from the display arrow controls', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    fireEvent.click(within(player).getByRole('button', { name: /next track/i }));

    expect(screen.getByRole('tab', { name: 'Projects' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(player).getByText(/cue \/ fight song \/ projects/i)).toBeInTheDocument();

    fireEvent.click(within(player).getByRole('button', { name: /previous track/i }));

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(player).getByText(/cue \/ fight song \/ profile/i)).toBeInTheDocument();
  });

  it('shows the related terminal command inside each tab label', () => {
    render(<App />);

    for (const link of siteContent.links) {
      const tab = screen.getByRole('tab', { name: link.label });

      expect(within(tab).getByText(link.command)).toBeInTheDocument();
    }
  });

  it('switches the terminal command and output when each tab is clicked', () => {
    render(<App />);

    const terminal = screen.getByRole('region', { name: /terminal output/i });

    for (const link of siteContent.links) {
      fireEvent.click(screen.getByRole('tab', { name: link.label }));

      expect(screen.getByRole('tab', { name: link.label })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(within(terminal).getByText(link.command)).toBeInTheDocument();
      expect(within(terminal).getByText(`session://chao/${link.id}`)).toBeInTheDocument();
      expect(within(terminal).getByText(link.lines[0].text)).toBeInTheDocument();
    }
  });

  it('keeps external destinations as terminal output links', () => {
    render(<App />);

    for (const label of ['GitHub', 'LinkedIn']) {
      fireEvent.click(screen.getByRole('tab', { name: label }));

      const matchingLinks = screen.getAllByRole('link', {
        name: new RegExp(`${label} opens external site`, 'i'),
      });

      expect(matchingLinks.length).toBeGreaterThan(0);
      for (const matchingLink of matchingLinks) {
        expect(matchingLink).toHaveAttribute('target', '_blank');
      }
    }
  });

  it('renders real terminal action targets for contact and social links', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: 'GitHub' }));
    expect(screen.getByRole('link', { name: /open github/i })).toHaveAttribute(
      'href',
      'https://github.com/rootSunc',
    );

    fireEvent.click(screen.getByRole('tab', { name: 'LinkedIn' }));
    expect(screen.getByRole('link', { name: /open linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/chaosun526/',
    );
  });

  it('renders all four live project destinations from the projects command', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(screen.getByRole('link', { name: /open luxestate/i })).toHaveAttribute(
      'href',
      'https://luxestate-indol.vercel.app/',
    );
    expect(screen.getByRole('link', { name: /open qparking/i })).toHaveAttribute(
      'href',
      'https://qparking.chaosun.xyz/',
    );
    expect(screen.getByRole('link', { name: /open sanakirja/i })).toHaveAttribute(
      'href',
      'https://sanakirja.chaosun.xyz/',
    );
    expect(screen.getByRole('link', { name: /open findata/i })).toHaveAttribute(
      'href',
      'https://findata.chaosun.xyz/',
    );
    expect(screen.getByText('target: 4 live projects')).toBeInTheDocument();
  });
});
