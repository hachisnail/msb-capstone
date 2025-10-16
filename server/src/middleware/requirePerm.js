import { getAccessControl } from "../services/rbac.service.js";

// "resource.action" => CRUD goes through AccessControl, others via raw perm set
function parsePerm(perm) {
  const [resource, actionCore] = perm.split(".");
  return { resource, actionCore };
}

export default function requirePerm(perm) {
  const { resource, actionCore } = parsePerm(perm);
  return async function (req, res, next) {
    try {
      const session = req.session || (req.auth && req.auth.session);
      if (!session?.user)
        return res.status(401).json({ error: "Unauthorized" });

      const userRoles = session.user.roles || [];
      const userPerms = new Set(session.user.perms || []);

      // Non-CRUD permissions (like "articles.approve") → check direct string
      if (!["create", "read", "update", "delete"].includes(actionCore)) {
        return userPerms.has(perm)
          ? next()
          : res.status(403).json({ error: "Forbidden (perm: " + perm + ")" });
      }

      // CRUD → AccessControl check
      const ac = getAccessControl();
      const checkMap = {
        create: (role) => ac.can(role).createAny(resource),
        read: (role) => ac.can(role).readAny(resource),
        update: (role) => ac.can(role).updateAny(resource),
        delete: (role) => ac.can(role).deleteAny(resource),
      };

      const granted = userRoles.some((r) => checkMap[actionCore](r).granted);
      if (!granted)
        return res
          .status(403)
          .json({ error: "Forbidden (perm: " + perm + ")" });
      next();
    } catch (e) {
      next(e);
    }
  };
}
