# NavLink Active Hover Effect — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a NavLink component that visually indicates the current page in the navigation bar with a permanent active style and distinct hover effect.

**Architecture:** A `NavLink` client component uses `usePathname()` to detect the active route, applies conditional Tailwind classes for active/inactive states, and renders a `Link` + `Button`. It replaces the existing `Link` + `Button` pattern in `authenticated-nav.tsx`.

**Tech Stack:** Next.js 15, React, Tailwind CSS, shadcn/ui Button, Vitest + Testing Library

---

### Task 1: Create NavLink component with tests

**Files:**
- Create: `src/components/features/landing/nav-link.tsx`
- Create: `src/components/features/landing/nav-link.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/features/landing/nav-link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";

import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("should render a link with the button text", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("should apply active styles when pathname matches href exactly", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).toHaveClass("bg-accent");
    expect(button).toHaveClass("text-accent-foreground");
  });

  it("should apply active styles when pathname is a sub-route of href", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/glossary");
    render(<NavLink href="/admin">Admin</NavLink>);
    const button = screen.getByRole("button", { name: "Admin" });
    expect(button).toHaveClass("bg-accent");
  });

  it("should not apply active styles when pathname does not match", () => {
    vi.mocked(usePathname).mockReturnValue("/glossary");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).not.toHaveClass("bg-accent");
  });

  it("should not false-positive on partial prefix match", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard-settings");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button).not.toHaveClass("bg-accent");
  });

  it("should set aria-current='page' when active", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("should not set aria-current when inactive", () => {
    vi.mocked(usePathname).mockReturnValue("/glossary");
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).not.toHaveAttribute("aria-current");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/features/landing/nav-link.test.tsx`
Expected: FAIL — module `./nav-link` not found

- [ ] **Step 3: Write the NavLink component**

Create `src/components/features/landing/nav-link.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname.startsWith(href) && pathname[href.length] === "/");

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined}>
      <Button
        variant="ghost"
        className={cn(
          isActive && "bg-accent text-accent-foreground hover:bg-accent/80",
        )}
      >
        {children}
      </Button>
    </Link>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/features/landing/nav-link.test.tsx`
Expected: All 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/features/landing/nav-link.tsx src/components/features/landing/nav-link.test.tsx
git commit -m "feat(nav): add NavLink component with active route detection"
```

---

### Task 2: Integrate NavLink into authenticated-nav

**Files:**
- Modify: `src/components/features/landing/authenticated-nav.tsx`

- [ ] **Step 1: Replace Link+Button with NavLink**

Update `src/components/features/landing/authenticated-nav.tsx`:

```tsx
"use client";

import { UserProfileDropdown } from "@/components/features/auth/user-profile-dropdown";
import { NavLink } from "@/components/features/landing/nav-link";

interface AuthenticatedNavProps {
  user: {
    name: string;
    email: string;
    image: string | null;
    role?: string;
  };
}

export function AuthenticatedNav({ user }: AuthenticatedNavProps) {
  return (
    <div className="flex items-center gap-4">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/glossary">Glossaire</NavLink>
      {user.role === "ADMIN" && (
        <NavLink href="/admin">Admin</NavLink>
      )}
      <UserProfileDropdown user={user} />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm ts`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `pnpm vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/features/landing/authenticated-nav.tsx
git commit -m "feat(nav): integrate NavLink into authenticated navigation"
```

---

### Task 3: Manual visual verification

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`

- [ ] **Step 2: Verify active state**

Navigate to `/dashboard` — Dashboard button should have `bg-accent` background permanently.
Navigate to `/glossary` — Glossaire button should have active state, Dashboard should be ghost.
Navigate to `/admin/glossary` — Admin button should be active.
Navigate to `/` — All buttons should be inactive (ghost).

- [ ] **Step 3: Verify hover effects**

Hover over active button — should show slightly dimmed accent (`bg-accent/80`).
Hover over inactive button — should show standard ghost hover (`bg-accent`).

- [ ] **Step 4: Final commit if any adjustments needed**

```bash
git add -u
git commit -m "fix(nav): adjust NavLink styling after visual review"
```
