import {
  GeneratedPostStatus,
  GenerationTone,
  SocialPlatform,
} from "@prisma/client";

export const SUPPORTED_REVIEW_PLATFORMS = [SocialPlatform.LINKEDIN, SocialPlatform.X] as const;

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  LINKEDIN: "LinkedIn",
  X: "X",
};

export const GENERATED_POST_STATUS_LABELS: Record<GeneratedPostStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  FAILED: "Failed",
};

export const GENERATION_TONE_LABELS: Record<GenerationTone, string> = {
  PROFESSIONAL: "Professional",
  BOLD: "Bold",
  EDUCATIONAL: "Educational",
};

export const SOCIAL_PLATFORM_CHARACTER_LIMITS: Record<SocialPlatform, number> = {
  LINKEDIN: 3000,
  X: 280,
};

export function getSocialPlatformLabel(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_LABELS[platform];
}

export function getGeneratedPostStatusLabel(status: GeneratedPostStatus) {
  return GENERATED_POST_STATUS_LABELS[status];
}

export function getGenerationToneLabel(tone: GenerationTone) {
  return GENERATION_TONE_LABELS[tone];
}

export function getSocialPlatformCharacterLimit(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_CHARACTER_LIMITS[platform];
}
