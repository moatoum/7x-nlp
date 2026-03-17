import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const emailLimiter = createRateLimiter({ limit: 5, windowMs: 60_000 }); // 5 emails per minute per IP

interface ConfirmationPayload {
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

/** Escape HTML special characters to prevent XSS in email templates */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(data: ConfirmationPayload): string {
  const services = data.recommendedServices
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
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:36px;height:36px;background:#000;border-radius:10px;margin-bottom:12px;"></div>
      <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">Request Submitted</h1>
      <p style="margin:6px 0 0;font-size:14px;color:#6b7280;">LINK &mdash; by 7X</p>
    </div>

    <!-- Card -->
    <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

      <!-- Greeting -->
      <div style="padding:24px 24px 16px;">
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
          Hi ${esc(data.contactName)},
        </p>
        <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
          Your logistics request has been submitted successfully. Our team will review your requirements and reach out within <strong>24 hours</strong>.
        </p>
      </div>

      <!-- Reference -->
      <div style="margin:0 24px;padding:16px;background:#f3f4f6;border-radius:8px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Tracking Reference</p>
        <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#111827;font-family:monospace;">${esc(data.referenceNumber)}</p>
      </div>

      <!-- Request Details -->
      <div style="padding:20px 24px 8px;">
        <h2 style="margin:0 0 12px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Request Details</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${details}
        </table>
      </div>

      <!-- Selected Services -->
      ${services ? `
      <div style="padding:8px 24px 20px;">
        <h2 style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Selected Services</h2>
        <ul style="margin:0;padding:0 0 0 16px;font-size:13px;">
          ${services}
        </ul>
      </div>
      ` : ''}

      <!-- Divider -->
      <div style="margin:0 24px;height:1px;background:#e5e7eb;"></div>

      <!-- Contact Info -->
      <div style="padding:16px 24px 20px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">
          ${esc(data.contactEmail)}${data.contactPhone ? ` · ${esc(data.contactPhone)}` : ''}${data.companyName ? ` · ${esc(data.companyName)}` : ''}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        &copy; 2026 LINK — Powered by 7X, Emirates Post Group
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request.headers);
    if (!emailLimiter(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait before sending again.' }, { status: 429 });
    }

    const data: ConfirmationPayload = await request.json();

    if (!data.contactEmail || !data.referenceNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping email');
      return NextResponse.json({ success: true, skipped: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'LINK <noreply@updates.7x.ax>',
      to: data.contactEmail,
      subject: `Request ${data.referenceNumber} — Submitted Successfully`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
