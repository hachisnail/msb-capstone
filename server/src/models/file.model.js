import { DataTypes } from "sequelize";

export default function (sequelize) {
  const File = sequelize.define(
    "File",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      original_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      privacy: {
        type: DataTypes.ENUM("public", "private"),
        allowNull: false,
        defaultValue: "private",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploader_id: {
        type: DataTypes.UUID, // Corrected to match your User model
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      associated_record_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      associated_table_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      tableName: "files",
    },
  );

  return File;
}
