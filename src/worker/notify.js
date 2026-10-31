/**
 * Optional email alert for new submissions, via Resend (https://resend.com).
 * Disabled unless both RESEND_API_KEY and NOTIFY_EMAIL are set. Failures are logged
 * and never affect the customer's submission.
 */
export async function notifyNewSubmission(env, record, fetchImpl = fetch) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return { sent: false, reason: 'disabled' };
  const lines = [
    `Ref: ${record.ref}`,
    `Type: ${record.type}`,
    `Name: ${record.name}`,
    record.phone && `Phone: ${record.phone}`,
    record.email && `Email: ${record.email}`,
    record.province && `Province: ${record.province}`,
    record.quantity && `Quantity: ${record.quantity}`,
    record.bike && `Bike: ${record.bike}`,
    record.contactPref && `Contact by: ${record.contactPref}`,
    record.topic && `Topic: ${record.topic}`,
    record.message && `\n${record.message}`,
  ].filter(Boolean);
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || 'Bao Viet Motor <onboarding@resend.dev>',
        to: [env.NOTIFY_EMAIL],
        subject: `[${record.type === 'preorder' ? 'Pre-order' : 'Message'}] ${record.ref}: ${record.name}`,
        text: lines.join('\n'),
      }),
    });
    if (!res.ok) console.warn('notify: email provider returned', res.status);
    return { sent: res.ok };
  } catch (err) {
    console.warn('notify: failed', err && err.message);
    return { sent: false, reason: 'error' };
  }
}
