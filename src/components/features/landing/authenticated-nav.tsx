"use client";

import { UserProfileDropdown } from "@/components/features/auth/user-profile-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthenticatedNavProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export function AuthenticatedNav({ user }: AuthenticatedNavProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
        {user.name ?? user.email.split("@")[0]}
      </span>
      <UserProfileDropdown user={user} />
    </div>
  );
}
