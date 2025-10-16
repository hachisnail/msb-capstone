"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { STRING, UUID, DATE } = Sequelize;
    await queryInterface.createTable("Sessions", {
      sessionToken: {
        type: STRING(255),
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
      expires: {
        type: DATE,
        allowNull: false,
      },
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

    await queryInterface.addIndex("Sessions", ["userId"]);
    await queryInterface.addIndex("Sessions", ["sessionToken"], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Sessions");
  },
};
