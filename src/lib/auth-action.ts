import { createSafeActionClient } from "next-safe-action";
import { requireAuth } from "@/lib/auth-utils";

export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const user = await requireAuth();
    return next({ ctx: { user } });
  },
);
