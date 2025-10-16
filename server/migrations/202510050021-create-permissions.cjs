"use strict";
module.exports = {
  async up(q, S) {
    const { UUID, UUIDV4, STRING, DATE } = S;
    await q.createTable("Permissions", {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      name: { type: STRING(128), unique: true, allowNull: false },
      createdAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updatedAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
  },
  async down(q) {
    await q.dropTable("Permissions");
  },
};
