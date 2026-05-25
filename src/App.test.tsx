import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { siteContent } from './profile';

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
      'Email',
      'Blog',
      'Profile',
      'Projects',
      'GitHub',
      'LinkedIn',
      'Resume',
      'Now',
    ]) {
      expect(within(navigation).getByRole('tab', { name: new RegExp(label) }))
        .toBeInTheDocument();
    }
  });

  it('starts with the default now command selected', () => {
    render(<App />);

    const terminal = screen.getByRole('region', { name: /terminal output/i });

    expect(screen.getByRole('tab', { name: /Now/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(terminal).getByText('open now')).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole('tab', { name: 'Email' }));
    expect(screen.getByRole('link', { name: /send email/i })).toHaveAttribute(
      'href',
      'mailto:chao.sun.me@gmail.com',
    );

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

  it('renders both live project destinations from the projects command', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: 'Projects' }));

    expect(screen.getByRole('link', { name: /open qparking/i })).toHaveAttribute(
      'href',
      'https://qparking.chaosun.xyz/',
    );
    expect(screen.getByRole('link', { name: /open sanakirja/i })).toHaveAttribute(
      'href',
      'https://sanakirja.chaosun.xyz/',
    );
    expect(screen.getByText('target: 2 live projects')).toBeInTheDocument();
  });
});
