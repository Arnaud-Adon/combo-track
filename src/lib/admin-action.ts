import { createSafeActionClient } from "next-safe-action";
import { requireAdmin } from "@/lib/auth-utils";

export const adminActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const user = await requireAdmin();
    return next({ ctx: { user } });
  },
);
