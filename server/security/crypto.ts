import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getKeyMaterial() {
  const explicitKey = process.env.APP_ENCRYPTION_KEY?.trim();

  if (explicitKey) {
    return explicitKey;
  }

  throw new Error("APP_ENCRYPTION_KEY is required to encrypt provider tokens.");
}

function getEncryptionKey() {
  return createHash("sha256").update(getKeyMaterial()).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString("base64url"), authTag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptSecret(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const [ivPart, tagPart, payloadPart] = value.split(".");

  if (!ivPart || !tagPart || !payloadPart) {
    throw new Error("Encrypted token payload is malformed.");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivPart, "base64url"),
  );

  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
