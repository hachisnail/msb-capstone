export default (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define(
    "VerificationToken",
    {
      identifier: { type: DataTypes.STRING(255), allowNull: false },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      expires: { type: DataTypes.DATE, allowNull: false },
      roleName: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },

      // ✅ Added field
      roleName: { type: DataTypes.STRING(64), allowNull: true },
    },
    {
      tableName: "VerificationTokens",
      indexes: [
        { fields: ["identifier"] },
        { unique: true, fields: ["token"] },
      ],
    },
  );

  return VerificationToken;
};
