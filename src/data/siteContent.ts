export type NavigationId = 'profile' | 'projects' | 'github' | 'linkedin' | 'resume' | 'blog';

type NonEmptyArray<T> = readonly [T, ...T[]];

export type Profile = {
  readonly name: string;
  readonly role: string;
  readonly descriptor: string;
  readonly tags: readonly string[];
};

export type TerminalAction = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type TerminalLine =
  | {
      readonly kind: 'text';
      readonly text: string;
    }
  | {
      readonly kind: 'link';
      readonly label: string;
      readonly href: string;
      readonly text: string;
      readonly external?: boolean;
    };

export type NavigationLink = {
  readonly id: NavigationId;
  readonly label: string;
  readonly external?: boolean;
  readonly command: string;
  readonly lines: NonEmptyArray<TerminalLine>;
  readonly actions: readonly TerminalAction[];
};

export type SiteContent = {
  readonly profile: Profile;
  readonly links: NonEmptyArray<NavigationLink>;
  readonly initialLinkId: NavigationId;
};

export const siteContent = {
  profile: {
    name: 'Chao',
    role: 'Software Architect',
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
      id: 'profile',
      label: 'Profile',
      command: 'cat ~/life-and-work/manifesto.txt',
      lines: [
        {
          kind: 'text',
          text: 'focus       product-minded developer shaping reliable systems with human pace',
        },
        {
          kind: 'text',
          text: 'base        Helsinki, building for the web between coffee, bikes, and northern light',
        },
        {
          kind: 'text',
          text: 'craft       turns fuzzy ideas into calm interfaces, useful automation, and maintainable code',
        },
        {
          kind: 'text',
          text: 'standard    clear tradeoffs, steady delivery, thoughtful tests, and no drama in prod',
        },
        {
          kind: 'text',
          text: 'life        good meals, photo walks, reading nights, and energy kept sustainable',
        },
        {
          kind: 'text',
          text: 'open        selective collaborations on products that make daily life better',
        },
      ],
      actions: [
        {
          label: 'Start a conversation',
          href: 'mailto:chao.sun.me@gmail.com',
        },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      command: 'ls ~/craft/selected-work --with-context',
      lines: [
        {
          kind: 'text',
          text: 'Sanakirja   Finnish vocabulary practice for slow, steady language progress',
        },
        {
          kind: 'text',
          text: 'Findata     market dashboards for reading signals without drowning in noise',
        },
        {
          kind: 'text',
          text: 'QParking    quick parking-zone lookup for Helsinki errands and less curbside guessing',
        },
        {
          kind: 'text',
          text: 'LuxEstate   premium property search with a calm, polished presentation layer',
        },
      ],
      actions: [
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
        {
          label: 'Open QParking',
          href: 'https://qparking.chaosun.xyz/',
          external: true,
        },
        {
          label: 'Open LuxEstate',
          href: 'https://luxestate-indol.vercel.app/',
          external: true,
        },
      ],
    },
    {
      id: 'github',
      label: 'GitHub',
      external: true,
      command: 'gh repo list rootSunc --public --source',
      lines: [
        {
          kind: 'link',
          label: 'GitHub',
          href: 'https://github.com/rootSunc',
          text: 'account     rootSunc',
          external: true,
        },
        {
          kind: 'text',
          text: 'rhythm      experiments, product code, and steady commits when the problem deserves it',
        },
        {
          kind: 'text',
          text: 'style       pragmatic architecture, readable code, and curiosity kept in motion',
        },
        {
          kind: 'text',
          text: 'balance     tools for work, side projects for play, learning folded into daily life',
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
      external: true,
      command: 'open ~/network/professional-context',
      lines: [
        {
          kind: 'link',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/chaosun526/',
          text: 'network     professional context, shared references, and practical collaboration history',
          external: true,
        },
        {
          kind: 'text',
          text: 'use         introductions, role context, and the human side of the work',
        },
        {
          kind: 'text',
          text: 'signal      concise background for teams who value clarity, trust, and momentum',
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
      command: 'request ~/resume.pdf --channel=email --context=collaboration',
      lines: [
        {
          kind: 'text',
          text: 'status      private one-page PDF, kept current for serious conversations',
        },
        {
          kind: 'text',
          text: 'contains    recent projects, architecture range, delivery habits, and contact details',
        },
        {
          kind: 'text',
          text: 'route       request by email when a formal document would make the next step easier',
        },
      ],
      actions: [
        {
          label: 'Request resume',
          href: 'mailto:chao.sun.me@gmail.com?subject=Resume%20request',
        },
      ],
    },
    {
      id: 'blog',
      label: 'Blog',
      command: 'cat ~/writing/field-notes.md',
      lines: [
        {
          kind: 'text',
          text: 'notes       field notes on software craft, product taste, tools, and living well',
        },
        {
          kind: 'text',
          text: 'status      curated writing surface coming online at a sustainable pace',
        },
        {
          kind: 'text',
          text: 'promise     fewer hot takes, more decisions worth rereading after a quiet morning',
        },
      ],
      actions: [],
    },
  ],
  initialLinkId: 'profile',
} satisfies SiteContent;
