"use client";

import { UserProfileDropdown } from "@/components/features/auth/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <Link href="/glossary">
        <Button variant="ghost">Glossaire</Button>
      </Link>
      {user.role === "ADMIN" && (
        <Link href="/admin/glossary">
          <Button variant="ghost">Admin</Button>
        </Link>
      )}
      <span className="text-foreground hover:text-primary text-sm font-medium transition-colors">
        {user.name ?? user.email.split("@")[0]}
      </span>
      <UserProfileDropdown user={user} />
    </div>
  );
}
