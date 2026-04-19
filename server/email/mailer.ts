import nodemailer from "nodemailer";

type SendEmailInput = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

function parseNumber(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error("SMTP timeout values must be positive integers.");
  }

  return parsedValue;
}

function parseBoolean(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalizedValue)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const portValue = process.env.SMTP_PORT?.trim();

  if (!host || !from || !portValue) {
    return null;
  }

  const port = Number(portValue);

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  if (user && !password) {
    throw new Error("SMTP_PASSWORD is required when SMTP_USER is set.");
  }

  const secure = parseBoolean(process.env.SMTP_SECURE) ?? port === 465;

  if (port === 465 && !secure) {
    throw new Error("SMTP_SECURE must be true when SMTP_PORT is 465.");
  }

  return {
    auth: user ? { pass: password!, user } : undefined,
    connectionTimeout: parseNumber(process.env.SMTP_CONNECTION_TIMEOUT_MS) ?? 15000,
    from,
    greetingTimeout: parseNumber(process.env.SMTP_GREETING_TIMEOUT_MS) ?? 15000,
    host,
    port,
    secure,
    socketTimeout: parseNumber(process.env.SMTP_SOCKET_TIMEOUT_MS) ?? 30000,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isAuthEmailDeliveryConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendEmailMessage({ html, subject, text, to }: Readonly<SendEmailInput>) {
  const config = getSmtpConfig();

  if (!config) {
    throw new Error(
      "SMTP_HOST, SMTP_PORT, and SMTP_FROM must be configured to send auth emails.",
    );
  }

  const transporter = nodemailer.createTransport({
    auth: config.auth,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    host: config.host,
    port: config.port,
    secure: config.secure,
    socketTimeout: config.socketTimeout,
  });

  try {
    await transporter.sendMail({
      from: config.from,
      html,
      subject,
      text,
      to,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown SMTP error";

    throw new Error(
      `Failed to send auth email via SMTP (${config.host}:${config.port}, secure=${String(config.secure)}): ${detail}`,
    );
  }
}

export function renderVerificationEmail({
  appName,
  recipientName,
  url,
}: Readonly<{
  appName: string;
  recipientName: string;
  url: string;
}>) {
  const safeAppName = escapeHtml(appName);
  const safeRecipientName = escapeHtml(recipientName);
  const safeUrl = escapeHtml(url);

  return {
    html: `
      <div style="background:#f8fafc;padding:32px 16px;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(15,23,42,0.08);border-radius:20px;padding:32px;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#64748b;">
            ${safeAppName}
          </p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;font-weight:700;color:#0f172a;">
            Verify your email address
          </h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">
            Hi ${safeRecipientName}, confirm this email address to finish setting up secure access for your account.
          </p>
          <a
            href="${safeUrl}"
            style="display:inline-block;border-radius:999px;background:#0053da;color:#ffffff;padding:14px 22px;font-size:15px;font-weight:700;text-decoration:none;"
          >
            Verify email
          </a>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.8;color:#64748b;">
            If the button does not work, copy and paste this link into your browser:<br />
            <span style="word-break:break-all;color:#0f172a;">${safeUrl}</span>
          </p>
          <p style="margin:16px 0 0;font-size:13px;line-height:1.8;color:#64748b;">
            This link expires in 1 hour.
          </p>
        </div>
      </div>
    `,
    subject: `Verify your email for ${appName}`,
    text: [
      `Hi ${recipientName},`,
      "",
      `Use the link below to verify your email for ${appName}:`,
      url,
      "",
      "This link expires in 1 hour.",
    ].join("\n"),
  };
}
