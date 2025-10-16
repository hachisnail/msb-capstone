"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, STRING, DATE, DATEONLY } = Sequelize;
    await queryInterface.createTable("Users", {
      id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      email: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },
      username: {
        type: STRING(64),
        allowNull: true,
        unique: true,
      },
      fname: { type: STRING(100) },
      lname: { type: STRING(100) },
      contact: { type: STRING(50) },
      birthdate: { type: DATEONLY },
      passwordHash: {
        type: STRING(255),
        allowNull: false,
      },
      emailVerified: { type: DATE, allowNull: true },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
