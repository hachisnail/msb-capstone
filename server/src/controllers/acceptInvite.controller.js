// controllers/acceptInvite.controller.js
import bcrypt from "bcryptjs";
import { models } from "../models/index.js";
import { assignRole } from "../services/rbac.service.js";

/**
 * GET /api/accept-invite?token=xyz
 * Used by the frontend to preload invite details before showing the form
 */
export async function getInviteDetails(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Missing token" });

    const record = await models.VerificationToken.findOne({ where: { token } });
    if (!record)
      return res.status(404).json({ error: "Invite not found or expired" });

    if (new Date(record.expires) < new Date())
      return res.status(400).json({ error: "Invite expired" });

    const user = await models.User.findOne({
      where: { email: record.identifier },
      attributes: ["email", "fname", "lname", "contact", "birthdate"],
    });

    if (!user)
      return res.status(404).json({ error: "User not found for this invite" });

    return res.json({
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      contact: user.contact,
      birthdate: user.birthdate,
      roleName: record.roleName,
      expires: record.expires,
    });
  } catch (err) {
    console.error("getInviteDetails error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * POST /api/accept-invite
 * Completes user registration by setting password and birthdate
 */
export async function acceptInvite(req, res) {
  try {
    const { token, password, birthdate } = req.body;
    if (!token || !password)
      return res.status(400).json({ error: "Missing token or password" });

    const record = await models.VerificationToken.findOne({ where: { token } });
    if (!record)
      return res.status(400).json({ error: "Invalid or expired token" });

    if (new Date(record.expires) < new Date())
      return res.status(400).json({ error: "Token expired" });

    const email = record.identifier;
    const user = await models.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optional: Validate birthdate (must be past date)
    if (birthdate) {
      const birth = new Date(birthdate);
      if (isNaN(birth.getTime()) || birth > new Date()) {
        return res
          .status(400)
          .json({ error: "Invalid birthdate. Must be a past date." });
      }
      user.birthdate = birth;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    user.passwordHash = passwordHash;
    user.emailVerified = new Date(); // mark as verified
    await user.save();

    // Assign role if valid
    if (record.roleName) {
      await assignRole(user.id, record.roleName);
    } else {
      console.warn("No roleName found for invite token", record.id);
    }

    // Delete token after use
    await record.destroy();

    return res.json({ ok: true });
  } catch (err) {
    console.error("Accept invite error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
