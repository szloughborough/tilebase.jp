export const INQUIRY_RETENTION_DAYS = 30;
const limitWindowMs = 600_000;

export function inquiryCutoff(now = Date.now()) {
  return new Date(now - INQUIRY_RETENTION_DAYS * 86_400_000).toISOString();
}

export async function purgeExpiredInquiries(db, now = Date.now()) {
  const [inquiries, limits] = await db.batch([
    db.prepare('DELETE FROM inquiries WHERE created_at <= ?').bind(inquiryCutoff(now)),
    db.prepare('DELETE FROM inquiry_limits WHERE window < ?').bind(Math.floor(now / limitWindowMs) - 6),
  ]);
  if (!inquiries.success || !limits.success) throw new Error('Inquiry retention cleanup failed');
  return { inquiries: inquiries.meta.changes, rateLimitEntries: limits.meta.changes };
}
