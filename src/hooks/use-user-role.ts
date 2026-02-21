"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useUserRole() {
  const { data: session } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!session?.user?.id) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/role");
        const data = await response.json();
        setRole(data.role ?? null);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [session?.user?.id]);

  return { role, loading };
}
