import { render, screen, within } from '@testing-library/react';
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

  it('renders the agreed primary navigation links', () => {
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
      expect(within(navigation).getByRole('link', { name: new RegExp(label) }))
        .toBeInTheDocument();
    }
  });

  it('labels external destinations accessibly', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /GitHub opens external site/i }),
    ).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: /LinkedIn opens external site/i }),
    ).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: /Resume opens external site/i }),
    ).toHaveAttribute('target', '_blank');
  });

  it('renders the terminal command and current developer context', () => {
    render(<App />);

    const terminal = screen.getByRole('region', { name: /current context/i });

    expect(within(terminal).getByText('>')).toBeInTheDocument();
    expect(within(terminal).getByText(siteContent.terminal.command)).toBeInTheDocument();
    expect(within(terminal).getByText(/Current:/i)).toBeInTheDocument();
    expect(within(terminal).getByText(/Project:/i)).toBeInTheDocument();
    expect(within(terminal).getByText(/Contact:/i)).toBeInTheDocument();
  });
});
