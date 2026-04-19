import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address.").trim(),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Use 128 characters or fewer."),
});

export const accountProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  image: z
    .union([z.url("Enter a valid image URL."), z.literal("")])
    .transform((value) => value.trim()),
});

export const accountEmailSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
});

export const accountPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Use 128 characters or fewer."),
  confirmPassword: z.string().min(1, "Confirm your new password."),
});

export const accountSetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Use 128 characters or fewer."),
  confirmPassword: z.string().min(1, "Confirm your new password."),
});
