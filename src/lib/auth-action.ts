import { requireAuth } from "@/lib/auth-utils";
import { createSafeActionClient } from "next-safe-action";

export const authActionClient = createSafeActionClient({
  handleServerError(e) {
    return e.message;
  },
}).use(async ({ next }) => {
  const user = await requireAuth();
  return next({ ctx: { user } });
});
