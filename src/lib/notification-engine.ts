/**
 * Client for the EPG Notification Engine — Send Email endpoint.
 *
 * API: POST {baseUrl}/services/sms/api/EmailNotifications?X-API-KEY={key}
 *
 * The template uses two variables:
 *   {{subject}} – the email subject line
 *   {{content}} – the HTML body
 *
 * Required env vars:
 *   NOTIFICATION_ENGINE_URL          – full endpoint URL
 *   NOTIFICATION_ENGINE_API_KEY      – X-API-KEY value
 *   NOTIFICATION_EMAIL_TEMPLATE_ID   – template GUID
 *   NOTIFICATION_EMAIL_FROM          – sender address
 */

export interface EmailPayload {
  templateId: string;
  from: string;
  to: string[];
  variables: Record<string, string>;
  cc?: string[];
  bcc?: string[];
}

export interface EmailResult {
  transactionId: string;
}

/**
 * Send an email via the Notification Engine.
 * Returns the transactionId on success, throws on failure.
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const baseUrl = process.env.NOTIFICATION_ENGINE_URL;
  const apiKey = process.env.NOTIFICATION_ENGINE_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('Notification Engine not configured (URL or API_KEY missing)');
  }

  const url = `${baseUrl.replace(/\/+$/, '')}/services/sms/api/EmailNotifications?X-API-KEY=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Notification Engine error ${res.status}: ${body || res.statusText}`,
    );
  }

  // The API returns a plain string transactionId (e.g. "8a5d8b53-...")
  const data = await res.json();
  const txnId = typeof data === 'string' ? data : data?.transactionId;
  return { transactionId: txnId } as EmailResult;
}

/** Escape HTML special characters */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Intake Form Confirmation Email ────────────────────────────

export interface IntakeEmailData {
  referenceNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  companyName: string | null;
  serviceCategory: string | null;
  serviceSubcategory: string | null;
  originLocation: string | null;
  destinationLocation: string | null;
  urgency: string | null;
  frequency: string | null;
  specialRequirements: string[];
  supplierStatus: string | null;
  supplierCountry: string | null;
  goodsCategory: string | null;
  incoterms: string | null;
  cargoVolume: string | null;
  customsRequired: string | null;
  storageType: string | null;
  recommendedServices: Array<{ name: string; category: string }>;
}

function buildIntakeHtml(data: IntakeEmailData): string {
  // Deduplicate services by name to avoid repeated entries in the email
  const uniqueServices = data.recommendedServices.filter(
    (s, i, arr) => arr.findIndex((x) => x.name === s.name) === i,
  );
  const services = uniqueServices
    .map((s) => `<li style="padding:4px 0;color:#374151;">${esc(s.name)} <span style="color:#9ca3af;font-size:12px;">(${esc(s.category)})</span></li>`)
    .join('');

  const detailRows: Array<[string, string]> = [];
  if (data.serviceCategory) detailRows.push(['Service', data.serviceCategory]);
  if (data.serviceSubcategory) detailRows.push(['Type', data.serviceSubcategory]);
  if (data.originLocation) detailRows.push(['Origin', data.originLocation]);
  if (data.destinationLocation) detailRows.push(['Destination', data.destinationLocation]);
  if (data.urgency) detailRows.push(['Urgency', data.urgency]);
  if (data.frequency) detailRows.push(['Volume', data.frequency]);
  if (data.specialRequirements?.length > 0) detailRows.push(['Special Requirements', data.specialRequirements.join(', ')]);
  if (data.supplierStatus) detailRows.push(['Supplier Status', data.supplierStatus]);
  if (data.supplierCountry) detailRows.push(['Supplier Country', data.supplierCountry]);
  if (data.goodsCategory) detailRows.push(['Goods Category', data.goodsCategory]);
  if (data.incoterms) detailRows.push(['Incoterms', data.incoterms]);
  if (data.cargoVolume) detailRows.push(['Cargo Volume', data.cargoVolume]);
  if (data.customsRequired) detailRows.push(['Customs Assistance', data.customsRequired]);
  if (data.storageType) detailRows.push(['Storage Type', data.storageType]);

  const details = detailRows
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
        <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${esc(value)}</td>
      </tr>
    `)
    .join('');

  return `
<div style="max-width:560px;margin:0 auto;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">Request Submitted</h1>
    <p style="margin:6px 0 0;font-size:14px;color:#6b7280;">LINK &mdash; by 7X</p>
  </div>
  <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="padding:24px 24px 16px;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">Hi ${esc(data.contactName)},</p>
      <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
        Your logistics request has been submitted successfully. Our team will review your requirements and reach out within <strong>24 hours</strong>.
      </p>
    </div>
    <div style="margin:0 24px;padding:16px;background:#f3f4f6;border-radius:8px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Tracking Reference</p>
      <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#111827;font-family:monospace;">${esc(data.referenceNumber)}</p>
    </div>
    <div style="padding:20px 24px 8px;">
      <h2 style="margin:0 0 12px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Request Details</h2>
      <table style="width:100%;border-collapse:collapse;">${details}</table>
    </div>
    ${services ? `
    <div style="padding:8px 24px 20px;">
      <h2 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Selected Services</h2>
      <ul style="margin:0;padding:0 0 0 16px;font-size:13px;">${services}</ul>
    </div>` : ''}
    <div style="margin:0 24px;height:1px;background:#e5e7eb;"></div>
    <div style="padding:16px 24px 20px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        ${esc(data.contactEmail)}${data.contactPhone ? ` &middot; ${esc(data.contactPhone)}` : ''}${data.companyName ? ` &middot; ${esc(data.companyName)}` : ''}
      </p>
    </div>
  </div>
</div>`;
}

export function buildIntakeEmailPayload(data: IntakeEmailData): EmailPayload {
  const templateId = process.env.NOTIFICATION_EMAIL_TEMPLATE_ID;
  if (!templateId) throw new Error('NOTIFICATION_EMAIL_TEMPLATE_ID not set');

  const from = process.env.NOTIFICATION_EMAIL_FROM || 'no-reply@7x.ae';

  return {
    templateId,
    from,
    to: [data.contactEmail],
    variables: {
      subject: `Request ${data.referenceNumber} — Submitted Successfully`,
      content: buildIntakeHtml(data),
    },
  };
}

// ─── Expert Form Confirmation Email ────────────────────────────

export interface ExpertEmailData {
  referenceNumber: string;
  contactName: string;
  businessEmail: string;
  phone: string;
  entityName: string;
  uaeRegistered: boolean;
}

function buildExpertHtml(data: ExpertEmailData): string {
  return `
<div style="max-width:560px;margin:0 auto;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">Expert Request Received</h1>
    <p style="margin:6px 0 0;font-size:14px;color:#6b7280;">LINK &mdash; by 7X</p>
  </div>
  <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="padding:24px 24px 16px;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">Hi ${esc(data.contactName)},</p>
      <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
        Thank you for reaching out. Your request to connect with a logistics expert has been received. One of our specialists will contact you within <strong>24 hours</strong>.
      </p>
    </div>
    <div style="padding:8px 24px 20px;">
      <h2 style="margin:0 0 12px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Your Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">Name</td>
          <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${esc(data.contactName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">Entity</td>
          <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${esc(data.entityName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">Email</td>
          <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${esc(data.businessEmail)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">Phone</td>
          <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${esc(data.phone)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">UAE Registered</td>
          <td style="padding:8px 12px;color:#111827;font-size:13px;font-weight:500;">${data.uaeRegistered ? 'Yes' : 'No'}</td>
        </tr>
      </table>
    </div>
  </div>
</div>`;
}

export function buildExpertEmailPayload(data: ExpertEmailData): EmailPayload {
  const templateId = process.env.NOTIFICATION_EMAIL_TEMPLATE_ID;
  if (!templateId) throw new Error('NOTIFICATION_EMAIL_TEMPLATE_ID not set');

  const from = process.env.NOTIFICATION_EMAIL_FROM || 'no-reply@7x.ae';

  return {
    templateId,
    from,
    to: [data.businessEmail],
    variables: {
      subject: 'Expert Request Received — LINK by 7X',
      content: buildExpertHtml(data),
    },
  };
}
