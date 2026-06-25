// Vercel serverless function: accepts POST JSON lead submissions from the
// Showtime contact and estimate forms and emails them via the Resend API.
//
// Required environment variables (set these in Vercel > Project > Settings >
// Environment Variables):
//   RESEND_API_KEY  - your Resend API key (starts with "re_")
//   LEAD_TO_EMAIL   - inbox that should receive lead notifications
// Optional:
//   LEAD_FROM_EMAIL - verified sender address (default no-reply@showtimeautobody.com)
//   LEAD_REPLY_TO   - fixed reply-to address; if unset the lead's own email is used
//
// No secrets or recipient addresses are hardcoded here.

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Human-readable label for each known field, in display order.
const FIELD_LABELS = [
  ['source', 'Source page'],
  ['form_type', 'Form'],
  ['name', 'Name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['contact_pref', 'Preferred contact'],
  ['year', 'Vehicle year'],
  ['make', 'Vehicle make'],
  ['model', 'Vehicle model'],
  ['color', 'Vehicle color'],
  ['vin', 'VIN / plate'],
  ['service', 'Service'],
  ['damage', 'Damage / message'],
  ['message', 'Message'],
  ['drivable', 'Drivable'],
  ['warning', 'Warning lights'],
  ['insurance', 'Insurance contacted'],
  ['ins_company', 'Insurance company'],
  ['claim_no', 'Claim number'],
  ['photo_count', 'Photos attached'],
  ['timestamp', 'Submitted at'],
];

async function readJsonBody(req) {
  // Vercel usually parses JSON into req.body, but fall back to manual parsing.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'no-reply@showtimeautobody.com';
  const fixedReplyTo = process.env.LEAD_REPLY_TO;

  if (!apiKey || !toEmail) {
    // Misconfiguration: tell the client clearly without leaking which var is missing.
    return res.status(500).json({
      ok: false,
      error: 'Lead handling is not configured yet. Please call the shop or try again later.',
    });
  }

  let data;
  try {
    data = await readJsonBody(req);
  } catch (err) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON body.' });
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';

  if (!name) {
    return res.status(400).json({ ok: false, error: 'Name is required.' });
  }
  if (!phone && !email) {
    return res.status(400).json({ ok: false, error: 'A phone number or email is required.' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  const formType = typeof data.form_type === 'string' ? data.form_type.trim() : 'Lead';
  const source = typeof data.source === 'string' ? data.source.trim() : '';
  const timestamp = typeof data.timestamp === 'string' && data.timestamp.trim()
    ? data.timestamp.trim()
    : new Date().toISOString();

  const record = { ...data, name, phone, email, form_type: formType, timestamp };

  // Build readable text + HTML bodies from known fields that have values.
  const lines = [];
  const htmlRows = [];
  for (const [key, label] of FIELD_LABELS) {
    const value = record[key];
    if (value === undefined || value === null || String(value).trim() === '') continue;
    const text = String(value).trim();
    lines.push(`${label}: ${text}`);
    htmlRows.push(
      `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">${escapeHtml(label)}</td>` +
      `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(text)}</td></tr>`
    );
  }

  const subjectName = name || 'New lead';
  const subjectVehicle = [record.year, record.make, record.model]
    .filter((p) => p && String(p).trim())
    .join(' ');
  const subject = `New ${formType} — ${subjectName}${subjectVehicle ? ' (' + subjectVehicle + ')' : ''}`;

  const text = lines.join('\n');
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#111">` +
    `<h2 style="margin:0 0 12px">New Showtime ${escapeHtml(formType)}</h2>` +
    `<table style="border-collapse:collapse;font-size:14px">${htmlRows.join('')}</table>` +
    `</div>`;

  const replyTo = fixedReplyTo || (isValidEmail(email) ? email : undefined);

  const payload = {
    from: fromEmail,
    to: [toEmail],
    subject,
    text,
    html,
  };
  if (replyTo) payload.reply_to = replyTo;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      console.error('Resend error', resendRes.status, detail);
      return res.status(502).json({
        ok: false,
        error: 'We could not send your request right now. Please call the shop or try again.',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Lead handler exception', err);
    return res.status(502).json({
      ok: false,
      error: 'We could not send your request right now. Please call the shop or try again.',
    });
  }
};
