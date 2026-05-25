export type Profile = {
  name: string;
  role: string;
  descriptor: string;
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
    role: 'Developer',
    descriptor: 'Building web tools, writing notes, and shipping small useful systems.',
  },
  links: [
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:chao.sun.me@gmail.com',
      command: 'open email',
      target: 'mailto:chao.sun.me@gmail.com',
      lines: [
        {
          kind: 'link',
          label: 'Email',
          href: 'mailto:chao.sun.me@gmail.com',
          text: 'Contact: chao.sun.me@gmail.com is the fastest path for focused conversations.',
        },
        {
          kind: 'text',
          text: 'Expect: concise context, a clear ask, and the link you want me to inspect.',
        },
      ],
      actions: [{ label: 'Send Email', href: 'mailto:chao.sun.me@gmail.com' }],
    },
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
      target: '2 live projects',
      lines: [
        {
          kind: 'text',
          text: 'Projects: two deployed tools are live and ready to inspect.',
        },
        {
          kind: 'text',
          text: 'QParking: parking-oriented utility at qparking.chaosun.xyz.',
        },
        {
          kind: 'text',
          text: 'Sanakirja: Finnish vocabulary tool at sanakirja.chaosun.xyz.',
        },
      ],
      actions: [
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
    {
      id: 'now',
      label: 'Now',
      href: '#now',
      command: 'open now',
      target: 'current focus',
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
          text: 'Project: QParking and Sanakirja are the current public builds.',
        },
        {
          kind: 'link',
          label: 'Email',
          href: 'mailto:chao.sun.me@gmail.com',
          text: 'Contact: email is the fastest path for focused conversations.',
        },
      ],
      actions: [
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
        { label: 'Send Email', href: 'mailto:chao.sun.me@gmail.com' },
      ],
    },
  ],
  initialLinkId: 'now',
};
