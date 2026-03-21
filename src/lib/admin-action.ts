import { createSafeActionClient } from "next-safe-action";
import { requireAdmin } from "@/lib/auth-utils";

export const adminActionClient = createSafeActionClient({
  handleServerError(e) {
    return e.message;
  },
}).use(
  async ({ next }) => {
    const user = await requireAdmin();
    return next({ ctx: { user } });
  },
);
