import nodemailer from "nodemailer";
import { adminNotificationContent, userConfirmationContent } from "@/lib/email/contact-templates";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type SendContactResult = {
  adminSent: boolean;
  userSent: boolean;
  errors: string[];
};

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim()
  );
}

function createTransporter() {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE !== "false" && port === 465;
  const pass = process.env.SMTP_PASSWORD!.trim().replace(/^["']|["']$/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    pool: true,
    maxConnections: 2,
    maxMessages: 20,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass,
    },
    tls: {
      minVersion: "TLSv1.2" as const,
    },
  });
}

function fromAddress(): string {
  const raw = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim();
  if (raw.includes("<")) return raw;
  return `GMD Fences <${raw}>`;
}

function adminAddress(): string {
  return (process.env.CONTACT_ADMIN_EMAIL || "test@gardurimd.ro").trim();
}

/** Inbox for “Reply” on the visitor confirmation (must accept mail). */
function replyToInbox(): string {
  return (process.env.CONTACT_REPLY_TO || adminAddress()).trim();
}

export function isSmtpReady(): boolean {
  return smtpConfigured();
}

function smtpErrorDetail(err: unknown): string {
  if (err && typeof err === "object") {
    const o = err as {
      message?: string;
      response?: string;
      responseCode?: number;
    };
    const parts = [o.message, o.responseCode != null ? `code ${o.responseCode}` : "", o.response].filter(Boolean);
    return parts.join(" | ") || String(err);
  }
  return String(err);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function sendMailSafe(
  transporter: nodemailer.Transporter,
  options: nodemailer.SendMailOptions
): Promise<{ ok: true } | { ok: false; detail: string }> {
  try {
    await transporter.sendMail(options);
    return { ok: true };
  } catch (e) {
    return { ok: false, detail: smtpErrorDetail(e) };
  }
}

export async function sendContactEmails(payload: ContactPayload): Promise<SendContactResult> {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const transporter = createTransporter();
  const from = fromAddress();
  const adminTo = adminAddress();
  const replyInbox = replyToInbox();

  const userContent = userConfirmationContent(payload.name, payload.message);
  const adminContent = adminNotificationContent(payload);

  const userMail: nodemailer.SendMailOptions = {
    from,
    to: payload.email,
    replyTo: replyInbox,
    subject: "We received your message — GMD Fences",
    text: userContent.text,
    html: userContent.html,
    headers: {
      "X-Entity-Ref-ID": `gmd-contact-user-${Date.now()}`,
    },
  };

  const adminMail: nodemailer.SendMailOptions = {
    from,
    to: adminTo,
    replyTo: payload.email,
    subject: `[GMD Fences] New inquiry from ${payload.name}`,
    text: adminContent.text,
    html: adminContent.html,
    headers: {
      "X-Entity-Ref-ID": `gmd-contact-admin-${Date.now()}`,
    },
  };

  const errors: string[] = [];

  const [u1, a1] = await Promise.all([sendMailSafe(transporter, userMail), sendMailSafe(transporter, adminMail)]);

  let userSent = u1.ok;
  let adminSent = a1.ok;

  if (!userSent && !u1.ok) errors.push(`User (1st): ${u1.detail}`);
  if (!adminSent && !a1.ok) errors.push(`Admin (1st): ${a1.detail}`);

  if (!userSent) {
    await sleep(900);
    const u2 = await sendMailSafe(transporter, userMail);
    if (u2.ok) {
      userSent = true;
    } else {
      errors.push(`User (2nd): ${u2.detail}`);
      await sleep(1400);
      const u3 = await sendMailSafe(transporter, userMail);
      if (u3.ok) {
        userSent = true;
      } else {
        errors.push(`User (3rd): ${u3.detail}`);
      }
    }
  }

  if (!adminSent) {
    await sleep(800);
    const a2 = await sendMailSafe(transporter, adminMail);
    if (a2.ok) {
      adminSent = true;
    } else {
      errors.push(`Admin (2nd): ${a2.detail}`);
    }
  }

  try {
    transporter.close();
  } catch {
    /* ignore */
  }

  return { adminSent, userSent, errors };
}
