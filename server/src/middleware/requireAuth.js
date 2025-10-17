import { getSession } from "@auth/express";
import { authConfig } from "../config/auth.config.js";

export default async function requireAuth(req, res, next) {
  try {
    // Skip session parsing for multipart forms (multer will handle the stream)
    if (req.is("multipart/form-data")) {
      console.log(" requireAuth: Skipping getSession for multipart upload");
      // Optionally: attach a pre-fetched session if token or cookie is present
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        req.session = await getSession(req, authConfig); // or custom token decode
      }
      return next();
    }

    const session = await getSession(req, authConfig);
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    req.session = session;
    next();
  } catch (e) {
    next(e);
  }
}
