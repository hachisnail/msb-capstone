"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("password123", 12);
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: require("crypto").randomUUID(),
          email: "dev@example.com",
          username: "dev",
          fname: "Dev",
          lname: "User",
          contact: "0917-000-0000",
          birthdate: "1990-01-01",
          passwordHash,
          emailVerified: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", { email: "dev@example.com" }, {});
  },
};
