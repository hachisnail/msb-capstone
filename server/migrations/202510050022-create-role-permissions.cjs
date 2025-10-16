"use strict";
module.exports = {
  async up(q, S) {
    const { UUID, DATE } = S;
    await q.createTable("RolePermissions", {
      roleId: { type: UUID, allowNull: false },
      permissionId: { type: UUID, allowNull: false },
      createdAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updatedAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
    await q.addIndex("RolePermissions", ["roleId", "permissionId"], {
      unique: true,
    });
  },
  async down(q) {
    await q.dropTable("RolePermissions");
  },
};
