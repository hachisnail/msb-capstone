export default function requireRole(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const session = req.session || (req.auth && req.auth.session);
      const roles = session?.user?.roles || [];
      if (roles.some((r) => allowedRoles.includes(r))) return next();
      return res.status(403).json({ error: "Forbidden (role)" });
    } catch (e) {
      next(e);
    }
  };
}
