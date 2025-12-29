"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnauthenticatedNav() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/sign-in">
        <Button variant="outline">Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
}
