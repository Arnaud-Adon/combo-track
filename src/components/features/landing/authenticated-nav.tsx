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
      <Link href="/videos">
        <Button variant="ghost">My Videos</Button>
      </Link>
      <UserProfileDropdown user={user} />
    </div>
  );
}
