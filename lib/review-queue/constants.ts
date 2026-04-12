import {
  GeneratedPostStatus,
  GenerationTone,
  SocialPlatform,
} from "@prisma/client";

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

export function getSocialPlatformLabel(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_LABELS[platform];
}

export function getGeneratedPostStatusLabel(status: GeneratedPostStatus) {
  return GENERATED_POST_STATUS_LABELS[status];
}

export function getGenerationToneLabel(tone: GenerationTone) {
  return GENERATION_TONE_LABELS[tone];
}
