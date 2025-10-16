import AccessControl from "accesscontrol";
import { sequelize, models } from "../models/index.js";
import { ROLES, PERMS, MAP } from "../config/accesscontrol.map.js";

// map "domain.action" -> { resource, actionCore }
// actionCore: create|read|update|delete|approve (approve not native AC)
const parsePerm = (perm) => {
  const [resource, actionCore] = perm.split(".");
  return { resource, actionCore };
};

// Convert MAP into AccessControl grants object
function buildGrantsFromMap() {
  const grants = {};
  for (const roleName of Object.keys(MAP)) {
    const perms = MAP[roleName];
    grants[roleName] = {};
    for (const p of perms) {
      const { resource, actionCore } = parsePerm(p);
      // Only CRUD map to AC directly; approve we'll check manually
      if (["create", "read", "update", "delete"].includes(actionCore)) {
        const acAction = `${actionCore}:any`;
        grants[roleName][resource] ??= {};
        grants[roleName][resource][acAction] = ["*"];
      }
    }
  }
  return grants;
}

let ac; // AccessControl singleton

export function getAccessControl() {
  if (!ac) {
    ac = new AccessControl(buildGrantsFromMap());
  }
  return ac;
}

// Seed DB tables from constants (idempotent)
export async function ensureSeedFromMAP() {
  const t = await sequelize.transaction();
  try {
    // upsert roles
    const rolesByName = {};
    for (const r of ROLES) {
      const [rec] = await models.Role.findOrCreate({
        where: { name: r.name },
        defaults: { description: r.description },
        transaction: t,
      });
      rolesByName[r.name] = rec;
    }

    // upsert permissions
    const permByName = {};
    for (const name of PERMS) {
      const [rec] = await models.Permission.findOrCreate({
        where: { name },
        defaults: {},
        transaction: t,
      });
      permByName[name] = rec;
    }

    // connect RolePermissions
    for (const [roleName, perms] of Object.entries(MAP)) {
      const role = rolesByName[roleName];
      const permIds = perms.map((p) => permByName[p].id);
      // get current
      const existing = await models.RolePermission.findAll({
        where: { roleId: role.id },
        transaction: t,
      });
      const existingSet = new Set(existing.map((rp) => rp.permissionId));
      // insert missing
      for (const pid of permIds) {
        if (!existingSet.has(pid)) {
          await models.RolePermission.create(
            { roleId: role.id, permissionId: pid },
            { transaction: t },
          );
        }
      }
    }

    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

// Assign a role to user (helper)
export async function assignRole(userId, roleName) {
  const role = await models.Role.findOne({ where: { name: roleName } });
  if (!role) throw new Error(`Role not found: ${roleName}`);
  await models.UserRole.findOrCreate({ where: { userId, roleId: role.id } });
}

// roles for user
export async function getUserRoles(userId) {
  const rows = await models.UserRole.findAll({
    where: { userId },
    include: [{ model: models.Role, attributes: ["name"] }],
  });
  return rows.map((r) => r.Role.name);
}

// permissions (strings) for user (via roles)
export async function getUserPerms(userId) {
  const rows = await models.UserRole.findAll({
    where: { userId },
    include: [
      {
        model: models.Role,
        attributes: ["id", "name"],
        include: [
          {
            model: models.Permission,
            through: { attributes: [] },
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  // flatten
  const set = new Set();
  for (const ur of rows) {
    for (const p of ur.Role.Permissions || []) set.add(p.name);
  }
  return [...set];
}
