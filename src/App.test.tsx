import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';
import App from './App';
import { siteContent } from './data/siteContent';

beforeAll(() => {
  Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, '', '/');
  delete document.body.dataset.page;
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

    const tabs = within(navigation).getAllByRole('tab');

    expect(tabs.map((tab) => tab.getAttribute('aria-label'))).toEqual([
      'Profile',
      'Projects',
      'GitHub',
      'LinkedIn',
      'Resume',
      'Blog',
    ]);
  });

  it('starts with the default profile command selected', () => {
    render(<App />);

    const terminal = screen.getByRole('region', { name: /terminal output/i });
    const player = screen.getByRole('region', { name: /vinyl navigation player/i });
    const profileLink = siteContent.links.find((link) => link.id === 'profile');

    expect(screen.getByRole('tab', { name: /Profile/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      within(player).getByText(/play \/ the four seasons: spring i\. allegro \/ profile/i),
    ).toBeInTheDocument();
    expect(within(terminal).getByText(profileLink?.command ?? '')).toBeInTheDocument();
    expect(within(terminal).queryByText(/chao sun/i)).not.toBeInTheDocument();
  });

  it('autoplays, uses the record itself for playback, and updates the playing track from tabs', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });
    const pauseRecordButton = within(player).getByRole('button', {
      name: /pause classical music/i,
    });

    expect(pauseRecordButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(pauseRecordButton);

    expect(
      within(player).getByRole('button', { name: /play classical music/i }),
    ).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(within(player).getByRole('button', { name: /play classical music/i }));

    fireEvent.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(
      within(player).getByText(/play \/ the four seasons: spring i\. allegro \/ projects/i),
    ).toBeInTheDocument();
  });

  it('falls back to the paused UI when the browser blocks autoplay', async () => {
    vi.mocked(window.HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException('Autoplay blocked', 'NotAllowedError'),
    );

    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    await waitFor(() => {
      expect(
        within(player).getByRole('button', { name: /play classical music/i }),
      ).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('retries blocked autoplay on the first page interaction', async () => {
    vi.mocked(window.HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException('Autoplay blocked', 'NotAllowedError'),
    );

    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    await waitFor(() => {
      expect(
        within(player).getByRole('button', { name: /play classical music/i }),
      ).toHaveAttribute('aria-pressed', 'false');
    });

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(
        within(player).getByRole('button', { name: /pause classical music/i }),
      ).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('uses the player play button to recover from blocked autoplay', async () => {
    vi.mocked(window.HTMLMediaElement.prototype.play).mockRejectedValueOnce(
      new DOMException('Autoplay blocked', 'NotAllowedError'),
    );

    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    await waitFor(() => {
      expect(
        within(player).getByRole('button', { name: /play classical music/i }),
      ).toHaveAttribute('aria-pressed', 'false');
    });

    fireEvent.click(within(player).getByRole('button', { name: /play classical music/i }));

    await waitFor(() => {
      expect(
        within(player).getByRole('button', { name: /pause classical music/i }),
      ).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('switches music tracks from the display arrow controls', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    fireEvent.click(within(player).getByRole('button', { name: /next track/i }));

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(player).getByText(/beethoven \/ symphony no\. 5/i)).toBeInTheDocument();
    expect(
      within(player).getByText(/play \/ symphony no\. 5: iii\. allegro \/ profile/i),
    ).toBeInTheDocument();

    fireEvent.click(within(player).getByRole('button', { name: /previous track/i }));

    expect(within(player).getByText(/vivaldi \/ the four seasons/i)).toBeInTheDocument();

    fireEvent.click(within(player).getByRole('button', { name: /previous track/i }));

    expect(within(player).getByText(/tchaikovsky \/ the nutcracker/i)).toBeInTheDocument();
  });

  it('advances to the next library track when audio ends', () => {
    render(<App />);

    const audio = screen.getByLabelText(/classical music player/i);
    const player = screen.getByRole('region', { name: /vinyl navigation player/i });

    fireEvent.ended(audio);

    expect(within(player).getByText(/beethoven \/ symphony no\. 5/i)).toBeInTheDocument();
  });

  it('keeps the tab labels compact without command subtitles', () => {
    render(<App />);

    const navigation = screen.getByRole('navigation', {
      name: /primary destinations/i,
    });

    for (const link of siteContent.links) {
      const tab = within(navigation).getByRole('tab', { name: link.label });

      expect(within(tab).queryByText(link.command)).not.toBeInTheDocument();
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

      const [fieldName, fieldValue] = link.lines[0].text.split(/\s{2,}/);

      expect(within(terminal).getAllByText(fieldName).length).toBeGreaterThan(0);
      expect(within(terminal).getByText(fieldValue)).toBeInTheDocument();
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

  it('opens a dedicated projects page with concise portfolio copy and real screenshots', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open projects page/i }));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: siteContent.projectsPage.title,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/A compact portfolio of apps/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Commercial enough to sell/i)).not.toBeInTheDocument();

    for (const project of siteContent.projectsPage.projects) {
      expect(screen.getByRole('heading', { name: project.name })).toBeInTheDocument();
      expect(screen.getByAltText(project.screenshots.web.alt)).toHaveAttribute(
        'src',
        project.screenshots.web.src,
      );
      expect(screen.getByAltText(project.screenshots.mobile.alt)).toHaveAttribute(
        'src',
        project.screenshots.mobile.src,
      );
      expect(
        screen.getByRole('link', {
          name: new RegExp(`${project.ctaLabel} opens external site`, 'i'),
        }),
      ).toHaveAttribute('href', project.href);
    }
  });

  it('supports loading the projects route directly and returning home', () => {
    window.history.replaceState(null, '', '/projects');

    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: siteContent.projectsPage.title,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /home/i }));

    expect(
      screen.getByRole('heading', { level: 1, name: siteContent.profile.name }),
    ).toBeInTheDocument();
  });

  it('renders all four project destinations from the projects command', () => {
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
    expect(screen.getByRole('link', { name: /open arkiwatch/i })).toHaveAttribute(
      'href',
      'https://github.com/rootSunc/ArkiWatch',
    );
    expect(screen.queryByText('target')).not.toBeInTheDocument();
  });
});
