import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";

import { frMessages } from "@/i18n/messages";
import { NavLink } from "./nav-link";

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="fr" messages={frMessages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("NavLink", () => {
  it("should render a link with the button text", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("should apply active styles when pathname matches href exactly", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).toHaveClass("bg-accent");
    expect(button).toHaveClass("text-accent-foreground");
  });

  it("should apply active styles when pathname is a sub-route of href", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/glossary");
    renderWithIntl(<NavLink href="/admin">Admin</NavLink>);
    const button = screen.getByRole("button", { name: "Admin" });
    expect(button).toHaveClass("bg-accent");
  });

  it("should not apply active styles when pathname does not match", () => {
    vi.mocked(usePathname).mockReturnValue("/glossary");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).not.toHaveClass("bg-accent");
  });

  it("should not false-positive on partial prefix match", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard-settings");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).not.toHaveClass("bg-accent");
  });

  it("should set aria-current='page' when active", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("should not set aria-current when inactive", () => {
    vi.mocked(usePathname).mockReturnValue("/glossary");
    renderWithIntl(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).not.toHaveAttribute("aria-current");
  });
});
