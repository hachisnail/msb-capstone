import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

import userFactory from "./user.model.js";
import accountFactory from "./account.model.js";
import sessionFactory from "./session.model.js";
import verificationTokenFactory from "./verificationToken.model.js";

import roleFactory from "./role.model.js";
import permissionFactory from "./permission.model.js";
import rolePermissionFactory from "./rolePermission.model.js";
import userRoleFactory from "./userRole.model.js";

import fileFactory from "./file.model.js";
import accessTokenFactory from "./accessToken.model.js";

const models = {};
models.User = userFactory(sequelize, DataTypes);
models.Account = accountFactory(sequelize, DataTypes);
models.Session = sessionFactory(sequelize, DataTypes);
models.VerificationToken = verificationTokenFactory(sequelize, DataTypes);

models.Role = roleFactory(sequelize, DataTypes);
models.Permission = permissionFactory(sequelize, DataTypes);
models.RolePermission = rolePermissionFactory(sequelize, DataTypes);
models.UserRole = userRoleFactory(sequelize, DataTypes);

models.User = userFactory(sequelize, DataTypes);

models.File = fileFactory(sequelize, DataTypes);
models.AccessToken = accessTokenFactory(sequelize, DataTypes);
// ===== Associations =====

// RolePermission: many-to-one
models.RolePermission.belongsTo(models.Role, { foreignKey: "roleId" });
models.RolePermission.belongsTo(models.Permission, {
  foreignKey: "permissionId",
});

// UserRole: many-to-one
models.UserRole.belongsTo(models.User, { foreignKey: "userId" });
models.UserRole.belongsTo(models.Role, { foreignKey: "roleId" });

// ===== Many-to-Many Associations =====
models.User.belongsToMany(models.Role, {
  through: models.UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
});

models.Role.belongsToMany(models.User, {
  through: models.UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
});

models.Role.belongsToMany(models.Permission, {
  through: models.RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
});

models.Permission.belongsToMany(models.Role, {
  through: models.RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
});

models.User.hasMany(models.File, { foreignKey: 'uploader_id' });
models.File.belongsTo(models.User, { foreignKey: 'uploader_id' });

// Call associate hooks if any
Object.values(models).forEach((m) => {
  if (m.associate) m.associate(models);
});

export { sequelize, models };
