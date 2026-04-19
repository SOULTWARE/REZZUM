"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/authentication",
});

export const { signIn, signOut, signUp, useSession } = authClient;
