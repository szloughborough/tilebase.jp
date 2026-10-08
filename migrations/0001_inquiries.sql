CREATE TABLE IF NOT EXISTS inquiries (
  inquiry_id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','sample_sent','quoted','won','lost','spam')),
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK(notification_status IN ('pending','sent','failed')),
  notification_attempts INTEGER NOT NULL DEFAULT 0,
  next_retry_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_inquiries_retry ON inquiries(notification_status,next_retry_at);
CREATE TABLE IF NOT EXISTS inquiry_limits (
  client_hash TEXT NOT NULL,
  window INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(client_hash,window)
);
