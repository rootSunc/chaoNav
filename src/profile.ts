export type Profile = {
  name: string;
  role: string;
  descriptor: string;
  tags: string[];
};

export type NavigationLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  command: string;
  target: string;
  lines: TerminalLine[];
  actions: TerminalAction[];
};

export type TerminalAction = {
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
  initialLinkId: string;
};

export const siteContent: SiteContent = {
  profile: {
    name: 'Chao',
    role: 'Software Craftsman',
    descriptor: 'Crafting tools, chasing ideas, and enjoying life one commit at a time.',
    tags: [
      'Full-Stack',
      'Open Source',
      'Typography',
      'Coffee',
      'Vinyl',
      'Photography',
      'Minimalism',
      'Cycling',
      'Reading',
      'Finnish Life',
    ],
  },
  links: [
    {
      id: 'blog',
      label: 'Blog',
      href: '#blog',
      command: 'open blog',
      target: 'not linked yet',
      lines: [
        {
          kind: 'text',
          text: 'Blog: longer notes on engineering decisions, tools, and systems.',
        },
        {
          kind: 'text',
          text: 'Status: add a blog URL here when the writing surface is public.',
        },
      ],
      actions: [],
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '#profile',
      command: 'open profile',
      target: 'local identity section',
      lines: [
        {
          kind: 'text',
          text: 'Profile: developer focused on compact web tools and pragmatic systems.',
        },
        {
          kind: 'text',
          text: 'Mode: product-minded engineering, automation, and readable interfaces.',
        },
      ],
      actions: [],
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#projects',
      command: 'open projects',
      target: '4 live projects',
      lines: [
        {
          kind: 'text',
          text: 'Projects: four deployed web applications are live and ready to inspect.',
        },
        {
          kind: 'text',
          text: 'LuxEstate: A premium real estate presentation and search platform.',
        },
        {
          kind: 'text',
          text: 'QParking: A quick helper tool for parking zone checks and queries.',
        },
        {
          kind: 'text',
          text: 'Sanakirja: A clean utility to study and memorize Finnish vocabulary.',
        },
        {
          kind: 'text',
          text: 'Findata: A dashboard for financial data visualization and analysis.',
        },
      ],
      actions: [
        {
          label: 'Open LuxEstate',
          href: 'https://luxestate-indol.vercel.app/',
          external: true,
        },
        {
          label: 'Open QParking',
          href: 'https://qparking.chaosun.xyz/',
          external: true,
        },
        {
          label: 'Open Sanakirja',
          href: 'https://sanakirja.chaosun.xyz/',
          external: true,
        },
        {
          label: 'Open Findata',
          href: 'https://findata.chaosun.xyz/',
          external: true,
        },
      ],
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/rootSunc',
      external: true,
      command: 'open github',
      target: 'https://github.com/rootSunc',
      lines: [
        {
          kind: 'link',
          label: 'GitHub',
          href: 'https://github.com/rootSunc',
          text: 'GitHub: code, experiments, and public repositories under rootSunc.',
          external: true,
        },
        {
          kind: 'text',
          text: 'Signal: recent commits and project history are the source of truth.',
        },
      ],
      actions: [
        {
          label: 'Open GitHub',
          href: 'https://github.com/rootSunc',
          external: true,
        },
      ],
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/chaosun526/',
      external: true,
      command: 'open linkedin',
      target: 'https://www.linkedin.com/in/chaosun526/',
      lines: [
        {
          kind: 'link',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/chaosun526/',
          text: 'LinkedIn: work history, network, and professional context.',
          external: true,
        },
        {
          kind: 'text',
          text: 'Use: best for background checks and professional introductions.',
        },
      ],
      actions: [
        {
          label: 'Open LinkedIn',
          href: 'https://www.linkedin.com/in/chaosun526/',
          external: true,
        },
      ],
    },
    {
      id: 'resume',
      label: 'Resume',
      href: '#resume',
      command: 'open resume',
      target: 'resume not linked yet',
      lines: [
        {
          kind: 'text',
          text: 'Resume: a compact PDF can be linked here when ready.',
        },
        {
          kind: 'text',
          text: 'Note: keep this file current before sharing the page publicly.',
        },
      ],
      actions: [],
    },
  ],
  initialLinkId: 'profile',
};
