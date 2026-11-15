import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { FINNISH_WORDS, LAKE_TIERS, copy, projects } from "./content";
import { LANG_STORAGE_KEY } from "./hooks/useLang";
import { THEME_STORAGE_KEY } from "./lib/theme";

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("content", () => {
  it("lists all 86 CNEquity datasets across ten tiers, without repeats", () => {
    const names = LAKE_TIERS.flat();
    expect(LAKE_TIERS).toHaveLength(10);
    expect(names).toHaveLength(86);
    expect(new Set(names).size).toBe(86);
    expect(copy.en.lake.tiers).toHaveLength(10);
    expect(copy.zh.lake.tiers).toHaveLength(10);
  });

  it("splits every Finnish word into parts that spell it back", () => {
    for (const entry of FINNISH_WORDS) {
      expect(entry.parts.map((part) => part.text).join("")).toBe(entry.word);
    }
  });

  it("keeps the opening to a greeting, in both languages", () => {
    expect(copy.en.introLead).toBe("Moi, I'm Chao.");
    expect(copy.en.introVerse).toEqual([
      "Tell all the truth but tell it slant —",
    ]);
    expect(copy.zh.introLead).toBe("Moi，我是 Chao。");
    expect(copy.zh.introVerse).toEqual(copy.en.introVerse);
  });
});

describe("page", () => {
  it("introduces the four projects and gives each a chapter", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Moi, I'm Chao.",
    );
    expect(
      screen.getByText("Tell all the truth but tell it slant —"),
    ).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Projects" });
    for (const project of projects) {
      expect(within(nav).getByRole("link", { name: project.name })).toHaveAttribute(
        "href",
        `#${project.id}`,
      );
      expect(
        screen.getByRole("heading", { level: 2, name: project.name }),
      ).toBeInTheDocument();
    }
  });

  it("links only to repositories that are public", () => {
    render(<App />);

    const github = screen
      .getAllByRole("link", { name: "GitHub" })
      .map((link) => link.getAttribute("href"));
    expect(github).toContain("https://github.com/rootSunc/CNEquity");
    expect(github).toContain("https://github.com/rootSunc/ArkiWatch");
    expect(github.join(" ")).not.toMatch(/USEquity|Suomeksi/);
    expect(screen.getAllByText(/isn't public yet/)).toHaveLength(2);
  });

  it("labels an unfetched star count as a dated snapshot", () => {
    render(<App />);

    const row = screen.getByRole("rowheader", { name: "CNEquity stars" }).closest("tr")!;
    expect(row).toHaveTextContent("1,033");
    expect(row).toHaveTextContent("api.github.com · snapshot · 2026-11-14");
  });

  it("switches language and remembers the choice", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "切换到中文" }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Moi，我是 Chao。",
    );
    expect(document.documentElement.lang).toBe("zh-Hans");
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe("zh");
    expect(
      screen.getByRole("button", { name: "Switch to English" }),
    ).toBeInTheDocument();
  });

  it("cycles the theme from the Helsinki sky to day, night and back", () => {
    render(<App />);

    const toggle = () => screen.getByRole("button", { name: /^Theme:/ });
    expect(toggle()).toHaveAccessibleName(/Sky/);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();

    fireEvent.click(toggle());
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    fireEvent.click(toggle());
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName(/Sky/);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("lets the reader pick which Finnish word to take apart", () => {
    render(<App />);

    const picker = screen.getByRole("group", { name: "Pick a word" });
    const word = within(picker).getByRole("button", { name: "taloissani" });
    fireEvent.click(word);

    expect(word).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("“in my houses”")).toBeInTheDocument();
  });
});
