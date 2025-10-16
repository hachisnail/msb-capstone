// services/invite.service.js
import crypto from "crypto";
import { models } from "../models/index.js";
import { sendMail } from "./mailer.service.js";
import { Op } from "sequelize"; // ✅ ADD THIS IMPORT

const INVITE_EXPIRY_HOURS = 24;

/**
 * Invite a new user
 */
export async function inviteUser({
  email,
  fname,
  lname,
  contact,
  roleName,
  invitedBy,
  baseUrl,
}) {
  if (!roleName) throw new Error("Role is required to invite a user");

  const existing = await models.User.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

  await models.VerificationToken.upsert({
    identifier: email,
    token,
    expires,
    roleName,
  });

  await models.User.upsert({
    email,
    fname,
    lname,
    contact,
    emailVerified: null, // null = not verified / still invited
    passwordHash: null,
  });

  const safeBase = (baseUrl || "").replace(/\/$/, "");
  const inviteUrl = `${safeBase}/accept-invite?token=${encodeURIComponent(token)}`;

  const subject = "You're invited to join the system";
  const html = `
    <p>Hi ${fname || ""},</p>
    <p>You’ve been invited to join our system by ${invitedBy} as a <strong>${roleName}</strong>.</p>
    <p>Please click below to complete your registration and set your password:</p>
    <p><a href="${inviteUrl}">${inviteUrl}</a></p>
    <p>This link will expire in ${INVITE_EXPIRY_HOURS} hours.</p>
  `;

  await sendMail({
    to: email,
    subject,
    html,
    mode: "production",
  });

  return { ok: true, email, roleName };
}

/**
 * Fetch all active invites (tokens not expired yet)
 */
export async function listInvites() {
  const now = new Date();

  const tokens = await models.VerificationToken.findAll({
    where: { expires: { [Op.gt]: now } },
    order: [["expires", "DESC"]],
  });

  const emails = tokens.map((t) => t.identifier);

  const users = await models.User.findAll({
    where: { email: emails },
    attributes: ["email", "fname", "lname", "contact"],
  });

  return tokens.map((t) => {
    const user = users.find((u) => u.email === t.identifier);
    return {
      email: t.identifier,
      fname: user?.fname || "",
      lname: user?.lname || "",
      contact: user?.contact || "",
      expires: t.expires,
    };
  });
}
