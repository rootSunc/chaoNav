// All words and facts on the page live here. Two languages, one structure.

export type Lang = "en" | "zh";
export type ProjectId = "cnequity" | "usequity" | "suomeksi" | "arkiwatch";
export type GroupId = "markets" | "finland";

type Localized<T> = Readonly<Record<Lang, T>>;

export type ProjectLink = {
  readonly label: Localized<string>;
  readonly href: string;
};

export type Project = {
  readonly id: ProjectId;
  readonly name: string;
  readonly group: GroupId;
  readonly kind: Localized<string>;
  readonly pitch: Localized<string>;
  readonly stack: readonly string[];
  readonly license?: string;
  /** owner/repo on GitHub when the repository is public. */
  readonly repo?: string;
  readonly links: readonly ProjectLink[];
  /** Shown instead of a source link while the repository is not public. */
  readonly note?: Localized<string>;
};

export const profile = {
  name: "Chao Sun",
  email: "chao.sun.me@gmail.com",
  github: "https://github.com/rootSunc",
  linkedin: "https://www.linkedin.com/in/chaosun526/",
} as const;

export const projects: readonly Project[] = [
  {
    id: "cnequity",
    name: "CNEquity",
    group: "markets",
    kind: { en: "China A-share data lake", zh: "A 股本地数据湖" },
    pitch: {
      en: "An open-source data lake for China's stock market that lives on your own disk. 86 datasets land in local Parquet, update daily, and answer to DuckDB, Python, or an AI agent over MCP.",
      zh: "一座装在你自己硬盘上的中国股市数据湖。86 个数据集落到本地 Parquet，每天增量更新；用 DuckDB、Python 查，或者通过 MCP 交给 AI 去问。",
    },
    stack: ["Python", "Parquet", "DuckDB", "MCP"],
    license: "Apache-2.0",
    repo: "rootSunc/CNEquity",
    links: [
      {
        label: { en: "GitHub", zh: "GitHub" },
        href: "https://github.com/rootSunc/CNEquity",
      },
      {
        label: { en: "Docs", zh: "文档" },
        href: "https://rootsunc.github.io/CNEquity/",
      },
      {
        label: { en: "PyPI", zh: "PyPI" },
        href: "https://pypi.org/project/cnequity/",
      },
    ],
  },
  {
    id: "usequity",
    name: "USEquity",
    group: "markets",
    kind: { en: "US equity research data", zh: "美股研究数据底座" },
    pitch: {
      en: "The same lake discipline, pointed at US stocks and built on free sources. It doesn't pretend the data is perfect. It tells you how far to trust each number.",
      zh: "同一套数据湖的纪律，换到美股，而且只用免费数据源。它不假装数据完美，只是老实告诉你每个数字能信到什么程度。",
    },
    stack: ["Python", "Parquet", "DuckDB"],
    links: [],
    note: {
      en: "Early days. The repository isn't public yet.",
      zh: "还在早期，仓库暂未公开。",
    },
  },
  {
    id: "suomeksi",
    name: "Suomeksi",
    group: "finland",
    kind: { en: "Finnish dictionary and study desk", zh: "芬兰语词典与学习台" },
    pitch: {
      en: "I moved to Finland and met a language with fifteen cases. Suomeksi is the dictionary I wanted: it takes any inflected form apart, explains the grammar in English or Chinese, and turns what you looked up into flashcards.",
      zh: "搬到芬兰之后才知道，这门语言有十五个格。Suomeksi 是我自己想要的那本词典：任何变形都能拆开来查，用中文或英文把语法讲清楚，查过的词顺手变成闪卡。",
    },
    stack: ["Next.js", "FastAPI", "PostgreSQL", "PWA"],
    license: "Apache-2.0",
    links: [
      {
        label: { en: "Open the dictionary", zh: "打开词典" },
        href: "https://sanakirja.chaosun.xyz/",
      },
    ],
    note: {
      en: "The repository isn't public yet.",
      zh: "仓库暂未公开。",
    },
  },
  {
    id: "arkiwatch",
    name: "ArkiWatch",
    group: "finland",
    kind: {
      en: "Finland's public data, one daily view",
      zh: "芬兰公共数据的每日一览",
    },
    pitch: {
      en: "Arki is Finnish for everyday life. ArkiWatch gathers the country's open feeds (weather, air, transit, energy, city events) into one useful next step for the day, with the evidence kept in view.",
      zh: "Arki 在芬兰语里是「日常」。ArkiWatch 把芬兰的公开数据（天气、空气、交通、电价、城市活动）汇成今天最该做的那一步，依据一直摆在旁边。",
    },
    stack: ["Go", "Next.js", "EN / 中文"],
    license: "AGPL-3.0",
    repo: "rootSunc/ArkiWatch",
    links: [
      {
        label: { en: "Open ArkiWatch", zh: "打开 ArkiWatch" },
        href: "https://arkiwatch.chaosun.xyz/",
      },
      {
        label: { en: "GitHub", zh: "GitHub" },
        href: "https://github.com/rootSunc/ArkiWatch",
      },
    ],
  },
];

export const copy = {
  en: {
    skip: "Skip to the projects",
    helsinki: "Helsinki",
    email: "Email",
    langSwitch: "中文",
    langSwitchLabel: "切换到中文",
    introLead: "Moi, I'm Chao.",
    introVerse: ["Tell all the truth but tell it slant —"],
    introCite: "Emily Dickinson",
    projectsNav: "Projects",
    groups: {
      markets: "For the markets I study",
      finland: "For the country I moved to",
    },
    stars: "stars",
    forks: "forks",
    copied: "Copied",
    aside: {
      lead: "Not open yet: EquityLab.",
      body: "My own research workbench, built on these lakes. Ask it about a stock and it gathers the filings, checks its own citations, argues the other side, and leaves the decision to me. Private for now.",
    },
    closing: {
      title: "Say moi.",
      open: "Write about data infrastructure, research tools, or an agent that has to show its sources.",
      body: "I read everything, and answer in English, 中文, or slow but improving Finnish.",
      copyEmail: "Copy address",
    },
    music: {
      title: "On repeat while I work",
      play: "Play",
      pause: "Pause",
      next: "Next piece",
    },
    ledger: {
      title: "Where this page's numbers come from",
      live: "live",
      snapshot: "snapshot",
      computed: "computed in your browser",
      unavailable: "unavailable, not faked",
      loading: "fetching",
      fetched: "fetched",
      rows: {
        cneStars: "CNEquity stars",
        arkiStars: "ArkiWatch stars",
        weather: "Helsinki weather",
        air: "Helsinki air",
        daylight: "Helsinki daylight",
      },
    },
    footer: {
      set: "Set in Recursive.",
      sky: "The page turns dark when the sun goes down in Helsinki.",
    },
    theme: {
      sky: "Sky",
      day: "Day",
      night: "Night",
      label: (mode: string) => `Theme: ${mode}. Click to change.`,
    },
    lake: {
      run: "Run it again",
      count: (n: number) => `${n} of 86 datasets`,
      done: "86 datasets · 78 curated · 8 derived",
      tiers: [
        "Reference",
        "Prices",
        "Corporate events",
        "Fundamentals",
        "Capital flows",
        "Industry structure",
        "Macro",
        "Sentiment, rotation",
        "Risk, compliance",
        "Derivatives",
      ],
    },
    tiers: {
      gap: "NULL, not filled in",
      rows: [
        {
          tier: "A",
          name: "Trusted",
          body: "SEC filings, FRED macro, verified daily bars",
        },
        {
          tier: "B",
          name: "Usable with caveats",
          body: "free-source bars, profiles, dividends and splits",
        },
        {
          tier: "C",
          name: "Unverified",
          body: "uncertain or anomalous, kept out of conclusions",
        },
      ],
    },
    morph: { pick: "Pick a word" },
    signals: {
      title: "Helsinki, right now",
      weather: "Weather",
      air: "Air",
      daylight: "Daylight",
      wind: "wind",
      ago: (s: number) =>
        s < 60 ? `${s} s ago` : `${Math.floor(s / 60)} min ago`,
      sunUp: (t: string) => `Daylight until ${t}. Go outside while it lasts.`,
      sunDown: (t: string) => `The sun is back at ${t}. Coffee until then.`,
      aqi: ["good", "fair", "moderate", "poor", "very poor", "extremely poor"],
    },
  },
  zh: {
    skip: "跳到项目",
    helsinki: "赫尔辛基",
    email: "写信",
    langSwitch: "EN",
    langSwitchLabel: "Switch to English",
    introLead: "Moi，我是 Chao。",
    introVerse: ["Tell all the truth but tell it slant —"],
    introCite: "Emily Dickinson",
    projectsNav: "项目",
    groups: {
      markets: "给我研究的市场",
      finland: "给我搬来的国家",
    },
    stars: "星标",
    forks: "分叉",
    copied: "已复制",
    aside: {
      lead: "还没开源的：EquityLab。",
      body: "建在这两座湖上的个人投研工作台。问它一个关于股票的问题，它去收集公告、核对自己的引用、再替反方说几句，买卖的决定留给我自己。暂未公开。",
    },
    closing: {
      title: "来打个招呼。",
      open: "数据基础设施、投研工具，或者一个必须拿出来处的 AI，都可以写信来谈。",
      body: "来信必读。中文、英文都行，我还在慢慢进步的芬兰语也行。",
      copyEmail: "复制地址",
    },
    music: {
      title: "写代码时循环的",
      play: "播放",
      pause: "暂停",
      next: "下一首",
    },
    ledger: {
      title: "这一页的数字从哪来",
      live: "实时",
      snapshot: "快照",
      computed: "在你的浏览器里算的",
      unavailable: "取不到，不编",
      loading: "获取中",
      fetched: "获取于",
      rows: {
        cneStars: "CNEquity 星标",
        arkiStars: "ArkiWatch 星标",
        weather: "赫尔辛基天气",
        air: "赫尔辛基空气",
        daylight: "赫尔辛基日照",
      },
    },
    footer: {
      set: "字体 Recursive。",
      sky: "赫尔辛基太阳落山的时候，这一页也会暗下来。",
    },
    theme: {
      sky: "天色",
      day: "白天",
      night: "夜晚",
      label: (mode: string) => `主题：${mode}。点击切换。`,
    },
    lake: {
      run: "再跑一遍",
      count: (n: number) => `86 个数据集中的 ${n} 个`,
      done: "86 个数据集 · 78 个 curated · 8 个 derived",
      tiers: [
        "基础参考",
        "行情",
        "公司事件",
        "基本面",
        "资金面",
        "结构行业",
        "宏观",
        "舆情与轮动",
        "风险合规",
        "衍生品",
      ],
    },
    tiers: {
      gap: "NULL，不补",
      rows: [
        { tier: "A", name: "可信", body: "SEC 申报、FRED 宏观、校验通过的日线" },
        {
          tier: "B",
          name: "可用，但有保留",
          body: "免费源日线、公司概况、分红与拆股",
        },
        { tier: "C", name: "未核验", body: "来源不明或明显异常，不用来下结论" },
      ],
    },
    morph: { pick: "选一个词" },
    signals: {
      title: "赫尔辛基，此刻",
      weather: "天气",
      air: "空气",
      daylight: "日照",
      wind: "风速",
      ago: (s: number) =>
        s < 60 ? `${s} 秒前` : `${Math.floor(s / 60)} 分钟前`,
      sunUp: (t: string) => `天亮到 ${t}，趁亮出去走走。`,
      sunDown: (t: string) => `太阳 ${t} 回来，在那之前先喝咖啡。`,
      aqi: ["优", "良", "中等", "差", "很差", "极差"],
    },
  },
} as const;

export type Copy = (typeof copy)[Lang];

// CNEquity's dataset registry, tier by tier (domain/datasets.py, 86 entries).
export const LAKE_TIERS: readonly (readonly string[])[] = [
  [
    "instruments",
    "etf_profiles",
    "trading_calendar",
    "trading_status",
    "name_history",
    "convertible_bonds",
    "convertible_bond_coupons",
    "executives",
  ],
  [
    "daily_bars",
    "limit_prices",
    "index_bars",
    "minute_bars",
    "minute_bars_5m",
    "minute_bars_15m",
    "minute_bars_30m",
    "minute_bars_60m",
    "trade_ticks",
    "adj_factors",
    "delisting_events",
    "convertible_bond_bars",
  ],
  [
    "corporate_actions",
    "announcement_index",
    "earnings_disclosure_schedule",
    "holder_trades",
    "share_repurchases",
    "earnings_forecasts",
    "investor_visits",
    "convertible_bond_calls",
    "convertible_bond_conversions",
  ],
  [
    "financial_statement_items",
    "valuation_metrics",
    "analyst_consensus",
    "broker_forecasts",
    "business_segments",
    "executive_compensation",
    "share_structure",
    "shareholder_counts",
    "top_holders",
  ],
  [
    "fund_flow",
    "fund_flow_ths",
    "fund_flow_tushare",
    "fund_flow_ths_tushare",
    "northbound_holdings",
    "northbound_flows",
    "northbound_top10",
    "margin_trading",
    "dragon_tiger",
    "block_trades",
    "institutional_holdings",
    "chip_distribution",
    "limit_events",
    "limit_ladder",
    "kpl_limit_ups",
    "hot_money_traders",
    "hot_money_trades",
  ],
  ["sector_members", "index_constituents", "industry_members", "industry_index"],
  ["macro_indicators", "market_breadth"],
  [
    "sentiment_scores",
    "hot_rank",
    "popularity_ranks",
    "strongest_sectors",
    "investor_qa",
    "sector_bars",
    "sector_fund_flow",
    "sector_fund_flow_ths",
    "news_headlines",
    "flash_news_wire",
    "economic_calendar",
    "economic_events",
    "market_holidays",
  ],
  ["share_unlock_schedule", "regulatory_events", "pledge_stats"],
  [
    "futures_contracts",
    "option_contracts",
    "futures_bars",
    "option_bars",
    "futures_continuous",
    "option_greeks",
    "futures_minute_bars",
    "futures_member_positions",
    "commodity_bars",
  ],
];

export type Morpheme = {
  readonly text: string;
  readonly gloss: Localized<string>;
};

export type FinnishWord = {
  readonly word: string;
  readonly parts: readonly Morpheme[];
  readonly meaning: Localized<string>;
};

export const FINNISH_WORDS: readonly FinnishWord[] = [
  {
    word: "suomeksi",
    parts: [
      { text: "suome", gloss: { en: "Finnish", zh: "芬兰语" } },
      { text: "ksi", gloss: { en: "into, as", zh: "变成，用" } },
    ],
    meaning: { en: "in Finnish", zh: "用芬兰语" },
  },
  {
    word: "Helsingissä",
    parts: [
      { text: "Helsingi", gloss: { en: "Helsinki", zh: "赫尔辛基" } },
      { text: "ssä", gloss: { en: "in", zh: "在…里" } },
    ],
    meaning: { en: "in Helsinki", zh: "在赫尔辛基" },
  },
  {
    word: "taloissani",
    parts: [
      { text: "talo", gloss: { en: "house", zh: "房子" } },
      { text: "i", gloss: { en: "plural", zh: "复数" } },
      { text: "ssa", gloss: { en: "in", zh: "在…里" } },
      { text: "ni", gloss: { en: "my", zh: "我的" } },
    ],
    meaning: { en: "in my houses", zh: "在我的那些房子里" },
  },
  {
    word: "kirjastossakin",
    parts: [
      { text: "kirja", gloss: { en: "book", zh: "书" } },
      { text: "sto", gloss: { en: "a place full of", zh: "聚集处" } },
      { text: "ssa", gloss: { en: "in", zh: "在…里" } },
      { text: "kin", gloss: { en: "too", zh: "也" } },
    ],
    meaning: { en: "in the library, too", zh: "在图书馆里也是" },
  },
  {
    word: "juoksentelisinkohan",
    parts: [
      { text: "juoks", gloss: { en: "run", zh: "跑" } },
      { text: "entel", gloss: { en: "around, idly", zh: "随便地" } },
      { text: "isi", gloss: { en: "would", zh: "会" } },
      { text: "n", gloss: { en: "I", zh: "我" } },
      { text: "ko", gloss: { en: "?", zh: "吗" } },
      { text: "han", gloss: { en: "I wonder", zh: "呢" } },
    ],
    meaning: {
      en: "I wonder if I should run around a bit",
      zh: "不知道我要不要随便跑跑呢",
    },
  },
];
