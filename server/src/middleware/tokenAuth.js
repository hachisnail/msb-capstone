import { models } from "../models/index.js";

/**
 * Creates a middleware to verify an access token for a given scope.
 * Looks for the token in the 'x-access-token' header or 'token' query param.
 * @param {'read'|'write'} requiredScope
 */
export function verifyAccessToken(requiredScope) {
  return async (req, res, next) => {
    const tokenValue = req.headers["x-access-token"] || req.query.token;
    if (!tokenValue) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Access token is missing." });
    }

    try {
      const token = await models.AccessToken.findOne({
        where: { token: tokenValue },
      });

      if (!token) {
        return res.status(403).json({ message: "Forbidden: Invalid token." });
      }

      if (token.scope !== requiredScope) {
        return res.status(403).json({
          message: "Forbidden: Token cannot be used for this action.",
        });
      }

      if (token.expires_at && new Date() > new Date(token.expires_at)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Token has expired." });
      }

      if (token.max_uses !== null && token.use_count >= token.max_uses) {
        return res
          .status(403)
          .json({ message: "Forbidden: Token has exceeded its usage limit." });
      }

      req.accessToken = token; // Attach for later use (e.g., incrementing count)
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      next(error);
    }
  };
}
