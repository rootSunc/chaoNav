export type NavigationId = 'profile' | 'projects' | 'github' | 'linkedin' | 'resume' | 'blog';

type NonEmptyArray<T> = readonly [T, ...T[]];

export type ProjectId = 'sanakirja' | 'arkiwatch' | 'qparking' | 'luxestate';

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

export type ProjectShowcaseItem = {
  readonly id: ProjectId;
  readonly name: string;
  readonly category: string;
  readonly headline: string;
  readonly summary: string;
  readonly href: string;
  readonly ctaLabel: string;
  readonly external: boolean;
  readonly screenshots: {
    readonly web: {
      readonly src: string;
      readonly alt: string;
    };
    readonly mobile: {
      readonly src: string;
      readonly alt: string;
    };
  };
  readonly highlights: readonly [string, string];
  readonly note?: string;
};

export type ProjectsPageContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly projects: NonEmptyArray<ProjectShowcaseItem>;
};

export type SiteContent = {
  readonly profile: Profile;
  readonly links: NonEmptyArray<NavigationLink>;
  readonly projectsPage: ProjectsPageContent;
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
          text: 'ai          AI practitioner applying models to daily tools, product loops, and useful automation',
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
          text: 'ArkiWatch   Finland-focused life-data assistant for weather, transit, air, and energy signals',
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
          label: 'Open ArkiWatch',
          href: 'https://arkiwatch.chaosun.xyz/',
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
  projectsPage: {
    eyebrow: '',
    title: 'Projects',
    intro:
      'A small set of products and experiments—language tools, local data dashboards, and urban utilities—built for daily use rather than demo polish.',
    projects: [
      {
        id: 'sanakirja',
        name: 'Sanakirja',
        category: 'Language learning',
        headline: 'Finnish dictionary and study workspace for everyday learning.',
        summary:
          'A clean learning surface that keeps dictionary lookup, grammar help, translation, flashcards, and notes close together.',
        href: 'https://sanakirja.chaosun.xyz/',
        ctaLabel: 'Open Sanakirja',
        external: true,
        screenshots: {
          web: {
            src: '/images/projects/sanakirja-web.jpg',
            alt: 'Sanakirja web screenshot',
          },
          mobile: {
            src: '/images/projects/sanakirja-mobile.jpg',
            alt: 'Sanakirja mobile screenshot',
          },
        },
        highlights: ['Focused learning workflow', 'Responsive product shell'],
      },
      {
        id: 'arkiwatch',
        name: 'ArkiWatch',
        category: 'Local intelligence',
        headline: 'Live Finland public-data dashboard for daily life signals.',
        summary:
          'A running dashboard that turns weather, air quality, commute, energy, and city signals into one daily operating view for Finland.',
        href: 'https://arkiwatch.chaosun.xyz/',
        ctaLabel: 'Open ArkiWatch',
        external: true,
        screenshots: {
          web: {
            src: '/images/projects/arkiwatch-web.jpg',
            alt: 'ArkiWatch live dashboard web screenshot',
          },
          mobile: {
            src: '/images/projects/arkiwatch-mobile.jpg',
            alt: 'ArkiWatch live dashboard mobile screenshot',
          },
        },
        highlights: ['Weather, transit, air, and energy signals', 'FastAPI + Next.js public-data pipeline'],
      },
      {
        id: 'qparking',
        name: 'QParking',
        category: 'Urban utility',
        headline: 'Helsinki parking-zone lookup with fast comparison.',
        summary:
          'A compact parking app that makes zones, city filtering, and price context easier to scan before a trip.',
        href: 'https://qparking.chaosun.xyz/',
        ctaLabel: 'Open QParking',
        external: true,
        screenshots: {
          web: {
            src: '/images/projects/qparking-web.jpg',
            alt: 'QParking web screenshot',
          },
          mobile: {
            src: '/images/projects/qparking-mobile.jpg',
            alt: 'QParking mobile screenshot',
          },
        },
        highlights: ['City-focused data presentation', 'Mobile-first errand flow'],
      },
      {
        id: 'luxestate',
        name: 'LuxEstate',
        category: 'Property search',
        headline: 'Real-estate marketplace with polished browsing and search.',
        summary:
          'A property search interface focused on strong first impression, listing cards, filtering, and a clear marketplace browsing path.',
        href: 'https://luxestate-indol.vercel.app/',
        ctaLabel: 'Open LuxEstate',
        external: true,
        screenshots: {
          web: {
            src: '/images/projects/luxestate-web.jpg',
            alt: 'LuxEstate web screenshot',
          },
          mobile: {
            src: '/images/projects/luxestate-mobile.jpg',
            alt: 'LuxEstate mobile screenshot',
          },
        },
        highlights: ['Hero-led marketplace positioning', 'Responsive listing layout'],
      },
    ],
  },
  initialLinkId: 'profile',
} satisfies SiteContent;
