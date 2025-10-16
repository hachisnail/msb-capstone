// controllers/invite.controller.js
import { inviteUser, listInvites } from "../services/invite.service.js";

export async function sendInvite(req, res) {
  try {
    const { email, fname, lname, contact, roleName } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!roleName) return res.status(400).json({ error: "Role is required" });

    const session = req.session?.user;
    if (
      !session ||
      !session.roles?.some((r) => ["ADMIN", "SUPERADMIN"].includes(r))
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await inviteUser({
      email,
      fname,
      lname,
      contact,
      roleName,
      invitedBy: session.email,
      baseUrl: process.env.FRONTEND_URL,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Invite error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getInvites(req, res) {
  try {
    const session = req.session?.user;
    if (
      !session ||
      !session.roles?.some((r) => ["ADMIN", "SUPERADMIN"].includes(r))
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const invites = await listInvites();
    res.json(invites);
  } catch (err) {
    console.error("getInvites error:", err);
    res.status(500).json({ error: "Failed to fetch invites" });
  }
}
