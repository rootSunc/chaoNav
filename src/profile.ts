export type Profile = {
  name: string;
  role: string;
  descriptor: string;
};

export type NavigationLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type TerminalLine =
  | {
      kind: 'text';
      text: string;
    }
  | {
      kind: 'link';
      label: string;
      href: string;
      text: string;
      external?: boolean;
    };

export type SiteContent = {
  profile: Profile;
  links: NavigationLink[];
  terminal: {
    command: string;
    lines: TerminalLine[];
  };
};

export const siteContent: SiteContent = {
  profile: {
    name: 'Chao',
    role: 'Developer',
    descriptor: 'Building web tools, writing notes, and shipping small useful systems.',
  },
  links: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'Blog', href: '#blog' },
    { label: 'Profile', href: '#profile' },
    { label: 'Projects', href: '#projects' },
    { label: 'GitHub', href: 'https://github.com/', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
    { label: 'Resume', href: '/resume.pdf', external: true },
    { label: 'Now', href: '#now' },
  ],
  terminal: {
    command: 'open now',
    lines: [
      {
        kind: 'text',
        text: 'Current: building compact web tools and keeping notes on software craft.',
      },
      {
        kind: 'text',
        text: 'Stack: TypeScript, React, Node.js, automation, and pragmatic systems design.',
      },
      {
        kind: 'link',
        label: 'Projects',
        href: '#projects',
        text: 'Project: selected builds, experiments, and open-source work.',
      },
      {
        kind: 'link',
        label: 'Email',
        href: 'mailto:hello@example.com',
        text: 'Contact: email is the fastest path for focused conversations.',
      },
    ],
  },
};
