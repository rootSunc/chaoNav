import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";
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
});
afterEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("personal card", () => {
  it("renders the real identity, contact, and social destinations", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Chao." }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteContent.profile.role)).toBeInTheDocument();
    expect(
      screen.getByText(siteContent.profile.descriptor),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
      "href",
      "mailto:chao.sun.me@gmail.com",
    );
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
  it("navigates to the portfolio, preserves real project links, and focuses the heading", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Explore my work" }));
    expect(window.location.pathname).toBe("/projects");
    expect(
      screen.getByRole("heading", { level: 1, name: "Projects." }),
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
  it("loads a direct project route and returns home", () => {
    window.history.replaceState(null, "", "/projects/");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Projects." }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(window.location.pathname).toBe("/");
    expect(screen.getByRole("heading", { name: "Chao." })).toHaveFocus();
  });
  it("responds to browser history navigation", () => {
    render(<App />);
    window.history.replaceState(null, "", "/notes");
    fireEvent.popState(window);
    expect(screen.getByRole("heading", { name: "Notes." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("keeps modified navigation clicks available to the browser", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Work" }), {
      ctrlKey: true,
    });
    expect(screen.getByRole("heading", { name: "Chao." })).toBeInTheDocument();
  });
  it("switches featured projects and their real destinations", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Show ArkiWatch" }));
    expect(
      screen.getByRole("heading", { name: "ArkiWatch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show ArkiWatch" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen
        .getByAltText("ArkiWatch live dashboard web screenshot")
        .closest("a"),
    ).toHaveAttribute("href", "https://arkiwatch.chaosun.xyz/");
  });
  it("starts with audio paused and supports playback and track changes", async () => {
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
      within(player).getByRole("heading", { name: "Beethoven" }),
    ).toBeInTheDocument();
    fireEvent.click(
      within(player).getByRole("button", { name: "Previous track" }),
    );
    expect(
      within(player).getByRole("heading", { name: "Vivaldi" }),
    ).toBeInTheDocument();
    fireEvent.ended(screen.getByLabelText("Classical music player"));
    expect(
      within(player).getByRole("heading", { name: "Beethoven" }),
    ).toBeInTheDocument();
  });
  it("expands notes and provides an honest longer-essay request", () => {
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
  it("copies the email and announces success", async () => {
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
  it("provides a manual fallback if clipboard access fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email address" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Please copy: chao.sun.me@gmail.com",
      ),
    );
  });
});
