import { createAuthClient } from "better-auth/react";
import { getServerUrl } from "./server-url";

const authClient = createAuthClient({
  baseURL: getServerUrl(),
});

export const { signUp, signIn, signOut, useSession } = authClient;
