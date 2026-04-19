import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db/client";
import {
  isAuthEmailDeliveryConfigured,
  renderVerificationEmail,
  sendEmailMessage,
} from "@/server/email/mailer";
import { getAppBaseUrl, getTrustedAppOrigins } from "@/server/app-url";

function getAuthSecret() {
  const secret =
    process.env.BETTER_AUTH_SECRET?.trim() || process.env.APP_ENCRYPTION_KEY?.trim();

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET or APP_ENCRYPTION_KEY is required for Better Auth.");
  }

  return secret;
}

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim(),
);
const linkedinEnabled = Boolean(
  process.env.LINKEDIN_CLIENT_ID?.trim() && process.env.LINKEDIN_CLIENT_SECRET?.trim(),
);
const emailVerificationEnabled = isAuthEmailDeliveryConfigured();
const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "REZZUM";

export const enabledAuthProviders = {
  google: googleEnabled,
  linkedin: linkedinEnabled,
} as const;

export { emailVerificationEnabled };

export const auth = betterAuth({
  appName,
  baseURL: getAppBaseUrl(),
  basePath: "/api/authentication",
  secret: getAuthSecret(),
  trustedOrigins: getTrustedAppOrigins(),
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: emailVerificationEnabled,
  },
  ...(emailVerificationEnabled
    ? {
        emailVerification: {
          autoSignInAfterVerification: true,
          expiresIn: 60 * 60,
          sendOnSignIn: true,
          sendOnSignUp: true,
          sendVerificationEmail: async ({ url, user }) => {
            const message = renderVerificationEmail({
              appName,
              recipientName: user.name || user.email,
              url,
            });

            await sendEmailMessage({
              ...message,
              to: user.email,
            });
          },
        },
      }
    : {}),
  socialProviders: {
    ...(googleEnabled
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {}),
    ...(linkedinEnabled
      ? {
          linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
          },
        }
      : {}),
  },
  user: {
    changeEmail: {
      enabled: emailVerificationEnabled,
    },
  },
  plugins: [nextCookies()],
});
