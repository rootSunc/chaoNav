import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import App from "./App";
import { siteContent } from "./data/siteContent";

beforeAll(() => {
  Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("contrapuntal workbench", () => {
  it("renders identity, Helsinki solar ephemeris, and correspondence links", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.profile.inscription,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Helsinki solar ephemeris" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/rootSunc",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/chaosun526/",
    );
    expect(screen.getByRole("link", { name: "Résumé" })).toHaveAttribute(
      "href",
      expect.stringContaining("subject=Resume"),
    );
  });

  it("navigates to the Systems lens, reveals full interface plates, and preserves real project links", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: /Inspect all 5 plates/i }));
    expect(window.location.pathname).toBe("/projects");
    expect(
      screen.getByRole("heading", { level: 1, name: "Systems" }),
    ).toHaveFocus();
    for (const project of siteContent.projectsPage.projects) {
      expect(
        screen.getByRole("heading", { name: project.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: project.ctaLabel }),
      ).toHaveAttribute("href", project.href);
      expect(screen.getByAltText(project.screenshots.web.alt)).toHaveAttribute(
        "src",
        project.screenshots.web.src,
      );
    }
  });

  it("loads a direct /projects route and returns to Field", () => {
    window.history.replaceState(null, "", "/projects/");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Systems" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Field" }));
    expect(window.location.pathname).toBe("/");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.profile.inscription,
      }),
    ).toHaveFocus();
  });

  it("responds to browser history navigation across lenses", () => {
    render(<App />);
    window.history.replaceState(null, "", "/notes");
    fireEvent.popState(window);
    expect(
      screen.getByRole("heading", { level: 1, name: "Cadence" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cadence/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps modified navigation clicks available to the browser", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: /Systems/ }), {
      ctrlKey: true,
    });
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteContent.profile.inscription,
      }),
    ).toBeInTheDocument();
  });

  it("supports interactive micro-specimens and optional interface plate inspection on Field", () => {
    render(<App />);
    const taloStem = screen.getByRole("button", { name: "+ni" });
    expect(taloStem).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(taloStem);
    expect(taloStem).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/“in my house”/)).toBeInTheDocument();

    const plateButtons = screen.getAllByRole("button", {
      name: "Interface plate",
    });
    expect(plateButtons[0]).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(plateButtons[0]);
    expect(
      screen.getByRole("button", { name: "Close plate" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByAltText(
        "CNEquity and EquityLab quant research workbench screenshot",
      ),
    ).toBeVisible();
  });

  it("starts with audio at rest and supports playback and repertoire changes", async () => {
    render(<App />);
    const player = screen.getByRole("region", { name: "Music player" });
    expect(
      within(player).getByRole("button", { name: "Play classical music" }),
    ).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(
      within(player).getByRole("button", { name: "Play classical music" }),
    );
    await waitFor(() =>
      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled(),
    );

    fireEvent.click(
      within(player).getByRole("button", { name: "Pause classical music" }),
    );
    expect(
      within(player).getByRole("button", { name: "Play classical music" }),
    ).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(within(player).getByRole("button", { name: "Next track" }));
    expect(
      within(player).getByRole("heading", { name: "S. Rachmaninoff" }),
    ).toBeInTheDocument();

    fireEvent.click(
      within(player).getByRole("button", { name: "Previous track" }),
    );
    expect(
      within(player).getByRole("heading", { name: "J. S. Bach" }),
    ).toBeInTheDocument();

    fireEvent.ended(screen.getByLabelText("Classical music player"));
    expect(
      within(player).getByRole("heading", { name: "S. Rachmaninoff" }),
    ).toBeInTheDocument();
  });

  it("expands field notes on /notes and provides longer-essay correspondence", () => {
    window.history.replaceState(null, "", "/notes");
    render(<App />);
    const note = screen.getByRole("button", { name: /Calmer study tools/ });
    expect(note).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(note);
    expect(note).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: "Ask for the longer essay" }),
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
    fireEvent.click(note);
    expect(
      screen.queryByRole("link", { name: "Ask for the longer essay" }),
    ).not.toBeInTheDocument();
  });

  it("copies email and announces status with fallback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email address" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Email address copied.",
      ),
    );
    expect(writeText).toHaveBeenCalledWith("chao.sun.me@gmail.com");
  });
});
