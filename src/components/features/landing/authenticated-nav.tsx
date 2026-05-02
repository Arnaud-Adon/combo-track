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
      <NavLink href="/stream">Stream</NavLink>
      {user.role === "ADMIN" && (
        <>
          <NavLink href="/admin/glossary">Admin</NavLink>
          <NavLink href="/admin/games">Jeux</NavLink>
          <NavLink href="/admin/characters">Personnages</NavLink>
        </>
      )}
      <UserProfileDropdown user={user} />
    </div>
  );
}
