import { NextResponse } from "next/server";
import { isSmtpReady, sendContactEmails } from "@/lib/email/contact-smtp";

const TZ_BODY_LIMIT = 12_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { name, email, phone, message } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (typeof phone !== "string" && phone !== undefined) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const nameTrim = name.trim();
  const emailTrim = email.trim();
  const phoneTrim = typeof phone === "string" && phone.trim() ? phone.trim() : "";
  const messageTrim = message.trim().slice(0, TZ_BODY_LIMIT);

  const text = [
    `Name: ${nameTrim}`,
    `Email: ${emailTrim}`,
    `Phone: ${phoneTrim || "—"}`,
    "",
    messageTrim,
  ].join("\n");

  if (isSmtpReady()) {
    try {
      const result = await sendContactEmails({
        name: nameTrim,
        email: emailTrim,
        phone: phoneTrim,
        message: messageTrim,
      });

      if (!result.adminSent) {
        console.error("[contact] Admin email failed:", result.errors);
        return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
      }

      if (!result.userSent) {
        console.warn("[contact] User confirmation not delivered (admin ok):", result.errors);
      }

      return NextResponse.json({
        ok: true,
        confirmationEmailSent: result.userSent,
      });
    } catch (e) {
      console.error("[contact] SMTP error:", e);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }
  }

  const to = process.env.CONTACT_TO_EMAIL || "info@gmdfences.com";

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from =
        process.env.CONTACT_FROM_EMAIL || "GMD Fences <onboarding@resend.dev>";
      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: emailTrim,
        subject: `GMD Fences inquiry from ${nameTrim}`,
        text,
      });
      if (error) {
        console.error("[contact] Resend error:", error);
        return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
      }
    } catch (e) {
      console.error("[contact]", e);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }
  } else {
    console.info("[contact] No SMTP_HOST/SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY — log only:\n", text);
  }

  return NextResponse.json({ ok: true });
}
