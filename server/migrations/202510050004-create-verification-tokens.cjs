"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { STRING, DATE } = Sequelize;
    await queryInterface.createTable("VerificationTokens", {
      identifier: { type: STRING(255), allowNull: false },
      token: { type: STRING(255), allowNull: false, primaryKey: true },
      expires: { type: DATE, allowNull: false },
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

    await queryInterface.addIndex("VerificationTokens", ["identifier"]);
    await queryInterface.addIndex("VerificationTokens", ["token"], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("VerificationTokens");
  },
};
