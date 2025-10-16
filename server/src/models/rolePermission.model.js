export default (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      roleId: { type: DataTypes.UUID, allowNull: false },
      permissionId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: "RolePermissions",
      indexes: [{ unique: true, fields: ["roleId", "permissionId"] }],
    },
  );

  return RolePermission;
};
