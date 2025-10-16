export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(64), unique: true, allowNull: false },
      description: { type: DataTypes.STRING(255) },
    },
    { tableName: "Roles" },
  );

  Role.associate = (models) => {
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
    });
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: "roleId",
      otherKey: "userId",
    });
  };

  return Role;
};
