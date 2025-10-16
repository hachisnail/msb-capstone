import nodemailer from "nodemailer";

let _transporter;
let _cachedMode;

/**
 * Determine current mailer mode (can be overridden manually).
 * Priority:
 *  1. opts.mode argument
 *  2. process.env.MAILER_MODE (manual override)
 *  3. process.env.NODE_ENV ("production" or "development")
 */
function resolveMailerMode(overrideMode) {
  if (overrideMode) return overrideMode;
  if (process.env.MAILER_MODE) return process.env.MAILER_MODE;
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/**
 * Create (and cache) a Nodemailer transporter.
 */
function getTransporter(mode) {
  if (_transporter && _cachedMode === mode) return _transporter;
  _cachedMode = mode;

  const {
    SMTP_SERVICE,
    SMTP_HOST,
    SMTP_PORT = "587",
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_POOL,
    SMTP_MAX_CONNECTIONS = "3",
    SMTP_MAX_MESSAGES = "100",
  } = process.env;

  const hasCreds = SMTP_USER && SMTP_PASS;

  // Use JSON transport in dev or when creds are missing
  if (mode !== "production" || !hasCreds) {
    console.info(`[Mailer] Using JSON transport (mode=${mode})`);
    _transporter = nodemailer.createTransport({ jsonTransport: true });
    return _transporter;
  }

  const base = SMTP_SERVICE
    ? { service: SMTP_SERVICE }
    : {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
      };

  _transporter = nodemailer.createTransport({
    ...base,
    pool: SMTP_POOL !== "false",
    maxConnections: Number(SMTP_MAX_CONNECTIONS),
    maxMessages: Number(SMTP_MAX_MESSAGES),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  console.info("[Mailer] Using SMTP transport (production mode)");
  return _transporter;
}

/**
 * Resolve default "from" address.
 */
function resolveDefaultFrom() {
  const {
    SMTP_FROM,
    SMTP_FROM_NAME = "System",
    SMTP_FROM_EMAIL,
    SMTP_USER,
  } = process.env;
  if (SMTP_FROM) return SMTP_FROM;
  const email = SMTP_FROM_EMAIL || SMTP_USER;
  return email ? `"${SMTP_FROM_NAME}" <${email}>` : undefined;
}

/**
 * Send an email via the shared transporter.
 * You can pass `mode: "development" | "production"` in opts to override behavior.
 */
export async function sendMail(opts) {
  const mode = resolveMailerMode(opts.mode);
  const transporter = getTransporter(mode);
  const from = opts.from || resolveDefaultFrom();

  const info = await transporter.sendMail({ ...opts, from });

  if (transporter.options.jsonTransport) {
    console.log(`[Mailer:${mode}] Simulated email:`, info.message);
  }

  return info;
}

/**
 * Optionally verify connection.
 */
export async function verifyMailer(mode) {
  mode = resolveMailerMode(mode);
  const transporter = getTransporter(mode);
  if (transporter.options.jsonTransport) return true;
  await transporter.verify();
  return true;
}
