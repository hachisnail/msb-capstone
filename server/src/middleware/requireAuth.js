import { getSession } from "@auth/express";
import { authConfig } from "../config/auth.config.js";

export default async function requireAuth(req, res, next) {
  try {
    const session = await getSession(req, authConfig);
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    req.session = session;
    next();
  } catch (e) {
    next(e);
  }
}
