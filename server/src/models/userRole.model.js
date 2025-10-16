export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      userId: { type: DataTypes.UUID, allowNull: false },
      roleId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: "UserRoles",
      indexes: [{ unique: true, fields: ["userId", "roleId"] }],
    },
  );

  return UserRole;
};
