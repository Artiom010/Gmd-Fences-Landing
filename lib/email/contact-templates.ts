/** Safe for HTML email bodies */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br />");
}

const BRAND_NAVY = "#0D1520";
const BRAND_GOLD = "#F4C430";
const MUTED = "#64748b";
const BG = "#f4f5f7";

function emailShell(opts: { title: string; preheader: string; innerHtml: string }) {
  const { title, preheader, innerHtml } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background:${BRAND_NAVY};padding:28px 32px;border-bottom:4px solid ${BRAND_GOLD};">
              <p style="margin:0;font-size:20px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">GMD<span style="color:${BRAND_GOLD};">Fences</span></p>
              <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.12em;">${escapeHtml(title)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 28px;color:#1e293b;font-size:15px;line-height:1.6;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;height:1px;background:linear-gradient(90deg,${BRAND_GOLD},transparent);max-width:120px;"></p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;font-size:12px;line-height:1.5;color:${MUTED};">
              <p style="margin:0 0 8px;">GMD Fences · USA market · <a href="https://gmdfences.com" style="color:${BRAND_NAVY};font-weight:600;">gmdfences.com</a></p>
              <p style="margin:0;">This message was sent from a notification-only address. Please do not reply to this email unless instructed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function userConfirmationContent(name: string, messagePreview: string) {
  const safeName = escapeHtml(name);
  const preview =
    messagePreview.length > 500 ? `${escapeHtml(messagePreview.slice(0, 500))}…` : escapeHtml(messagePreview);

  const text = [
    `Hello ${name},`,
    "",
    "Thank you for contacting GMD Fences. We have received your request.",
    "Our team will review your message and respond as soon as possible.",
    "",
    "A short excerpt from your message:",
    messagePreview.slice(0, 500) + (messagePreview.length > 500 ? "…" : ""),
    "",
    "— GMD Fences",
    "https://gmdfences.com",
  ].join("\n");

  const innerHtml = `
    <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:${BRAND_NAVY};">Hello ${safeName},</p>
    <p style="margin:0 0 16px;">Thank you for reaching out to <strong>GMD Fences</strong>. Your request has been received and saved.</p>
    <p style="margin:0 0 24px;">We will get back to you as soon as possible. If your matter is urgent, please call us using the number on our website.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG};border-radius:8px;border:1px solid #e2e8f0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED};">Your message (excerpt)</p>
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.55;">${preview}</p>
        </td>
      </tr>
    </table>
  `;

  const html = emailShell({
    title: "Request received",
    preheader: `Thanks ${name} — we received your GMD Fences inquiry.`,
    innerHtml,
  });

  return { text, html };
}

export function adminNotificationContent(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const { name, email, phone, message } = payload;
  const text = [
    "New contact form — gmdfences.com",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const innerHtml = `
    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:${BRAND_NAVY};">New inquiry from the website</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};width:100px;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;"><a href="mailto:${email.replace(/"/g, "")}" style="color:${BRAND_NAVY};font-weight:600;">${escapeHtml(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};">Phone</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;">${escapeHtml(phone || "—")}</td>
      </tr>
    </table>
    <p style="margin:24px 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${MUTED};">Message</p>
    <div style="background:${BG};border:1px solid #e2e8f0;border-radius:8px;padding:18px 20px;font-size:14px;line-height:1.55;color:#334155;">${escapeHtml(message)}</div>
    <p style="margin:24px 0 0;">
      <a href="mailto:${email.replace(/"/g, "")}?subject=${encodeURIComponent("Re: Your GMD Fences inquiry")}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_NAVY};font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px;text-decoration:none;">Reply to ${escapeHtml(name.split(" ")[0] || "visitor")}</a>
    </p>
  `;

  const html = emailShell({
    title: "New lead",
    preheader: `${name} — ${email}`,
    innerHtml,
  });

  return { text, html };
}
