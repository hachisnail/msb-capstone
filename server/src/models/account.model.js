export default (sequelize, DataTypes) => {
  // For OAuth providers (not used with pure credentials, but needed by adapter shape)
  const Account = sequelize.define(
    "Account",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: DataTypes.STRING,
      provider: DataTypes.STRING,
      providerAccountId: DataTypes.STRING,
      refresh_token: DataTypes.TEXT,
      access_token: DataTypes.TEXT,
      expires_at: DataTypes.INTEGER,
      token_type: DataTypes.STRING,
      scope: DataTypes.STRING,
      id_token: DataTypes.TEXT,
      session_state: DataTypes.STRING,
    },
    {
      tableName: "Accounts",
      indexes: [
        { unique: true, fields: ["provider", "providerAccountId"] },
        { fields: ["userId"] },
      ],
    },
  );

  Account.associate = (models) => {
    Account.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Account;
};
