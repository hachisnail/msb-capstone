"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, STRING, INTEGER, TEXT, DATE } = Sequelize;
    await queryInterface.createTable("Accounts", {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: STRING,
      provider: STRING,
      providerAccountId: STRING,
      refresh_token: TEXT,
      access_token: TEXT,
      expires_at: INTEGER,
      token_type: STRING,
      scope: STRING,
      id_token: TEXT,
      session_state: STRING,
      createdAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex(
      "Accounts",
      ["provider", "providerAccountId"],
      { unique: true },
    );
    await queryInterface.addIndex("Accounts", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Accounts");
  },
};
