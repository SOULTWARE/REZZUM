"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";
import { authClient } from "@/lib/auth-client";
import {
  accountEmailSchema,
  accountPasswordSchema,
  accountProfileSchema,
  accountSetPasswordSchema,
} from "@/lib/auth-validation";

type AccountSettingsPanelProps = {
  emailVerificationEnabled: boolean;
  hasPassword: boolean;
  user: {
    email: string;
    emailVerified: boolean;
    image: string | null;
    name: string;
  };
};

type PendingAction = "email" | "password" | "profile" | "verification" | null;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveCallbackURL(pathname: string) {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  if (typeof window === "undefined") {
    return pathname;
  }

  return new URL(pathname, window.location.origin).toString();
}

function getAuthErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "INVALID_PASSWORD") {
    return "Your current password is incorrect.";
  }

  if (error.code === "PASSWORD_TOO_SHORT") {
    return "Use at least 8 characters for your password.";
  }

  if (error.code === "PASSWORD_TOO_LONG") {
    return "Use 128 characters or fewer for your password.";
  }

  if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "Another account already uses that email address.";
  }

  if (error.code === "EMAIL_ALREADY_VERIFIED") {
    return "This email address is already verified.";
  }

  if (error.code === "PASSWORD_ALREADY_SET") {
    return "A password is already set for this account.";
  }

  if (error.code === "CREDENTIAL_ACCOUNT_NOT_FOUND") {
    return "This account does not have an email/password login yet.";
  }

  if (error.code === "VERIFICATION_EMAIL_NOT_ENABLED") {
    return "Email delivery is not configured yet.";
  }

  return error.message || "Something went wrong. Please try again.";
}

async function setCredentialPassword(newPassword: string) {
  const response = await fetch("/api/authentication/set-password", {
    body: JSON.stringify({ newPassword }),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as
    | { code?: string; message?: string }
    | null;

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(payload));
  }
}

export function AccountSettingsPanel({
  emailVerificationEnabled,
  hasPassword,
  user,
}: Readonly<AccountSettingsPanelProps>) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [profileName, setProfileName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(user.image ?? "");
  const [emailValue, setEmailValue] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(hasPassword);

  useEffect(() => {
    setProfileName(user.name);
    setProfileImage(user.image ?? "");
    setEmailValue(user.email);
  }, [user.email, user.image, user.name]);

  useEffect(() => {
    setPasswordEnabled(hasPassword);
  }, [hasPassword]);

  const avatarInitials = useMemo(() => getInitials(profileName || user.email), [profileName, user.email]);

  async function runAction<T>(
    action: PendingAction,
    work: () => Promise<T>,
    onSuccess: () => void,
  ) {
    setPendingAction(action);

    try {
      await work();
      onSuccess();
    } finally {
      setPendingAction(null);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValues = accountProfileSchema.safeParse({
      image: profileImage,
      name: profileName,
    });

    if (!parsedValues.success) {
      pushToast({
        detail: parsedValues.error.issues[0]?.message,
        message: "Profile update failed.",
        status: "error",
      });
      return;
    }

    await runAction(
      "profile",
      async () => {
        const result = await authClient.updateUser({
          image: parsedValues.data.image || null,
          name: parsedValues.data.name,
        });

        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
      },
      () => {
        pushToast({
          message: "Profile updated.",
          status: "success",
        });
        router.refresh();
      },
    ).catch((error) => {
      pushToast({
        detail: error instanceof Error ? error.message : undefined,
        message: "Profile update failed.",
        status: "error",
      });
    });
  }

  async function handleVerificationResend() {
    if (!emailVerificationEnabled) {
      pushToast({
        detail: "Add the SMTP settings in your environment to enable verification emails.",
        message: "Email delivery is not configured.",
        status: "warning",
      });
      return;
    }

    await runAction(
      "verification",
      async () => {
        const result = await authClient.sendVerificationEmail({
          callbackURL: resolveCallbackURL("/settings?verified=1"),
          email: user.email,
        });

        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
      },
      () => {
        pushToast({
          detail: `A fresh verification link was sent to ${user.email}.`,
          message: "Verification email sent.",
          status: "success",
        });
      },
    ).catch((error) => {
      pushToast({
        detail: error instanceof Error ? error.message : undefined,
        message: "Could not send verification email.",
        status: "error",
      });
    });
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailVerificationEnabled) {
      pushToast({
        detail: "Add SMTP settings in your environment to enable email verification and change flows.",
        message: "Email changes are unavailable.",
        status: "warning",
      });
      return;
    }

    const parsedValues = accountEmailSchema.safeParse({
      email: emailValue,
    });

    if (!parsedValues.success) {
      pushToast({
        detail: parsedValues.error.issues[0]?.message,
        message: "Email update failed.",
        status: "error",
      });
      return;
    }

    if (parsedValues.data.email === user.email) {
      pushToast({
        detail: "The new email must be different from your current one.",
        message: "Use a different email address.",
        status: "warning",
      });
      return;
    }

    await runAction(
      "email",
      async () => {
        const result = await authClient.changeEmail({
          callbackURL: resolveCallbackURL("/settings?emailUpdated=1"),
          newEmail: parsedValues.data.email,
        });

        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
      },
      () => {
        pushToast({
          detail: `Check ${parsedValues.data.email} for the verification link.`,
          message: "Email change started.",
          status: "success",
        });
      },
    ).catch((error) => {
      pushToast({
        detail: error instanceof Error ? error.message : undefined,
        message: "Email update failed.",
        status: "error",
      });
    });
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordEnabled) {
      const parsedValues = accountPasswordSchema.safeParse({
        confirmPassword,
        currentPassword,
        newPassword,
      });

      if (!parsedValues.success) {
        pushToast({
          detail: parsedValues.error.issues[0]?.message,
          message: "Password update failed.",
          status: "error",
        });
        return;
      }

      if (parsedValues.data.newPassword !== parsedValues.data.confirmPassword) {
        pushToast({
          detail: "Enter the same new password in both fields.",
          message: "Passwords do not match.",
          status: "error",
        });
        return;
      }

      await runAction(
        "password",
        async () => {
          const result = await authClient.changePassword({
            currentPassword: parsedValues.data.currentPassword,
            newPassword: parsedValues.data.newPassword,
            revokeOtherSessions: false,
          });

          if (result.error) {
            throw new Error(getAuthErrorMessage(result.error));
          }
        },
        () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          pushToast({
            message: "Password updated.",
            status: "success",
          });
        },
      ).catch((error) => {
        pushToast({
          detail: error instanceof Error ? error.message : undefined,
          message: "Password update failed.",
          status: "error",
        });
      });

      return;
    }

    const parsedValues = accountSetPasswordSchema.safeParse({
      confirmPassword,
      newPassword,
    });

    if (!parsedValues.success) {
      pushToast({
        detail: parsedValues.error.issues[0]?.message,
        message: "Password setup failed.",
        status: "error",
      });
      return;
    }

    if (parsedValues.data.newPassword !== parsedValues.data.confirmPassword) {
      pushToast({
        detail: "Enter the same password in both fields.",
        message: "Passwords do not match.",
        status: "error",
      });
      return;
    }

    await runAction(
      "password",
      async () => {
        await setCredentialPassword(parsedValues.data.newPassword);
      },
      () => {
        setPasswordEnabled(true);
        setNewPassword("");
        setConfirmPassword("");
        pushToast({
          detail: "You can now sign in with email and password.",
          message: "Password added.",
          status: "success",
        });
        router.refresh();
      },
    ).catch((error) => {
      pushToast({
        detail: error instanceof Error ? error.message : undefined,
        message: "Password setup failed.",
        status: "error",
      });
    });
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Account
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-slate-900">
            Profile and sign-in
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Manage the details Better Auth uses for your profile, verification, and credential login.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[var(--surface-low)] px-4 py-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileName || user.email}
              className="h-16 w-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-sm">
              {avatarInitials}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{user.email}</p>
            <p className="mt-1 text-xs text-slate-500">
              {user.emailVerified ? "Verified email" : "Verification pending"}
            </p>
          </div>
        </div>
      </div>

      {!emailVerificationEnabled ? (
        <div className="mt-6 rounded-xl border border-[rgb(181_125_20_/_0.18)] bg-[rgb(255_250_240)] px-4 py-4 text-sm text-[rgb(108_79_10)]">
          Email delivery is not configured yet. Add <code>SMTP_HOST</code>,{" "}
          <code>SMTP_PORT</code>, and <code>SMTP_FROM</code> in your environment to enable
          verification emails and email change confirmations.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6">
        <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-[var(--surface-low)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Profile
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Update your display name and profile image URL.
              </p>
            </div>
            <button
              type="submit"
              disabled={pendingAction !== null}
              className="button-primary inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "profile" ? "Saving..." : "Save profile"}
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Full name
              </span>
              <input
                type="text"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                autoComplete="name"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Profile image URL
              </span>
              <input
                type="url"
                value={profileImage}
                onChange={(event) => setProfileImage(event.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                placeholder="https://..."
                autoComplete="url"
              />
            </label>
          </div>
        </form>

        <form onSubmit={handleEmailSubmit} className="rounded-2xl bg-[var(--surface-low)] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Email
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Your current email is <span className="font-semibold text-slate-700">{user.email}</span>. Email changes require verification before they take effect.
              </p>
            </div>
            {!user.emailVerified ? (
              <button
                type="button"
                disabled={pendingAction !== null || !emailVerificationEnabled}
                onClick={() => void handleVerificationResend()}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingAction === "verification" ? "Sending..." : "Resend verification"}
              </button>
            ) : (
              <span className="rounded-full bg-[rgb(223_243_232)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[rgb(24_93_63)]">
                Verified
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                New email address
              </span>
              <input
                type="email"
                value={emailValue}
                onChange={(event) => setEmailValue(event.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                autoComplete="email"
              />
            </label>

            <button
              type="submit"
              disabled={pendingAction !== null || !emailVerificationEnabled}
              className="button-primary inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "email" ? "Sending..." : "Change email"}
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="rounded-2xl bg-[var(--surface-low)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Password
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {passwordEnabled
                  ? "Update the password used for email/password sign-in."
                  : "Set a password so this account can also sign in with email/password."}
              </p>
            </div>
            <button
              type="submit"
              disabled={pendingAction !== null}
              className="button-primary inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "password"
                ? passwordEnabled
                  ? "Updating..."
                  : "Saving..."
                : passwordEnabled
                  ? "Update password"
                  : "Set password"}
            </button>
          </div>

          <div
            className={`mt-6 grid gap-6 ${passwordEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            {passwordEnabled ? (
              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Current password
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                  autoComplete="current-password"
                />
              </label>
            ) : null}

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                New password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                autoComplete="new-password"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Confirm password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm text-slate-900"
                autoComplete="new-password"
              />
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}
