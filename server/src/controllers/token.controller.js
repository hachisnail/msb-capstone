import axios from "axios";
import { randomBytes } from "crypto";
import { models } from "../models/index.js";

// 6Lfb8qUrAAAAABgilG-YrjsfUSlsvHyYTWPaznpL
const RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_V3_SECRET_KEY;
const RECAPTCHA_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || 0.5);
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export const tokenController = {
  issueUploadToken: async (req, res) => {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ message: "CAPTCHA token is required." });
    }

    try {
      // 1️ Verify the CAPTCHA token with Google API
      const verificationResponse = await axios.post(
        `${RECAPTCHA_VERIFY_URL}?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
      );

      const { success, score, action } = verificationResponse.data;

      // 2️ Validate verification
      if (!success) {
        return res.status(403).json({ message: "CAPTCHA verification failed." });
      }

      if (action !== "SUBMIT_FILE") {
        return res.status(403).json({ message: "Invalid CAPTCHA action." });
      }

      if (score < RECAPTCHA_THRESHOLD) {
        return res.status(403).json({ message: "Bot behavior detected. Please try again." });
      }

      // 3️ Generate new token
      const newUploadToken = randomBytes(32).toString("hex");

      await models.AccessToken.create({
        token: newUploadToken,
        scope: "write",
        max_uses: 1,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      res.status(200).json({ uploadToken: newUploadToken });
    } catch (error) {
      console.error("Token issuance error:", error);
      res.status(500).json({ message: "Could not issue an upload token." });
    }
  },
};
