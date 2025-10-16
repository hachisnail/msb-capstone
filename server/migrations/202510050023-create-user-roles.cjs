"use strict";
module.exports = {
  async up(q, S) {
    const { UUID, DATE } = S;
    await q.createTable("UserRoles", {
      userId: { type: UUID, allowNull: false },
      roleId: { type: UUID, allowNull: false },
      createdAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updatedAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
    await q.addIndex("UserRoles", ["userId", "roleId"], { unique: true });
  },
  async down(q) {
    await q.dropTable("UserRoles");
  },
};
