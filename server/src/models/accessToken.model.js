import { DataTypes } from "sequelize";

export default function (sequelize) {
  const AccessToken = sequelize.define(
    "AccessToken",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      scope: {
        type: DataTypes.ENUM("read", "write"),
        allowNull: false,
      },
      max_uses: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = unlimited uses
      },
      use_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true, // NULL = never expires
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "access_tokens",
    },
  );

  return AccessToken;
}
