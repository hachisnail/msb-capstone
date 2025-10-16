"use strict";

const { ROLES, PERMS, MAP } = require("../src/config/accesscontrol.map.js"); // require ESM file via transpiled path if needed

module.exports = {
  async up(queryInterface, Sequelize) {
    // This seeder is designed to run after tables exist.
    // It mirrors ensureSeedFromMAP (runtime), but at seed-time.
    const t = await queryInterface.sequelize.transaction();
    try {
      // Roles
      const roleRows = {};
      for (const r of ROLES) {
        const [row] =
          (await queryInterface.rawSelect(
            "Roles",
            {
              where: { name: r.name },
              plain: false,
              transaction: t,
            },
            ["id"],
          )) || [];
        if (!row) {
          await queryInterface.bulkInsert(
            "Roles",
            [
              {
                id: require("crypto").randomUUID(),
                name: r.name,
                description: r.description,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { transaction: t },
          );
        }
      }
      const roles = await queryInterface.sequelize.query(
        "SELECT id,name FROM Roles",
        { type: Sequelize.QueryTypes.SELECT, transaction: t },
      );
      for (const r of roles) roleRows[r.name] = r;

      // Permissions
      const perms = await queryInterface.sequelize.query(
        "SELECT id,name FROM Permissions",
        { type: Sequelize.QueryTypes.SELECT, transaction: t },
      );
      const permSet = new Set(perms.map((p) => p.name));
      for (const name of PERMS) {
        if (!permSet.has(name)) {
          await queryInterface.bulkInsert(
            "Permissions",
            [
              {
                id: require("crypto").randomUUID(),
                name,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { transaction: t },
          );
        }
      }
      const permRows = await queryInterface.sequelize.query(
        "SELECT id,name FROM Permissions",
        { type: Sequelize.QueryTypes.SELECT, transaction: t },
      );
      const permByName = Object.fromEntries(permRows.map((p) => [p.name, p]));

      // RolePermissions
      for (const [roleName, list] of Object.entries(MAP)) {
        const roleId = roleRows[roleName].id;
        const existing = await queryInterface.sequelize.query(
          "SELECT permissionId FROM RolePermissions WHERE roleId = :roleId",
          {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { roleId },
            transaction: t,
          },
        );
        const existingSet = new Set(existing.map((x) => x.permissionId));
        for (const permName of list) {
          const pid = permByName[permName].id;
          if (!existingSet.has(pid)) {
            await queryInterface.bulkInsert(
              "RolePermissions",
              [
                {
                  roleId,
                  permissionId: pid,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              { transaction: t },
            );
          }
        }
      }

      // Assign SUPERADMIN to the first user if any user exists and has no roles
      const users = await queryInterface.sequelize.query(
        "SELECT id FROM Users ORDER BY createdAt ASC LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT, transaction: t },
      );
      if (users.length) {
        const userId = users[0].id;
        const ur = await queryInterface.sequelize.query(
          "SELECT * FROM UserRoles WHERE userId = :userId",
          {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { userId },
            transaction: t,
          },
        );
        if (ur.length === 0) {
          await queryInterface.bulkInsert(
            "UserRoles",
            [
              {
                userId,
                roleId: roleRows["SUPERADMIN"].id,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { transaction: t },
          );
        }
      }

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },

  async down(queryInterface) {
    // No-op (leave roles/permissions)
  },
};
